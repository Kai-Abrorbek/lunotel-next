import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button } from '@mui/material';

interface Notification {
	id: string;
	category: 'reservation' | 'payment' | 'review' | 'system' | 'message';
	title: string;
	description: string;
	time: string;
	isRead: boolean;
	isImportant: boolean;
}

const NotificationsPage = () => {
	const [filter, setFilter] = useState<'all' | 'unread' | 'read' | 'important'>('all');
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
		setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	const deleteNotification = (id: string) => {
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	return (
		<Box className="notifications-container">
			{/* 헤더 */}
			<Box className="page-header">
				<Typography component="h1" className="page-title">
					Notifications
				</Typography>
				<Box className="header-actions">
					<Button className="btn btn-secondary" onClick={markAllAsRead}>
						✓ Mark All as Read
					</Button>
					<Button className="btn btn-primary">⚙️ Settings</Button>
				</Box>
			</Box>

			{/* 통계 카드 */}
			<Box className="stats-grid">
				<Card className="stat-card">
					<CardContent>
						<div className="stat-label">Total Notifications</div>
						<div className="stat-value">{notifications.length}</div>
					</CardContent>
				</Card>
				<Card className="stat-card">
					<CardContent>
						<div className="stat-label">Unread</div>
						<div className="stat-value">{unreadCount}</div>
					</CardContent>
				</Card>
				<Card className="stat-card">
					<CardContent>
						<div className="stat-label">Today</div>
						<div className="stat-value">{todayCount}</div>
					</CardContent>
				</Card>
			</Box>

			{/* 필터 탭 */}
			<Box className="filter-tabs">
				<Button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
					All
				</Button>
				<Button className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
					Unread ({unreadCount})
				</Button>
				<Button className={`filter-tab ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
					Read
				</Button>
				<Button
					className={`filter-tab ${filter === 'important' ? 'active' : ''}`}
					onClick={() => setFilter('important')}
				>
					Important
				</Button>
			</Box>

			{/* 알림 리스트 / Empty */}
			{filteredNotifications.length > 0 ? (
				filteredNotifications.map((notif) => {
					const categoryInfo = getCategoryInfo(notif.category);

					return (
						<Card
							key={notif.id}
							className={`notification-card ${!notif.isRead ? 'unread' : ''} ${notif.isImportant ? 'important' : ''}`}
						>
							{!notif.isRead && <div className="unread-indicator" />}

							<Box className="notification-header">
								<Box
									className="notification-icon"
									style={{
										backgroundColor: `${categoryInfo.color}20`,
										color: categoryInfo.color,
									}}
								>
									{categoryInfo.icon}
								</Box>

								<Box className="notification-content">
									<div className="notification-title">
										{notif.title}
										{notif.isImportant && <span className="important-badge">! Important</span>}
									</div>
									<div className="notification-description">{notif.description}</div>
								</Box>
							</Box>

							<Box className="notification-footer">
								<Box className="notification-meta">
									<span className="notification-time">{notif.time}</span>
									<span
										className="category-badge"
										style={{
											backgroundColor: `${categoryInfo.color}20`,
											color: categoryInfo.color,
										}}
									>
										{categoryInfo.label}
									</span>
								</Box>
								<Box className="notification-actions">
									{!notif.isRead && (
										<Button
											className="action-btn"
											onClick={(e) => {
												e.stopPropagation();
												markAsRead(notif.id);
											}}
										>
											Mark as Read
										</Button>
									)}
									<Button
										className="action-btn danger"
										onClick={(e) => {
											e.stopPropagation();
											deleteNotification(notif.id);
										}}
									>
										Delete
									</Button>
								</Box>
							</Box>
						</Card>
					);
				})
			) : (
				<Card className="empty-state">
					<CardContent>
						<div className="empty-state-icon">🔔</div>
						<div className="empty-state-title">No notifications</div>
						<div className="empty-state-text">You're all caught up! Check back later for updates.</div>
					</CardContent>
				</Card>
			)}
		</Box>
	);
};

export default NotificationsPage;
