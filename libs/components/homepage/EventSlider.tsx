import React from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
import 'swiper/css';

import 'swiper/css/pagination';
import { useTranslation } from 'react-i18next';

const EventSlider = () => {
	const { t, i18n } = useTranslation('common');
	const events = [
		{
			title1: '지금 예약하면 연말까지 최대할인!',
			title2: '최대 10% 할인\n국내숙소 쿠폰팩',
			img: '/img/01.png',
		},
		{
			title1: '1년에 딱 한 번 오는 특가',
			title2: '블랙숙소\n최대 78% 할인',
			img: '/img/01.png',
		},
		{
			title1: '전 세계 투숙 기간 상관 없이!',
			title2: '최대 10%\n해외숙소 쿠폰팩',
			img: '/img/01.png',
		},
		{
			title1: '전 세계 투숙 기간 상관 없이!',
			title2: '최대 10%\n해외숙소 쿠폰팩',
			img: '/img/01.png',
		},
		{
			title1: '전 세계 투숙 기간 상관 없이!',
			title2: '최대 10%\n해외숙소 쿠폰팩',
			img: '/img/01.png',
		},
		{
			title1: '전 세계 투숙 기간 상관 없이!',
			title2: '최대 10%\n해외숙소 쿠폰팩',
			img: '/img/01.png',
		},
		{
			title1: '전 세계 투숙 기간 상관 없이!',
			title2: '최대 10%\n해외숙소 쿠폰팩',
			img: '/img/01.png',
		},
		{
			title1: '전 세계 투숙 기간 상관 없이!',
			title2: '최대 10%\n해외숙소 쿠폰팩',
			img: '/img/01.png',
		},
	];

	return (
		<Stack className="container">
			<Box className="event-container">
				<Box className="event-header">
					<Typography className="event-title">{t('이벤트')}</Typography>
					{/* <Typography className="event-more">더보기</Typography> */}
				</Box>

				<Swiper
					slidesPerView={3}
					slidesPerGroup={3}
					spaceBetween={20}
					loop={true}
					autoplay={{
						delay: 3000,
						disableOnInteraction: false,
					}}
					pagination={{ clickable: true }}
					modules={[Autoplay, Pagination]}
					className="event-swiper"
				>
					{events.map((ev, idx) => (
						<SwiperSlide key={idx}>
							<Box className="event-card">
								<Box className="event-card-text">
									<Typography className="event-sub">{ev.title1}</Typography>
									<Typography className="event-main">
										{ev.title2.split('\n').map((line, i) => (
											<span key={i}>
												{line}
												<br />
											</span>
										))}
									</Typography>
								</Box>

								<Box className="event-card-img-wrapper">
									<img src={ev.img} alt="" className="event-card-img" />
								</Box>
							</Box>
						</SwiperSlide>
					))}
				</Swiper>
			</Box>
		</Stack>
	);
};

export default EventSlider;
