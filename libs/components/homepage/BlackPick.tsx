import { Box, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import 'swiper/css';
import 'swiper/css/navigation';
import { useTranslation } from 'react-i18next';

const ITEMS = [
	{
		tag: '신규입점',
		title: '시간의 흐름을 담는 발레 리조트 보령',
		image: '/img/event1.jfif',
	},
	{
		tag: '신규입점',
		title: '아이와 부모를 위한 완주 전주 스테이피크닉',
		image: '/img/event2.jfif',
	},
	{
		tag: '신규입점',
		title: '새로운 라이프스타일 신라모노그램 강릉 호텔',
		image: '/img/event3.jfif',
	},
	{
		tag: '풀빌라',
		title: '노을과 윤슬이 흐르는 부산 기장 홀로부산',
		image: '/img/event4.jfif',
	},
	{
		tag: '풀빌라',
		title: '노을과 윤슬이 흐르는 부산 기장 홀로부산',
		image: '/img/event5.jfif',
	},
];

export default function BlackPick() {
	const { t, i18n } = useTranslation('common');
	return (
		<Stack className="container">
			<Box className="blackpick-container">
				<Typography className="blackpick-title">{t('블랙 PICK')}</Typography>
				<Typography className="blackpick-sub">{t('여행 전문가가 경험하고 선별한 숙소 큐레이션')}</Typography>

				{ITEMS.length !== 0 ? (
					<Box className="blackpick-wrapper">
						<Swiper
							className="blackpick-swiper"
							slidesPerView={4}
							spaceBetween={20}
							modules={[Navigation]}
							navigation={{
								nextEl: '.blackpick-next',
							}}
						>
							{ITEMS.map((item, idx) => (
								<SwiperSlide key={idx}>
									<Box className="blackpick-card">
										<img src={item.image} className="blackpick-img" />

										<Box className="blackpick-overlay">
											<div className="blackpick-tag">{item.tag}</div>
											<div className="blackpick-text">{item.title}</div>
										</Box>
									</Box>
								</SwiperSlide>
							))}
						</Swiper>

						<div className="blackpick-next">
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
