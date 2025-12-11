import { NextPage } from 'next';
import { useState } from 'react';
import { ReservationsInquiry } from '../../../types/reservation/reservation.input';
import { ReservationStatus } from '../../../enums/reservation';
import { text } from 'stream/consumers';
import { Direction } from '../../../enums/common.enum';

interface Reservation {
	id: string;
	guest: string;
	email: string;
	phone?: string;
	room: string;
	roomType: string;
	checkIn: string;
	checkOut: string;
	nights: number;
	guests: number;
	amount: number;
	status: ReservationStatus;
	bookingDate: string;
	channel: string;
}

interface ReservationsPageProps {
	initialInput: ReservationsInquiry;
}

const ReservationsPage = (props: ReservationsPageProps) => {
	const { initialInput } = props;
	const [filterStatus, setFilterStatus] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
	const [searchFilter, setSearchFilter] = useState<ReservationsInquiry>(initialInput);
	const allReservations: Reservation[] = [
		{
			id: 'RSV-001',
			guest: 'John Doe',
			email: 'john.doe@email.com',
			phone: '+1 234-567-8900',
			room: 'R102',
			roomType: 'Deluxe Double Room',
			checkIn: '2024-11-25',
			checkOut: '2024-11-28',
			nights: 3,
			guests: 2,
			amount: 540,
			status: ReservationStatus.CONFIRMED,
			bookingDate: '2024-11-20',
			channel: '직접 예약',
		},
		{
			id: 'RSV-002',
			guest: 'Maria Kim',
			email: 'maria.kim@email.com',
			phone: '+82 10-1234-5678',
			room: 'R202',
			roomType: 'Oceanview Suite',
			checkIn: '2024-11-25',
			checkOut: '2024-11-29',
			nights: 4,
			guests: 3,
			amount: 1280,
			status: ReservationStatus.CONFIRMED,
			bookingDate: '2024-11-18',
			channel: 'Booking.com',
		},
		{
			id: 'RSV-003',
			guest: 'Daniel Choi',
			email: 'daniel.choi@email.com',
			phone: '+82 10-9876-5432',
			room: 'R302',
			roomType: 'Standard Twin',
			checkIn: '2024-11-26',
			checkOut: '2024-11-27',
			nights: 1,
			guests: 2,
			amount: 150,
			status: ReservationStatus.CHECKED_IN,
			bookingDate: '2024-11-22',
			channel: 'Airbnb',
		},
		{
			id: 'RSV-004',
			guest: 'Sarah Park',
			email: 'sarah.park@email.com',
			phone: '+82 10-5555-6666',
			room: 'R401',
			roomType: 'Premium King',
			checkIn: '2024-11-24',
			checkOut: '2024-11-27',
			nights: 3,
			guests: 2,
			amount: 840,
			status: ReservationStatus.CHECKED_IN,
			bookingDate: '2024-11-15',
			channel: '직접 예약',
		},
		{
			id: 'RSV-005',
			guest: 'Alice Johnson',
			email: 'alice.j@email.com',
			phone: '+1 555-123-4567',
			room: 'R101',
			roomType: 'Deluxe Double Room',
			checkIn: '2024-11-28',
			checkOut: '2024-11-30',
			nights: 2,
			guests: 2,
			amount: 360,
			status: ReservationStatus.PENDING,
			bookingDate: '2024-11-25',
			channel: 'Expedia',
		},
		{
			id: 'RSV-006',
			guest: 'Bob Smith',
			email: 'bob.smith@email.com',
			phone: '+1 444-888-9999',
			room: 'R201',
			roomType: 'Oceanview Suite',
			checkIn: '2024-11-27',
			checkOut: '2024-11-30',
			nights: 3,
			guests: 3,
			amount: 960,
			status: ReservationStatus.CONFIRMED,
			bookingDate: '2024-11-21',
			channel: '직접 예약',
		},
	];

	/************
	 * LIFESICLE *
	 ************/

	/************
	 * HANDLERS *
	 ************/
	const getStatusInfo = (status: string) => {
		const statusMap: { [key: string]: { label: string; class: string } } = {
			CONFIRMED: { label: '예약 확정', class: 'status-confirmed' },
			CHECKED_IN: { label: '체크인 완료', class: 'status-checked-in' },
			PENDING: { label: '확인 대기중', class: 'status-pending' },
			completed: { label: '완료', class: 'status-completed' },
			CANCELLED: { label: '취소됨', class: 'status-cancelled' },
		};
		return statusMap[status] || { label: '알 수 없음', class: 'status-confirmed' };
	};

	const filteredReservations = allReservations.filter((reservation) => {
		const matchesStatus = filterStatus === 'all' || reservation.status === filterStatus;
		const matchesSearch =
			reservation.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
			reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			reservation.room.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const statusCounts = {
		all: allReservations.length,
		confirmed: allReservations.filter((r) => r.status === 'CONFIRMED').length,
		CHECKED_IN: allReservations.filter((r) => r.status === 'CHECKED_IN').length,
		pending: allReservations.filter((r) => r.status === 'PENDING').length,
	};

	const totalRevenue = allReservations.filter((r) => r.status !== 'CANCELLED').reduce((sum, r) => sum + r.amount, 0);

	return (
		<div className="reservation-page-contanier">
			<div className="header-actions">
				<h1 className="page-title">예약 현황</h1>
			</div>

			<div className="stats-grid stats-grid-3">
				<div className="stat-card">
					<p className="stat-label">총 예약수</p>
					<p className="stat-value">{allReservations.length}</p>
				</div>
				<div className="stat-card">
					<p className="stat-label">총 수익</p>
					<p className="stat-value">${totalRevenue.toLocaleString()}</p>
				</div>
				<div className="stat-card">
					<p className="stat-label">보류 중인 체크인</p>
					<p className="stat-value">{statusCounts.confirmed}</p>
				</div>
			</div>

			<div className="stat-card">
				<div className="search-filter-row">
					<div className="search-wrapper">
						<span className="search-icon">🔍</span>
						<input
							type="text"
							placeholder="Search by guest name, reservation ID, or room..."
							className="search-input-with-icon"
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setSearchFilter((prev) => ({
									...prev,
									search: {
										...prev.search,
										text: e.target.value,
									},
								}));
							}}
						/>
						{searchFilter?.search?.text && (
							<button
								className="clear-btn"
								onClick={() => {
									setSearchTerm('');
									setSearchFilter((prev) => ({
										...prev,
										search: {
											...prev.search,
											text: '',
										},
									}));
								}}
							>
								×
							</button>
						)}
					</div>
					<select
						className="filter-select"
						value={filterStatus}
						onChange={(e) => {
							setSearchFilter((prev) => ({
								...prev,
								sort: e.target.value,
							}));
							setFilterStatus(e.target.value);
						}}
					>
						<option value="all">전체 ({statusCounts.all})</option>
						<option value="CONFIRMED">확인됨 ({statusCounts.confirmed})</option>
						<option value="CHECKED_IN">체크인 ({statusCounts.CHECKED_IN})</option>
						<option value="PENDING">보류 중 ({statusCounts.pending})</option>
					</select>
				</div>

				{filteredReservations.length > 0 ? (
					filteredReservations.map((r) => {
						const statusInfo = getStatusInfo(r.status);
						return (
							<div key={r.id} className="reservation-item" onClick={() => setSelectedReservation(r)}>
								<div className="reservation-item-header">
									<span className="reservation-id">{r.id}</span>
									<span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>
								</div>
								<div className="reservation-item-body">
									<div className="reservation-avatar">{r.guest.charAt(0)}</div>
									<div className="reservation-item-info">
										<div className="reservation-guest-name">{r.guest}</div>
										<div className="reservation-room-info">
											{r.room} • {r.roomType}
										</div>
										<div className="reservation-dates">
											<span>📅</span>
											<span>{r.checkIn}</span>
											<span className="date-separator">→</span>
											<span>{r.checkOut}</span>
											<span>({r.nights} 박)</span>
										</div>
									</div>
									<div className="reservation-item-actions">
										<div className="reservation-amount">${r.amount.toLocaleString()}</div>
										<div className="reservation-room-info">{r.guests} 명</div>
									</div>
								</div>
							</div>
						);
					})
				) : (
					<div className="empty-state">
						<div className="empty-state-icon">🔍</div>
						<div className="empty-state-title">예약이 없습니다</div>
						<div className="empty-state-text">검색 또는 필터 기준을 조정해 보세요.</div>
					</div>
				)}
			</div>

			{selectedReservation && (
				<div className="modal-overlay" onClick={() => setSelectedReservation(null)}>
					<div className="modal-content" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<div>
								<h3>예약 세부 정보</h3>
								<p className="reservation-id">{selectedReservation.id}</p>
							</div>
							<button className="close-btn" onClick={() => setSelectedReservation(null)}>
								✕
							</button>
						</div>

						<div className="modal-info-section">
							<div className="modal-info-title">고객 정보</div>
							<div className="modal-info-row">
								<span className="modal-info-label">이름</span>
								<span className="modal-info-value">{selectedReservation.guest}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">이메일</span>
								<span className="modal-info-value">{selectedReservation.email}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">전화번호</span>
								<span className="modal-info-value">{selectedReservation.phone}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">손님 수</span>
								<span className="modal-info-value">{selectedReservation.guests} 명</span>
							</div>
						</div>

						<div className="modal-info-section">
							<div className="modal-info-title">숙박 세부 정보</div>
							<div className="modal-info-row">
								<span className="modal-info-label">방</span>
								<span className="modal-info-value">
									{selectedReservation.room} - {selectedReservation.roomType}
								</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">체크인</span>
								<span className="modal-info-value">{selectedReservation.checkIn}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">체크아웃</span>
								<span className="modal-info-value">{selectedReservation.checkOut}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">지속</span>
								<span className="modal-info-value">{selectedReservation.nights} 박</span>
							</div>
						</div>

						<div className="modal-info-section">
							<div className="modal-info-title">예약 정보</div>
							<div className="modal-info-row">
								<span className="modal-info-label">예약 날짜</span>
								<span className="modal-info-value">{selectedReservation.bookingDate}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">예약 채널</span>
								<span className="modal-info-value">{selectedReservation.channel}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">상태</span>
								<span className={`status-badge ${getStatusInfo(selectedReservation.status).class}`}>
									{getStatusInfo(selectedReservation.status).label}
								</span>
							</div>
						</div>

						<div className="modal-total">
							<div className="modal-total-row">
								<span className="modal-total-label">총액</span>
								<span className="modal-total-value">${selectedReservation.amount.toLocaleString()}</span>
							</div>
						</div>

						<div className="modal-actions">
							<button className="btn btn-secondary">예약 편집</button>
							<button className="btn btn-danger">예약 취소</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

ReservationsPage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			propertyId: '',
			text: '',
		},
	},
};

export default ReservationsPage;
