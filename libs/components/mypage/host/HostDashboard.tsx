import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AgentPropertiesInquiry } from '../../../types/property/property.input';
import { useRouter } from 'next/router';
import { GET_AGENT_RESERVATIONS } from '../../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { Reservation } from '../../../types/reservation/reservation';
import { ReservationStatus } from '../../../enums/reservation';

type StatItem = {
	id: string;
	label: string;
	value: number;
};

const HostDashboard = () => {
	const router = useRouter();
	const [stats, setStats] = useState<StatItem[]>([
		{ id: 'checkins', label: '오늘의 체크인', value: 0 },
		{ id: 'checkouts', label: '오늘의 체크아웃', value: 0 },
		{ id: 'reservations', label: '오늘의 예약', value: 5 },
		{ id: 'revenue', label: '이번 주 수익', value: 0 },
	]);
	/** APOLLO REQUEST **/
	const {
		loading: getPropertyInfoLoading,
		data: getPropertyInfoData,
		error: getPropertyInfoError,
		refetch: getPropertyInfoRefetch,
	} = useQuery(GET_AGENT_RESERVATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 5,
				search: {
					propertyId: router.query.propertyId,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !router.query.propertyId,
	});

	const reservations: Reservation[] = getPropertyInfoData?.getAgentReservations.list;

	const todayLocalYMD = (() => {
		const d = new Date();
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const dd = String(d.getDate()).padStart(2, '0');
		return `${yyyy}-${mm}-${dd}`;
	})();

	const todayYMD = new Date().toLocaleDateString('sv-SE'); // YYYY-MM-DD
	const todayCheckInCount =
		reservations?.filter((r: Reservation) => r.reservationCheckIn?.slice(0, 10) === todayLocalYMD).length ?? 0;
	const todayCheckOutCount =
		reservations?.filter((r: Reservation) => r.reservationCheckOut?.slice(0, 10) === todayLocalYMD).length ?? 0;
	const todayReservations =
		reservations?.filter((r: Reservation) => r.createdAt?.toString()?.slice(0, 10) === todayYMD).length ?? 0;
	const revenueTotal =
		reservations
			?.filter((reservation: Reservation) => reservation.reservationStatus !== ReservationStatus.CANCELLED)
			?.reduce((a, b) => a + b.reservationTotalPrice!, 0) ?? 0;

	useEffect(() => {
		setStats((prev) => {
			const checkins = prev.filter((p) => p.id === 'checkins')[0];
			checkins.value = todayCheckInCount;

			const checkOuts = prev.filter((p) => p.id === 'checkouts')[0];
			checkOuts.value = todayCheckOutCount;

			const reservations = prev.filter((p) => p.id === 'reservations')[0];
			reservations.value = todayReservations;

			const revenue = prev.filter((p) => p.id === 'revenue')[0];
			revenue.value = Number(revenueTotal);
			return prev;
		});
	}, [todayCheckInCount, todayCheckOutCount, todayReservations, revenueTotal]);

	return (
		<div className="dashboard">
			<div className="dashboard__header">
				<h1 className="dashboard__title">대시보드</h1>
			</div>

			<section className="dashboard__stats">
				{stats.map((item) => (
					<div key={item.id} className="dashboard__stat-card">
						<div className="dashboard__stat-label">{item.label}</div>
						<div className="dashboard__stat-value">
							{item.id === 'revenue' ? (
								<span className="dashboard__stat-value--bold">$ {item.value.toLocaleString()}</span>
							) : (
								item.value.toLocaleString()
							)}
						</div>
					</div>
				))}
			</section>

			<hr className="dashboard__divider" />

			<section className="dashboard__main-row">
				{/* 왼쪽: Recent Reservations */}
				<div className="dashboard__reservations">
					<h2 className="dashboard__section-title">최근 예약</h2>

					<div className="dashboard__reservation-list">
						{reservations?.map((r: Reservation) => (
							<div key={r._id} className="reservation-card">
								<div className="reservation-card__left">
									<div className="reservation-card__avatar">{r?.memberInfo?.guestName.charAt(0)}</div>
									<div className="reservation-card__info">
										<div className="reservation-card__name">{r?.memberInfo?.guestName}</div>
										<div className="reservation-card__room">{r?.roomData?.[0].roomName}</div>

										<div className="reservation-card__dates">
											<div className="reservation-card__date-item">
												<span className="reservation-card__date-label">체크인</span>
												<span className="reservation-card__date-value">{r?.reservationCheckIn}</span>
											</div>
											<div className="reservation-card__date-item">
												<span className="reservation-card__date-label">체크아웃</span>
												<span className="reservation-card__date-value">{r?.reservationCheckOut}</span>
											</div>
										</div>
									</div>
								</div>

								<div className="reservation-card__status-wrap">
									<span
										className={`reservation-card__status ${
											r.reservationStatus === 'UPCOMING'
												? 'UPCOMING'
												: r.reservationStatus === 'PENDING'
												? 'PENDING'
												: r.reservationStatus === 'CANCELLED'
												? 'CANCELLED'
												: r.reservationStatus === 'COMPLETED'
												? 'COMPLETED'
												: r.reservationStatus === 'CHECKED_IN'
												? 'CHECKED_IN'
												: ''
										}`}
									>
										{r.reservationStatus === 'UPCOMING'
											? '예정'
											: r.reservationStatus === 'PENDING'
											? '대기중'
											: r.reservationStatus === 'CANCELLED'
											? '취소됨'
											: r.reservationStatus === 'COMPLETED'
											? '완료됨'
											: r.reservationStatus === 'CHECKED_IN'
											? '두숙중'
											: ''}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* 오른쪽: Quick Actions */}
				<div className="dashboard__quick-actions">
					<h2 className="dashboard__section-title">빠른 작업</h2>

					<div className="quick-card">
						<Link href={''}>
							<button className="quick-card__item">
								<span className="quick-card__icon">＋</span>
								<span className="quick-card__text">객실 추가</span>
							</button>
						</Link>
						<div className="quick-card__divider" />
						<Link href={''}>
							<button className="quick-card__item">
								<span className="quick-card__icon quick-card__icon--square">▦</span>
								<span className="quick-card__text">달력 보기</span>
							</button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default HostDashboard;
