import { Box, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/router';
import { PropertyLocation } from '../../enums/property.enum';

const Locations = [
	{ name: '제주도', image: `/img/${PropertyLocation.JEJU}.jfif`, value: PropertyLocation.GAPYEONG },
	{ name: '서울', image: `/img/${PropertyLocation.SEOUL}.jfif`, value: PropertyLocation.SEOUL },
	{ name: '부산', image: `/img/${PropertyLocation.BUSAN}.jfif`, value: PropertyLocation.BUSAN },
	{ name: '강릉', image: `/img/${PropertyLocation.GANGNEUNG}.jfif`, value: PropertyLocation.GANGNEUNG },
	{ name: '인천', image: `/img/${PropertyLocation.INCHEON}.jfif`, value: PropertyLocation.INCHEON },
	{ name: '경주', image: `/img/${PropertyLocation.GYEONGJU}.jfif`, value: PropertyLocation.GYEONGJU },
	{ name: '해운대', image: `/img/${PropertyLocation.HEUNDE}.jfif`, value: PropertyLocation.HEUNDE },
	{ name: '가평', image: `/img/${PropertyLocation.GAPYEONG}.jfif`, value: PropertyLocation.GAPYEONG },
	{ name: '여수', image: `/img/${PropertyLocation.YEOSU}.jfif`, value: PropertyLocation.GAPYEONG },
	{ name: '속초', image: `/img/${PropertyLocation.SOKCHO}.jfif`, value: PropertyLocation.GAPYEONG },
];

export default function PopularDestinations() {
	const router = useRouter();
	/**LIFESICLE**/

	/**LIFESICLE**/

	/**HANDLER**/
	const handleSelectLocation = async (location: string) => {
		if (typeof window === 'undefined') return;

		const data = localStorage.getItem('searchFilter');
		const searchFilter = data ? JSON.parse(data) : { search: {} };

		searchFilter.search.location = location;

		const input = encodeURIComponent(JSON.stringify(searchFilter));
		localStorage.setItem('searchFilter', JSON.stringify(searchFilter));

		await router.push(`/property?input=${input}`);
	};
	/**HANDLER**/
	return (
		<Stack className="container">
			<Box className="dest-container">
				<Typography className="dest-title">국내 인기 여행지</Typography>

				{Locations.length !== 0 ? (
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
							{Locations.map((item) => (
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
