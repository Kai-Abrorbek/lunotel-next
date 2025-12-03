import React, { useState } from 'react';
import Sidebar from '../../../libs/components/mypage/host/Sidebar';
import HostDashboard from '../../../libs/components/mypage/host/HostDashboard';
import CalendarPage from '../../../libs/components/mypage/host/CalendarPage';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import RoomsPage from '../../../libs/components/mypage/host/RoomsPage';
import ReservationsPage from '../../../libs/components/mypage/host/ReservationsPage';
import PropertySettingsPage from '../../../libs/components/mypage/host/PropertySettingsPage';
import RevenuePage from '../../../libs/components/mypage/host/RevenuePage';
import ReviewsPage from '../../../libs/components/mypage/host/ReviewsPage';
import NotificationsPage from '../../../libs/components/mypage/host/NotificationsPage';
import CustomerInquiryPage from '../../../libs/components/mypage/host/CustomerInquiryPage';

const HostMyPage = () => {
	const [active, setActive] = useState('dashboard');

	const renderPage = () => {
		switch (active) {
			case 'dashboard':
				return <HostDashboard />;
			case 'reservations':
				return <ReservationsPage />;
			case 'calendar':
				return <CalendarPage />;
			case 'rooms':
				return <RoomsPage />;
			case 'property-settings':
				return <PropertySettingsPage />;
			case 'revenue':
				return <RevenuePage />;
			case 'reviews':
				return <ReviewsPage />;
			case 'notifications':
				return <NotificationsPage />;
			case 'customer-inquiry':
				return <CustomerInquiryPage />;
		}
	};

	return (
		<div className="container">
			<div className="host-layout">
				<Sidebar active={active} setActive={setActive} />
				<main className="host-layout__content">{renderPage()}</main>
			</div>
		</div>
	);
};

export default LayoutHome(HostMyPage);
