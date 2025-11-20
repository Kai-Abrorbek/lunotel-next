import React from 'react';
import { Box, Typography } from '@mui/material';
import { PropertiesInquiry } from '../../types/property/property.input';
import HeroCard from '../property/HeroCard';

interface HeroSearchProps {
	initialInput: PropertiesInquiry;
}

const HeroSearch = (props: HeroSearchProps) => {
	const { initialInput } = props;

	return (
		<Box className="hero-section">
			<Box className="hero-overlay" />

			<Box className="hero-inner">
				<Typography className="hero-title">국내부터 해외까지 루노텔</Typography>
				<HeroCard initialInput={initialInput} />
			</Box>
		</Box>
	);
};

function formatDate(date: Date, day: number = 0) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate() + day).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

HeroSearch.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		search: {
			location: '',
			checkInDate: formatDate(new Date(), 0),
			checkOutDate: formatDate(new Date(), 1),
			personal: 2,
		},
	},
};

export default HeroSearch;
