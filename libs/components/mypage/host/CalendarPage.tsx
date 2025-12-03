// src/components/HostLayout/CalendarPage.tsx
import React, { useCallback, useMemo, useState } from 'react';
import { Box, Card, Typography, Button, FormControl, Select, MenuItem } from '@mui/material';

type RoomOption = {
	value: string;
	label: string;
};

const roomOptions: RoomOption[] = [
	{ value: 'all', label: '전체 객실' },
	{ value: 'r101', label: 'R101 - Deluxe Double Room' },
	{ value: 'r102', label: 'R102 - Deluxe Double Room' },
	{ value: 'r201', label: 'R201 - Oceanview Suite' },
	{ value: 'r202', label: 'R202 - Oceanview Suite' },
	{ value: 'r301', label: 'R301 - Standard Twin' },
	{ value: 'r302', label: 'R302 - Standard Twin' },
	{ value: 'r401', label: 'R401 - Premium King' },
	{ value: 'r402', label: 'R402 - Premium King' },
];

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

type CalendarCell = Date | null;

type RoomReservation = {
	id: string;
	checkIn: string;
	checkOut: string;
};

const roomReservations: RoomReservation[] = [
	{ id: '0', checkIn: '2025-11-01', checkOut: '2025-11-02' },
	{ id: '1', checkIn: '2025-11-03', checkOut: '2025-11-04' },
	{ id: '2', checkIn: '2025-11-04', checkOut: '2025-11-06' },
	{ id: '3', checkIn: '2025-11-10', checkOut: '2025-11-16' },
	{ id: '4', checkIn: '2025-11-18', checkOut: '2025-11-26' },

	{ id: '5', checkIn: '2025-12-01', checkOut: '2025-12-02' },
	{ id: '6', checkIn: '2025-12-03', checkOut: '2025-12-04' },
	{ id: '7', checkIn: '2025-12-04', checkOut: '2025-12-06' },
	{ id: '8', checkIn: '2025-12-10', checkOut: '2025-12-16' },
	{ id: '9', checkIn: '2025-12-18', checkOut: '2025-12-26' },
];

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

export default function CalendarPage() {
	const today = useMemo(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // 00:00
	}, []);
	const [currentMonth, setCurrentMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth());
	});
	const [selectedRoom, setSelectedRoom] = useState<string>('all');
	const cells = useMemo(() => buildCalendar(currentMonth), [currentMonth]);
	const formattedMonthLabel = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

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

	function getReservationForDay(day: Date, reservations: RoomReservation[]) {
		const t = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();

		return reservations.find((r) => {
			const start = toMidnight(r.checkIn).getTime();
			const end = toMidnight(r.checkOut).getTime(); // [start, end)
			return t >= start && t < end;
		});
	}

	// 예약별 색을 HSL로 자동 생성 (예: id 기반)
	function getReservationColorStyles(reservation: RoomReservation | undefined) {
		if (!reservation) return {};

		// id 숫자 추출해서 대충 해시처럼 사용 (예시는 아주 단순하게)
		const num = parseInt(reservation.id.replace(/\D/g, ''), 10) || 1;
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
					<Select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value as string)}>
						{roomOptions.map((room) => (
							<MenuItem key={room.value} value={room.value}>
								{room.label}
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
				<Box className="calendar-page__grid">
					{cells.map((cell, idx) => {
						const isPastDay = cell !== null && isPastDate(cell, currentMonth);
						let reservationStyle;
						let isReserved;
						if (cell) {
							const reservation = getReservationForDay(cell!, roomReservations);
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
			</Card>
		</Box>
	);
}
