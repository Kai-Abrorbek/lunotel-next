// MyReservationsPage.tsx
import React, { useState } from 'react';
import { Box, Button, Paper, Divider, Stack, dividerClasses } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import ReservationHistory from '../../../libs/components/mypage/user/ReservationHistory';
import RoomResultCard from '../../../libs/components/mypage/user/RoomResultCard';
import PointPage from '../../../libs/components/mypage/user/PointPage';
import MyInfoPage from '../../../libs/components/mypage/user/MyInfoPage';
import SettingsPage from '../../../libs/components/mypage/user/SettingsPage';
import Link from 'next/link';

const MyReservationsPage: React.FC = () => {
	const [menu, setManu] = useState<string>('reservation-details');
	const user = { name: 'KAi', type: 'host' };
	const renderPage = () => {
		switch (menu) {
			case 'reservation-details':
				return <ReservationHistory />;
			case 'my-favorits':
				return <RoomResultCard />;
			case 'points':
				return <PointPage />;
			case 'my-info':
				return <MyInfoPage />;
			case 'settings':
				return <SettingsPage />;
		}
	};

	return (
		<Stack className="container">
			<Box className="my-res-page">
				<Box className="my-res-inner">
					{/* LEFT SIDE MENU */}
					<Paper
						className="my-res-side-menu"
						elevation={0}
						style={{ height: `${user.type === 'host' ? '338px' : ''}` }}
					>
						<Stack className="my-res-side-menu-list">
							<Box className="my-res-side-menu-box " onClick={() => setManu('reservation-details')}>
								<Button className={`my-res-side-menu-item ${menu === 'reservation-details' ? 'active' : ''}`}>
									예약 내역
								</Button>
								<ChevronRightIcon />
							</Box>
							<Divider />
							<Box className="my-res-side-menu-box " onClick={() => setManu('my-favorits')}>
								<Button className={`my-res-side-menu-item ${menu === 'my-favorits' ? 'active' : ''}`}>찜 목록</Button>
								<ChevronRightIcon />
							</Box>
							<Divider />
							<Box className="my-res-side-menu-box " onClick={() => setManu('points')}>
								<Button className={`my-res-side-menu-item ${menu === 'points' ? 'active' : ''}`}>포인트</Button>
								<ChevronRightIcon />
							</Box>
							<Divider />
							<Box className="my-res-side-menu-box " onClick={() => setManu('my-info')}>
								<Button className={`my-res-side-menu-item ${menu === 'my-info' ? 'active' : ''}`}>내 정보 관리</Button>
								<ChevronRightIcon />
							</Box>
							<Divider />
							<Box className="my-res-side-menu-box " onClick={() => setManu('settings')}>
								<Button className={`my-res-side-menu-item ${menu === 'settings' ? 'active' : ''}`}>설정</Button>
								<ChevronRightIcon />
							</Box>
							<Divider />
							{user.type === 'host' ? (
								<Link href={'/mypage/host'}>
									<Box className="my-res-side-menu-box " onClick={() => setManu('dashboard')}>
										<Button className={`my-res-side-menu-item ${menu === 'settings' ? 'active' : ''}`}>대시보드</Button>
										<ChevronRightIcon />
									</Box>
								</Link>
							) : (
								''
							)}
						</Stack>
					</Paper>

					{/* RIGHT MAIN AREA */}
					<Box className="my-res-main">
						<div>{renderPage()}</div>
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};

export default LayoutHome(MyReservationsPage);
