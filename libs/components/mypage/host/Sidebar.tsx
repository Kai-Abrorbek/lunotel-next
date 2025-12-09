import React, { useState } from 'react';
import {
	LayoutDashboard,
	CalendarCheck,
	Calendar,
	Hotel,
	DollarSign,
	Star,
	MessageCircle,
	Bell,
	User,
	Settings,
} from 'lucide-react';
interface SidebarProps {
	activeMenu: string;
	setActiveMenu: (id: string) => void;
}

interface MenuItem {
	id: string;
	label: string;
	icon: React.ReactNode;
	badge?: number;
}

const menuItems: MenuItem[] = [
	{ id: 'dashboard', icon: <LayoutDashboard size={24} />, label: 'Dashboard' },
	{ id: 'reservations', icon: <CalendarCheck size={24} />, label: 'Reservations', badge: 5 },
	{ id: 'calendar', icon: <Calendar size={24} />, label: 'Calendar' },
	{ id: 'rooms', icon: <Hotel size={24} />, label: 'Rooms' },
	{ id: 'revenue', icon: <DollarSign size={24} />, label: 'Revenue' },
	{ id: 'reviews', icon: <Star size={24} />, label: 'Reviews' },
	{ id: 'customer-inquiry', icon: <MessageCircle size={24} />, label: 'Customer Inquiry' },
	{ id: 'notifications', icon: <Bell size={24} />, label: 'Notifications', badge: 3 },
];

const bottomMenuItems: MenuItem[] = [
	{ id: 'account', icon: <User size={24} />, label: 'Account' },
	{ id: 'settings', icon: <Settings size={24} />, label: 'Settings' },
];

export default function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<div className="sidebar-container">
			<div
				className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
				onMouseEnter={() => setIsExpanded(true)}
				onMouseLeave={() => setIsExpanded(false)}
			>
				<div className="sidebar-header">
					<div className="logo">V</div>
					{isExpanded && <span className="brand-text">LunoTel</span>}
				</div>

				<div className="menu-section">
					{menuItems.map((item) => (
						<button
							key={item.id}
							className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
							onClick={() => setActiveMenu(item.id)}
						>
							<span className="menu-icon">{item.icon}</span>
							<span className="menu-label">{item.label}</span>
							{item.badge && <span className="menu-badge">{item.badge}</span>}
						</button>
					))}
				</div>

				<div className="menu-divider" />

				<div className="bottom-menu">
					{bottomMenuItems.map((item) => (
						<button
							key={item.id}
							className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
							onClick={() => setActiveMenu(item.id)}
						>
							<span className="menu-icon">{item.icon}</span>
							<span className="menu-label">{item.label}</span>
						</button>
					))}
				</div>
			</div>
		</div>
		// <div className="sidebar">
		// 	<div className="logo">
		// 		<div className="logo-title">LunoTel</div>
		// 		<div className="logo-subtitle">Hotel Management</div>
		// 	</div>
		// 	<nav>
		// 		{menuItems.map((item) => (
		// 			<div
		// 				key={item.id}
		// 				className={`menu-item ${active === item.id ? 'active' : ''}`}
		// 				onClick={() => setActive(item.id)}
		// 			>
		// 				<div className="menu-left">
		// 					<span className="icon">{item.icon}</span>
		// 					<span>{item.label}</span>
		// 				</div>
		// 				{item.badge && <span className="badge">{item.badge}</span>}
		// 			</div>
		// 		))}
		// 	</nav>
		// </div>
	);
}
