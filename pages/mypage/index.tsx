import React, { useState } from 'react';
import LayoutHome from '../../libs/components/layout/LayoutHome';

const MyPage = () => {
	const [activePage, setActivePage] = useState('dashboard');

	const menuItems = [
		{ id: 'dashboard', label: 'Dashboard' },
		{ id: 'reservations', label: 'Reservations' },
		{ id: 'calendar', label: 'Calendar' },
		{ id: 'rooms', label: 'Rooms' },
		{ id: 'property-settings', label: 'Property Settings' },
		{ id: 'revenue', label: 'Revenue' },
		{ id: 'reviews', label: 'Reviews' },
		{ id: 'notifications', label: 'Notifications' },
		{ id: 'customer-inquiry', label: 'Customer Inquiry' },
		{ id: 'staff-role', label: 'Staff / Role Management' },
		{ id: 'notice-faq', label: 'Notice / FAQ' },
	];

	const stats = [
		{ label: "Today's Check-ins", value: '12' },
		{ label: "Today's Check-outs", value: '8' },
		{ label: "Today's Reservations", value: '5' },
		{ label: 'Revenue This Week', value: '$24,580' },
	];

	const reservations = [
		{
			guest: 'John Doe',
			room: 'Deluxe Double Room',
			checkIn: '2024-02-12',
			checkOut: '2024-02-14',
		},
		{
			guest: 'Maria Kim',
			room: 'Oceanview Suite',
			checkIn: '2024-02-13',
			checkOut: '2024-02-15',
		},
		{
			guest: 'Daniel Choi',
			room: 'Standard Twin',
			checkIn: '2024-02-12',
			checkOut: '2024-02-13',
		},
	];

	const ReservationCard = ({
		guest,
		room,
		checkIn,
		checkOut,
	}: {
		guest: string;
		room: string;
		checkIn: string;
		checkOut: string;
	}) => (
		<div className="reservation-card">
			<div className="reservation-content">
				<div className="avatar">{guest.charAt(0)}</div>

				<div className="reservation-details">
					<div className="reservation-header">
						<h4 className="guest-name">{guest}</h4>
						<span className="status-badge">Confirmed</span>
					</div>

					<p className="room-type">{room}</p>

					<div className="dates-info">
						<div className="date-item">
							<span className="date-label">Check-in</span>
							<span className="date-value">{checkIn}</span>
						</div>

						<div className="date-item">
							<span className="date-label">Check-out</span>
							<span className="date-value">{checkOut}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const DashboardPage = () => (
		<div>
			<h2 className="page-title">Dashboard</h2>

			<div className="stats-grid">
				{stats.map((stat, idx) => (
					<div key={idx} className="stat-card">
						<p className="stat-label">{stat.label}</p>
						<p className="stat-value">{stat.value}</p>
					</div>
				))}
			</div>

			<div className="divider"></div>

			<div className="bottom-section">
				<div className="left-section">
					<h3 className="section-title">Recent Reservations</h3>

					<div className="reservations-list">
						{reservations.map((res, idx) => (
							<ReservationCard key={idx} {...res} />
						))}
					</div>
				</div>

				<div className="right-section">
					<h3 className="section-title">Quick Actions</h3>
					<div className="quick-actions-card">
						<div className="actions-list">
							<a href="#" className="action-link">
								<span className="plus">＋</span> Add Reservation
							</a>

							<div className="action-divider" />

							<a href="#" className="action-link">
								📅 View Calendar
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	);

	const PlaceholderPage = ({ title, description }: { title: string | undefined; description: string }) => (
		<div>
			<h2 className="page-title">{title}</h2>
			<div className="placeholder-content">
				<h3>{description}</h3>
			</div>
		</div>
	);

	const renderPage = () => {
		switch (activePage) {
			case 'dashboard':
				return <DashboardPage />;
			default:
				const item = menuItems.find((m) => m.id === activePage);
				return <PlaceholderPage title={item?.label} description={`${item?.label} 페이지`} />;
		}
	};

	return (
		<div className="container">
			<div className="host-container">
				<aside className="sidebar">
					<div className="sidebar-header">
						<h1 className="sidebar-title">Host Dashboard</h1>
					</div>

					<nav className="sidebar-nav">
						{menuItems.map((item) => (
							<a
								key={item.id}
								className={`menu-item ${activePage === item.id ? 'active' : ''}`}
								onClick={() => setActivePage(item.id)}
							>
								{item.label}
							</a>
						))}
					</nav>
				</aside>

				<main className="main-content">{renderPage()}</main>
			</div>
		</div>
	);
};

export default LayoutHome(MyPage);
