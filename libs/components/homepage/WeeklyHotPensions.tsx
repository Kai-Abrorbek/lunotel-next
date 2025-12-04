// PopularStays.tsx
import { useState } from 'react';
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
import { PropertiesInquiry } from '../../types/property/property.input';

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
	const [hotPensions, setHotPensions] = useState<PropertiesInquiry[]>([]);
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const toggleFavorite = (id: number) => {
		setFavoriteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	return (
		<Stack className="container">
			<Box className="weeklyhotpensions-container">
				{/* 헤더 */}
				<Box className="popular-header">
					<Typography className="popular-title">이번 주 HOT 인기 펜션</Typography>
				</Box>

				{/* 슬라이더 래퍼 + 화살표 버튼 */}
				{STAYS.length !== 0 ? (
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
							{STAYS.map((stay) => {
								const isFav = favoriteIds.includes(stay.id);
								return (
									<SwiperSlide key={stay.id}>
										<Box className="popular-card">
											{/* 이미지 */}
											<Box className="popular-image-wrapper">
												<img src={stay.imageUrl} alt={stay.name} className="popular-image" />
												<Box className="popular-image-top">
													{stay.badgeText && <Chip className="popular-chip" label={stay.badgeText} size="small" />}
													<IconButton className="popular-fav-btn" onClick={() => toggleFavorite(stay.id)}>
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

												{stay.originalPrice && <Typography className="popular-coupon-text">쿠폰 적용시</Typography>}

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
