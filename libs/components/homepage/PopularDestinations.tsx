import { Box, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import { PropertyLocation, PropertyLocationKorean } from '../../enums/property.enum';

const ITEMS = [
	{ name: '서울', image: '/img/서울.jfif', value: PropertyLocation.SEOUL },
	{ name: '부산', image: '/img/부산.jfif', value: PropertyLocation.BUSAN },
	{ name: '강릉', image: '/img/강릉.jfif', value: PropertyLocation.GANGNEUNG },
	{ name: '인천', image: '/img/인천.jfif', value: PropertyLocation.INCHEON },
	{ name: '경주', image: '/img/경주.jfif', value: PropertyLocation.GYEONGJU },
	{ name: '해운대', image: '/img/해운대.jfif', value: PropertyLocation.HEUNDE },
	{ name: '가평1', image: '/img/가평.jfif', value: PropertyLocation.GAPYEONG },
	{ name: '가평2', image: '/img/가평.jfif', value: PropertyLocation.GAPYEONG },
	{ name: '가평3', image: '/img/가평.jfif', value: PropertyLocation.GAPYEONG },
	{ name: '가평4', image: '/img/가평.jfif', value: PropertyLocation.GAPYEONG },
];

export default function PopularDestinations() {
	const router = useRouter();
	/**LIFESICLE**/

	/**LIFESICLE**/

	/**HANDLER**/
	const handleSelectLocation = async (location: string) => {
		const data = localStorage.getItem('searchFilter');
		if (data) {
			const searchFilter = JSON.parse(data);
			searchFilter.search.location = location;
			localStorage.setItem('searchFilter', JSON.stringify(searchFilter));
			await router.push(
				`/property?input=${JSON.stringify(searchFilter)}`,
				`/property?input=${JSON.stringify(searchFilter)}`,
			);
		}
	};
	/**HANDLER**/
	return (
		<Stack className="container">
			<Box className="dest-container">
				<Typography className="dest-title">국내 인기 여행지</Typography>

				{ITEMS.length !== 0 ? (
					<Box className="dest-wrapper">
						<div className="dest-nav dest-prev">
							<ArrowBackIosNewIcon />
						</div>

						<Swiper
							className="dest-swiper"
							slidesPerView={6}
							spaceBetween={10}
							modules={[Navigation]}
							navigation={{
								prevEl: '.dest-prev',
								nextEl: '.dest-next',
							}}
						>
							{ITEMS.map((item) => (
								<SwiperSlide key={item.name}>
									<Box className="dest-card" onClick={() => handleSelectLocation(item.value)}>
										<img src={item.image} className="dest-img" />
										<Typography className="dest-label">{item.name}</Typography>
									</Box>
								</SwiperSlide>
							))}
						</Swiper>

						<div className="dest-nav dest-next">
							<ArrowForwardIosIcon />
						</div>
					</Box>
				) : (
					<div className="no-data">
						<img src="/img/no-data3.webp" alt="" />
					</div>
				)}
			</Box>
		</Stack>
	);
}
