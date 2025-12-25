import React, { useCallback, useMemo, useState } from 'react';
import { Box, Button, Chip, Typography, Dialog, DialogContent, IconButton, Stack, Pagination } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import RoomUpdateModal from './RoomUpdateModal';
import { RoomStatus } from '../../../enums/propertyRoomtype.enum';
import RoomAddModal from './RoomAddModal';
import { sweetMixinErrorAlert } from '../../../sweetAlert';
import { ReservationInput } from '../../../types/reservation/reservation.input';
import { useRouter } from 'next/router';
import { GET_MYROOMS } from '../../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { RoomType } from '../../../types/roomtype/roomtype';
import { Reservation } from '../../../types/reservation/reservation';

const dateTypeToString = (date: Date): string => {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
		2,
		'0',
	)}`;
};

type TabKey = 'all' | RoomStatus;

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const RoomsPage: React.FC = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<TabKey>('all');
	const [calendarOpenRoomId, setCalendarOpenRoomId] = useState<string | null>(null);
	const [checkIn, setCheckIn] = useState<Date | null>(null);
	const [checkOut, setCheckOut] = useState<Date | null>(null);
	const [isOpenAddRoom, setIsOpenAddRoom] = useState<boolean>(false);
	const [isOpenUpdateRoom, setIsOpenUpdateRoom] = useState<boolean>(false);
	const [selectRoom, setSelectRoom] = useState<RoomType | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [calendarMonth, setCalendarMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});
	const today = useMemo(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate());
	}, []);

	const todayStr = useMemo(() => {
		const d = new Date();
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}, []);

	/** APOLLO REQUEST **/
	const {
		loading: getMyProperttRoomsLoading,
		data: getMyProperttRoomsData,
		error: getMyProperttRoomsError,
		refetch: getMyProperttRoomsRefetch,
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

	const roomList = getMyProperttRoomsData?.getMyRooms.list;

	const filteredRooms = roomList?.filter((room: RoomType) => {
		const matchesStatus = activeTab === 'all' || room.roomStatus === activeTab;
		const matchesSearch =
			room.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			room._id.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const counts = useMemo(() => {
		const base = {
			all: roomList?.length,
			AVAILABLE: 0,
			UNAVAILABLE: 0,
			OCCUPIED: 0,
			CLEANING: 0,
			MAINTENANCE: 0,
		};
		roomList?.forEach((r: RoomType) => {
			base[r.roomStatus]++;
		});
		return base;
	}, [roomList]);

	const selectedRoom: RoomType = useMemo(
		() => roomList?.find((r: RoomType) => r._id === calendarOpenRoomId) ?? null,
		[calendarOpenRoomId],
	);

	/** UTIL */
	const renderStatusChip = (status: RoomStatus) => {
		switch (status) {
			case 'AVAILABLE':
				return <span className="room-card__status room-card__status--available">예약 가능</span>;
			case 'UNAVAILABLE':
				return <span className="room-card__status room-card__status--unavailable">예약 불가</span>;
			case 'OCCUPIED':
				return <span className="room-card__status room-card__status--occupied">투숙중</span>;
			case 'CLEANING':
				return <span className="room-card__status room-card__status--cleaning">청소중</span>;
			case 'MAINTENANCE':
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
		const reservations = selectedRoom?.reservationData?.filter((r: Reservation) => r.roomTypeId === roomId);
		return reservations!.some((r) => {
			const start = toMidnight(r.reservationCheckIn!).getTime();
			const end = toMidnight(r.reservationCheckOut!).getTime(); // [start, end)
			return t >= start && t < end;
		});
	};

	const hasReservedBetween = (roomId: string, start: Date, end: Date) => {
		const [s, e] = start < end ? [start, end] : [end, start];

		let d = new Date(s);
		while (d <= e) {
			if (isReservedDay(roomId, d)) return true;
			d.setDate(d.getDate() + 1);
		}
		return false;
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
	const handleSelectDay = async (day: Date) => {
		if (isReservedDay(selectedRoom?._id!, day)) return;

		if (!checkIn || (checkIn && checkOut)) {
			setCheckIn(day);
			setCheckOut(null);
			return;
		}

		if (hasReservedBetween(selectedRoom?._id!, checkIn, day)) {
			await sweetMixinErrorAlert('해당 기간에 이미 예약이 있습니다');
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

	const handleOpenCalendar = (room: RoomType) => {
		setCalendarOpenRoomId(room._id);
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

	const handlePushReservationPage = (room: RoomType) => {
		// 나중에 room 자체를 가겨와서 data 거내기
		const reservationInput: ReservationInput = {
			propertyId: router.query.propertyId as string,
			roomTypeId: room._id,
			stayPlanId: room?.stayPlans?.[1]._id!,
			reservationCheckIn: dateTypeToString(checkIn!),
			reservationCheckOut: dateTypeToString(checkOut!),
			reservationCheckInAt: '15:00',
			reservationCheckOutAt: '11:00',
			stayPlan: room?.stayPlans?.[1].stayPlanType!,
		};

		router.push(
			`/reservation/checkout?input=${JSON.stringify({
				...reservationInput,
			})}`,
		);
	};

	return (
		<Box className="rooms-page">
			<Box className="rooms-page__header">
				<Typography variant="h2" className="rooms-page__title">
					객실
				</Typography>
				<Button
					onClick={() => setIsOpenAddRoom(true)}
					variant="contained"
					size="large"
					className="rooms-page__add-button"
				>
					+ 객실 추가
				</Button>
				<RoomAddModal
					isOpen={isOpenAddRoom}
					setIsOpen={setIsOpenAddRoom}
					getMyProperttRoomsRefetch={getMyProperttRoomsRefetch}
				/>
				{selectRoom?._id && (
					<RoomUpdateModal
						isOpen={isOpenUpdateRoom}
						setIsOpen={setIsOpenUpdateRoom}
						selectRoom={selectRoom!}
						getMyProperttRoomsRefetch={getMyProperttRoomsRefetch}
					/>
				)}
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
						className={`rooms-tab ${activeTab === RoomStatus.AVAILABLE ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab(RoomStatus.AVAILABLE)}
					>
						예약 가능 ({counts.AVAILABLE})
					</button>
					<button
						className={`rooms-tab ${activeTab === RoomStatus.UNAVAILABLE ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab(RoomStatus.UNAVAILABLE)}
					>
						예약 불가 ({counts.UNAVAILABLE})
					</button>
					<button
						className={`rooms-tab ${activeTab === RoomStatus.OCCUPIED ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab(RoomStatus.OCCUPIED)}
					>
						투숙중 ({counts.OCCUPIED})
					</button>
					<button
						className={`rooms-tab ${activeTab === RoomStatus.CLEANING ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab(RoomStatus.CLEANING)}
					>
						청소중 ({counts.CLEANING})
					</button>
					<button
						className={`rooms-tab ${activeTab === RoomStatus.MAINTENANCE ? 'rooms-tab--active' : ''}`}
						onClick={() => setActiveTab(RoomStatus.MAINTENANCE)}
					>
						정비중 ({counts.MAINTENANCE})
					</button>
				</Box>
				<div className="search-box">
					<input
						type="search"
						className="search-input"
						placeholder="검색어를 입력하세요"
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					/>
					<button
						className="search-btn"
						onClick={() => {
							setSearchTerm('');
						}}
					>
						검색
					</button>
				</div>
			</Box>

			{roomList?.length !== 0 && (
				<Box className="rooms-page__grid">
					{filteredRooms?.map((room: RoomType) => {
						const reservationData = room?.reservationData?.filter((r) => r.reservationCheckIn === todayStr)[0];
						return (
							<Box key={room._id} className="room-card">
								<img
									src={`${process.env.REACT_APP_API_URL}/${room.roomImages[0]}`}
									className={`room-card__image room-card__image--`}
								/>

								<Box className="room-card__body">
									<Box className="room-card__header">
										<div>
											<div className="room-card__code">R: {room._id.slice(0, 5)}</div>
											<div className="room-card__name">{room.roomName}</div>
										</div>
										{renderStatusChip(room.roomStatus)}
									</Box>

									{room.roomStatus === RoomStatus.OCCUPIED &&
										reservationData?.memberInfo?.guestName &&
										reservationData?.reservationCheckOut && (
											<Box className="room-card__current-stay">
												<div className="room-card__stay-line">
													<span className="room-card__stay-label">투숙객:</span>
													<span className="room-card__stay-value">{reservationData?.memberInfo.guestName}</span>
												</div>
												<div className="room-card__stay-line">
													<span className="room-card__stay-label">체크아웃:</span>
													<span className="room-card__stay-value">{reservationData?.reservationCheckOut}</span>
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
											<span>{1}층</span>
											<span>{room.roomMaxPersonal}명</span>
											<span>{28}m²</span>
										</div>
									</Box>

									<Box className="room-card__amenities">
										{room?.roomAmenities?.map((a) => (
											<Chip key={a} label={a} size="small" className="room-card__amenity-chip" />
										))}
									</Box>

									<Box className="room-card__footer">
										<div className="room-card__price">
											<span className="room-card__price-label">1박 요금</span>
											<span className="room-card__price-value">${room.basePriceOvernight.toLocaleString()}</span>
										</div>
										<div className="room-card__actions">
											<Button
												onClick={() => {
													setIsOpenUpdateRoom(true);
													setSelectRoom(room);
												}}
												variant="contained"
												size="large"
												className="room-card__reserve-btn"
											>
												수정
											</Button>
											{room.roomStatus === RoomStatus.AVAILABLE && (
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
						);
					})}
				</Box>
			)}
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
									{selectedRoom._id.slice(0, 5)} - {selectedRoom.roomName}
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
								const reserved = isReservedDay(selectedRoom._id, day);
								const isRange = inRange(day);
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
										onClick={() => !isPast && !reserved && handleSelectDay(day)}
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
							<div>
								{checkIn && checkOut ? (
									<button
										className="room-calendar__reservation-btn"
										onClick={() => handlePushReservationPage(selectedRoom)}
									>
										{' '}
										➕ 예약
									</button>
								) : (
									''
								)}
							</div>
						</Box>
					</DialogContent>
				)}
			</Dialog>
		</Box>
	);
};

export default RoomsPage;
