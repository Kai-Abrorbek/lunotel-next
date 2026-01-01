import { useState } from 'react';

// UserManagement 컴포넌트
const UserManagement = () => {
	const [users, setUsers] = useState([
		{
			id: 1,
			name: '김철수',
			email: 'kim@example.com',
			phone: '010-1234-5678',
			joinDate: '2025-01-15',
			status: 'active',
			role: 'user',
		},
		{
			id: 2,
			name: '이영희',
			email: 'lee@example.com',
			phone: '010-2345-6789',
			joinDate: '2025-02-20',
			status: 'active',
			role: 'host',
		},
		{
			id: 3,
			name: '박민수',
			email: 'park@example.com',
			phone: '010-3456-7890',
			joinDate: '2025-03-10',
			status: 'suspended',
			role: 'user',
		},
		{
			id: 4,
			name: '최지은',
			email: 'choi@example.com',
			phone: '010-4567-8901',
			joinDate: '2025-04-05',
			status: 'active',
			role: 'user',
		},
		{
			id: 5,
			name: '정수진',
			email: 'jung@example.com',
			phone: '010-5678-9012',
			joinDate: '2025-05-12',
			status: 'inactive',
			role: 'host',
		},
		{
			id: 6,
			name: '강호동',
			email: 'kang@example.com',
			phone: '010-6789-0123',
			joinDate: '2025-06-18',
			status: 'active',
			role: 'user',
		},
		{
			id: 7,
			name: '유재석',
			email: 'yoo@example.com',
			phone: '010-7890-1234',
			joinDate: '2025-07-22',
			status: 'active',
			role: 'host',
		},
		{
			id: 8,
			name: '송지효',
			email: 'song@example.com',
			phone: '010-8901-2345',
			joinDate: '2025-08-30',
			status: 'suspended',
			role: 'user',
		},
	]);

	const [searchTerm, setSearchTerm] = useState('');
	const [filterStatus, setFilterStatus] = useState('all');

	const handleStatusChange = (userId: number, newStatus: string) => {
		setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)));
	};

	const handleDeleteUser = (userId: number) => {
		if (window.confirm('정말로 이 유저를 삭제하시겠습니까?')) {
			setUsers(users.filter((user) => user.id !== userId));
		}
	};

	const filteredUsers = users.filter((user) => {
		const matchesSearch =
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const getStatusLabel = (status: string) => {
		const labels: { [key: string]: string } = {
			active: '활성',
			inactive: '비활성',
			suspended: '정지됨',
		};
		return labels[status] || status;
	};

	const getRoleLabel = (role: string) => {
		const labels: { [key: string]: string } = {
			user: '일반 유저',
			host: '호스트',
		};
		return labels[role] || role;
	};

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">유저 관리</h1>
				<p className="page-subtitle">전체 유저 목록 및 상태 관리 ({filteredUsers.length}명)</p>
			</div>

			{/* Filters */}
			<div className="user-filters">
				<div className="search-box">
					<input
						type="text"
						placeholder="이름 또는 이메일로 검색..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
				</div>
				<div className="filter-group">
					<label className="filter-label">상태 필터:</label>
					<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
						<option value="all">전체</option>
						<option value="active">활성</option>
						<option value="inactive">비활성</option>
						<option value="suspended">정지됨</option>
					</select>
				</div>
			</div>

			{/* User List */}
			<div className="user-list-container">
				<table className="user-table">
					<thead>
						<tr>
							<th>유저</th>
							<th>역할</th>
							<th>이메일</th>
							<th>전화번호</th>
							<th>가입일</th>
							<th>상태</th>
							<th>액션</th>
						</tr>
					</thead>
					<tbody>
						{filteredUsers.map((user) => (
							<tr key={user.id} className="user-row">
								<td>
									<div className="user-cell">
										<div className="user-avatar-small">{user.name.charAt(0)}</div>
										<span className="user-name-text">{user.name}</span>
									</div>
								</td>
								<td>
									<span className={`role-badge-small role-${user.role}`}>{getRoleLabel(user.role)}</span>
								</td>
								<td className="email-cell">{user.email}</td>
								<td>{user.phone}</td>
								<td>{user.joinDate}</td>
								<td>
									<select
										value={user.status}
										onChange={(e) => handleStatusChange(user.id, e.target.value)}
										className={`status-select-inline status-${user.status}`}
									>
										<option value="active">활성</option>
										<option value="inactive">비활성</option>
										<option value="suspended">정지됨</option>
									</select>
								</td>
								<td>
									<button className="delete-btn-small" onClick={() => handleDeleteUser(user.id)}>
										삭제
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{filteredUsers.length === 0 && (
				<div className="empty-state">
					<p>검색 결과가 없습니다.</p>
				</div>
			)}
		</div>
	);
};

export default UserManagement;
