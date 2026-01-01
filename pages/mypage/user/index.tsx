// MyReservationsPage.tsx
import React, { use, useEffect, useRef, useState } from 'react';
import { Box, Button, Paper, Divider, Stack, Pagination } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import ReservationHistory from '../../../libs/components/mypage/user/ReservationHistory';
import MyFavorits from '../../../libs/components/mypage/user/MyFavorits';
import PointPage from '../../../libs/components/mypage/user/PointPage';
import MyInfoPage from '../../../libs/components/mypage/user/MyInfoPage';
import SettingsPage from '../../../libs/components/mypage/user/SettingsPage';
import Link from 'next/link';
import { useRouter } from 'next/router';
import NotificationsPage from '../../../libs/components/mypage/user/NotificationsPage';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberType } from '../../../libs/enums/member.enum';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const MyReservationsPage: React.FC = () => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const boxRef = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);
	const [category, setCategory] = useState('reservation-details');
	const user = useReactiveVar(userVar);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);

	useEffect(() => {
		setMounted(true);

		if (!router.isReady) return;
		setCategory((router.query.category as string) ?? 'reservation-details');
	}, [router.isReady, router.query.category]);

	useEffect(() => {
		if (!user?._id) router.push('/');
	}, [user?._id]);

	if (!mounted || !router.isReady) return null;

	const renderPage = () => {
		switch (category) {
			case 'reservation-details':
				return <ReservationHistory currentPage={currentPage} setTotal={setTotal} />;
			case 'my-favorits':
				return <MyFavorits currentPage={currentPage} setTotal={setTotal} />;
			case 'points':
				return <PointPage />;
			case 'my-info':
				return <MyInfoPage />;
			case 'settings':
				return <SettingsPage />;
			case 'notifications':
				return <NotificationsPage currentPage={currentPage} setTotal={setTotal} />;
		}
	};

	const paginationHandler = (e: any, value: number) => {
		setCurrentPage(value);
		boxRef.current ? boxRef.current.scrollTo({ top: 0, behavior: 'smooth' }) : null;
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<Stack className="container">
			<Box className="my-res-page">
				<Box className="my-res-inner">
					{/* LEFT SIDE MENU */}
					<Paper
						className="my-res-side-menu"
						elevation={0}
						style={{ height: `${user.memberType === MemberType.AGENT ? '395px' : '339px'}` }}
					>
						<Stack className="my-res-side-menu-list">
							<Link href={'/mypage/user?category=reservation-details'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'reservation-details' ? 'active' : ''}`}>
										{t('예약 내역')}
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=my-favorits'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'my-favorits' ? 'active' : ''}`}>
										{t('찜 목록')}
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=points'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'points' ? 'active' : ''}`}>
										{t('포인트')}
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=my-info'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'my-info' ? 'active' : ''}`}>
										{t('내 정보 관리')}
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=settings'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'settings' ? 'active' : ''}`}>
										{t('설정')}
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							<Link href={'/mypage/user?category=notifications'}>
								<Box className="my-res-side-menu-box ">
									<Button className={`my-res-side-menu-item ${category === 'notifications' ? 'active' : ''}`}>
										{t('알림센터')}
									</Button>
									<ChevronRightIcon />
								</Box>
							</Link>
							<Divider />
							{user.memberType === MemberType.AGENT ? (
								<Link href={'/mypage/property-management'}>
									<Box className="my-res-side-menu-box  my-res-side-menu-box--special">
										<Button className={`my-res-side-menu-item ${category === 'property-management' ? 'active' : ''}`}>
											{t('숙소 관리')}
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
					<Box className="my-res-main" ref={boxRef}>
						<div>{renderPage()}</div>
					</Box>
				</Box>
			</Box>
			<Stack sx={{ width: '100%', alignItems: 'center' }}>
				<Pagination
					count={Math.ceil(total / 10) || 1}
					page={currentPage}
					shape="circular"
					color="primary"
					onChange={paginationHandler}
				/>
			</Stack>
		</Stack>
	);
};

export default LayoutHome(MyReservationsPage);
