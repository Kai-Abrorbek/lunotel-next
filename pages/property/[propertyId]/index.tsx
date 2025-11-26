import { useEffect, useState } from 'react';
import OtherLayout from '../../../libs/components/layout/OtherLayout';
import { PropertiesInquiry } from '../../../libs/types/property/property.input';
import { useRouter } from 'next/router';
import { Box, Button, Chip, IconButton, Pagination, Stack, Typography } from '@mui/material';
import RoomStickyBar from '../../../libs/components/room/RoomStickyBar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RoomIcon from '@mui/icons-material/MeetingRoom';
import WifiIcon from '@mui/icons-material/Wifi';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PlaceIcon from '@mui/icons-material/Place';
import NearMeIcon from '@mui/icons-material/NearMe';
import StarIcon from '@mui/icons-material/Star';
import PropertyLocationMap from '../../../libs/components/room/PropertyLocationMap';
import ReviewItem from '../../../libs/components/room/ReviewItem';
import ImageGalleryModal, { ImageCategory } from '../../../libs/components/room/ImageGalleryModal';
import ReviewImageModal from '../../../libs/components/room/ReviewImageModal';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';

export type GalleryImage = {
	id: number;
	src: string;
	alt: string;
	category?: ImageCategory;
};

const GALLERY_IMAGES: GalleryImage[] = [
	{
		id: 1,
		src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
		alt: '모던한 호텔 객실 전경',
	},
	{
		id: 2,
		src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
		alt: '침대와 소파가 있는 객실',
	},
	{
		id: 3,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '어두운 톤의 호텔 침실',
	},
	{
		id: 4,
		src: 'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80',
		alt: '라운지와 책상이 있는 객실',
	},
	{
		id: 5,
		src: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=800&q=80',
		alt: '욕실과 욕조가 있는 호텔',
	},
];

const reviewImages = [
	{
		id: 0,
		src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
		alt: '욕조가 있는 욕실',
	},
	{
		id: 1,
		src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
		alt: '침대와 책상이 있는 객실',
	},
	{
		id: 2,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
	{
		id: 3,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
	{
		id: 4,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
	{
		id: 5,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
];

const IMAGES: GalleryImage[] = [
	{
		id: 1,
		src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
		alt: 'PC 객실',
		category: 'ROOM',
	},
	{
		id: 2,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 3,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 4,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 5,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 6,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
];

interface Stay {
	id: number;
	categoryLabel: string;
	name: string;
	location: string;
	subLocation: string;
	rating: number;
	reviewCount: number;
	price: number;
	originalPrice?: number;
	badgeText?: string;
	imageUrl: string;
}

const STAYS: Stay[] = [
	{
		id: 1,
		categoryLabel: '블랙 · 특급 · 호텔',
		name: '★당일특가★ 세인트존스 호텔',
		location: '강릉시',
		subLocation: '강릉 강문해변 앞',
		rating: 9.2,
		reviewCount: 10235,
		price: 99750,
		imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 2,
		categoryLabel: '모텔',
		name: '길동 MARI-마리',
		location: '길동역',
		subLocation: '도보 3분',
		rating: 9.3,
		reviewCount: 4934,
		price: 44000,
		originalPrice: 50000,
		imageUrl: 'https://images.pexels.com/photos/265004/pexels-photo-265004.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 3,
		categoryLabel: '가족호텔 · 호텔',
		name: '★당일특가★ 체스터톤스 호텔',
		location: '속초시',
		subLocation: '속초터미널 차량 11분',
		rating: 9.1,
		reviewCount: 3368,
		price: 65490,
		originalPrice: 350000,
		imageUrl: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 5,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 6,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 7,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 8,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 9,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 10,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},

	// 필요하면 더 추가
];

interface PropertyDetailPageProps {
	initialInput: PropertiesInquiry;
}
type TabKey = 'overview' | 'rooms' | 'amenities' | 'location' | 'reviews';

const PropertyDetailPage = (props: PropertyDetailPageProps) => {
	const { initialInput } = props;
	const [open, setOpen] = useState(false);
	const [openReviewImage, setOpenReviewImage] = useState(false);
	const [initialIndex, setInitialIndex] = useState<number>(0);
	const [reviewImgIndex, setReviewImgIndex] = useState<number>(0);
	const [activeTab, setActiveTab] = useState<TabKey>('rooms');
	const router = useRouter();
	const [favoriteIds, setFavoriteIds] = useState<boolean>(false);
	const [favoriteRooms, setFavoriteRooms] = useState<number[]>([]);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const main = GALLERY_IMAGES[0];
	const thumbs = GALLERY_IMAGES.slice(1, 5); // 오른쪽 4개
	const totalCount = GALLERY_IMAGES.length; // 오른쪽 4개
	/** LIFECYCLES **/

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const data = localStorage.getItem('searchFilter');
		if (data) {
			setSearchFilter(JSON.parse(data));
		}
	}, [router]);

	/** HANDLERS **/
	const handleTabClick = (tab: TabKey) => {
		setActiveTab(tab);
		const target = document.getElementById(`section-${tab}`);
		if (target) {
			const rect = target.getBoundingClientRect();
			const top = window.scrollY + rect.top - 170; // 고정바 높이만큼 보정
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	const toggleFavorite = (id: number) => {
		setFavoriteRooms((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	return (
		<Stack className="container">
			<ImageGalleryModal
				open={open}
				onClose={() => setOpen(false)}
				title="길동 MARI-마리"
				images={IMAGES}
				initialIndex={initialIndex}
			/>
			{/* 상단 헤더 / 갤러리 등 */}
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
									src={main.src}
									alt={main.alt}
									onClick={() => {
										setOpen(true);
										setInitialIndex(0);
									}}
								/>
							)}
							<Box className="property-gallery__badge">무제한 할인</Box>
						</Box>

						<Box className="property-gallery__side">
							{thumbs.map((img, idx) => (
								<Box key={img.id} className="property-gallery__thumb">
									<img
										src={img.src}
										alt={img.alt}
										onClick={() => {
											setOpen(true);
											setInitialIndex(idx);
										}}
									/>
									{idx === thumbs.length - 1 && totalCount && (
										<Box className="property-gallery__more">
											<Typography component="span">{totalCount}+</Typography>
										</Box>
									)}
								</Box>
							))}
						</Box>
					</Box>
					<Stack className="property-info">
						<Stack className="property-info__type-name">
							<Typography className="property-info__type">모텔</Typography>
							<Typography className="property-info__name">길동 MARI-마리</Typography>
						</Stack>
						<Stack className="property-info__price">
							<IconButton className="property-info__favorite" onClick={() => setFavoriteIds(!favoriteIds)}>
								{favoriteIds ? <FavoriteIcon className={favoriteIds ? 'active' : ''} /> : <FavoriteBorderIcon />}
							</IconButton>

							<Typography className="property-info__coupon-price">3000원 쿠폰 적용가</Typography>
							<Typography className="property-info__basic-price">22,000원</Typography>
						</Stack>
					</Stack>
					<Box className="property-summary">
						{/* 평점 카드 */}
						<Box
							className="property-summary__card property-summary__card--rating"
							onClick={() => handleTabClick('reviews')}
						>
							<Box className="rating-box">
								<Box className="rating-chip">
									<StarIcon fontSize="small" />
									<span>{(9.3).toFixed(1)}</span>
								</Box>
								<span className="rating-chip__count">{1234}명 평가</span>
							</Box>
							<Typography className="rating-snippet" noWrap>
								{'예전에도 들렀던 모텔인데 이번에도 근처 방문할 일이 생겨서 또 숙박했습니다...'}
							</Typography>
						</Box>

						{/* 서비스 및 부대시설 */}
						<Box
							className="property-summary__card property-summary__card--services"
							onClick={() => handleTabClick('amenities')}
						>
							<Box className="card-header">
								<Typography className="card-title">서비스 및 부대시설</Typography>
								<Typography className="card-link">자세히 보기 &gt;</Typography>
							</Box>
							<Box className="service-icons">
								<Chip icon={<LocalOfferIcon />} label="스파/월풀" />
								<Chip icon={<WifiIcon />} label="무선인터넷" />
								<Chip icon={<DirectionsCarIcon />} label="주차장" />
								<Chip icon={<RoomIcon />} label="트윈베드" />
							</Box>
						</Box>

						{/* 위치 정보 */}
						<Box
							className="property-summary__card property-summary__card--location"
							onClick={() => handleTabClick('location')}
						>
							<Box className="card-header">
								<Typography className="card-title">위치 정보</Typography>
								<Typography className="card-link">지도보기 &gt;</Typography>
							</Box>
							<Box className="location-lines">
								<Box className="location-line">
									<PlaceIcon fontSize="small" />
									<Typography>{'서울 강동구 길동 387-7'}</Typography>
								</Box>
								<Box className="location-line">
									<NearMeIcon fontSize="small" />
									<Typography>{'길동역 도보 3분'}</Typography>
								</Box>
							</Box>
						</Box>
					</Box>
				</section>
				<section id="section-rooms">
					{[1, 2, 3, 4, 5, 6].map((room) => {
						return (
							<Box key={room} className="room-card">
								<Box className="room-card__image">
									<img src={main.src} alt={main.alt} onClick={() => setOpen(true)} />
									<Box className="room-card__count">65+</Box>
								</Box>

								<Box className="room-card__content">
									<Box className="room-card__header">
										<Typography className="room-card__title">{'title'}</Typography>
										<Typography className="room-card__link">상세 정보 &gt;</Typography>
									</Box>

									<Box className="room-card__section">
										<Typography className="room-card__section-title">대실</Typography>
										<Typography className="room-card__sub">무한대실 · 9시간 이용</Typography>
										<Box className="room-card__price-row">
											<Box className="room-card__price-left">
												{true && <span className="coupon-label">{'2,500원 쿠폰 적용가'}</span>}
												{true && <span className="original-price">{'30,000원'}</span>}
											</Box>
											<Box className="room-card__price-right">
												<span className="final-price">{'27,500원'}</span>
												<span className="per-night">/1실</span>
												<Button variant="contained" className="room-card__button room-card__button--day">
													대실 예약
												</Button>
											</Box>
										</Box>
									</Box>

									<Box className="room-card__divider" />

									<Box className="room-card__section">
										<Typography className="room-card__section-title">숙박</Typography>
										<Typography className="room-card__sub">숙박 베이직 룸 · 입실 17:00 · 퇴실 12:00</Typography>
										<Box className="room-card__price-row">
											<Box className="room-card__price-left">
												{true && <span className="coupon-label">{'8,000원+1,000원 쿠폰 적용가'}</span>}
												{true && <span className="original-price">{'80,000원'}</span>}
											</Box>
											<Box className="room-card__price-right">
												<span className="final-price">{'71,000원'}</span>
												<span className="per-night">/1박</span>
												<Button variant="contained" className="room-card__button room-card__button--stay">
													숙박 예약
												</Button>
											</Box>
										</Box>
									</Box>
								</Box>
								<Stack className="room-card__info">
									<Typography>객실정보</Typography>
									<Typography>기준2인 · 최대2인</Typography>
								</Stack>
							</Box>
						);
					})}
				</section>
				<section id="section-amenities">
					<Box className="room-amenities__divider" />
					<Stack className="amenities-card">
						<Typography className="amenities-card__title">서비스 및 부대시설</Typography>
						<Box className="amenities-card__icons">
							<Chip icon={<LocalOfferIcon />} label="스파/월풀" />
							<Chip icon={<WifiIcon />} label="무선인터넷" />
							<Chip icon={<DirectionsCarIcon />} label="주차장" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
						</Box>
					</Stack>
					<Box className="room-amenities__divider" />
					<Stack className="amenities-card">
						<Typography className="amenities-card__title">취소 및 환불 규정</Typography>
						<Typography className="">객실별 취소 정책이 상이하니 객실 상세정보에서 확인해주세요.</Typography>
					</Stack>
					<Box className="room-amenities__divider" />
				</section>
				<section id="section-location">
					<Typography className="section-location_title">위치</Typography>
					<PropertyLocationMap address="서울 강동구 길동 387-7" />
				</section>
				<section id="section-reviews">
					<ReviewImageModal
						images={reviewImages}
						open={openReviewImage}
						onClose={() => setOpenReviewImage(false)}
						reviewImgIndex={reviewImgIndex}
					/>
					{[1, 2, 3, 4].map((review) => {
						return (
							<ReviewItem
								key={review}
								nickname="마롱이주인"
								statsText="리뷰 37 · 사진 58 · 장소 34"
								rating={5}
								writtenAgo="1개월 전"
								roomName="A-타입(카운터에서 A타입 꼭 말씀해주세요, OTT 시청가능)"
								text="길동 마리호텔! 예전에도 들렀던 적 있었는데 이번에도 근처 방문할 일이 생겨서 또 숙박했습니다. 욕조도 있고 침대나 방도 큼직한데 가격이 항상 착한 것 같아요. 주변에 해장할만한 맛집도 많고 지하철역이나 버스정류장도 가까워서 교통도 잘 좋습니다. 사장님도 친절하시고 방 컨디션이나 청소 상태도 마음에 들었습니다. 아 티비도 엄청 큽니다. 다음에도 서울 올 일 있으면 여기로 예약 잡을 것 같습니다. 추천드립니다."
								replyText="저희 숙소를 이용해주셔서 진심으로 감사드립니다. 자주 오셔서 편히 쉬시고 가실 수 있도록 항상 꼼꼼하게 객실 관리를 해놓겠습니다. 앞으로도 많은 이용 부탁드리겠습니다."
								replyAgo="1개월 전"
								images={reviewImages}
								setOpenReviewImage={setOpenReviewImage}
								setReviewImgIndex={setReviewImgIndex}
							/>
						);
					})}

					<Stack className="reviews-pagination">
						<Pagination
							count={Math.ceil(5 / 11) || 1}
							page={1}
							shape="circular"
							color="primary"
							// onChange={paginationHandler}
						/>
					</Stack>
				</section>
				<section id="section-similar-rooms">
					<Stack className="container">
						<Box className="hotelspecials-container">
							{/* 헤더 */}
							<Box className="popular-header">
								<Typography className="popular-title">다른 고객이 본 비슷한 숙소</Typography>
							</Box>

							{/* 슬라이더 래퍼 + 화살표 버튼 */}
							{STAYS.length !== 0 ? (
								<Box className="hotelspecials-slider-wrapper">
									<IconButton className="hotelspecials-arrow hotelspecials-prev">
										<ArrowBackIosNewIcon />
									</IconButton>

									<Swiper
										className="popular-swiper"
										modules={[Navigation]}
										navigation={{
											prevEl: '.hotelspecials-prev',
											nextEl: '.hotelspecials-next',
										}}
										spaceBetween={24}
										slidesPerView={4}
										breakpoints={{
											0: { slidesPerView: 1.2, spaceBetween: 16 },
											768: { slidesPerView: 2.5, spaceBetween: 20 },
											1024: { slidesPerView: 3, spaceBetween: 22 },
											1280: { slidesPerView: 4, spaceBetween: 24 },
										}}
									>
										{STAYS.map((stay) => {
											const isFav = favoriteRooms.includes(stay.id);
											return (
												<SwiperSlide key={stay.id}>
													<Box className="popular-card">
														<Box className="popular-image-wrapper">
															<img src={stay.imageUrl} alt={stay.name} className="popular-image" />
															<Box className="popular-image-top">
																{stay.badgeText && (
																	<Chip className="popular-chip" label={stay.badgeText} size="small" />
																)}
																<IconButton className="popular-fav-btn" onClick={() => toggleFavorite(stay.id)}>
																	{isFav ? (
																		<FavoriteIcon className="popular-fav-icon active" />
																	) : (
																		<FavoriteBorderIcon className="popular-fav-icon" />
																	)}
																</IconButton>
															</Box>
														</Box>

														<Box className="popular-info">
															<Typography className="popular-category">{stay.categoryLabel}</Typography>
															<Typography className="popular-name">{stay.name}</Typography>
															<Typography className="popular-location">
																{stay.location} · {stay.subLocation}
															</Typography>

															<Box className="popular-rating-row">
																<Box className="popular-rating-badge">
																	<StarIcon className="popular-rating-star" />
																	<span className="popular-rating-score">{stay.rating.toFixed(1)}</span>
																</Box>
																<span className="popular-rating-count">{stay.reviewCount.toLocaleString()}명 평가</span>
															</Box>

															{stay.originalPrice && (
																<Typography className="popular-coupon-text">쿠폰 적용시</Typography>
															)}

															<Box className="popular-price-row">
																<span className="popular-price-current">{stay.price.toLocaleString()}원</span>
																{stay.originalPrice && (
																	<span className="popular-price-origin">{stay.originalPrice.toLocaleString()}원</span>
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
		</Stack>
	);
};

PropertyDetailPage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {
			location: '',
			checkInDate: '',
			checkOutDate: '',
			personal: 2,
		},
	},
};

export default OtherLayout(PropertyDetailPage);
