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
import Link from 'next/link';
import { useRouter } from 'next/router';
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
	const router = useRouter();

	return (
		<div className="sidebar-container">
			<div
				className={`sidebar ${isExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'}`}
				onMouseEnter={() => setIsExpanded(true)}
				onMouseLeave={() => setIsExpanded(false)}
			>
				<Link href={'/mypage/property-management'}>
					<div className="sidebar-header">
						<div className="logo">V</div>
						{isExpanded && <span className="brand-text">LunoTel</span>}
					</div>
				</Link>

				<div className="menu-section">
					{menuItems.map((item) => (
						<Link
							key={item.id}
							href={`/mypage/property-management/deshboard?category=${item.id}&propertyId=${router.query.propertyId}`}
						>
							<button
								className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
								onClick={() => setActiveMenu(item.id)}
							>
								<span className="menu-icon">{item.icon}</span>
								<span className="menu-label">{item.label}</span>
								{item.badge && <span className="menu-badge">{item.badge}</span>}
							</button>
						</Link>
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
	);
}
