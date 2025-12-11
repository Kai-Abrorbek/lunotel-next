import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AgentPropertiesInquiry } from '../../../types/property/property.input';
import { useRouter } from 'next/router';

type StatItem = {
	id: string;
	label: string;
	value: string;
};

type Reservation = {
	id: number;
	name: string;
	roomType: string;
	checkIn: string;
	checkOut: string;
	status: '확인됨';
};

const stats: StatItem[] = [
	{ id: 'checkins', label: '오늘의 체크인', value: '12' },
	{ id: 'checkouts', label: '오늘의 체크아웃', value: '8' },
	{ id: 'reservations', label: '오늘의 예약', value: '5' },
	{ id: 'revenue', label: '이번 주 수익', value: '$24,580' },
];

const reservations: Reservation[] = [
	{
		id: 1,
		name: 'John Doe',
		roomType: 'Deluxe Double Room',
		checkIn: '2024-02-12',
		checkOut: '2024-02-14',
		status: '확인됨',
	},
	{
		id: 2,
		name: 'Maria Kim',
		roomType: 'Oceanview Suite',
		checkIn: '2024-02-13',
		checkOut: '2024-02-15',
		status: '확인됨',
	},
	{
		id: 3,
		name: 'Daniel Choi',
		roomType: 'Standard Twin',
		checkIn: '2024-02-12',
		checkOut: '2024-02-13',
		status: '확인됨',
	},
];

interface HostDashboardProps {
	initialInput: AgentPropertiesInquiry;
}

const HostDashboard = (props: HostDashboardProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<AgentPropertiesInquiry>(initialInput);

	useEffect(() => {
		if (!router.isReady) return;
		const propertyId = router.query.propertyId as string;
		setSearchFilter({
			...searchFilter,
			search: {
				propertyId: propertyId,
			},
		});
	}, [router]);

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
							{item.id === 'revenue' ? <span className="dashboard__stat-value--bold">{item.value}</span> : item.value}
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
						{reservations.map((r) => (
							<div key={r.id} className="reservation-card">
								<div className="reservation-card__left">
									<div className="reservation-card__avatar">{r.name.charAt(0)}</div>
									<div className="reservation-card__info">
										<div className="reservation-card__name">{r.name}</div>
										<div className="reservation-card__room">{r.roomType}</div>

										<div className="reservation-card__dates">
											<div className="reservation-card__date-item">
												<span className="reservation-card__date-label">체크인</span>
												<span className="reservation-card__date-value">{r.checkIn}</span>
											</div>
											<div className="reservation-card__date-item">
												<span className="reservation-card__date-label">체크아웃</span>
												<span className="reservation-card__date-value">{r.checkOut}</span>
											</div>
										</div>
									</div>
								</div>

								<div className="reservation-card__status-wrap">
									<span className="reservation-card__status">{r.status}</span>
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

HostDashboard.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			propertyId: '',
		},
	},
};

export default HostDashboard;
