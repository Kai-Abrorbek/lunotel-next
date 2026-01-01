import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import React, { use, useEffect, useState } from 'react';
import { userVar } from '../../../../apollo/store';
import { GET_MY_NOTIFICATIONS } from '../../../../apollo/user/query';
import { Notification } from '../../../types/notification/notification';
import { DELETE_NOTIFICATION, UPDATE_NOTIFICATION } from '../../../../apollo/user/mutation';
import { sweetErrorAlert } from '../../../sweetAlert';
import { useTranslation } from 'react-i18next';

interface NotificationsPageProps {
	currentPage: number;
	setTotal: (v: number) => void;
}

export default function NotificationsPage(props: NotificationsPageProps) {
	const { t, i18n } = useTranslation('common');
	const { currentPage, setTotal } = props;
	const user = useReactiveVar(userVar);
	const [filter, setFilter] = useState('all');
	const [notifications, setNotifications] = useState<Notification[]>([]);

	const [updateNotification] = useMutation(UPDATE_NOTIFICATION);
	const [deleteNotif] = useMutation(DELETE_NOTIFICATION);

	/** APOLLO REQUEST **/
	const {
		loading: getMyNotificationsLoading,
		data: getMyNotificationsData,
		error: getMyNotificationsError,
		refetch: getMyNotificationsRefetch,
	} = useQuery(GET_MY_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: currentPage,
				limit: 10,
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !user._id,
	});

	const notificationsList = getMyNotificationsData?.getMyNotifications.list;
	const notificationsTotal = getMyNotificationsData?.getMyNotifications?.metaCounter?.[0]?.total ?? 0;

	useEffect(() => {
		if (notificationsList?.length !== 0) {
			setNotifications(notificationsList);
			setTotal(notificationsTotal);
		}
	}, [notificationsList]);

	/** HANDLER **/
	function timeAgo(createdAt: string | Date) {
		const now = new Date().getTime();
		const past = new Date(createdAt).getTime();
		const diff = Math.floor((now - past) / 1000); // seconds

		if (diff < 60) return `${diff}${t('초 전')}`;
		if (diff < 3600) return `${Math.floor(diff / 60)}${t('분 전')}`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}${t('시간 전')}`;
		return `${Math.floor(diff / 86400)}${t('일 전')}`;
	}

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

	const filteredNotifications = notifications?.filter((notif: Notification) => {
		if (filter === 'all') return true;
		if (filter === 'unread') return !notif.isRead;
		if (filter === 'read') return notif.isRead;
		// if (filter === 'important') return notif.isImportant;
		return true;
	});

	const unreadCount = notifications?.filter((n: Notification) => !n.isRead).length;
	const todayCount = notificationsList?.filter((n: Notification) => {
		const created = new Date(n.createdAt);
		const now = new Date();
		return created.toDateString() === now.toDateString();
	}).length;

	const markAsRead = async (id: string) => {
		try {
			await updateNotification({
				variables: {
					input: {
						_id: id,
						isRead: true,
					},
				},
			});

			await getMyNotificationsRefetch({
				input: {
					page: currentPage,
					limit: 10,
					search: {},
				},
			});
		} catch (err: any) {
			sweetErrorAlert(err.message);
		}
		setNotifications(notifications?.map((n: Notification) => (n._id === id ? { ...n, isRead: true } : n)));
	};

	const markAllAsRead = async () => {
		try {
			notifications?.map(async (notif: Notification) => {
				await updateNotification({
					variables: {
						input: {
							_id: notif._id,
							isRead: true,
						},
					},
				});
			});
			await getMyNotificationsRefetch({
				input: {
					page: currentPage,
					limit: 10,
					search: {},
				},
			});
		} catch (err: any) {
			sweetErrorAlert(err.message);
		}
		setNotifications(notifications?.map((n: Notification) => ({ ...n, isRead: true })));
	};

	const deleteNotification = async (id: string) => {
		try {
			await deleteNotif({
				variables: {
					notifId: id,
				},
			});

			await getMyNotificationsRefetch({
				input: {
					page: currentPage,
					limit: 10,
					search: {},
				},
			});
		} catch (err: any) {
			sweetErrorAlert(err.message);
		}
		setNotifications(notifications?.filter((n: Notification) => n._id !== id));
	};

	return (
		<div className="notifications-container">
			<div className="page-header">
				<h1 className="page-title">{t('알림센터')}</h1>
				<div className="header-actions">
					<button className="btn btn-secondary" onClick={markAllAsRead}>
						✓ {t('모두 읽음으로 표시')}
					</button>
					<button className="btn btn-primary">⚙️ {t('설정')}</button>
				</div>
			</div>

			<div className="stats-grid">
				<div className="stat-card">
					<div className="stat-label">{t('총 알림')}</div>
					<div className="stat-value">{notificationsTotal}</div>
				</div>
				<div className="stat-card">
					<div className="stat-label">{t('읽히지 않는')}</div>
					<div className="stat-value">{unreadCount}</div>
				</div>
				<div className="stat-card">
					<div className="stat-label">{t('오늘')}</div>
					<div className="stat-value">{todayCount}</div>
				</div>
			</div>

			<div className="filter-tabs">
				<button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
					{t('전체')}
				</button>
				<button className={`filter-tab ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>
					{t('읽지 않는')} ({unreadCount})
				</button>
				<button className={`filter-tab ${filter === 'read' ? 'active' : ''}`} onClick={() => setFilter('read')}>
					{t('읽음')}
				</button>
				<button
					className={`filter-tab ${filter === 'important' ? 'active' : ''}`}
					onClick={() => setFilter('important')}
				>
					{t('중요한')}
				</button>
			</div>

			{filteredNotifications?.length > 0 ? (
				filteredNotifications?.map((notif: Notification) => {
					const categoryInfo = getCategoryInfo('reservation');
					return (
						<div key={notif._id} className={`notification-card ${!notif.isRead ? 'unread' : ''} `}>
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
										{t(`${notif.title}`)}
										{/* {notif.isImportant && <span className="important-badge">! 중요한</span>} */}
									</div>
									<div className="notification-description">{notif.message}</div>
								</div>
							</div>

							<div className="notification-footer">
								<div className="notification-meta">
									<span className="notification-time">{timeAgo(notif.createdAt)}</span>
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
												markAsRead(notif._id);
											}}
										>
											{t('읽음으로 표시')}
										</button>
									)}
									<button
										className="action-btn danger"
										onClick={(e) => {
											e.stopPropagation();
											deleteNotification(notif._id);
										}}
									>
										{t('삭제')}
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
