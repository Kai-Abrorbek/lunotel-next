// PopularStays.tsx
import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, IconButton, Chip, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import { PropertyType, PropertyTypeKorean } from '../../enums/property.enum';
import { PropertiesInquiry, PropertyInquiry } from '../../types/property/property.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Property } from '../../types/property/property';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const CATEGORIES_K: PropertyTypeKorean[] = Object.values(PropertyTypeKorean);
const CATEGORIES_EN: PropertyType[] = Object.values(PropertyType);

interface PopularStaysProps {
	initialInput: PropertiesInquiry;
}

const PopularStays = (props: PopularStaysProps) => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const { initialInput } = props;
	const user = useReactiveVar(userVar);
	const [activeCategory, setActiveCategory] = useState<PropertyType>(PropertyType.ALL);
	const checkIn = useMemo(() => {
		const d = new Date();
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}, []);
	const checkOut = useMemo(() => {
		const d = new Date();
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`;
	}, []);

	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	/** APOLLO REQUESTS **/
	const {
		loading: getPopularStaysLoading,
		data: getPopularStaysData,
		error: getPopularStaysError,
		refetch: getPopularStaysRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const popularStays: Property[] = getPopularStaysData?.getProperties?.list ?? [];
	const filteredStays =
		activeCategory === 'ALL' ? popularStays : popularStays.filter((s: Property) => s.propertyType === activeCategory);

	/** --- HANDLER **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await getPopularStaysRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	const handlePushPropertyDetail = (property: Property) => {
		const url: PropertyInquiry = {
			_id: String(property._id),
			propertyName: encodeURIComponent(property.propertyName),
			checkInDate: checkIn,
			checkOutDate: checkOut,
			personal: 2,
		};

		router.push(
			`/property/propertyId=${property._id}?input=${JSON.stringify({ ...url })}`,
			`/property/propertyId=${property._id}?input=${JSON.stringify({ ...url })}`,
			{
				scroll: false,
			},
		);
	};

	return (
		<Stack className="container">
			<Box className="popular-container">
				{/* 헤더 */}
				<Box className="popular-header">
					<Typography className="popular-title">{t('인기 추천 숙소')}</Typography>

					<Box className="popular-tabs">
						{CATEGORIES_EN.map((c, idx) => (
							<Button
								key={c}
								className={`popular-tab ${activeCategory === c ? 'active' : ''}`}
								onClick={() => setActiveCategory(c)}
							>
								{t(`${CATEGORIES_K[idx]}`)}
							</Button>
						))}
					</Box>
				</Box>

				{/* 슬라이더 래퍼 + 화살표 버튼 */}
				{filteredStays.length !== 0 ? (
					<Box className="popular-slider-wrapper">
						<IconButton className="popular-arrow popular-prev">
							<ArrowBackIosNewIcon />
						</IconButton>

						<Swiper
							className="popular-swiper"
							modules={[Navigation]}
							navigation={{
								prevEl: '.popular-prev',
								nextEl: '.popular-next',
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
							{filteredStays.map((stay: Property) => {
								const isFav = stay?.meLiked?.[0]?.myFavorite!;
								return (
									<SwiperSlide key={stay._id}>
										<Box className="popular-card" onClick={() => handlePushPropertyDetail(stay)}>
											{/* 이미지 */}
											<Box className="popular-image-wrapper">
												<img
													src={`${process.env.REACT_APP_API_URL}/${stay.propertyImages![0]}`}
													alt={stay.propertyName}
													className="popular-image"
												/>
												<Box className="popular-image-top">
													{/* {stay.badgeText && <Chip className="popular-chip" label={stay.badgeText} size="small" />} */}
													<IconButton
														className="popular-fav-btn"
														onClick={(e) => {
															e.stopPropagation();
															likePropertyHandler(user, stay._id);
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

											{/* 텍스트/정보 영역 */}
											<Box className="popular-info">
												<Typography className="popular-category">{stay.propertyType}</Typography>
												<Typography className="popular-name">{stay.propertyName}</Typography>
												<Typography className="popular-location">
													{stay.propertyAddress} · {stay.propertyAddress}
												</Typography>

												<Box className="popular-rating-row">
													<Box className="popular-rating-badge">
														<StarIcon className="popular-rating-star" />
														<span className="popular-rating-score">{stay.propertyRank!.toFixed(1)}</span>
													</Box>
													<span className="popular-rating-count">{stay.propertyComments!.toLocaleString()}명 평가</span>
												</Box>

												{stay.propertyPrice && <Typography className="popular-coupon-text">쿠폰 적용시</Typography>}

												<Box className="popular-price-row">
													<span className="popular-price-current">{stay.propertyPrice!.toLocaleString()}원</span>
													{stay.propertyPrice! && (
														<span className="popular-price-origin">{stay.propertyPrice!.toLocaleString()}원</span>
													)}
												</Box>
											</Box>
										</Box>
									</SwiperSlide>
								);
							})}
						</Swiper>

						<IconButton className="popular-arrow popular-next">
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
	);
};

PopularStays.defaultProps = {
	initialInput: {
		page: 1,
		limit: 20,
		sort: 'propertyLikes',
		direction: 'DESC',
		search: {},
	},
};

export default PopularStays;
