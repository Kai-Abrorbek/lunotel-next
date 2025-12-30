// RoomStickyBar.tsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

type TabKey = 'overview' | 'rooms' | 'amenities' | 'location' | 'reviews';
const TABS: { key: TabKey; label: string }[] = [
	{ key: 'overview', label: '개요' },
	{ key: 'rooms', label: '객실' },
	{ key: 'amenities', label: '서비스 및 부대시설' },
	{ key: 'location', label: '위치' },
	{ key: 'reviews', label: '리뷰' },
];

interface RoomStickyBarProps {
	price: string; // "22,500원"
	couponLabel?: string; // "2,500원 쿠폰 적용가"
	scrollOffset?: number; // 몇 px 이상 스크롤되면 나타날지 (기본 260)
	activeTab: string;
	setActiveTab: (v: TabKey) => void;
}

const RoomStickyBar: React.FC<RoomStickyBarProps> = ({
	price,
	couponLabel,
	scrollOffset = 260,
	setActiveTab,
	activeTab,
}) => {
	const [visible, setVisible] = useState(false);
	const { t, i18n } = useTranslation('common');

	useEffect(() => {
		const handleScroll = () => {
			setVisible(window.scrollY > scrollOffset);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [scrollOffset]);

	const handleTabClick = (tab: TabKey) => {
		setActiveTab(tab);
		const target = document.getElementById(`section-${tab}`);
		if (target) {
			const rect = target.getBoundingClientRect();
			const top = window.scrollY + rect.top - 170; // 고정바 높이만큼 보정
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	const handleReserveClick = () => {
		const roomsSection = document.getElementById('section-rooms');
		if (roomsSection) {
			const rect = roomsSection.getBoundingClientRect();
			const top = window.scrollY + rect.top - 170;
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	return (
		<Stack className="container">
			<Box className={`room-sticky-bar ${visible ? 'room-sticky-bar--visible' : ''}`}>
				<Box className="room-sticky-bar__inner">
					{/* 왼쪽 탭들 */}
					<Box className="room-sticky-bar__tabs">
						{TABS.map((tab) => (
							<button
								key={tab.key}
								className={
									tab.key === activeTab ? 'room-sticky-bar__tab room-sticky-bar__tab--active' : 'room-sticky-bar__tab'
								}
								onClick={() => handleTabClick(tab.key)}
							>
								{t(`${tab.label}`)}
								{tab.key === activeTab && <span className="room-sticky-bar__underline" />}
							</button>
						))}
					</Box>

					{/* 오른쪽 가격 + 버튼 */}
					<Box className="room-sticky-bar__right">
						{couponLabel && <Typography className="room-sticky-bar__coupon">{couponLabel}</Typography>}
						<Typography className="room-sticky-bar__price">{price}</Typography>
						<Button variant="outlined" className="room-sticky-bar__button" onClick={handleReserveClick}>
							객실보기
						</Button>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default RoomStickyBar;
