import { Home, Users, UserCheck, MessageSquare, Menu, X } from 'lucide-react';

const Dashboard = () => {
	// 실제로는 API에서 가져올 데이터
	const stats = [
		{
			id: 1,
			title: '전체 숙소',
			value: '1,234',
			change: '+12.5%',
			changeType: 'increase',
			icon: Home,
			color: '#3b82f6',
		},
		{
			id: 2,
			title: '전체 유저',
			value: '45,678',
			change: '+8.2%',
			changeType: 'increase',
			icon: Users,
			color: '#8b5cf6',
		},
		{
			id: 3,
			title: '전체 호스트',
			value: '892',
			change: '+5.1%',
			changeType: 'increase',
			icon: UserCheck,
			color: '#ec4899',
		},
		{
			id: 4,
			title: '이번 달 매출',
			value: '₩128,456,000',
			change: '+15.3%',
			changeType: 'increase',
			icon: MessageSquare,
			color: '#10b981',
		},
	];

	const systemAlerts = [
		{ id: 1, type: 'report', message: '숙소 "강남 럭셔리 아파트" 신고 접수', severity: 'high', time: '10분 전' },
		{ id: 2, type: 'payment', message: '결제 오류 5건 발생', severity: 'high', time: '25분 전' },
		{ id: 3, type: 'approval', message: '호스트 승인 대기 12건', severity: 'medium', time: '1시간 전' },
		{ id: 4, type: 'user', message: '유저 "user1234" 탈퇴 요청', severity: 'low', time: '2시간 전' },
	];

	const pendingHosts = [
		{ id: 1, name: '김호스트', email: 'host1@example.com', submitDate: '2025-12-28', accommodations: 3 },
		{ id: 2, name: '이민수', email: 'host2@example.com', submitDate: '2025-12-27', accommodations: 1 },
		{ id: 3, name: '박지영', email: 'host3@example.com', submitDate: '2025-12-27', accommodations: 2 },
		{ id: 4, name: '최수진', email: 'host4@example.com', submitDate: '2025-12-26', accommodations: 5 },
	];

	const recentUsers = [
		{ id: 1, name: '김유저', email: 'user1@example.com', joinDate: '2025-12-29', status: 'active' },
		{ id: 2, name: '이철수', email: 'user2@example.com', joinDate: '2025-12-29', status: 'active' },
		{ id: 3, name: '박영희', email: 'user3@example.com', joinDate: '2025-12-28', status: 'pending' },
		{ id: 4, name: '최민지', email: 'user4@example.com', joinDate: '2025-12-28', status: 'active' },
		{ id: 5, name: '정준호', email: 'user5@example.com', joinDate: '2025-12-27', status: 'active' },
	];

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">대시보드</h1>
				<p className="page-subtitle">숙소, 유저, 호스트 현황 및 매출 분석</p>
			</div>

			{/* Stats Cards */}
			<div className="stats-grid">
				{stats.map((stat) => {
					const IconComponent = stat.icon;
					return (
						<div key={stat.id} className="stat-card">
							<div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
								<IconComponent size={28} style={{ color: stat.color }} />
							</div>
							<div className="stat-content">
								<p className="stat-title">{stat.title}</p>
								<h2 className="stat-value">{stat.value}</h2>
								<div className={`stat-change ${stat.changeType}`}>
									<span>{stat.change}</span>
									<span className="stat-period">지난 달 대비</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>

			{/* System Alerts */}
			<div className="recent-section">
				<div className="section-header">
					<h3 className="section-title">🚨 시스템 알림</h3>
					<button className="view-all-btn">전체 보기</button>
				</div>
				<div className="alerts-list">
					{systemAlerts.map((alert) => (
						<div key={alert.id} className={`alert-item severity-${alert.severity}`}>
							<div className="alert-indicator"></div>
							<div className="alert-content">
								<p className="alert-message">{alert.message}</p>
								<span className="alert-time">{alert.time}</span>
							</div>
							<button className="alert-action-btn">확인</button>
						</div>
					))}
				</div>
			</div>

			{/* Pending Hosts Approval */}
			<div className="recent-section">
				<div className="section-header">
					<h3 className="section-title">✋ 호스트 승인 대기</h3>
					<span className="badge">{pendingHosts.length}건</span>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>이름</th>
								<th>이메일</th>
								<th>신청일</th>
								<th>숙소 수</th>
								<th>액션</th>
							</tr>
						</thead>
						<tbody>
							{pendingHosts.map((host) => (
								<tr key={host.id}>
									<td>{host.name}</td>
									<td>{host.email}</td>
									<td>{host.submitDate}</td>
									<td>
										<span className="badge-small">{host.accommodations}개</span>
									</td>
									<td>
										<div className="action-buttons">
											<button className="btn-approve">승인</button>
											<button className="btn-reject">거절</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Recent Users */}
			<div className="recent-section">
				<div className="section-header">
					<h3 className="section-title">👥 최근 가입 유저</h3>
					<button className="view-all-btn">전체 보기</button>
				</div>
				<div className="table-container">
					<table className="data-table">
						<thead>
							<tr>
								<th>이름</th>
								<th>이메일</th>
								<th>가입일</th>
								<th>상태</th>
							</tr>
						</thead>
						<tbody>
							{recentUsers.map((user) => (
								<tr key={user.id}>
									<td>{user.name}</td>
									<td>{user.email}</td>
									<td>{user.joinDate}</td>
									<td>
										<span className={`status-badge status-${user.status}`}>
											{user.status === 'active' ? '활성' : '대기'}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* Sales Chart Placeholder */}
			<div className="chart-section">
				<div className="section-header">
					<h3 className="section-title">월별 매출 분석</h3>
				</div>
				<div className="chart-placeholder">
					<div className="chart-bar" style={{ height: '60%' }}>
						<span className="chart-label">1월</span>
					</div>
					<div className="chart-bar" style={{ height: '75%' }}>
						<span className="chart-label">2월</span>
					</div>
					<div className="chart-bar" style={{ height: '55%' }}>
						<span className="chart-label">3월</span>
					</div>
					<div className="chart-bar" style={{ height: '80%' }}>
						<span className="chart-label">4월</span>
					</div>
					<div className="chart-bar" style={{ height: '70%' }}>
						<span className="chart-label">5월</span>
					</div>
					<div className="chart-bar" style={{ height: '90%' }}>
						<span className="chart-label">6월</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
