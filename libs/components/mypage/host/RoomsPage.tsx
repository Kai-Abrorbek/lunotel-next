import React, { useCallback, useMemo, useState } from 'react';
import {
	Box,
	Button,
	Chip,
	Typography,
	Dialog,
	DialogContent,
	IconButton,
	InputBase,
	Stack,
	Pagination,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import AddReservationModal from './ReservationForm';
import AddRoomModal from './AddRoomModal';

type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance';

interface Room {
	id: string;
	code: string;
	name: string;
	type: string;
	floor: number;
	capacity: number;
	size: number;
	price: number;
	status: RoomStatus;
	imageType: 'bed' | 'wave' | 'building';
	amenities: string[];
	guestName?: string;
	checkoutDate?: string; // YYYY-MM-DD
}

interface RoomReservation {
	roomId: string;
	checkIn: string; // YYYY-MM-DD
	checkOut: string; // YYYY-MM-DD (checkout 당일은 제외)
}

const ROOMS: Room[] = [
	{
		id: '1',
		code: 'R101',
		name: 'Deluxe Double Room',
		type: 'Deluxe Double Room',
		floor: 1,
		capacity: 2,
		size: 32,
		price: 180,
		status: 'available',
		imageType: 'bed',
		amenities: ['WiFi', 'TV', 'Mini Bar', 'Bathtub'],
	},
	{
		id: '2',
		code: 'R102',
		name: 'Deluxe Double Room',
		type: 'Deluxe Double Room',
		floor: 1,
		capacity: 2,
		size: 32,
		price: 180,
		status: 'occupied',
		imageType: 'bed',
		amenities: ['WiFi', 'TV', 'Mini Bar', 'Bathtub'],
		guestName: 'John Doe',
		checkoutDate: '2024-11-28',
	},
	{
		id: '3',
		code: 'R201',
		name: 'Oceanview Suite',
		type: 'Oceanview Suite',
		floor: 2,
		capacity: 3,
		size: 48,
		price: 320,
		status: 'available',
		imageType: 'wave',
		amenities: ['WiFi', 'TV', 'Mini Bar', 'Ocean View', 'Balcony'],
	},
	{
		id: '4',
		code: 'R202',
		name: 'Oceanview Suite',
		type: 'Oceanview Suite',
		floor: 2,
		capacity: 3,
		size: 48,
		price: 320,
		status: 'occupied',
		imageType: 'wave',
		amenities: ['WiFi', 'TV', 'Mini Bar', 'Ocean View', 'Balcony'],
		guestName: 'Maria Kim',
		checkoutDate: '2024-11-29',
	},
	{
		id: '5',
		code: 'R301',
		name: 'Standard Twin',
		type: 'Standard Twin',
		floor: 3,
		capacity: 2,
		size: 28,
		price: 150,
		status: 'maintenance',
		imageType: 'building',
		amenities: ['WiFi', 'TV', 'Desk'],
	},
	{
		id: '6',
		code: 'R301',
		name: 'Standard Twin',
		type: 'Standard Twin',
		floor: 3,
		capacity: 2,
		size: 28,
		price: 150,
		status: 'available',
		imageType: 'building',
		amenities: ['WiFi', 'TV', 'Desk'],
	},
	{
		id: '7',
		code: 'R301',
		name: 'Standard Twin',
		type: 'Standard Twin',
		floor: 3,
		capacity: 2,
		size: 28,
		price: 150,
		status: 'available',
		imageType: 'building',
		amenities: ['WiFi', 'TV', 'Desk'],
	},
	{
		id: '8',
		code: 'R301',
		name: 'Standard Twin',
		type: 'Standard Twin',
		floor: 3,
		capacity: 2,
		size: 28,
		price: 150,
		status: 'available',
		imageType: 'building',
		amenities: ['WiFi', 'TV', 'Desk'],
	},
];

// 예시 예약 데이터 (실제에선 API 응답으로 교체하면 됨)
const ROOM_RESERVATIONS: RoomReservation[] = [
	{ roomId: '1', checkIn: '2025-11-10', checkOut: '2025-11-13' },
	{ roomId: '1', checkIn: '2025-11-20', checkOut: '2025-11-23' },
	{ roomId: '2', checkIn: '2025-11-05', checkOut: '2025-11-09' },
	{ roomId: '2', checkIn: '2025-11-25', checkOut: '2025-11-29' },
	{ roomId: '3', checkIn: '2025-11-18', checkOut: '2025-11-21' },
	{ roomId: '4', checkIn: '2025-11-27', checkOut: '2025-11-30' },

	{ roomId: '5', checkIn: '2025-12-10', checkOut: '2025-12-13' },
	{ roomId: '6', checkIn: '2025-12-20', checkOut: '2025-12-23' },
	{ roomId: '7', checkIn: '2025-12-05', checkOut: '2025-12-09' },
	{ roomId: '8', checkIn: '2025-12-25', checkOut: '2025-12-29' },
	{ roomId: '9', checkIn: '2025-12-18', checkOut: '2025-12-21' },
	{ roomId: '10', checkIn: '2025-12-27', checkOut: '2025-12-30' },
];

type TabKey = 'all' | RoomStatus;

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const RoomsPage: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabKey>('all');
	const [calendarOpenRoomId, setCalendarOpenRoomId] = useState<string | null>(null);
	const [checkIn, setCheckIn] = useState<Date | null>(null);
	const [checkOut, setCheckOut] = useState<Date | null>(null);
	const [isOpen, setIsOpen] = useState(false);
	const [isOpenAddRoom, setIsOpenAddRoom] = useState(false);
	const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});
	const today = useMemo(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}, []);
	const filteredRooms = useMemo(() => {
		if (activeTab === 'all') return ROOMS;
		return ROOMS.filter((room) => room.status === activeTab);
	}, [activeTab]);

	const counts = useMemo(() => {
		const base = {
			all: ROOMS.length,
			available: 0,
			occupied: 0,
			cleaning: 0,
			maintenance: 0,
		};
		ROOMS.forEach((r) => {
			base[r.status]++;
		});
		return base;
	}, [ROOMS]);

	const selectedRoom = useMemo(() => ROOMS.find((r) => r.id === calendarOpenRoomId) ?? null, [calendarOpenRoomId]);

	/** UTIL */

	const renderStatusChip = (status: RoomStatus) => {
		switch (status) {
			case 'available':
				return <span className="room-card__status room-card__status--available">예약 가능</span>;
			case 'occupied':
				return <span className="room-card__status room-card__status--occupied">투숙중</span>;
			case 'cleaning':
				return <span className="room-card__status room-card__status--cleaning">청소중</span>;
			case 'maintenance':
				return <span className="room-card__status room-card__status--maintenance">정비중</span>;
		}
	};

	const toMidnight = (dateStr: string): Date => {
		const d = new Date(dateStr);
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	};

	const buildCalendarCells = (monthDate: Date): (Date | null)[] => {
		const year = monthDate.getFullYear();
		const month = monthDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const firstDow = firstDay.getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const cells: (Date | null)[] = [];
		for (let i = 0; i < firstDow; i++) cells.push(null);
		for (let d = 1; d <= daysInMonth; d++) {
			cells.push(new Date(year, month, d));
		}
		while (cells.length % 7 !== 0) cells.push(null);
		return cells;
	};

	const isSameDate = (a: Date | null, b: Date | null) => {
		if (!a || !b) return false;
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
	};

	const isReservedDay = (roomId: string, day: Date): boolean => {
		const t = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime();
		const reservations = ROOM_RESERVATIONS.filter((r) => r.roomId === roomId);

		return reservations.some((r) => {
			const start = toMidnight(r.checkIn).getTime();
			const end = toMidnight(r.checkOut).getTime(); // [start, end)
			return t >= start && t < end;
		});
	};

	const formatMonthLabel = (date: Date) => `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월`;

	const isPastDate = useCallback(
		(day: Date, month: Date) => {
			if (!day || !today) return false;
			const cellDate = new Date(month.getFullYear(), month.getMonth(), day.getDate());
			return cellDate < today;
		},
		[calendarMonth],
	);

	/** HANDLERS */

	const handleSelectDay = (day: Date) => {
		if (!checkIn || (checkIn && checkOut)) {
			setCheckIn(day);
			setCheckOut(null);
			return;
		}

		if (day.getTime() < checkIn.getTime()) {
			setCheckIn(day);
			setCheckOut(checkIn);
		} else {
			setCheckOut(day);
		}
	};

	const inRange = (day: Date) => {
		if (!checkIn || !checkOut) return false;
		const t = day.getTime();
		return t > checkIn.getTime() && t < checkOut.getTime();
	};

	const handleOpenCalendar = (room: Room) => {
		setCalendarOpenRoomId(room.id);
		const d = new Date();
		setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
	};

	const handleCloseCalendar = () => {
		setCalendarOpenRoomId(null);
		setCheckIn(null);
		setCheckIn(checkOut);
	};

	const handlePrevMonth = () => {
		setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
	};

	const handleNextMonth = () => {
		setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
	};

	return (
		<Box className="rooms-page">
			<Box className="rooms-page__header">
				<Typography variant="h2" className="rooms-page__title">
					Rooms
				</Typography>
				<AddRoomModal isOpen={isOpenAddRoom} setIsOpen={setIsOpenAddRoom} />
			</Box>

			<Box className="rooms-page__tabs">
				<Box>
					<button
						className={`rooms-tab ${activeTab === 'all' ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab('all')}
					>
						전체 ({counts.all})
					</button>
					<button
						className={`rooms-tab ${activeTab === 'available' ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab('available')}
					>
						예약 가능 ({counts.available})
					</button>
					<button
						className={`rooms-tab ${activeTab === 'occupied' ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab('occupied')}
					>
						투숙중 ({counts.occupied})
					</button>
					<button
						className={`rooms-tab ${activeTab === 'cleaning' ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab('cleaning')}
					>
						청소중 ({counts.cleaning})
					</button>
					<button
						className={`rooms-tab ${activeTab === 'maintenance' ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab('maintenance')}
					>
						정비중 ({counts.maintenance})
					</button>
				</Box>
				<div className="search-box">
					<input type="search" className="search-input" placeholder="검색어를 입력하세요" />
					<button className="search-btn">검색</button>
				</div>
			</Box>

			<Box className="rooms-page__grid">
				{filteredRooms.map((room) => (
					<Box key={room.id} className="room-card">
						<img
							src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800"
							className={`room-card__image room-card__image--`}
						/>

						<Box className="room-card__body">
							<Box className="room-card__header">
								<div>
									<div className="room-card__code">{room.code}</div>
									<div className="room-card__name">{room.name}</div>
								</div>
								{renderStatusChip(room.status)}
							</Box>

							{room.status === 'occupied' && room.guestName && room.checkoutDate && (
								<Box className="room-card__current-stay">
									<div className="room-card__stay-line">
										<span className="room-card__stay-label">투숙객:</span>
										<span className="room-card__stay-value">{room.guestName}</span>
									</div>
									<div className="room-card__stay-line">
										<span className="room-card__stay-label">체크아웃:</span>
										<span className="room-card__stay-value">{room.checkoutDate}</span>
									</div>
								</Box>
							)}

							<Box className="room-card__meta">
								<div className="room-card__meta-row">
									<span>층수</span>
									<span>인원</span>
									<span>면적</span>
								</div>
								<div className="room-card__meta-row room-card__meta-row--bold">
									<span>{room.floor}층</span>
									<span>{room.capacity}명</span>
									<span>{room.size}m²</span>
								</div>
							</Box>

							<Box className="room-card__amenities">
								{room.amenities.map((a) => (
									<Chip key={a} label={a} size="small" className="room-card__amenity-chip" />
								))}
							</Box>

							<Box className="room-card__footer">
								<div className="room-card__price">
									<span className="room-card__price-label">1박 요금</span>
									<span className="room-card__price-value">${room.price}</span>
								</div>
								<div className="room-card__actions">
									{room.status !== 'maintenance' && (
										<Button
											onClick={() => handleOpenCalendar(room)}
											variant="contained"
											size="large"
											className="room-card__reserve-btn"
										>
											예약
										</Button>
									)}
								</div>
							</Box>
						</Box>
					</Box>
				))}
			</Box>
			<Stack className="rooms-page__pagination">
				<Pagination count={Math.ceil(15 / 9 || 1)} color="primary" />
			</Stack>
			{/* 예약 달력 모달 */}
			<Dialog
				open={!!calendarOpenRoomId}
				onClose={handleCloseCalendar}
				maxWidth="md"
				fullWidth
				PaperProps={{ className: 'room-calendar-dialog' }}
			>
				{selectedRoom && (
					<DialogContent className="room-calendar">
						<Box className="room-calendar__header">
							<div>
								<div className="room-calendar__room-code">
									{selectedRoom.code} - {selectedRoom.name}
								</div>
								<div className="room-calendar__room-subtitle">예약 현황 달력</div>
							</div>
							<IconButton size="small" onClick={handleCloseCalendar}>
								<CloseIcon />
							</IconButton>
						</Box>

						<Box className="room-calendar__month-nav">
							<Button variant="outlined" size="small" className="room-calendar__month-btn" onClick={handlePrevMonth}>
								<ArrowBackIosNewIcon fontSize="small" />
								이전
							</Button>
							<span className="room-calendar__month-label">{formatMonthLabel(calendarMonth)}</span>
							<Button variant="outlined" size="small" className="room-calendar__month-btn" onClick={handleNextMonth}>
								다음
								<ArrowForwardIosIcon fontSize="small" />
							</Button>
						</Box>

						<Box className="room-calendar__weekdays">
							{WEEK_DAYS.map((d) => (
								<div key={d} className="room-calendar__weekday">
									{d}
								</div>
							))}
						</Box>

						<Box className="room-calendar__grid">
							{buildCalendarCells(calendarMonth).map((day, idx) => {
								if (!day) {
									return <div key={idx} className="room-calendar__cell room-calendar__cell--empty" />;
								}

								const isToday = isSameDate(day, today);
								const isStart = isSameDate(day, checkIn);
								const isEnd = isSameDate(day, checkOut);
								const isRange = inRange(day);
								const reserved = isReservedDay(selectedRoom.id, day);
								const isPast = isPastDate(day, calendarMonth);
								const cellClasses = [
									'room-calendar__cell',
									reserved ? 'room-calendar__cell--reserved' : '',
									isToday ? 'room-calendar__cell--today' : '',
									isPast ? 'room-calendar__cell--past' : '',
									isStart ? 'room-calendar__cell--start' : '',
									isRange ? 'room-calendar__cell--range' : '',
									isEnd ? 'room-calendar__cell--end' : '',
								]
									.filter(Boolean)
									.join(' ');

								return (
									<button
										key={day.toISOString()}
										className={cellClasses}
										onClick={() => !isPast && handleSelectDay(day)}
									>
										{day.getDate()}
									</button>
								);
							})}
						</Box>

						<Box className="room-calendar__legend">
							<div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
								<span className="room-calendar__legend-title">범례</span>
								<div className="room-calendar__legend-item">
									<span className="room-calendar__legend-dot room-calendar__legend-dot--reserved" />
									<span>예약됨</span>
								</div>
								<div className="room-calendar__legend-item">
									<span className="room-calendar__legend-dot room-calendar__legend-dot--today" />
									<span>오늘</span>
								</div>
								<div className="room-calendar__legend-item">
									<span className="room-calendar__legend-dot room-calendar__legend-dot--available" />
									<span>예약 가능</span>
								</div>
							</div>
							{checkIn && checkOut ? <AddReservationModal isOpen={isOpen} setIsOpen={setIsOpen} /> : ''}
						</Box>
					</DialogContent>
				)}
			</Dialog>
		</Box>
	);
};

export default RoomsPage;
