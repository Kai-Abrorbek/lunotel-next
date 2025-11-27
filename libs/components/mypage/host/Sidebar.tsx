import React from 'react';

interface SidebarProps {
	active: string;
	setActive: (id: string) => void;
}

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

export default function Sidebar({ active, setActive }: SidebarProps) {
	return (
		<aside className="sidebar">
			<h2 className="sidebar__title">Host Dashboard</h2>

			<nav className="sidebar__menu">
				{menuItems.map((item) => (
					<div
						key={item.id}
						className={`sidebar__menu-item ${active === item.id ? 'active' : ''}`}
						onClick={() => setActive(item.id)}
					>
						{item.label}
					</div>
				))}
			</nav>
		</aside>
	);
}
