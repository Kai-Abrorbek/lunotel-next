import { Box, Button, Divider, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import ReviewPage from './ReviewPage';

type TripStatus = 'upcoming' | 'completed' | 'canceled';
type TripType = 'domestic' | 'overseas' | 'package';
type TabValue = 'domestic' | 'overseas' | 'package';

interface Reservation {
	id: string;
	title: string;
	dateRange: string;
	location: string;
	guestCount: number;
	status: TripStatus;
	type: TripType;
}

const MOCK_RESERVATIONS: Reservation[] = [
	{
		id: 'R-20241101',
		title: '서울 시티 호텔 (디럭스 더블)',
		dateRange: '2024.12.01 ~ 2024.12.03',
		location: '서울 · 명동',
		guestCount: 2,
		status: 'upcoming',
		type: 'domestic',
	},
	{
		id: 'R-20241021',
		title: '제주 블루오션 리조트',
		dateRange: '2024.10.21 ~ 2024.10.24',
		location: '제주 · 애월',
		guestCount: 3,
		status: 'completed',
		type: 'domestic',
	},
	{
		id: 'R-20240911',
		title: '오사카 난바 호텔',
		dateRange: '2024.09.11 ~ 2024.09.14',
		location: '일본 · 오사카',
		guestCount: 2,
		status: 'canceled',
		type: 'domestic',
	},
];

interface MenuLIst {
	id: string;
	title: string;
	label: string;
}

const manuList: MenuLIst[] = [
	{
		id: '1',
		label: 'reservation-details',
		title: '예약 내역',
	},
	{
		id: '2',
		label: 'my-favorits',
		title: '찜 목록',
	},
	{
		id: '3',
		label: 'points',
		title: '포인트',
	},
	{
		id: '4',
		label: 'my-info',
		title: '내 정보 관리',
	},
	{
		id: '4',
		label: 'settings',
		title: '설정',
	},
];

const ReservationHistory = () => {
	const [tab, setTab] = useState<TabValue>('domestic');
	const filtered = useMemo(() => MOCK_RESERVATIONS.filter((r) => r.type === tab), [tab]);
	const upcoming = filtered.filter((r) => r.status === 'upcoming');
	const history = filtered.filter((r) => r.status === 'completed' || r.status === 'canceled');
	const [openReview, setOpenReview] = useState<boolean>(false);

	const handleTabChange = (_: React.SyntheticEvent, value: TabValue) => {
		setTab(value);
	};
	return (
		<>
			<Typography className="my-res-main-title">예약내역</Typography>

			{/* TABS + UPCOMING CARD */}
			<Box className="my-res-card-wrap">
				<Tabs
					value={tab}
					onChange={handleTabChange}
					className="my-res-tabs"
					textColor="primary"
					indicatorColor="primary"
				>
					<Tab label="국내숙소" value="domestic" />
					{/* <Tab label="해외숙소" value="ㅐverseas" /> */}
					{/* <Tab label="국내숙소" value="domestic" /> */}
				</Tabs>

				<Paper className="my-res-card" elevation={0}>
					{upcoming.length === 0 ? (
						<Box className="my-res-empty">
							<Box className="my-res-empty-text">
								<Typography className="my-res-empty-title">예정된 여행이 없습니다.</Typography>
								<Typography className="my-res-empty-sub">지금 새로 예약을 진행해보세요.</Typography>
								<Button variant="contained" className="my-res-empty-button">
									여행지 찾아보기
								</Button>
							</Box>
							<Box className="my-res-empty-illust" />
						</Box>
					) : (
						<Box>
							{upcoming.map((r) => (
								<Stack className="my-res-item-box">
									<Box className="my-res-item-img" src="/img/서울.jfif" component={'img'}></Box>
									<Box key={r.id} className="my-res-item">
										<Box className="my-res-item-info">
											<Typography className="my-res-item-title">{r.title}</Typography>
											<Typography className="my-res-item-meta">{r.dateRange}</Typography>
											<Typography className="my-res-item-meta">
												{r.location} · {r.guestCount}명
											</Typography>
										</Box>
									</Box>
									<Box className="my-res-item-btn">
										<Link href={'#'}>
											<Button variant="outlined">상세 보기</Button>
										</Link>
									</Box>
								</Stack>
							))}
						</Box>
					)}
				</Paper>
			</Box>

			{/* HISTORY SECTION */}
			<Box className="my-res-history">
				<Typography className="my-res-history-title">이용완료 및 예약취소</Typography>

				{history.length === 0 ? (
					<Box className="my-res-history-empty">해당되는 예약 내역이 없습니다.</Box>
				) : (
					<Paper className="my-res-history-card" elevation={0}>
						{history.map((r, idx) => (
							<React.Fragment key={r.id}>
								{idx > 0 && <Divider />}
								<Stack className="my-res-history-box">
									<Box className="my-res-history-item-img" src="/img/서울.jfif" component={'img'}></Box>
									<Box className="my-res-history-item">
										<Box className="my-res-history-item-info">
											<Typography className="my-res-history-item-title">{r.title}</Typography>
											<Typography className="my-res-history-item-meta">{r.dateRange}</Typography>
											<Typography className="my-res-history-item-meta">
												{r.location} · {r.guestCount}명
											</Typography>
										</Box>
										<Box className="my-res-history-item-btns">
											<Typography
												className={
													'my-res-history-status ' +
													(r.status === 'completed'
														? 'my-res-history-status--completed'
														: 'my-res-history-status--canceled')
												}
											>
												{r.status === 'completed' ? '이용완료' : '예약취소'}
											</Typography>
											{r.status === 'completed' ? (
												<Box>
													<Button className="add-review-btn" onClick={() => setOpenReview(true)} variant="outlined">
														리뷰 작성
													</Button>
													<ReviewPage isOpen={openReview} setIsOpen={setOpenReview} />
												</Box>
											) : (
												''
											)}
										</Box>
									</Box>
								</Stack>
							</React.Fragment>
						))}
					</Paper>
				)}
			</Box>
		</>
	);
};

export default ReservationHistory;
