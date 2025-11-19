import { NextPage } from 'next';
import React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import { Stack } from '@mui/material';
import LayoutHome from '../libs/components/layout/LayoutHome';
import DomesticDestination from '../libs/components/homepage/DomesticDestination';
import PopularStays from '../libs/components/homepage/PopularStays';
import HotelSpecialsToday from '../libs/components/homepage/HotelSpecialsToday';
import WeeklyHotPensions from '../libs/components/homepage/WeeklyHotPensions';
import PopularDestinations from '../libs/components/homepage/PopularDestinations';
import BlackPick from '../libs/components/homepage/BlackPick';
import HeroSearch from '../libs/components/homepage/HeroSearch';
import EventSlider from '../libs/components/homepage/EventSlider';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();
	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<HeroSearch />
				<EventSlider />
				<PopularDestinations />
				<PopularStays />
				<HotelSpecialsToday />
				<WeeklyHotPensions />
				<DomesticDestination />
				<BlackPick />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<HeroSearch />
				<EventSlider />
				<PopularDestinations />
				<PopularStays />
				<HotelSpecialsToday />
				<WeeklyHotPensions />
				<BlackPick />
				<DomesticDestination />
			</Stack>
		);
	}
};

export default LayoutHome(Home);
