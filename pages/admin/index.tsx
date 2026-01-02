import { Home, Hotel, Menu, MessageSquare, UserCheck, Users, X } from 'lucide-react';
import { useState } from 'react';
import CSCenter from '../../libs/components/admin/CScenter';
import HostManagement from '../../libs/components/admin/HostManagement ';
import UserManagement from '../../libs/components/admin/UserManagement';
import Dashboard from '../../libs/components/admin/Dashboard';
import PropertyManagement from '../../libs/components/admin/PropertyManagement';
import Link from 'next/link';

// 메인 컴포넌트
const AdminPanel = () => {
	const [isExpanded, setIsExpanded] = useState(true);
	const [activeMenu, setActiveMenu] = useState('dashboard');

	const menuItems = [
		{ id: 'dashboard', label: '대시보드', icon: Home, component: Dashboard },
		{ id: 'users', label: '유저 관리', icon: Users, component: UserManagement },
		{ id: 'hosts', label: '호스트 관리', icon: UserCheck, component: HostManagement },
		{ id: 'properties', label: '숙소 관리', icon: Hotel, component: PropertyManagement },
		{ id: 'cs', label: 'CS 센터', icon: MessageSquare, component: CSCenter },
	];

	const ActiveComponent = menuItems.find((item) => item.id === activeMenu)?.component || Dashboard;

	return (
		<>
			<div className="admin-container">
				{/* Sidebar */}
				<aside
					className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}
					onMouseEnter={() => setIsExpanded(true)}
					onMouseLeave={() => setIsExpanded(false)}
				>
					<div className="sidebar-header">
						<div className="logo">
							<Link href={'/'}>
								<div className="logo-circle">
									<span className="logo-text-circle">Lunotel</span>
								</div>
							</Link>
						</div>
						<button className="toggle-btn" onClick={() => setIsExpanded(!isExpanded)}>
							{/* {isExpanded ? <X size={20} /> : <Menu size={20} />} */}
						</button>
					</div>

					<ul className="menu-list">
						{menuItems.map((item) => (
							<li key={item.id} className="menu-item">
								<a
									className={`menu-link ${activeMenu === item.id ? 'active' : ''}`}
									onClick={() => setActiveMenu(item.id)}
								>
									<span className="menu-icon">
										<item.icon size={22} />
									</span>
									<span className="menu-text">{item.label}</span>
								</a>
							</li>
						))}
					</ul>
				</aside>

				{/* Main Content */}
				<main className={`main-content ${isExpanded ? 'with-sidebar-expanded' : 'with-sidebar-collapsed'}`}>
					<div className="content-area">
						<ActiveComponent />
					</div>
				</main>
			</div>
		</>
	);
};

export default AdminPanel;
