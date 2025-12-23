import { useState } from 'react';
import { ReservationsInquiry } from '../../../types/reservation/reservation.input';
import { ReservationStatus } from '../../../enums/reservation';
import { Direction } from '../../../enums/common.enum';
import { GET_AGENT_RESERVATIONS } from '../../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { Reservation } from '../../../types/reservation/reservation';
import { UPDATE_RESERVATION } from '../../../../apollo/user/mutation';
import { sweetErrorAlert, sweetTopSmallSuccessAlert } from '../../../sweetAlert';

interface ReservationsPageProps {
	initialInput: ReservationsInquiry;
}

const ReservationsPage = (props: ReservationsPageProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const [filterStatus, setFilterStatus] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
	const [searchFilter, setSearchFilter] = useState<ReservationsInquiry>(initialInput);

	const [updateReservation] = useMutation(UPDATE_RESERVATION);
	/** APOLLO REQUEST **/
	const {
		loading: getPropertyReservationsLoading,
		data: getPropertyReservationsData,
		error: getPropertyReservationsError,
		refetch: getPropertyReservationsRefetch,
	} = useQuery(GET_AGENT_RESERVATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 1000,
				search: {
					propertyId: router.query.propertyId,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !router.query.propertyId,
	});

	const allReservations: Reservation[] = getPropertyReservationsData?.getAgentReservations?.list;

	/************
	 * LIFESICLE *
	 ************/

	/************
	 * HANDLERS *
	 ************/
	const handleUpdateReservation = async (updateType: string, reservation: Reservation) => {
		if (updateType === ReservationStatus.PENDING) {
			try {
				await updateReservation({
					variables: {
						input: {
							_id: reservation._id,
							propertyId: reservation.propertyId,
							roomTypeId: reservation.roomTypeId,
							stayPlanId: reservation.stayPlanId,
							reservationStatus: ReservationStatus.UPCOMING,
						},
					},
				});

				await sweetTopSmallSuccessAlert('예약 내역이 변경되었습니다!');
				setSelectedReservation(null);
			} catch (err: any) {
				await sweetErrorAlert(err);
			}
		} else {
			try {
				await updateReservation({
					variables: {
						input: {
							_id: reservation._id,
							propertyId: reservation.propertyId,
							roomTypeId: reservation.roomTypeId,
							stayPlanId: reservation.stayPlanId,
							reservationStatus: ReservationStatus.CANCELLED,
						},
					},
				});
				await sweetTopSmallSuccessAlert('예약 내역이 변경되었습니다!');
				setSelectedReservation(null);
			} catch (err: any) {
				await sweetErrorAlert(err);
			}
		}
	};

	const getStatusInfo = (status: string) => {
		const statusMap: { [key: string]: { label: string; class: string } } = {
			UPCOMING: { label: '예정', class: 'status-upcoming' },
			CONFIRMED: { label: '예약 확정', class: 'status-confirmed' },
			CHECKED_IN: { label: '체크인 완료', class: 'status-checked-in' },
			PENDING: { label: '확인 대기중', class: 'status-pending' },
			COMPLETED: { label: '완료', class: 'status-completed' },
			CANCELLED: { label: '취소됨', class: 'status-cancelled' },
		};
		return statusMap[status] || { label: '알 수 없음', class: 'status-confirmed' };
	};

	const filteredReservations = allReservations?.filter((reservation) => {
		const matchesStatus = filterStatus === 'all' || reservation?.reservationStatus === filterStatus;
		const matchesSearch =
			reservation?.memberInfo?.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			reservation._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
			reservation?.roomData?.[0].roomName.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const statusCounts = {
		all: allReservations?.length,
		UPCOMING: allReservations?.filter((r) => r.reservationStatus === 'UPCOMING').length,
		CONFIRMED: allReservations?.filter((r) => r.reservationStatus === 'CONFIRMED').length,
		CHECKED_IN: allReservations?.filter((r) => r.reservationStatus === 'CHECKED_IN').length,
		COMPLETED: allReservations?.filter((r) => r.reservationStatus === 'COMPLETED').length,
		PENDING: allReservations?.filter((r) => r.reservationStatus === 'PENDING').length,
		CANCELLED: allReservations?.filter((r) => r.reservationStatus === 'CANCELLED').length,
	};

	const totalRevenue = allReservations
		?.filter((r) => r.reservationStatus !== 'CANCELLED')
		?.reduce((sum, r) => sum + r.reservationTotalPrice!, 0);

	return (
		<div className="reservation-page-contanier">
			<div className="header-actions">
				<h1 className="page-title">예약 현황</h1>
			</div>

			<div className="stats-grid stats-grid-3">
				<div className="stat-card">
					<p className="stat-label">총 예약수</p>
					<p className="stat-value">{allReservations?.length}</p>
				</div>
				<div className="stat-card">
					<p className="stat-label">총 수익</p>
					<p className="stat-value">${totalRevenue?.toLocaleString()}</p>
				</div>
				<div className="stat-card">
					<p className="stat-label">보류 중인 체크인</p>
					<p className="stat-value">{statusCounts?.CONFIRMED}</p>
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
						<option value="UPCOMING">예정 ({statusCounts.UPCOMING})</option>
						<option value="CONFIRMED">확인됨 ({statusCounts.CONFIRMED})</option>
						<option value="CHECKED_IN">체크인 ({statusCounts.CHECKED_IN})</option>
						<option value="COMPLETED">완료 ({statusCounts.COMPLETED})</option>
						<option value="PENDING">보류 중 ({statusCounts.PENDING})</option>
						<option value="CANCELLED">취소됨 ({statusCounts.CANCELLED})</option>
					</select>
				</div>

				{filteredReservations?.length > 0 ? (
					filteredReservations?.map((r) => {
						const statusInfo = getStatusInfo(r.reservationStatus!);
						return (
							<div key={r._id} className="reservation-item" onClick={() => setSelectedReservation(r)}>
								<div className="reservation-item-header">
									<span className="reservation-id">R_ID: {r._id.slice(0, 10)}</span>
									<span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>
								</div>
								<div className="reservation-item-body">
									<div className="reservation-avatar">{r?.memberInfo?.guestName.charAt(0)}</div>
									<div className="reservation-item-info">
										<div className="reservation-guest-name">{r?.memberInfo?.guestName}</div>
										<div className="reservation-room-info">
											{r.roomData?.[0].roomName}• {r.reservationPlanType === 'OVERNIGHT' ? '숙박' : '대실'}
										</div>
										<div className="reservation-dates">
											<span>📅</span>
											<span>{r.reservationCheckIn}</span>
											<span className="date-separator">→</span>
											<span>{r.reservationCheckOut}</span>
											<span>({r.priceBreakdown?.length} 박)</span>
										</div>
									</div>
									<div className="reservation-item-actions">
										<div className="reservation-amount">${r.reservationTotalPrice!.toLocaleString()}</div>
										<div className="reservation-room-info">{r.memberInfo?.guestName} 명</div>
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
								<p className="reservation-id">R_ID: {selectedReservation._id.slice(0, 10)}</p>
							</div>
							<button className="close-btn" onClick={() => setSelectedReservation(null)}>
								✕
							</button>
						</div>

						<div className="modal-info-section">
							<div className="modal-info-title">고객 정보</div>
							<div className="modal-info-row">
								<span className="modal-info-label">이름</span>
								<span className="modal-info-value">{selectedReservation?.memberInfo?.guestName}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">이메일</span>
								<span className="modal-info-value">{selectedReservation?.memberInfo?.guestEmail ?? ''}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">전화번호</span>
								<span className="modal-info-value">{selectedReservation?.memberInfo?.guestPhone}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">손님 수</span>
								<span className="modal-info-value">{selectedReservation.reservationQty} 명</span>
							</div>
						</div>

						<div className="modal-info-section">
							<div className="modal-info-title">숙박 세부 정보</div>
							<div className="modal-info-row">
								<span className="modal-info-label">방</span>
								<span className="modal-info-value">
									{selectedReservation?.roomData?.[0].roomName} - R_ID: {selectedReservation?.roomTypeId?.slice(0, 10)}
								</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">체크인</span>
								<span className="modal-info-value">
									{selectedReservation.reservationPlanType === 'OVERNIGHT'
										? selectedReservation?.reservationCheckIn
										: selectedReservation?.reservationCheckIn + ` ${selectedReservation?.reservationCheckInAt}`}
								</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">체크아웃</span>
								<span className="modal-info-value">
									{selectedReservation.reservationPlanType === 'OVERNIGHT'
										? selectedReservation?.reservationCheckOut
										: selectedReservation?.reservationCheckOut + ` ${selectedReservation?.reservationCheckOutAt}`}
								</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">지속</span>
								<span className="modal-info-value">{selectedReservation?.priceBreakdown?.length} 박</span>
							</div>
						</div>

						<div className="modal-info-section">
							<div className="modal-info-title">예약 정보</div>
							<div className="modal-info-row">
								<span className="modal-info-label">예약 날짜</span>
								<span className="modal-info-value">{selectedReservation?.reservationDate}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">예약 채널</span>
								<span className="modal-info-value">{'Lunotel'}</span>
							</div>
							<div className="modal-info-row">
								<span className="modal-info-label">상태</span>
								<span className={`status-badge ${getStatusInfo(selectedReservation.reservationStatus!).class}`}>
									{getStatusInfo(selectedReservation.reservationStatus).label}
								</span>
							</div>
						</div>

						<div className="modal-total">
							<div className="modal-total-row">
								<span className="modal-total-label">총액</span>
								<span className="modal-total-value">
									${selectedReservation.reservationTotalPrice!.toLocaleString()}
								</span>
							</div>
						</div>

						<div className="modal-actions">
							{selectedReservation.reservationStatus === ReservationStatus.PENDING && (
								<button
									className="btn btn-secondary"
									onClick={() => handleUpdateReservation(ReservationStatus.PENDING, selectedReservation)}
								>
									예약 승인
								</button>
							)}
							{selectedReservation.reservationStatus !== ReservationStatus.CANCELLED &&
								selectedReservation.reservationStatus !== ReservationStatus.COMPLETED && (
									<button
										className="btn btn-danger"
										onClick={() => handleUpdateReservation(ReservationStatus.CANCELLED, selectedReservation)}
									>
										예약 취소
									</button>
								)}
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
