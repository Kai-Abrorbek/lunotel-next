import { useState } from 'react';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { PropertiesInquiry } from '../../types/property/property.input';
import { PropertyType, PropertyTypeKorean } from '../../enums/property.enum';
import { Property } from '../../types/property/property';
import { usePropertySection } from '../../hooks/usePropertySection';
import PropertyCard from '../common/PropertyCard';
import PropertyCardSkeleton from '../common/PropertyCardSkeleton';

const CATEGORIES_K: PropertyTypeKorean[] = Object.values(PropertyTypeKorean);
const CATEGORIES_EN: PropertyType[] = Object.values(PropertyType);

interface PopularStaysProps {
	initialInput: PropertiesInquiry;
}

const PopularStays = ({ initialInput }: PopularStaysProps) => {
	const [activeCategory, setActiveCategory] = useState<PropertyType>(PropertyType.ALL);
	const { properties, user, loading, t, likePropertyHandler, handlePushPropertyDetail } =
		usePropertySection(initialInput);

	const filtered =
		activeCategory === 'ALL' ? properties : properties.filter((p: Property) => p.propertyType === activeCategory);

	return (
		<Stack className="container">
			<Box className="section-container">
				<Box className="section-header">
					<Typography className="section-title">{t('인기 추천 숙소')}</Typography>
					<Box className="section-tabs">
						{CATEGORIES_EN.map((c, idx) => (
							<Button
								key={c}
								className={`section-tab ${activeCategory === c ? 'active' : ''}`}
								onClick={() => setActiveCategory(c)}
							>
								{t(`${CATEGORIES_K[idx]}`)}
							</Button>
						))}
					</Box>
				</Box>

				{loading ? (
					<Box className="section-slider-wrapper">
						<Swiper
							className="section-swiper"
							modules={[Navigation]}
							spaceBetween={24}
							breakpoints={{
								0: { slidesPerView: 1.2, spaceBetween: 16 },
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
				) : filtered.length !== 0 ? (
					<Box className="section-slider-wrapper">
						<IconButton className="section-arrow section-prev">
							<ArrowBackIosNewIcon />
						</IconButton>
						<Swiper
							className="section-swiper"
							modules={[Navigation]}
							navigation={{ prevEl: '.section-prev', nextEl: '.section-next' }}
							spaceBetween={24}
							breakpoints={{
								0: { slidesPerView: 1.2, spaceBetween: 16 },
								768: { slidesPerView: 2.5, spaceBetween: 20 },
								1024: { slidesPerView: 3, spaceBetween: 22 },
								1280: { slidesPerView: 4, spaceBetween: 24 },
							}}
						>
							{filtered.map((p: Property) => (
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
						<IconButton className="section-arrow section-next">
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
