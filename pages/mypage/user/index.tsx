// MyReservationsPage.tsx
import React from 'react';
import { Box, Button, Paper, Divider, Stack } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import ReservationHistory from '../../../libs/components/mypage/user/ReservationHistory';
import RoomResultCard from '../../../libs/components/mypage/user/RoomResultCard';
import PointPage from '../../../libs/components/mypage/user/PointPage';
import MyInfoPage from '../../../libs/components/mypage/user/MyInfoPage';
import SettingsPage from '../../../libs/components/mypage/user/SettingsPage';
import Link from 'next/link';
import { useRouter } from 'next/router';

const MyReservationsPage: React.FC = () => {
	const router = useRouter();
	const category = router.query.category ?? 'reservation-details';
	const user = { name: 'KAi', type: 'host' };

	const renderPage = () => {
		switch (category) {
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
							<Link href={'/mypage/user?category=reservation-details'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'reservation-details' ? 'active' : ''}`}>
										예약 내역
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=my-favorits'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'my-favorits' ? 'active' : ''}`}>
										찜 목록
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=points'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'points' ? 'active' : ''}`}>포인트</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=my-info'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'my-info' ? 'active' : ''}`}>
										내 정보 관리
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=settings'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'settings' ? 'active' : ''}`}>설정</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							{user.type === 'host' ? (
								<Link href={'/mypage/property-management'}>
									<Box className="my-res-side-menu-box ">
										<Button className={`my-res-side-menu-item ${category === 'settings' ? 'active' : ''}`}>
											숙소 관리
										</Button>
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
