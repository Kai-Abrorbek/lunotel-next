import { ChangeEvent, useEffect, useState } from 'react';
import OtherLayout from '../../../libs/components/layout/OtherLayout';
import { PropertiesInquiry, PropertyInquiry } from '../../../libs/types/property/property.input';
import { useRouter } from 'next/router';
import { Box, Button, IconButton, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import RoomStickyBar from '../../../libs/components/room/RoomStickyBar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaceIcon from '@mui/icons-material/Place';
import NearMeIcon from '@mui/icons-material/NearMe';
import StarIcon from '@mui/icons-material/Star';
import PropertyLocationMap from '../../../libs/components/room/PropertyLocationMap';
import ReviewItem from '../../../libs/components/room/ReviewItem';
import ImageGalleryModal from '../../../libs/components/room/ImageGalleryModal';
import ReviewImageModal from '../../../libs/components/room/ReviewImageModal';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CheckIcon from '@mui/icons-material/Check';
import 'swiper/css';
import 'swiper/css/navigation';
import { CommentsInquiry } from '../../../libs/types/comment/comment.input';
import { Message } from '../../../libs/enums/common.enum';
import { ReservationInput } from '../../../libs/types/reservation/reservation.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { GET_PROPERTY, GET_SIMILAR_PROPERTIES } from '../../../apollo/user/query';
import { userVar } from '../../../apollo/store';
import { T } from '../../../libs/types/common';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../libs/sweetAlert';
import { Property } from '../../../libs/types/property/property';
import { RoomType } from '../../../libs/types/roomtype/roomtype';
import { amenitiesList, PropertyAmenity } from '../../../libs/enums/property.enum';
import { GET_COMMENTS } from '../../../apollo/admin/query';
import { Comment } from '../../../libs/types/comment/comment';
import { COMMENT_SORT_OPTIONS } from '../../../libs/enums/propertyRoomtype.enum';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export const getServerSideProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface PropertyDetailPageProps {
	initialInput: PropertyInquiry;
}
type TabKey = 'overview' | 'rooms' | 'amenities' | 'location' | 'reviews';

const PropertyDetailPage = (props: PropertyDetailPageProps) => {
	const { initialInput } = props;
	const { t, i18n } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const propertyId = router.query.propertyId?.slice(11) as string;
	const [open, setOpen] = useState(false);
	const [open2, setOpen2] = useState(false);
	const [openReviewImage, setOpenReviewImage] = useState(false);
	const [initialIndex, setInitialIndex] = useState<number>(0);
	const [reviewImgIndex, setReviewImgIndex] = useState<number>(0);
	const [activeTab, setActiveTab] = useState<TabKey>('rooms');
	const [sortOption, setSortOption] = useState('추천순');
	const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
	const [selectRoomImg, setSelectRoomImg] = useState<string[]>([]);
	const [selectCommentImg, setselectCommentImg] = useState<string[]>([]);
	const [selectRoomName, setSelectRoomName] = useState<string>('');
	const isSortMenuOpen = Boolean(sortAnchorEl);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [lang, setLang] = useState<string | null>(null);
	const [targetCommnetsInput, setTargetCommnetsInput] = useState<CommentsInquiry>({
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			commentRefId: propertyId!,
		},
	});
	const [searchFilter, setSearchFilter] = useState<PropertyInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput, // propertyInquiry => 변경
	);
	const [hasRouterApplied, setHasRouterApplied] = useState(false);

	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	/** APOLLO REQUESTS **/
	const {
		loading: getPropertyLoading,
		data: getPropertyData,
		error: getPropertyError,
		refetch: getPropertyRefetch,
	} = useQuery(GET_PROPERTY, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		skip: !hasRouterApplied,
	});
	const targetProperty: Property = getPropertyData?.getProperty;

	const {
		loading: getPropertyCommentsLoading,
		data: getPropertyCommentsData,
		error: getPropertyCommentsError,
		refetch: getPropertyCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: targetCommnetsInput },
		notifyOnNetworkStatusChange: true,
		skip: !targetCommnetsInput.search.commentRefId,
	});

	const propertyCommentList: Comment[] = getPropertyCommentsData?.getComments?.list!;
	const {
		loading: getSimilarPropertiesLoading,
		data: getSimilarPropertiesData,
		error: getSimilarPropertiesError,
		refetch: getSimilarPropertiesRefetch,
	} = useQuery(GET_SIMILAR_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { propertyId: targetProperty?._id },
		notifyOnNetworkStatusChange: true,
		skip: !targetProperty,
	});

	const similarProperties = getSimilarPropertiesData?.getSimilarProperties;
	/** VARIABLES **/
	const commentTotal = propertyCommentList?.length ?? 0;
	const propertyImages = targetProperty?.propertyImages;
	const propertyAmenities = new Set(targetProperty?.propertyAmenities);
	const propertyAmenitiesList = amenitiesList.filter((amenint) =>
		propertyAmenities.has(amenint.key as PropertyAmenity),
	);
	const main = propertyImages?.[0];
	const thumbs = propertyImages?.slice(1, 5);
	const totalCount = propertyImages?.length;

	/** LIFECYCLES **/
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const lang = localStorage.getItem('locale');
		setLang(lang);
	}, [router]);

	useEffect(() => {
		if (!router.isReady) return;

		if (router.query.input) {
			setSearchFilter(JSON.parse(router?.query?.input as string));
			setTargetCommnetsInput({
				...targetCommnetsInput,
				search: {
					commentRefId: propertyId,
				},
			});
		}
		setHasRouterApplied(true);
	}, [router.isReady, router.query.input]);

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await getPropertyRefetch({ input: searchFilter });
			await getSimilarPropertiesRefetch({ propertyId: targetProperty?._id });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	const handleTabClick = (tab: TabKey) => {
		setActiveTab(tab);
		const target = document.getElementById(`section-${tab}`);
		if (target) {
			const rect = target.getBoundingClientRect();
			const top = window.scrollY + rect.top - 170; // 고정바 높이만큼 보정
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		setTargetCommnetsInput({
			...targetCommnetsInput,
			page: value,
		});
		setCurrentPage(value);
	};

	const handlePushReservationPage = (room: RoomType, stayType: number) => {
		const reservationInput: ReservationInput = {
			propertyId: propertyId,
			roomTypeId: room?._id,
			stayPlanId: room?.stayPlans?.[stayType]?._id!,
			reservationCheckIn: searchFilter.checkInDate,
			reservationCheckOut: searchFilter.checkOutDate,
			reservationCheckInAt: String(room?.stayPlans?.[1]?.stayPlanRules?.checkInFrom!),
			reservationCheckOutAt: String(room?.stayPlans?.[1]?.stayPlanRules?.checkOutBy!),
			stayPlan: room?.stayPlans?.[stayType]?.stayPlanType,
			propertyName: encodeURIComponent(targetProperty?.propertyName),
		};

		router.push(
			`/reservation/checkout?input=${JSON.stringify({
				...reservationInput,
			})}`,
		);
	};

	const handleSelectRoomImages = (roomId: string, roomName: string) => {
		const result = targetProperty?.rooms?.filter((room) => room._id === roomId)[0];
		setSelectRoomImg(result?.roomImages!);
		setSelectRoomName(roomName);
	};
	return (
		<Stack className="property-detail-wrap container">
			<ImageGalleryModal
				open={open && !openReviewImage}
				onClose={() => {
					setOpen(false);
					setInitialIndex(0);
				}}
				title={targetProperty?.propertyName}
				images={targetProperty?.propertyImages!}
				initialIndex={initialIndex}
			/>
			<ImageGalleryModal
				open={open2 && !openReviewImage}
				onClose={() => {
					setOpen2(false);
					setInitialIndex(0);
				}}
				title={selectRoomName}
				images={selectRoomImg}
				initialIndex={initialIndex}
			/>
			<ReviewImageModal
				images={selectCommentImg}
				open={openReviewImage}
				onClose={() => setOpenReviewImage(false)}
				reviewImgIndex={reviewImgIndex}
			/>

			{/* ===================== PC ===================== */}
			<Box className="pc-only">
				<RoomStickyBar
					price="22,500원"
					couponLabel="2,500원 쿠폰 적용가"
					activeTab={activeTab}
					setActiveTab={setActiveTab}
				/>
				<main className="property-detail-main container">
					<section id="section-overview">
						<Box className="property-gallery">
							<Box className="property-gallery__main">
								{main && (
									<img
										src={`${process.env.REACT_APP_API_URL}/${main}`}
										alt={main}
										onClick={() => {
											setOpen(true);
											setInitialIndex(0);
										}}
									/>
								)}
								<Box className="property-gallery__badge">무제한 할인</Box>
							</Box>
							<Box className="property-gallery__side">
								{thumbs?.map((img, idx) => (
									<Box key={idx} className="property-gallery__thumb">
										<img
											src={`${process.env.REACT_APP_API_URL}/${img}`}
											alt={img}
											onClick={() => {
												setOpen(true);
												setInitialIndex(idx + 1);
											}}
										/>
										{idx === thumbs?.length - 1 && totalCount && (
											<Box
												className="property-gallery__more"
												onClick={() => {
													setOpen(true);
													setInitialIndex(idx + 1);
												}}
											>
												<Typography component="span">{totalCount}+</Typography>
											</Box>
										)}
									</Box>
								))}
							</Box>
						</Box>
						<Stack className="property-info">
							<Stack className="property-info__type-name">
								<Typography className="property-info__type">{targetProperty?.propertyType}</Typography>
								<Typography className="property-info__name">{targetProperty?.propertyName}</Typography>
							</Stack>
							<Stack className="property-info__price">
								<IconButton
									className="property-info__favorite"
									onClick={() => likePropertyHandler(user, targetProperty?._id)}
								>
									{targetProperty?.meLiked?.[0]?.memberId === user._id ? (
										<FavoriteIcon className="active" />
									) : (
										<FavoriteBorderIcon />
									)}
								</IconButton>
								<Typography className="property-info__basic-price">
									{targetProperty?.propertyPrice!.toLocaleString()}
									{t('원')}
								</Typography>
							</Stack>
						</Stack>
						<Box className="property-summary">
							<Box
								className="property-summary__card property-summary__card--rating"
								onClick={() => handleTabClick('reviews')}
							>
								<Box className="rating-box">
									<Box className="rating-chip">
										<StarIcon fontSize="small" />
										<span>{targetProperty?.propertyRank.toFixed(1)}</span>
									</Box>
									<span className="rating-chip__count">
										{targetProperty?.propertyComments.toLocaleString()} {t('명 평가')}
									</span>
								</Box>
								<Typography className="rating-snippet" noWrap>
									{'예전에도 들렀던 모텔인데 이번에도 근처 방문할 일이 생겨서 또 숙박했습니다...'}
								</Typography>
							</Box>
							<Box
								className="property-summary__card property-summary__card--services"
								onClick={() => handleTabClick('amenities')}
							>
								<Box className="card-header">
									<Typography className="card-title">{t('서비스 및 부대시설')}</Typography>
									<Typography className="card-link">{t('자세히 보기')} &gt;</Typography>
								</Box>
								<Box className="service-icons">
									{propertyAmenitiesList.map((amenit) => (
										<div key={amenit.key} className="amenit-box">
											<span>{amenit.icon}</span>
											{lang === 'en' ? <span>{amenit.en}</span> : <span>{amenit.name}</span>}
										</div>
									))}
								</Box>
							</Box>
							<Box
								className="property-summary__card property-summary__card--location"
								onClick={() => handleTabClick('location')}
							>
								<Box className="card-header">
									<Typography className="card-title">{t('위치 정보')}</Typography>
									<Typography className="card-link">{t('지도보기')} &gt;</Typography>
								</Box>
								<Box className="location-lines">
									<Box className="location-line">
										<PlaceIcon fontSize="small" />
										<Typography>{targetProperty?.propertyAddress}</Typography>
									</Box>
									<Box className="location-line">
										<NearMeIcon fontSize="small" />
										<Typography>{targetProperty?.propertyDetailAddress}</Typography>
									</Box>
								</Box>
							</Box>
						</Box>
					</section>

					<section id="section-rooms">
						{targetProperty?.rooms?.length === 0 && (
							<div className="no-data">
								<h1>{t('검색 결과가 없어요')}.</h1>
							</div>
						)}
						{targetProperty?.rooms?.map((room: RoomType) => {
							const maxUsageTime = room?.stayPlans?.[0].stayPlanRules?.durationHours;
							const checkinOverNight = room?.stayPlans?.[1]?.stayPlanRules?.checkInFrom;
							const checkOutOverNight = room?.stayPlans?.[1]?.stayPlanRules?.checkOutBy;
							const isDayUse = room?.stayPlans?.[0]?.inventories;
							const isOvernight = room?.stayPlans?.[1]?.inventories;
							return (
								<Box key={room._id} className="room-card">
									<Box className="room-card__image">
										<img
											src={`${process.env.REACT_APP_API_URL}/${room.roomImages[0]}`}
											alt={room.roomName}
											onClick={() => {
												handleSelectRoomImages(room?._id, room?.roomName);
												setOpen2(true);
											}}
										/>
										<Box className="room-card__count">{room.roomImages.length}+</Box>
									</Box>
									<Box className="room-card__content">
										<Box className="room-card__header">
											<Typography className="room-card__title">{room?.roomName}</Typography>
											<Typography className="room-card__link">{t('상세 정보')} &gt;</Typography>
										</Box>
										<Box className="room-card__section">
											<Typography className="room-card__section-title">{t('대실')}</Typography>
											{isDayUse?.length !== 0 ? (
												<>
													<Typography className="room-card__sub">
														{t('무한대실')} · {String(maxUsageTime)}시간 이용
													</Typography>
													<Box className="room-card__price-row">
														<Box className="room-card__price-left">
															{room?.roomDiscountPrice! > 0 && (
																<span className="coupon-label">
																	{room?.roomDiscountPrice!.toLocaleString()}원 할인가 적용
																</span>
															)}
															{room?.roomDiscountPrice! > 0 && (
																<span className="original-price">{room?.basePriceDayUse}</span>
															)}
														</Box>
														<Box className="room-card__price-right">
															<span className="final-price">
																{(room?.basePriceDayUse - room?.roomDiscountPrice!).toLocaleString()}원
															</span>
															<span className="per-night">/1실</span>
															<Button
																variant="contained"
																className="room-card__button room-card__button--day"
																onClick={() => handlePushReservationPage(room, 0)}
															>
																{t('대실 예약')}
															</Button>
														</Box>
													</Box>
												</>
											) : (
												<p style={{ color: 'red', fontSize: '13px', fontWeight: '600' }}>{t('다른 날짜 확인')}</p>
											)}
										</Box>
										<Box className="room-card__divider" />
										<Box className="room-card__section">
											<Typography className="room-card__section-title">{t('숙박')}</Typography>
											{isOvernight?.length !== 0 ? (
												<>
													<Typography className="room-card__sub">
														숙박 베이직 룸 · 입실 {String(checkinOverNight)} · {t('퇴실')} {String(checkOutOverNight)}
													</Typography>
													<Box className="room-card__price-row">
														<Box className="room-card__price-left">
															{room?.roomDiscountPrice! > 0 && (
																<span className="coupon-label">
																	{room?.roomDiscountPrice!.toLocaleString()}원 할인가 적용
																</span>
															)}
															{room?.roomDiscountPrice! > 0 && (
																<span className="original-price">{(room?.basePriceDayUse).toLocaleString()}원</span>
															)}
														</Box>
														<Box className="room-card__price-right">
															<span className="final-price">
																{(room?.basePriceOvernight - room?.roomDiscountPrice!).toLocaleString()}원
															</span>
															<span className="per-night">/1박</span>
															<Button
																variant="contained"
																className="room-card__button room-card__button--stay"
																onClick={() => handlePushReservationPage(room, 1)}
															>
																{t('숙박 예약')}
															</Button>
														</Box>
													</Box>
												</>
											) : (
												<p style={{ color: 'red', fontSize: '13px', fontWeight: '600' }}>다른 날짜 확인</p>
											)}
										</Box>
									</Box>
									<Stack className="room-card__info">
										<Typography>{t('객실정보')}</Typography>
										<Typography>
											{t('기준')}
											{room?.roomStandPersonal + ''}
											{t('인')} · {t('최대')}
											{room?.roomMaxPersonal + ''}
											{t('인')}
										</Typography>
									</Stack>
								</Box>
							);
						})}
					</section>

					<section id="section-amenities">
						<Box className="room-amenities__divider" />
						<Stack className="amenities-card">
							<Typography className="amenities-card__title">{t('서비스 및 부대시설')}</Typography>
							<Box className="amenities-card__icons">
								{propertyAmenitiesList.map((amenit) => (
									<div key={amenit.key} className="amenit-box">
										<span>{amenit.icon}</span>
										{lang === 'en' ? <span>{amenit.en}</span> : <span>{amenit.name}</span>}
									</div>
								))}
							</Box>
						</Stack>
						<Box className="room-amenities__divider" />
						<Stack className="amenities-card">
							<Typography className="amenities-card__title">{t('취소 및 환불 규정')}</Typography>
							<Typography>{t('객실별 취소 정책이 상이하니 객실 상세정보에서 확인해주세요')}.</Typography>
						</Stack>
						<Box className="room-amenities__divider" />
					</section>

					<section id="section-location">
						<Typography className="section-location_title">{t('위치')}</Typography>
						<PropertyLocationMap address={targetProperty?.propertyAddress} />
					</section>

					<section id="section-reviews">
						<Box className="reviews-page__header">
							<Box className="reviews-page__header-left">
								<span className="reviews-page__header-star">★</span>
								<span className="reviews-page__header-title">
									{t('리얼 리뷰')}{' '}
									<span className="reviews-page__header-score">{targetProperty?.propertyRank?.toFixed(1)}</span>
								</span>
								<span className="reviews-page__header-meta">
									{targetProperty?.propertyComments.toLocaleString()} {t('명 평가')} ·{' '}
									{targetProperty?.propertyComments.toLocaleString()} {t('개 리뷰')}
								</span>
							</Box>
							<Box className="reviews-page__header-right">
								<Button
									className="reviews-page__sort-trigger"
									onClick={(e) => setSortAnchorEl(e.currentTarget)}
									disableRipple
								>
									<SwapVertIcon fontSize="small" className="reviews-page__sort-icon" />
									<span className="reviews-page__sort-label">{sortOption}</span>
								</Button>
								<Menu
									anchorEl={sortAnchorEl}
									open={isSortMenuOpen}
									onClose={() => setSortAnchorEl(null)}
									anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
									transformOrigin={{ vertical: 'top', horizontal: 'right' }}
								>
									{COMMENT_SORT_OPTIONS.map((item) => (
										<MenuItem
											key={item.value}
											onClick={() => {
												setTargetCommnetsInput({ ...targetCommnetsInput, sort: item.sort, direction: item.direc });
												setSortOption(item.label);
												setSortAnchorEl(null);
											}}
											className="reviews-page__sort-menu-item"
										>
											<span
												className={
													sortOption === item.label
														? 'reviews-page__sort-menu-text reviews-page__sort-menu-text--active'
														: 'reviews-page__sort-menu-text'
												}
											>
												{item.label}
											</span>
											{sortOption === item.label && (
												<CheckIcon fontSize="small" className="reviews-page__sort-menu-check" />
											)}
										</MenuItem>
									))}
								</Menu>
							</Box>
						</Box>
						<hr className="reviews-page__header-divider" />
						{propertyCommentList?.length !== 0 ? (
							propertyCommentList?.map((review: Comment) => (
								<Box key={review._id}>
									<ReviewItem
										comment={review}
										key={review._id}
										replyText={review.commentResponse}
										setOpenReviewImage={setOpenReviewImage}
										setReviewImgIndex={setReviewImgIndex}
										setselectCommentImg={setselectCommentImg}
									/>
								</Box>
							))
						) : (
							<div className="no-data">
								<img src="/img/no-data3.webp" alt="" />
							</div>
						)}
						<Stack className="reviews-pagination">
							<Pagination
								count={Math.max(1, Math.ceil(commentTotal! / targetCommnetsInput.limit))}
								page={currentPage}
								shape="circular"
								color="primary"
								onChange={handlePaginationChange}
							/>
						</Stack>
					</section>

					<section id="section-similar-rooms">
						<Stack className="container">
							<Box className="hotelspecials-container">
								<Box className="popular-header">
									<Typography className="popular-title">{t('다른 고객이 본 비슷한 숙소')}</Typography>
								</Box>
								{similarProperties?.length !== 0 ? (
									<Box className="hotelspecials-slider-wrapper">
										<IconButton className="hotelspecials-arrow hotelspecials-prev">
											<ArrowBackIosNewIcon />
										</IconButton>
										<Swiper
											className="popular-swiper"
											modules={[Navigation]}
											navigation={{ prevEl: '.hotelspecials-prev', nextEl: '.hotelspecials-next' }}
											spaceBetween={24}
											slidesPerView={4}
											breakpoints={{
												0: { slidesPerView: 1.2, spaceBetween: 16 },
												768: { slidesPerView: 2.5, spaceBetween: 20 },
												1024: { slidesPerView: 3, spaceBetween: 22 },
												1280: { slidesPerView: 4, spaceBetween: 24 },
											}}
										>
											{similarProperties?.map((property: Property) => {
												const isFav = property?.meLiked?.[0]?.myFavorite!;
												return (
													<SwiperSlide key={property._id}>
														<Box className="popular-card">
															<Box className="popular-image-wrapper">
																<img
																	src={`${process.env.REACT_APP_API_URL}/${property.propertyImages[0]}`}
																	alt={property.propertyName}
																	className="popular-image"
																/>
																<Box className="popular-image-top">
																	<IconButton
																		className="popular-fav-btn"
																		onClick={(e) => {
																			e.stopPropagation();
																			likePropertyHandler(user, property._id);
																		}}
																	>
																		{isFav ? (
																			<FavoriteIcon className="popular-fav-icon active" />
																		) : (
																			<FavoriteBorderIcon className="popular-fav-icon" />
																		)}
																	</IconButton>
																</Box>
															</Box>
															<Box className="popular-info">
																<Typography className="popular-category">{property.propertyType}</Typography>
																<Typography className="popular-name">{property.propertyName}</Typography>
																<Typography className="popular-location">
																	{property.propertyAddress} · {property.propertyDetailAddress}
																</Typography>
																<Box className="popular-rating-row">
																	<Box className="popular-rating-badge">
																		<StarIcon className="popular-rating-star" />
																		<span className="popular-rating-score">{property.propertyRank.toFixed(1)}</span>
																	</Box>
																	<span className="popular-rating-count">
																		{property.propertyComments.toLocaleString()}
																		{t('명 평가')}
																	</span>
																</Box>
																{property.propertyPrice && (
																	<Typography className="popular-coupon-text">쿠폰 적용시</Typography>
																)}
																<Box className="popular-price-row">
																	<span className="popular-price-current">
																		{property.propertyPrice.toLocaleString()} {t('원')}
																	</span>
																	{property.propertyPrice && (
																		<span className="popular-price-origin">
																			{property.propertyPrice.toLocaleString()} {t('원')}
																		</span>
																	)}
																</Box>
															</Box>
														</Box>
													</SwiperSlide>
												);
											})}
										</Swiper>
										<IconButton className="hotelspecials-arrow hotelspecials-next">
											<ArrowForwardIosIcon />
										</IconButton>
									</Box>
								) : (
									<div className="no-data">
										<img src="/img/no-data3.webp" alt="" />
									</div>
								)}
							</Box>
						</Stack>
					</section>
				</main>
			</Box>

			{/* ===================== MOBILE ===================== */}
			<Box className="mobile-only mobile-detail">
				{/* 갤러리 슬라이더 */}
				<Box className="mobile-detail__gallery">
					<Swiper
						modules={[Navigation]}
						navigation={{ prevEl: '.mob-gal-prev', nextEl: '.mob-gal-next' }}
						className="mobile-detail__swiper"
					>
						{propertyImages?.map((img, idx) => (
							<SwiperSlide key={idx}>
								<img
									src={`${process.env.REACT_APP_API_URL}/${img}`}
									alt=""
									className="mobile-detail__gallery-img"
									onClick={() => {
										setOpen(true);
										setInitialIndex(idx);
									}}
								/>
							</SwiperSlide>
						))}
					</Swiper>
					<IconButton className="mob-gal-prev mob-gal-nav">
						<ArrowBackIosNewIcon />
					</IconButton>
					<IconButton className="mob-gal-next mob-gal-nav">
						<ArrowForwardIosIcon />
					</IconButton>
					<Box className="mobile-detail__gallery-badge">무제한 할인</Box>
					<Box className="mobile-detail__gallery-count" onClick={() => setOpen(true)}>
						📷 {totalCount}장
					</Box>
					<IconButton className="mobile-detail__fav" onClick={() => likePropertyHandler(user, targetProperty?._id)}>
						{targetProperty?.meLiked?.[0]?.memberId === user._id ? (
							<FavoriteIcon style={{ color: '#ff4e5b' }} />
						) : (
							<FavoriteBorderIcon style={{ color: '#fff' }} />
						)}
					</IconButton>
				</Box>

				{/* 기본 정보 */}
				<Box className="mobile-detail__info">
					<Typography className="mobile-detail__type">{targetProperty?.propertyType}</Typography>
					<Typography className="mobile-detail__name">{targetProperty?.propertyName}</Typography>
					<Box className="mobile-detail__rating-row">
						<StarIcon style={{ fontSize: 14, color: '#ff4e5b' }} />
						<span className="mobile-detail__rating-score">{targetProperty?.propertyRank?.toFixed(1)}</span>
						<span className="mobile-detail__rating-count">({targetProperty?.propertyComments?.toLocaleString()})</span>
					</Box>
					<Box className="mobile-detail__location-row">
						<PlaceIcon style={{ fontSize: 14, color: '#999' }} />
						<Typography className="mobile-detail__location-text">{targetProperty?.propertyAddress}</Typography>
					</Box>
				</Box>

				{/* 탭 */}
				<Box className="mobile-detail__tabs">
					{(['overview', 'rooms', 'amenities', 'location', 'reviews'] as TabKey[]).map((tab) => {
						const labels: Record<TabKey, string> = {
							overview: '개요',
							rooms: '객실',
							amenities: '시설',
							location: '위치',
							reviews: '리뷰',
						};
						return (
							<button
								key={tab}
								className={`mobile-detail__tab ${activeTab === tab ? 'active' : ''}`}
								onClick={() => handleTabClick(tab)}
							>
								{t(labels[tab])}
							</button>
						);
					})}
				</Box>

				{/* 요약 카드 */}
				<Box className="mobile-detail__summary">
					<Box className="mobile-detail__summary-card" onClick={() => handleTabClick('amenities')}>
						<Typography className="mobile-detail__summary-title">{t('서비스 및 부대시설')}</Typography>
						<Box className="mobile-detail__amenit-list">
							{propertyAmenitiesList.slice(0, 4).map((a) => (
								<Box key={a.key} className="mobile-detail__amenit-item">
									<span>{a.icon}</span>
									<span>{lang === 'en' ? a.en : a.name}</span>
								</Box>
							))}
						</Box>
					</Box>
					<Box className="mobile-detail__summary-card" onClick={() => handleTabClick('location')}>
						<Typography className="mobile-detail__summary-title">{t('위치')}</Typography>
						<Typography className="mobile-detail__summary-addr">{targetProperty?.propertyAddress}</Typography>
					</Box>
				</Box>

				{/* 객실 */}
				<Box className="mobile-detail__section" id="section-rooms">
					<Typography className="mobile-detail__section-title">{t('객실 선택')}</Typography>
					{targetProperty?.rooms?.map((room: RoomType) => {
						const checkinOverNight = room?.stayPlans?.[1]?.stayPlanRules?.checkInFrom;
						const checkOutOverNight = room?.stayPlans?.[1]?.stayPlanRules?.checkOutBy;
						const isDayUse = room?.stayPlans?.[0]?.inventories;
						const isOvernight = room?.stayPlans?.[1]?.inventories;
						return (
							<Box key={room._id} className="mobile-room-card">
								<Box className="mobile-room-card__img-wrap">
									<img
										src={`${process.env.REACT_APP_API_URL}/${room.roomImages[0]}`}
										alt={room.roomName}
										className="mobile-room-card__img"
										onClick={() => {
											handleSelectRoomImages(room._id, room.roomName);
											setOpen2(true);
										}}
									/>
									<Box className="mobile-room-card__img-count">{room.roomImages.length}+</Box>
								</Box>
								<Box className="mobile-room-card__body">
									<Typography className="mobile-room-card__name">{room.roomName}</Typography>
									<Typography className="mobile-room-card__persons">
										기준 {room.roomStandPersonal}인 · 최대 {room.roomMaxPersonal}인
									</Typography>
									<Box className="mobile-room-card__divider" />
									{isDayUse?.length !== 0 && (
										<Box className="mobile-room-card__plan">
											<Box className="mobile-room-card__plan-header">
												<Typography className="mobile-room-card__plan-type">{t('대실')}</Typography>
												<Typography className="mobile-room-card__plan-price">
													{(room.basePriceDayUse - room.roomDiscountPrice!).toLocaleString()}원
												</Typography>
											</Box>
											<Button
												className="mobile-room-card__btn mobile-room-card__btn--day"
												onClick={() => handlePushReservationPage(room, 0)}
											>
												{t('대실 예약')}
											</Button>
										</Box>
									)}
									{isOvernight?.length !== 0 && (
										<Box className="mobile-room-card__plan">
											<Box className="mobile-room-card__plan-header">
												<Typography className="mobile-room-card__plan-type">{t('숙박')}</Typography>
												<Typography className="mobile-room-card__plan-price">
													{(room.basePriceOvernight - room.roomDiscountPrice!).toLocaleString()}원/박
												</Typography>
											</Box>
											<Typography className="mobile-room-card__plan-time">
												입실 {String(checkinOverNight)} · 퇴실 {String(checkOutOverNight)}
											</Typography>
											<Button
												className="mobile-room-card__btn mobile-room-card__btn--stay"
												onClick={() => handlePushReservationPage(room, 1)}
											>
												{t('숙박 예약')}
											</Button>
										</Box>
									)}
								</Box>
							</Box>
						);
					})}
				</Box>

				{/* 부대시설 */}
				<Box className="mobile-detail__section" id="section-amenities">
					<Typography className="mobile-detail__section-title">{t('서비스 및 부대시설')}</Typography>
					<Box className="mobile-detail__amenit-grid">
						{propertyAmenitiesList.map((a) => (
							<Box key={a.key} className="mobile-detail__amenit-item-lg">
								<span className="mobile-detail__amenit-icon">{a.icon}</span>
								<span className="mobile-detail__amenit-name">{lang === 'en' ? a.en : a.name}</span>
							</Box>
						))}
					</Box>
					<Box className="mobile-detail__divider" />
					<Typography className="mobile-detail__section-title">{t('취소 및 환불 규정')}</Typography>
					<Typography className="mobile-detail__refund-text">
						{t('객실별 취소 정책이 상이하니 객실 상세정보에서 확인해주세요')}.
					</Typography>
				</Box>

				{/* 위치 */}
				<Box className="mobile-detail__section" id="section-location">
					<Typography className="mobile-detail__section-title">{t('위치')}</Typography>
					<Typography className="mobile-detail__addr">{targetProperty?.propertyAddress}</Typography>
					<PropertyLocationMap address={targetProperty?.propertyAddress} />
				</Box>

				{/* 리뷰 */}
				<Box className="mobile-detail__section" id="section-reviews">
					<Box className="mobile-detail__review-header">
						<Box>
							<span className="mobile-detail__review-star">★</span>
							<span className="mobile-detail__review-score">{targetProperty?.propertyRank?.toFixed(1)}</span>
							<span className="mobile-detail__review-meta">
								{' '}
								· {targetProperty?.propertyComments?.toLocaleString()}
								{t('개 리뷰')}
							</span>
						</Box>
						<Button
							className="reviews-page__sort-trigger"
							onClick={(e) => setSortAnchorEl(e.currentTarget)}
							disableRipple
						>
							<SwapVertIcon fontSize="small" />
							<span>{sortOption}</span>
						</Button>
						<Menu
							anchorEl={sortAnchorEl}
							open={isSortMenuOpen}
							onClose={() => setSortAnchorEl(null)}
							anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
							transformOrigin={{ vertical: 'top', horizontal: 'right' }}
						>
							{COMMENT_SORT_OPTIONS.map((item) => (
								<MenuItem
									key={item.value}
									onClick={() => {
										setTargetCommnetsInput({ ...targetCommnetsInput, sort: item.sort, direction: item.direc });
										setSortOption(item.label);
										setSortAnchorEl(null);
									}}
									className="reviews-page__sort-menu-item"
								>
									<span
										className={
											sortOption === item.label
												? 'reviews-page__sort-menu-text reviews-page__sort-menu-text--active'
												: 'reviews-page__sort-menu-text'
										}
									>
										{item.label}
									</span>
									{sortOption === item.label && (
										<CheckIcon fontSize="small" className="reviews-page__sort-menu-check" />
									)}
								</MenuItem>
							))}
						</Menu>
					</Box>
					<Box className="mobile-detail__divider" />
					{propertyCommentList?.length !== 0 ? (
						propertyCommentList?.map((review: Comment) => (
							<Box key={review._id}>
								<ReviewItem
									comment={review}
									replyText={review.commentResponse}
									setOpenReviewImage={setOpenReviewImage}
									setReviewImgIndex={setReviewImgIndex}
									setselectCommentImg={setselectCommentImg}
								/>
							</Box>
						))
					) : (
						<div className="no-data">
							<img src="/img/no-data3.webp" alt="" />
						</div>
					)}
					<Stack className="reviews-pagination" style={{ justifyContent: 'center', alignItems: 'center' }}>
						<Pagination
							count={Math.max(1, Math.ceil(commentTotal! / targetCommnetsInput.limit))}
							page={currentPage}
							shape="circular"
							color="primary"
							onChange={handlePaginationChange}
						/>
					</Stack>
				</Box>

				{/* 비슷한 숙소 */}
				<Box className="mobile-detail__section">
					<Typography className="mobile-detail__section-title">{t('비슷한 숙소')}</Typography>
					<Swiper slidesPerView={1.3} spaceBetween={12} className="mobile-similar-swiper">
						{similarProperties?.map((property: Property) => {
							const isFav = property?.meLiked?.[0]?.myFavorite!;
							return (
								<SwiperSlide key={property._id}>
									<Box className="popular-card">
										<Box className="popular-image-wrapper">
											<img
												src={`${process.env.REACT_APP_API_URL}/${property.propertyImages[0]}`}
												alt={property.propertyName}
												className="popular-image"
											/>
											<Box className="popular-image-top">
												<IconButton
													className="popular-fav-btn"
													onClick={(e) => {
														e.stopPropagation();
														likePropertyHandler(user, property._id);
													}}
												>
													{isFav ? (
														<FavoriteIcon className="popular-fav-icon active" />
													) : (
														<FavoriteBorderIcon className="popular-fav-icon" />
													)}
												</IconButton>
											</Box>
										</Box>
										<Box className="popular-info">
											<Typography className="popular-category">{property.propertyType}</Typography>
											<Typography className="popular-name">{property.propertyName}</Typography>
											<Box className="popular-price-row">
												<span className="popular-price-current">
													{property.propertyPrice?.toLocaleString()} {t('원')}
												</span>
											</Box>
										</Box>
									</Box>
								</SwiperSlide>
							);
						})}
					</Swiper>
				</Box>

				{/* 하단 고정 예약 버튼 */}
				<Box className="mobile-detail__bottom-bar">
					<Box className="mobile-detail__bottom-price">
						<Typography className="mobile-detail__bottom-price-num">
							{targetProperty?.propertyPrice?.toLocaleString()}원
						</Typography>
						<Typography className="mobile-detail__bottom-price-per">/1박부터</Typography>
					</Box>
					<Button className="mobile-detail__bottom-btn" onClick={() => handleTabClick('rooms')}>
						객실 선택
					</Button>
				</Box>
			</Box>
		</Stack>
	);
};

PropertyDetailPage.defaultProps = {
	initialInput: {
		_id: '',
		propertyName: '',
		checkInDate: '',
		checkOutDate: '',
		personal: 2,
	},
};

export default OtherLayout(PropertyDetailPage);
