import { Button } from '@mui/material';
import React from 'react';

interface SidebarProps {
	active: string;
	setActive: (id: string) => void;
}

interface MenuItem {
	id: string;
	label: string;
	icon: string;
	badge?: number;
}

const menuItems: MenuItem[] = [
	{ id: 'dashboard', label: 'Dashboard', icon: '📊' },
	{ id: 'reservations', label: 'Reservations', icon: '📅', badge: 5 },
	{ id: 'calendar', label: 'Calendar', icon: '🗓️' },
	{ id: 'rooms', label: 'Rooms', icon: '🏨' },
	{ id: 'revenue', label: 'Revenue', icon: '💰' },
	{ id: 'reviews', label: 'Reviews', icon: '⭐' },
	{ id: 'customer-inquiry', label: 'Customer Inquiry', icon: '🗨️' },
	{ id: 'notifications', label: 'Notifications', icon: '🔔', badge: 3 },
];

export default function Sidebar({ active, setActive }: SidebarProps) {
	return (
		<div className="sidebar">
			<div className="logo">
				<div className="logo-title">LunoTel</div>
				<div className="logo-subtitle">Hotel Management</div>
			</div>
			<nav>
				{menuItems.map((item) => (
					<div
						key={item.id}
						className={`menu-item ${active === item.id ? 'active' : ''}`}
						onClick={() => setActive(item.id)}
					>
						<div className="menu-left">
							<span className="icon">{item.icon}</span>
							<span>{item.label}</span>
						</div>
						{item.badge && <span className="badge">{item.badge}</span>}
					</div>
				))}
			</nav>
		</div>
	);
}
