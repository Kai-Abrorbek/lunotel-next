import React from 'react';

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
	status: 'Confirmed';
};

const stats: StatItem[] = [
	{ id: 'checkins', label: "Today's Check-ins", value: '12' },
	{ id: 'checkouts', label: "Today's Check-outs", value: '8' },
	{ id: 'reservations', label: "Today's Reservations", value: '5' },
	{ id: 'revenue', label: 'Revenue This Week', value: '$24,580' },
];

const reservations: Reservation[] = [
	{
		id: 1,
		name: 'John Doe',
		roomType: 'Deluxe Double Room',
		checkIn: '2024-02-12',
		checkOut: '2024-02-14',
		status: 'Confirmed',
	},
	{
		id: 2,
		name: 'Maria Kim',
		roomType: 'Oceanview Suite',
		checkIn: '2024-02-13',
		checkOut: '2024-02-15',
		status: 'Confirmed',
	},
	{
		id: 3,
		name: 'Daniel Choi',
		roomType: 'Standard Twin',
		checkIn: '2024-02-12',
		checkOut: '2024-02-13',
		status: 'Confirmed',
	},
];

export default function HostDashboard() {
	return (
		<div className="dashboard">
			<div className="dashboard__header">
				<h1 className="dashboard__title">Dashboard</h1>
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
					<h2 className="dashboard__section-title">Recent Reservations</h2>

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
												<span className="reservation-card__date-label">Check-in</span>
												<span className="reservation-card__date-value">{r.checkIn}</span>
											</div>
											<div className="reservation-card__date-item">
												<span className="reservation-card__date-label">Check-out</span>
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
					<h2 className="dashboard__section-title">Quick Actions</h2>

					<div className="quick-card">
						<button className="quick-card__item">
							<span className="quick-card__icon">＋</span>
							<span className="quick-card__text">Add Reservation</span>
						</button>

						<div className="quick-card__divider" />

						<button className="quick-card__item">
							<span className="quick-card__icon quick-card__icon--square">▦</span>
							<span className="quick-card__text">View Calendar</span>
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
