import React, { useState } from 'react';

interface Notification {
	id: string;
	category: 'reservation' | 'payment' | 'review' | 'system' | 'message';
	title: string;
	description: string;
	time: string;
	isRead: boolean;
	isImportant: boolean;
}

interface NotificationsPageProps {
	currentPage: number;
	setTotal: (v: number) => void;
}

export default function NotificationsPage(props: NotificationsPageProps) {
	const { currentPage, setTotal } = props;

	const [filter, setFilter] = useState('all');
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: 'N001',
			category: 'reservation',
			title: 'New Reservation',
			description: 'John Doe booked Deluxe Double Room for 3 nights',
			time: '5 minutes ago',
			isRead: false,
			isImportant: true,
		},
		{
			id: 'N002',
			category: 'payment',
			title: 'Payment Received',
			description: 'Payment of $540 received for reservation RSV-001',
			time: '1 hour ago',
			isRead: false,
			isImportant: false,
		},
		{
			id: 'N003',
			category: 'review',
			title: 'New Review',
			description: 'Maria Kim left a 5-star review for Oceanview Suite',
			time: '2 hours ago',
			isRead: false,
			isImportant: false,
		},
		{
			id: 'N004',
			category: 'reservation',
			title: 'Reservation Cancelled',
			description: 'Reservation RSV-005 has been cancelled by guest',
			time: '3 hours ago',
			isRead: true,
			isImportant: true,
		},
		{
			id: 'N005',
			category: 'message',
			title: 'Guest Message',
			description: 'Sarah Park sent you a message about check-in time',
			time: '5 hours ago',
			isRead: true,
			isImportant: false,
		},
		{
			id: 'N006',
			category: 'system',
			title: 'System Update',
			description: 'New features added to the dashboard',
			time: '1 day ago',
			isRead: true,
			isImportant: false,
		},
		{
			id: 'N007',
			category: 'payment',
			title: 'Refund Processed',
			description: 'Refund of $360 processed for cancelled reservation',
			time: '1 day ago',
			isRead: true,
			isImportant: false,
		},
		{
			id: 'N008',
			category: 'review',
			title: 'Review Response Needed',
			description: 'Guest is waiting for your response to their review',
			time: '2 days ago',
			isRead: false,
			isImportant: true,
		},
	]);

	/** HANDLER **/
	const getCategoryInfo = (category: string) => {
		const categoryMap: { [key: string]: { icon: string; color: string; label: string } } = {
			reservation: { icon: '🔔', color: '#3b82f6', label: 'Reservation' },
			payment: { icon: '💰', color: '#10b981', label: 'Payment' },
			review: { icon: '⭐', color: '#fbbf24', label: 'Review' },
			system: { icon: '🔧', color: '#6b7280', label: 'System' },
			message: { icon: '👤', color: '#8b5cf6', label: 'Message' },
		};
		return categoryMap[category] || { icon: '🔔', color: '#6b7280', label: 'Other' };
	};

	const filteredNotifications = notifications.filter((notif) => {
		if (filter === 'all') return true;
		if (filter === 'unread') return !notif.isRead;
		if (filter === 'read') return notif.isRead;
		if (filter === 'important') return notif.isImportant;
		return true;
	});

	const unreadCount = notifications.filter((n) => !n.isRead).length;
	const todayCount = notifications.filter((n) => n.time.includes('minute') || n.time.includes('hour')).length;

	const markAsRead = (id: string) => {
		setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
	};

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
	};

	const deleteNotification = (id: string) => {
		setNotifications(notifications.filter((n) => n.id !== id));
	};

	return (
		<div className="notifications-container">
			<div className="page-header">
				<h1 className="page-title">알림</h1>
				<div className="header-actions">
					<button className="btn btn-secondary" onClick={markAllAsRead}>
						✓ 모두 읽음으로 표시
					</button>
					<button className="btn btn-primary">⚙️ 설정</button>
				</div>
			</div>

			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-label">총 알림</div>
					<div className="stat-value">{notifications.length}</div>
				</div>
				<div className="stat-card">
					<div className="stat-label">읽히지 않는</div>
					<div className="stat-value">{unreadCount}</div>
				</div>
				<div className="stat-card">
					<div className="stat-label">오늘</div>
					<div className="stat-value">{todayCount}</div>
				</div>
			</div>

			<div className="filter-tabs">
				<button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
					전체
				</button>
				<button className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
					읽지 않는 ({unreadCount})
				</button>
				<button className={`filter-tab ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
					읽음
				</button>
				<button
					className={`filter-tab ${filter === 'important' ? 'active' : ''}`}
					onClick={() => setFilter('important')}
				>
					중요한
				</button>
			</div>

			{filteredNotifications.length > 0 ? (
				filteredNotifications.map((notif) => {
					const categoryInfo = getCategoryInfo(notif.category);
					return (
						<div
							key={notif.id}
							className={`notification-card ${!notif.isRead ? 'unread' : ''} ${notif.isImportant ? 'important' : ''}`}
						>
							{!notif.isRead && <div className="unread-indicator"></div>}

							<div className="notification-header">
								<div
									className="notification-icon"
									style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
								>
									{categoryInfo.icon}
								</div>
								<div className="notification-content">
									<div className="notification-title">
										{notif.title}
										{notif.isImportant && <span className="important-badge">! 중요한</span>}
									</div>
									<div className="notification-description">{notif.description}</div>
								</div>
							</div>

							<div className="notification-footer">
								<div className="notification-meta">
									<span className="notification-time">{notif.time}</span>
									<span
										className="category-badge"
										style={{ backgroundColor: `${categoryInfo.color}20`, color: categoryInfo.color }}
									>
										{categoryInfo.label}
									</span>
								</div>
								<div className="notification-actions">
									{!notif.isRead && (
										<button
											className="action-btn"
											onClick={(e) => {
												e.stopPropagation();
												markAsRead(notif.id);
											}}
										>
											읽음으로 표시
										</button>
									)}
									<button
										className="action-btn danger"
										onClick={(e) => {
											e.stopPropagation();
											deleteNotification(notif.id);
										}}
									>
										삭제
									</button>
								</div>
							</div>
						</div>
					);
				})
			) : (
				<div className="empty-state">
					<div className="empty-state-icon">🔔</div>
					<div className="empty-state-title">No notifications</div>
					<div className="empty-state-text">You're all caught up! Check back later for updates.</div>
				</div>
			)}
		</div>
	);
}
