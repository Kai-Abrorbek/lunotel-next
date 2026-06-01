import { Box, Typography, IconButton, Stack } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { PropertiesInquiry } from '../../types/property/property.input';
import { Property } from '../../types/property/property';
import { usePropertySection } from '../../hooks/usePropertySection';
import PropertyCard from '../common/PropertyCard';
import PropertyCardSkeleton from '../common/PropertyCardSkeleton';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import PropertyCardMobile from './PropertyCardMobile';

interface WeeklyHotPensionsProps {
	initialInput: PropertiesInquiry;
}

const WeeklyHotPensions = ({ initialInput }: WeeklyHotPensionsProps) => {
	const { properties, user, t, loading, likePropertyHandler, handlePushPropertyDetail } =
		usePropertySection(initialInput);
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Box className="mobile-section">
				<Box className="mobile-section__header">
					<Typography className="mobile-section__title">{t('이번 주 HOT 인기 펜션')}</Typography>
					<Box className="mobile-section__tabs">{/* 탭들 */}</Box>
				</Box>
				<Box className="mobile-section__scroll">
					{loading ? (
						[1, 2, 3, 4].map((i) => (
							<Box key={i} className="mobile-section__card-wrap">
								<PropertyCardSkeleton />
							</Box>
						))
					) : properties.length !== 0 ? (
						properties.map((p: Property) => (
							<Box key={p._id} className="mobile-section__card-wrap">
								<PropertyCardMobile
									property={p}
									user={user}
									onLike={likePropertyHandler}
									onClick={handlePushPropertyDetail}
								/>
							</Box>
						))
					) : (
						<div style={{ width: '100%', height: '100px', textAlign: 'center' }}>
							<img src="/img/no-data3.webp" alt="" style={{ width: '100px', height: '100%' }} />
						</div>
					)}
				</Box>
			</Box>
		);
	}

	return (
		<Stack className="container">
			<Box className="section-container">
				<Box className="section-header">
					<Typography className="section-title">{t('이번 주 HOT 인기 펜션')}</Typography>
				</Box>

				{loading ? (
					<Box className="section-slider-wrapper">
						<Swiper
							className="section-swiper"
							modules={[Navigation]}
							spaceBetween={24}
							breakpoints={{
								0: { slidesPerView: 2.3, spaceBetween: 10 },
								768: { slidesPerView: 2.5, spaceBetween: 20 },
								1024: { slidesPerView: 3, spaceBetween: 22 },
								1280: { slidesPerView: 4, spaceBetween: 24 },
							}}
						>
							{[1, 2, 3, 4].map((i) => (
								<SwiperSlide key={i}>
									<PropertyCardSkeleton />
								</SwiperSlide>
							))}
						</Swiper>
					</Box>
				) : properties.length !== 0 ? (
					<Box className="section-slider-wrapper">
						<IconButton className="section-arrow section-prev-pensions">
							<ArrowBackIosNewIcon />
						</IconButton>
						<Swiper
							className="section-swiper"
							modules={[Navigation]}
							navigation={{ prevEl: '.section-prev-pensions', nextEl: '.section-next-pensions' }}
							spaceBetween={24}
							breakpoints={{
								0: { slidesPerView: 1.2, spaceBetween: 16 },
								768: { slidesPerView: 2.5, spaceBetween: 20 },
								1024: { slidesPerView: 3, spaceBetween: 22 },
								1280: { slidesPerView: 4, spaceBetween: 24 },
							}}
						>
							{properties.map((p: Property) => (
								<SwiperSlide key={p._id}>
									<PropertyCard
										property={p}
										user={user}
										onLike={likePropertyHandler}
										onClick={handlePushPropertyDetail}
									/>
								</SwiperSlide>
							))}
						</Swiper>
						<IconButton className="section-arrow section-next-pensions">
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
		search: { propertyType: 'PENSION' },
	},
};

export default WeeklyHotPensions;
