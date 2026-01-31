import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PropertiesInquiry } from '../../types/property/property.input';
import HeroCard from '../common/HeroCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCoverflow } from 'swiper';
import 'swiper/css';
import { useTranslation } from 'react-i18next';
import useDateHook from '../../hooks/useDate';

interface HeroSearchProps {
	initialInput: PropertiesInquiry;
}

const HERO_IMAGES = [
	'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
	'https://images.pexels.com/photos/261187/pexels-photo-261187.jpeg?auto=compress&cs=tinysrgb&w=800',
	'https://images.pexels.com/photos/242246/pexels-photo-242246.jpeg?auto=compress&cs=tinysrgb&w=800',
];

const HeroSearch = (props: HeroSearchProps) => {
	const { formatDate } = useDateHook();
	const { initialInput } = props;
	const [heroCardOpen, setHeroCardOpen] = useState<boolean>(false);
	const { t, i18n } = useTranslation('common');

	return (
		<Box className="hero-section">
			<Swiper
				modules={[Autoplay, EffectCoverflow]}
				effect="coverflow"
				centeredSlides
				slidesPerView="auto"
				autoplay={{ delay: 1000 * 60 * 24 }}
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
				<Typography className="hero-title">{t('국내부터 해외까지 루노텔')}</Typography>
				<HeroCard setHeroCardOpen={setHeroCardOpen} initialInput={initialInput} refElement={null} propertyName={null} />
			</Box>
		</Box>
	);
};

function formatDate(date: Date, addDays = 0) {
	const d = new Date(date);
	d.setDate(d.getDate() + addDays);

	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

HeroSearch.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {
			location: '',
			checkInDate: formatDate(new Date(), 0),
			checkOutDate: formatDate(new Date(), 1),
			personal: 2,
			// propertyType: 'ALL',
		},
	},
};

export default HeroSearch;
