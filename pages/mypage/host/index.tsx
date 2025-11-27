import React, { useState } from 'react';
import Sidebar from '../../../libs/components/mypage/host/Sidebar';
import HostDashboard from '../../../libs/components/mypage/host/HostDashboard';
import CalendarPage from './CalendarPage';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import RoomsPage from '../../../libs/components/mypage/host/RoomsPage';

const HostMyPage = () => {
	const [active, setActive] = useState('dashboard');

	const renderPage = () => {
		switch (active) {
			case 'dashboard':
				return <HostDashboard />;
			case 'calendar':
				return <CalendarPage />;
			case 'rooms':
				return <RoomsPage />;
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
