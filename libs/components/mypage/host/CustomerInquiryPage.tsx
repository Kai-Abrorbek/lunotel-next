import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField } from '@mui/material';

interface Inquiry {
	id: string;
	customer: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	category: 'booking' | 'payment' | 'facilities' | 'complaint' | 'general';
	status: 'new' | 'in-progress' | 'resolved' | 'closed';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	date: string;
	replies?: Array<{
		author: string;
		message: string;
		date: string;
		isHost: boolean;
	}>;
}

export default function CustomerInquiryPage() {
	const [filter, setFilter] = useState<'all' | Inquiry['status']>('all');
	const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
	const [replyText, setReplyText] = useState('');

	const [inquiries, setInquiries] = useState<Inquiry[]>([
		{
			id: 'INQ-001',
			customer: 'John Doe',
			email: 'john.doe@email.com',
			phone: '+1 234-567-8900',
			subject: 'Early Check-in Request',
			message: 'Hi, I will be arriving at 11 AM. Is early check-in available? I am willing to pay extra if needed.',
			category: 'booking',
			status: 'new',
			priority: 'high',
			date: '2024-11-28 09:30',
			replies: [],
		},
		{
			id: 'INQ-002',
			customer: 'Maria Kim',
			email: 'maria.kim@email.com',
			phone: '+82 10-1234-5678',
			subject: 'Pool Hours Question',
			message: 'What are the operating hours for the swimming pool? Also, is it heated during winter?',
			category: 'facilities',
			status: 'in-progress',
			priority: 'medium',
			date: '2024-11-27 14:20',
			replies: [
				{
					author: 'Maria Kim',
					message: 'What are the operating hours for the swimming pool? Also, is it heated during winter?',
					date: '2024-11-27 14:20',
					isHost: false,
				},
				{
					author: 'Host',
					message:
						'Hello Maria! Our pool is open from 6 AM to 10 PM daily. Yes, it is heated year-round to maintain a comfortable temperature. Looking forward to your stay!',
					date: '2024-11-27 15:45',
					isHost: true,
				},
			],
		},
		{
			id: 'INQ-003',
			customer: 'Daniel Choi',
			email: 'daniel.choi@email.com',
			phone: '+82 10-9876-5432',
			subject: 'Refund Request',
			message: 'I need to cancel my reservation due to an emergency. What is your cancellation policy?',
			category: 'payment',
			status: 'resolved',
			priority: 'urgent',
			date: '2024-11-26 10:15',
			replies: [
				{
					author: 'Daniel Choi',
					message: 'I need to cancel my reservation due to an emergency. What is your cancellation policy?',
					date: '2024-11-26 10:15',
					isHost: false,
				},
				{
					author: 'Host',
					message:
						'We understand. You can cancel with a full refund up to 48 hours before check-in. I have processed your cancellation and the refund will be credited within 5-7 business days.',
					date: '2024-11-26 11:30',
					isHost: true,
				},
			],
		},
		{
			id: 'INQ-004',
			customer: 'Sarah Park',
			email: 'sarah.park@email.com',
			phone: '+82 10-5555-6666',
			subject: 'Noise Complaint',
			message: 'There was loud construction noise during my stay last week. This greatly affected my experience.',
			category: 'complaint',
			status: 'closed',
			priority: 'high',
			date: '2024-11-25 16:40',
			replies: [
				{
					author: 'Sarah Park',
					message: 'There was loud construction noise during my stay last week. This greatly affected my experience.',
					date: '2024-11-25 16:40',
					isHost: false,
				},
				{
					author: 'Host',
					message:
						'We sincerely apologize for the inconvenience. We have issued a 20% refund to your account as compensation. The construction is now complete.',
					date: '2024-11-25 18:20',
					isHost: true,
				},
			],
		},
		{
			id: 'INQ-005',
			customer: 'Alice Johnson',
			email: 'alice.j@email.com',
			phone: '+1 555-123-4567',
			subject: 'Airport Shuttle Service',
			message: 'Do you provide airport shuttle service? If yes, what is the cost?',
			category: 'general',
			status: 'new',
			priority: 'low',
			date: '2024-11-28 08:15',
			replies: [],
		},
	]);

	const getCategoryInfo = (category: string) => {
		const categoryMap: {
			[key: string]: { icon: string; color: string; label: string };
		} = {
			booking: { icon: '📅', color: '#3b82f6', label: '예약' },
			payment: { icon: '💳', color: '#10b981', label: '결제' },
			facilities: { icon: '🏊', color: '#8b5cf6', label: '시설' },
			complaint: { icon: '⚠️', color: '#ef4444', label: '불만' },
			general: { icon: '💬', color: '#6b7280', label: '일반' },
		};
		return (
			categoryMap[category] || {
				icon: '💬',
				color: '#6b7280',
				label: '일반',
			}
		);
	};

	const getStatusInfo = (status: string) => {
		const statusMap: {
			[key: string]: { color: string; bg: string; label: string };
		} = {
			new: { color: '#2563eb', bg: '#dbeafe', label: '새 문의' },
			'in-progress': { color: '#f59e0b', bg: '#fef3c7', label: '처리 중' },
			resolved: { color: '#10b981', bg: '#d1fae5', label: '해결됨' },
			closed: { color: '#6b7280', bg: '#f3f4f6', label: '종료' },
		};
		return (
			statusMap[status] || {
				color: '#6b7280',
				bg: '#f3f4f6',
				label: '알 수 없음',
			}
		);
	};

	const getPriorityInfo = (priority: string) => {
		const priorityMap: { [key: string]: { color: string; label: string } } = {
			low: { color: '#10b981', label: '낮음' },
			medium: { color: '#f59e0b', label: '보통' },
			high: { color: '#ef4444', label: '높음' },
			urgent: { color: '#dc2626', label: '긴급' },
		};
		return priorityMap[priority] || { color: '#6b7280', label: '알 수 없음' };
	};

	const filteredInquiries = inquiries.filter((inquiry) => {
		if (filter === 'all') return true;
		return inquiry.status === filter;
	});

	const statusCounts = {
		all: inquiries.length,
		new: inquiries.filter((i) => i.status === 'new').length,
		'in-progress': inquiries.filter((i) => i.status === 'in-progress').length,
		resolved: inquiries.filter((i) => i.status === 'resolved').length,
	};

	const handleSendReply = () => {
		if (!replyText.trim() || !selectedInquiry) return;

		const newReply = {
			author: 'Host',
			message: replyText,
			date: new Date().toLocaleString(),
			isHost: true,
		};

		setInquiries((prev) =>
			prev.map((inq) =>
				inq.id === selectedInquiry.id
					? {
							...inq,
							replies: [...(inq.replies || []), newReply],
							status: 'in-progress',
					  }
					: inq,
			),
		);

		setSelectedInquiry((prev) =>
			prev
				? {
						...prev,
						replies: [...(prev.replies || []), newReply],
						status: 'in-progress',
				  }
				: prev,
		);

		setReplyText('');
	};

	const updateStatus = (id: string, status: Inquiry['status']) => {
		setInquiries((prev) => prev.map((inq) => (inq.id === id ? { ...inq, status } : inq)));
		setSelectedInquiry((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
	};

	return (
		<Box className="inquiry-container">
			<Box className="page-header">
				<Typography component="h1" className="page-title">
					고객 문의
				</Typography>
			</Box>

			<Box className="stats-grid">
				<Card className="stat-card">
					<CardContent>
						<div className="stat-label">전체 문의</div>
						<div className="stat-value">{inquiries.length}</div>
					</CardContent>
				</Card>
				<Card className="stat-card">
					<CardContent>
						<div className="stat-label">새 문의</div>
						<div className="stat-value">{statusCounts.new}</div>
					</CardContent>
				</Card>
				<Card className="stat-card">
					<CardContent>
						<div className="stat-label">처리 중</div>
						<div className="stat-value">{statusCounts['in-progress']}</div>
					</CardContent>
				</Card>
				<Card className="stat-card">
					<CardContent>
						<div className="stat-label">해결됨</div>
						<div className="stat-value">{statusCounts.resolved}</div>
					</CardContent>
				</Card>
			</Box>

			<Box className="filter-tabs">
				<Button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
					전체 ({statusCounts.all})
				</Button>
				<Button className={`filter-tab ${filter === 'new' ? 'active' : ''}`} onClick={() => setFilter('new')}>
					새 문의 ({statusCounts.new})
				</Button>
				<Button
					className={`filter-tab ${filter === 'in-progress' ? 'active' : ''}`}
					onClick={() => setFilter('in-progress')}
				>
					처리 중 ({statusCounts['in-progress']})
				</Button>
				<Button className={`filter-tab ${filter === 'resolved' ? 'active' : ''}`} onClick={() => setFilter('resolved')}>
					해결됨 ({statusCounts.resolved})
				</Button>
			</Box>

			<Box className="content-layout">
				<Card className="inquiries-list">
					<CardContent sx={{ p: 0 }}>
						{filteredInquiries.map((inquiry) => {
							const categoryInfo = getCategoryInfo(inquiry.category);
							const statusInfo = getStatusInfo(inquiry.status);
							const priorityInfo = getPriorityInfo(inquiry.priority);

							return (
								<Box
									key={inquiry.id}
									className={`inquiry-item ${selectedInquiry?.id === inquiry.id ? 'selected' : ''}`}
									onClick={() => setSelectedInquiry(inquiry)}
								>
									<Box className="inquiry-item-header">
										<div className="inquiry-customer">
											<span className="priority-indicator" style={{ backgroundColor: priorityInfo.color }} />
											{inquiry.customer}
										</div>
										<Box className="inquiry-badges">
											<span
												className="badge"
												style={{
													backgroundColor: statusInfo.bg,
													color: statusInfo.color,
												}}
											>
												{statusInfo.label}
											</span>
										</Box>
									</Box>
									<div className="inquiry-subject">{inquiry.subject}</div>
									<div className="inquiry-preview">{inquiry.message}</div>
									<div className="inquiry-meta">
										<span>
											{categoryInfo.icon} {categoryInfo.label}
										</span>
										<span>•</span>
										<span>{inquiry.date}</span>
									</div>
								</Box>
							);
						})}
					</CardContent>
				</Card>

				<Card className="detail-panel">
					<CardContent sx={{ p: 0 }}>
						{selectedInquiry ? (
							<>
								<Box className="detail-header">
									<div className="detail-title">{selectedInquiry.subject}</div>
									<Box className="detail-info">
										<div className="info-item">
											<div className="info-label">고객 이름</div>
											<div className="info-value">{selectedInquiry.customer}</div>
										</div>
										<div className="info-item">
											<div className="info-label">이메일</div>
											<div className="info-value">{selectedInquiry.email}</div>
										</div>
										<div className="info-item">
											<div className="info-label">전화번호</div>
											<div className="info-value">{selectedInquiry.phone}</div>
										</div>
										<div className="info-item">
											<div className="info-label">카테고리</div>
											<div className="info-value">
												{getCategoryInfo(selectedInquiry.category).icon}{' '}
												{getCategoryInfo(selectedInquiry.category).label}
											</div>
										</div>
										<div className="info-item">
											<div className="info-label">우선순위</div>
											<div
												className="info-value"
												style={{
													color: getPriorityInfo(selectedInquiry.priority).color,
												}}
											>
												{getPriorityInfo(selectedInquiry.priority).label}
											</div>
										</div>
										<div className="info-item">
											<div className="info-label">상태</div>
											<div className="info-value">
												<span
													className="badge"
													style={{
														backgroundColor: getStatusInfo(selectedInquiry.status).bg,
														color: getStatusInfo(selectedInquiry.status).color,
													}}
												>
													{getStatusInfo(selectedInquiry.status).label}
												</span>
											</div>
										</div>
									</Box>
									<Box className="status-actions">
										<Button className="btn btn-primary" onClick={() => updateStatus(selectedInquiry.id, 'in-progress')}>
											처리 중으로 변경
										</Button>
										<Button className="btn btn-success" onClick={() => updateStatus(selectedInquiry.id, 'resolved')}>
											해결됨으로 변경
										</Button>
										<Button className="btn btn-secondary" onClick={() => updateStatus(selectedInquiry.id, 'closed')}>
											종료
										</Button>
									</Box>
								</Box>

								<Box className="conversation">
									<Box className="message customer">
										<Box className="message-header">
											<div className="message-author">{selectedInquiry.customer}</div>
											<div className="message-date">{selectedInquiry.date}</div>
										</Box>
										<div className="message-content">{selectedInquiry.message}</div>
									</Box>

									{selectedInquiry.replies?.map((reply, idx) => (
										<Box key={idx} className={`message ${reply.isHost ? 'host' : 'customer'}`}>
											<Box className="message-header">
												<div className="message-author">{reply.author}</div>
												<div className="message-date">{reply.date}</div>
											</Box>
											<div className="message-content">{reply.message}</div>
										</Box>
									))}
								</Box>

								<Box className="reply-section">
									<div className="reply-title">고객에게 답장</div>
									<TextField
										className="reply-textarea"
										placeholder="답장을 입력하세요..."
										value={replyText}
										onChange={(e) => setReplyText(e.target.value)}
										multiline
										minRows={4}
										fullWidth
									/>
									<Box className="reply-actions">
										<Button className="btn btn-primary" onClick={handleSendReply}>
											📤 답장 보내기
										</Button>
										<Button className="btn btn-secondary" onClick={() => setReplyText('')}>
											취소
										</Button>
									</Box>
								</Box>
							</>
						) : (
							<Box className="empty-state">
								<div className="empty-icon">💬</div>
								<div className="empty-title">문의 내역을 선택하세요</div>
								<div className="empty-text">왼쪽 목록에서 문의를 선택하면 상세 내용과 답장을 작성할 수 있습니다.</div>
							</Box>
						)}
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
}
