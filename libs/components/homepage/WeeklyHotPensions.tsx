// PopularStays.tsx
import { useMemo, useState } from 'react';
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
import { PropertiesInquiry, PropertyInquiry } from '../../types/property/property.input';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Property } from '../../types/property/property';
import { useRouter } from 'next/router';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'react-i18next';

type CategoryKey = 'all' | 'motel' | 'hotel_resort' | 'pension' | 'premium' | 'camping' | 'home_villa' | 'guesthouse';

interface Stay {
	id: number;
	categoryKey: CategoryKey;
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
		categoryKey: 'hotel_resort',
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
		categoryKey: 'motel',
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
		categoryKey: 'hotel_resort',
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
		categoryKey: 'motel',
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
		categoryKey: 'motel',
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
		categoryKey: 'motel',
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
		categoryKey: 'motel',
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
		categoryKey: 'motel',
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
		categoryKey: 'motel',
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

interface WeeklyHotPensionsProps {
	initialInput: PropertiesInquiry;
}

const WeeklyHotPensions = (props: WeeklyHotPensionsProps) => {
	const { initialInput } = props;
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
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
		loading: getHotPensionsLoading,
		data: getHotPensionsData,
		error: getHotPensionsError,
		refetch: getHotPensionsRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const hotPensions: Property[] = getHotPensionsData?.getProperties?.list ?? [];

	/** --- HANDLER **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await getHotPensionsRefetch({ input: initialInput });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	const handlePushPropertyDetail = (property: Property) => {
		const url: PropertyInquiry = {
			_id: String(property._id),
			checkInDate: checkIn,
			checkOutDate: checkOut,
			personal: 2,
			propertyName: encodeURIComponent(property.propertyName),
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
			<Box className="weeklyhotpensions-container">
				{/* 헤더 */}
				<Box className="popular-header">
					<Typography className="popular-title">{t('이번 주 HOT 인기 펜션')}</Typography>
				</Box>

				{/* 슬라이더 래퍼 + 화살표 버튼 */}
				{hotPensions.length !== 0 ? (
					<Box className="weeklyhotpensions-slider-wrapper">
						<IconButton className="weeklyhotpensions-arrow weeklyhotpensions-prev">
							<ArrowBackIosNewIcon />
						</IconButton>

						<Swiper
							className="weeklyhotpensions-swiper"
							modules={[Navigation]}
							navigation={{
								prevEl: '.weeklyhotpensions-prev',
								nextEl: '.weeklyhotpensions-next',
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
							{hotPensions.map((stay: Property) => {
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
													{stay.propertyLocation} · {stay.propertyLocation}
												</Typography>

												<Box className="popular-rating-row">
													<Box className="popular-rating-badge">
														<StarIcon className="popular-rating-star" />
														<span className="popular-rating-score">{stay.propertyRank.toFixed(1)}</span>
													</Box>
													<span className="popular-rating-count">{stay.propertyComments.toLocaleString()}명 평가</span>
												</Box>

												{stay.propertyPrice && <Typography className="popular-coupon-text">쿠폰 적용시</Typography>}

												<Box className="popular-price-row">
													<span className="popular-price-current">{stay.propertyPrice.toLocaleString()}원</span>
													{stay.propertyPrice && (
														<span className="popular-price-origin">{stay.propertyPrice.toLocaleString()}원</span>
													)}
												</Box>
											</Box>
										</Box>
									</SwiperSlide>
								);
							})}
						</Swiper>

						<IconButton className="weeklyhotpensions-arrow weeklyhotpensions-next">
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

WeeklyHotPensions.defaultProps = {
	initialInput: {
		page: 1,
		limit: 20,
		sort: 'propertyViews',
		direction: 'DESC',
		search: {
			propertyType: 'PENSION',
		},
	},
};

export default WeeklyHotPensions;
