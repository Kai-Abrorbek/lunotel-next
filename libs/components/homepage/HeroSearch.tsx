import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PropertiesInquiry } from '../../types/property/property.input';
import HeroCard from '../common/HeroCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper';
import 'swiper/css';
import { useTranslation } from 'react-i18next';

interface HeroSearchProps {
	initialInput: PropertiesInquiry;
}

const HERO_IMAGES = [
	'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
	'https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg?auto=compress&cs=tinysrgb&w=800',
	'https://images.pexels.com/photos/242246/pexels-photo-242246.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const HeroSearch = (props: HeroSearchProps) => {
	const { initialInput } = props;
	const [heroCardOpen, setHeroCardOpen] = useState<boolean>(false);
	const { t, i18n } = useTranslation('common');

	return (
		<Box className="hero-section">
			<Swiper
				modules={[Autoplay]}
				effect="coverflow"
				centeredSlides
				slidesPerView="auto"
				autoplay={{ delay: 5000, disableOnInteraction: false }}
				className="hero-swiper"
			>
				{HERO_IMAGES.map((img, index) => (
					<SwiperSlide key={index}>
						<Box className="hero-bg" sx={{ backgroundImage: `url(${img})` }} />
					</SwiperSlide>
				))}
			</Swiper>

			<Box className="hero-overlay" />
			<Box className="hero-inner">
				<Typography className="hero-title">
					{t('국내부터 해외까지')}
					<br />
					<span className="hero-title-brand">루노텔</span>
				</Typography>
				<HeroCard setHeroCardOpen={setHeroCardOpen} initialInput={initialInput} refElement={null} propertyName={null} />
			</Box>
		</Box>
	);
};

HeroSearch.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {
			location: '',
			checkInDate: new Date().toISOString().split('T')[0],
			checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
			personal: 2,
		},
	},
};

export default HeroSearch;
