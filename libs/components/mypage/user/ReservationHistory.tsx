import { Box, Button, Divider, Pagination, Paper, Stack, Tab, Tabs, Typography } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ReviewPage from './ReviewPage';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_MY_RESERVATIONS } from '../../../../apollo/user/query';
import { userVar } from '../../../../apollo/store';
import { Reservation } from '../../../types/reservation/reservation';
import { ReservationStatus } from '../../../enums/reservation';

type TripStatus = 'upcoming' | 'completed' | 'canceled';
type TripType = 'domestic' | 'overseas' | 'package';
type TabValue = 'domestic' | 'overseas' | 'package';

interface ReservationHistoryProps {
	currentPage: number;
	setTotal: (v: number) => void;
}

const ReservationHistory = (props: ReservationHistoryProps) => {
	const { currentPage, setTotal } = props;
	const [tab, setTab] = useState<TabValue>('domestic');
	const [openReview, setOpenReview] = useState<boolean>(false);
	const user = useReactiveVar(userVar);

	/** APOLLO REQUEST **/
	const {
		loading: getMyReservationsLoading,
		data: getMyReservationsData,
		error: getMyReservationsError,
		refetch: getMyReservationsRefetch,
	} = useQuery(GET_MY_RESERVATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: currentPage,
				limit: 10,
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !user._id,
	});

	useEffect(() => {
		if (getMyReservationsData) {
			setTotal(getMyReservationsData?.getMyReservations?.metaCounter?.[0]?.total);
		}
	}, [getMyReservationsData]);

	const myReservations = getMyReservationsData?.getMyReservations?.list ?? [];
	const upcoming = myReservations?.filter((r: Reservation) => r.reservationStatus === ReservationStatus.UPCOMING);
	const history = myReservations?.filter(
		(r: Reservation) =>
			r.reservationStatus === ReservationStatus.COMPLETED || r.reservationStatus === ReservationStatus.CANCELLED,
	);
	/** HANDLER **/
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
								<Link href={'/'}>
									<Button variant="contained" className="my-res-empty-button">
										여행지 찾아보기
									</Button>
								</Link>
							</Box>
							<Box className="my-res-empty-illust" />
						</Box>
					) : (
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
							{upcoming.map((reservation: Reservation, idx: number) => (
								<Stack key={idx} className="my-res-item-box">
									<Box
										className="my-res-item-img"
										src={`${process.env.REACT_APP_API_URL}/${reservation?.propertyData?.[0].propertyImages[0]}`}
										component={'img'}
									></Box>
									<Box key={reservation._id} className="my-res-item">
										<Box className="my-res-item-info">
											<Typography className="my-res-item-title">
												{reservation.propertyData?.[0].propertyName}
											</Typography>
											<Typography className="my-res-item-meta">
												{reservation.createdAt?.toString().split('T')[0]}
											</Typography>
											<Typography className="my-res-item-meta">
												{reservation?.propertyData?.[0].propertyAddress} · {2}명
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
						{history.map((reservation: Reservation, idx: number) => (
							<React.Fragment key={reservation._id}>
								{idx > 0 && <Divider />}
								<Stack className="my-res-history-box">
									<Box
										className="my-res-history-item-img"
										src={`${process.env.REACT_APP_API_URL}/${reservation?.propertyData?.[0].propertyImages[0]}`}
										component={'img'}
									></Box>
									<Box className="my-res-history-item">
										<Box className="my-res-history-item-info">
											<Typography className="my-res-history-item-title">
												{reservation.propertyData?.[0].propertyName}
											</Typography>
											<Typography className="my-res-history-item-meta">
												{reservation.createdAt?.toString().split('T')[0]}
											</Typography>
											<Typography className="my-res-history-item-meta">
												{reservation?.propertyData?.[0].propertyAddress} · {2}명
											</Typography>
										</Box>
										<Box className="my-res-history-item-btns">
											<Typography
												className={
													'my-res-history-status ' +
													(reservation.reservationStatus === ReservationStatus.COMPLETED
														? 'my-res-history-status--completed'
														: 'my-res-history-status--canceled')
												}
											>
												{reservation.reservationStatus === ReservationStatus.COMPLETED ? '이용완료' : '예약취소'}
											</Typography>
											{reservation.reservationStatus === ReservationStatus.COMPLETED ? (
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
