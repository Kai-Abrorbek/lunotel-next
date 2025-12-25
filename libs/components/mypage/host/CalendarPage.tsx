// src/components/HostLayout/CalendarPage.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Card, Typography, Button, FormControl, Select, MenuItem } from '@mui/material';
import { useRouter } from 'next/router';
import { RoomType } from '../../../types/roomtype/roomtype';
import { Reservation } from '../../../types/reservation/reservation';
import { GET_MYROOMS, GET_ROOM } from '../../../../apollo/user/query';
import { useQuery } from '@apollo/client';

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

type CalendarCell = Date | null;

function buildCalendar(monthDate: Date): CalendarCell[] {
	const year = monthDate.getFullYear();
	const month = monthDate.getMonth();
	const firstDay = new Date(year, month, 1);
	const firstWeekday = firstDay.getDay(); // 0=일요일
	const daysInMonth = new Date(year, month + 1, 0).getDate(); // 월에 몇일이 있는지
	const cells: CalendarCell[] = [];

	for (let i = 0; i < firstWeekday; i++) {
		cells.push(null);
	}
	for (let d = 1; d <= daysInMonth; d++) {
		cells.push(new Date(year, month, d));
	}
	while (cells.length < 42) {
		cells.push(null);
	}

	return cells;
}

const CalendarPage = () => {
	const router = useRouter();
	const today = useMemo(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // 00:00
	}, []);
	const [currentMonth, setCurrentMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth());
	});
	const [selectedRoom, setSelectedRoom] = useState<string>('방을 선택해주세요!');
	const [roomId, setRoomId] = useState<string>('');
	const cells = useMemo(() => buildCalendar(currentMonth), [currentMonth]);
	const formattedMonthLabel = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

	/** APOLLO REQUEST **/
	const {
		loading: getMyRoomsLoading,
		data: getMyRoomsData,
		error: getMyRoomsError,
		refetch: getMyRoomsRefetch,
	} = useQuery(GET_MYROOMS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 20,
				sort: 'createdAt',
				direction: 'DESC',
				search: {
					propertyId: router.query.propertyId,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !router.query.propertyId,
	});

	useEffect(() => {
		const firstRoomId = getMyRoomsData?.getMyRooms?.list?.[0];
		if (!firstRoomId) return;

		setRoomId((prev) => (prev ? prev : firstRoomId._id));
	}, [getMyRoomsData]);

	/** APOLLO REQUEST **/
	const {
		loading: getRoomLoading,
		data: getRoomData,
		error: getRoomError,
		refetch: getRoomRefetch,
	} = useQuery(GET_ROOM, {
		fetchPolicy: 'cache-and-network',
		variables: { roomId: roomId },
		notifyOnNetworkStatusChange: true,
		skip: !roomId,
	});

	const roomList = getMyRoomsData?.getMyRooms?.list;
	const room: RoomType = getRoomData?.getRoom;
	/*****************
	 **  	LIFESICLE   **
	 *****************/
	useEffect(() => {}, []);
	/*****************
	 **  	HANDLER   **
	 *****************/
	const handlePrevMonth = () => {
		setCurrentMonth((prev) => {
			const year = prev.getFullYear();
			const month = prev.getMonth() - 1;
			return new Date(year, month, 1);
		});
	};

	const handleNextMonth = () => {
		setCurrentMonth((prev) => {
			const year = prev.getFullYear();
			const month = prev.getMonth() + 1;
			return new Date(year, month, 1);
		});
	};

	const isPastDate = useCallback(
		(cell: Date, month: Date) => {
			if (!cell || !today) return false;
			const cellDate = new Date(month.getFullYear(), month.getMonth(), cell.getDate());
			return cellDate < today;
		},
		[currentMonth],
	);

	function toMidnight(dateStr: string): Date {
		const d = new Date(dateStr);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}

	function getReservationForDay(day: Date, reservations: Reservation[]) {
		const t = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();

		return reservations?.find((r) => {
			const start = toMidnight(r?.reservationCheckIn!).getTime();
			const end = toMidnight(r?.reservationCheckOut!).getTime(); // [start, end)
			return t >= start && t < end;
		});
	}

	function getReservationColorStyles(reservation: Reservation | undefined) {
		if (!reservation) return {};

		// id 숫자 추출해서 대충 해시처럼 사용 (예시는 아주 단순하게)
		const num = parseInt(reservation._id.replace(/\D/g, ''), 10) || 1;
		const hue = (num * 157) % 360;

		return {
			'--resv-bg': `hsl(${hue} 95% 92%)`,
			'--resv-border': `hsl(${hue} 80% 70%)`,
			'--resv-text': `hsl(${hue} 50% 35%)`,
		} as React.CSSProperties;
	}

	return (
		<Box className="calendar-page">
			{/* 상단 제목 + 셀렉트 */}
			<Box className="calendar-page__header">
				<Typography className="calendar-page__title">달력</Typography>

				<FormControl size="small" className="calendar-page__room-select">
					<Select
						value={selectedRoom}
						onChange={(e) => {
							setRoomId(e.target.value);
							setSelectedRoom(e.target.value as string);
						}}
					>
						{roomList?.map((room: RoomType) => (
							<MenuItem key={room._id} value={room._id}>
								{room.roomName}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{/* 캘린더 카드 */}
			<Card className="calendar-page__card">
				{/* 카드 헤더: 이전/다음 달 + 년/월 */}
				<Box className="calendar-page__card-header">
					<Button variant="outlined" className="calendar-page__nav-button" onClick={handlePrevMonth}>
						← 이전 달
					</Button>

					<Typography className="calendar-page__month-label">{formattedMonthLabel}</Typography>

					<Button
						variant="outlined"
						className="calendar-page__nav-button calendar-page__nav-button--right"
						onClick={handleNextMonth}
					>
						다음 달 →
					</Button>
				</Box>

				{/* 요일 헤더 */}
				<Box className="calendar-page__weekday-row">
					{weekdays.map((day, index) => (
						<Box
							key={day}
							className={`calendar-page__weekday ${
								index === 0 ? 'calendar-page__weekday--sun' : index === 6 ? 'calendar-page__weekday--sat' : ''
							}`}
						>
							{day}
						</Box>
					))}
				</Box>

				{/* 날짜 그리드 */}
				{selectedRoom && (
					<Box className="calendar-page__grid">
						{cells.map((cell, idx) => {
							const isPastDay = cell !== null && isPastDate(cell, currentMonth);
							let reservationStyle;
							let isReserved;
							if (cell) {
								const reservation = getReservationForDay(cell!, room?.reservationData!);
								isReserved = !!reservation;
								reservationStyle = getReservationColorStyles(reservation!);
							}

							const classes = [
								'calendar-page__cell',
								isReserved ? 'calendar-page__cell--reserved' : '',
								cell === null ? 'calendar-page__cell--empty' : '',
								isPastDay ? 'calendar-page__cell--past' : '',
							]
								.filter(Boolean)
								.join(' ');

							return (
								<Box key={idx} className={classes} style={isReserved ? reservationStyle : undefined}>
									{cell && <span className="calendar-page__cell-day">{cell.getDate()}</span>}
								</Box>
							);
						})}
					</Box>
				)}
			</Card>
		</Box>
	);
};

CalendarPage.defaultProps = {
	roomsInquiry: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			propertyId: '',
		},
	},
	getRoomReservation: {
		propertyId: '',
		roomId: '',
		stayPlanId: '',
	},
};
export default CalendarPage;
