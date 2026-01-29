// PopularStays.tsx
import { useMemo, useState } from 'react';
import { Box, Typography, IconButton, Chip, Stack } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import { PropertiesInquiry, PropertyInquiry } from '../../types/property/property.input';
import 'swiper/css';
import 'swiper/css/navigation';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { Message } from '../../enums/common.enum';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { useTranslation } from 'react-i18next';

interface HotelSpecialsTodayProps {
	initialInput: PropertiesInquiry;
}
const HotelSpecialsToday = (props: HotelSpecialsTodayProps) => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const { initialInput } = props;
	const user = useReactiveVar(userVar);
	const checkIn = useMemo(() => {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
	}, []);
	const checkOut = useMemo(() => {
		const d = new Date();
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate() + 1).padStart(
			2,
			'0',
		)}`;
	}, []);

	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	/** APOLLO REQUESTS **/
	const {
		loading: getHotelSpecialsLoading,
		data: getHotelSpecialsData,
		error: getHotelSpecialsError,
		refetch: getHotelSpecialsRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
	});

	const hotelspecials: Property[] = getHotelSpecialsData?.getProperties?.list ?? [];

	/** --- HANDLER **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await getHotelSpecialsRefetch({ input: initialInput });
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
			<Box className="hotelspecials-container">
				{/* 헤더 */}
				<Box className="popular-header">
					<Typography className="popular-title">{t('오늘 체크인 호텔 특가')}</Typography>
				</Box>

				{/* 슬라이더 래퍼 + 화살표 버튼 */}
				{hotelspecials.length !== 0 ? (
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
							{hotelspecials.map((stay: Property) => {
								const isFav = stay?.meLiked?.[0]?.myFavorite!;
								return (
									<SwiperSlide key={stay._id}>
										<Box className="popular-card" onClick={() => handlePushPropertyDetail(stay)}>
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
	);
};

HotelSpecialsToday.defaultProps = {
	initialInput: {
		page: 1,
		limit: 20,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default HotelSpecialsToday;
