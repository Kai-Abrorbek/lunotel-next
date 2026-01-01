import { useState } from 'react';

const PropertyManagement = () => {
	const [accommodations, setAccommodations] = useState([
		{
			id: 1,
			name: '강남 럭셔리 아파트',
			image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
			hostName: '김호스트',
			hostEmail: 'host1@example.com',
			hostPhone: '010-1234-5678',
			address: '서울시 강남구 테헤란로 123',
			status: 'pending',
			registeredDate: '2025-12-28',
		},
		{
			id: 2,
			name: '제주 오션뷰 펜션',
			image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80',
			hostName: '이민수',
			hostEmail: 'host2@example.com',
			hostPhone: '010-2345-6789',
			address: '제주특별자치도 제주시 해안로 456',
			status: 'approved',
			registeredDate: '2025-12-25',
		},
		{
			id: 3,
			name: '부산 해운대 호텔',
			image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
			hostName: '박지영',
			hostEmail: 'host3@example.com',
			hostPhone: '010-3456-7890',
			address: '부산광역시 해운대구 해운대로 789',
			status: 'pending',
			registeredDate: '2025-12-27',
		},
		{
			id: 4,
			name: '서울 홍대 게스트하우스',
			image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
			hostName: '최수진',
			hostEmail: 'host4@example.com',
			hostPhone: '010-4567-8901',
			address: '서울시 마포구 홍익로 321',
			status: 'rejected',
			registeredDate: '2025-12-26',
		},
		{
			id: 5,
			name: '경주 한옥 스테이',
			image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
			hostName: '정준호',
			hostEmail: 'host5@example.com',
			hostPhone: '010-5678-9012',
			address: '경상북도 경주시 첨성로 654',
			status: 'approved',
			registeredDate: '2025-12-24',
		},
	]);

	const [filterStatus, setFilterStatus] = useState('all');
	const [searchTerm, setSearchTerm] = useState('');

	const handleStatusChange = (id: number, newStatus: string) => {
		setAccommodations(accommodations.map((acc) => (acc.id === id ? { ...acc, status: newStatus } : acc)));
	};

	const handleApprove = (id: number) => {
		if (window.confirm('이 숙소를 승인하시겠습니까?')) {
			handleStatusChange(id, 'approved');
		}
	};

	const handleReject = (id: number) => {
		if (window.confirm('이 숙소를 거부하시겠습니까?')) {
			handleStatusChange(id, 'rejected');
		}
	};

	const handleDelete = (id: number) => {
		if (window.confirm('정말로 이 숙소를 삭제하시겠습니까?')) {
			setAccommodations(accommodations.filter((acc) => acc.id !== id));
		}
	};

	const filteredAccommodations = accommodations.filter((acc) => {
		const matchesSearch =
			acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			acc.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			acc.address.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesFilter = filterStatus === 'all' || acc.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	const getStatusLabel = (status: string) => {
		const labels: { [key: string]: string } = {
			pending: '승인 대기',
			approved: '승인됨',
			rejected: '거부됨',
		};
		return labels[status] || status;
	};

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">숙소 관리</h1>
				<p className="page-subtitle">전체 숙소 목록 및 승인 관리 ({filteredAccommodations.length}개)</p>
			</div>

			{/* Filters */}
			<div className="user-filters">
				<div className="search-box">
					<input
						type="text"
						placeholder="숙소명, 호스트명 또는 주소로 검색..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
				</div>
				<div className="filter-group">
					<label className="filter-label">상태 필터:</label>
					<select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="filter-select">
						<option value="all">전체</option>
						<option value="pending">승인 대기</option>
						<option value="approved">승인됨</option>
						<option value="rejected">거부됨</option>
					</select>
				</div>
			</div>

			{/* Accommodation List */}
			<div className="accommodation-list">
				{filteredAccommodations.map((acc) => (
					<div key={acc.id} className="accommodation-item">
						<div className="accommodation-image-wrapper">
							<img src={acc.image} alt={acc.name} className="accommodation-image" />
							<span className={`status-badge-overlay status-${acc.status}`}>{getStatusLabel(acc.status)}</span>
						</div>

						<div className="accommodation-content">
							<div className="accommodation-main">
								<h3 className="accommodation-name">{acc.name}</h3>
								<p className="accommodation-address">📍 {acc.address}</p>
							</div>

							<div className="accommodation-host-info">
								<div className="host-detail-row">
									<span className="detail-icon">👤</span>
									<div className="detail-text">
										<span className="detail-label">호스트</span>
										<span className="detail-value">{acc.hostName}</span>
									</div>
								</div>
								<div className="host-detail-row">
									<span className="detail-icon">📧</span>
									<div className="detail-text">
										<span className="detail-label">이메일</span>
										<span className="detail-value">{acc.hostEmail}</span>
									</div>
								</div>
								<div className="host-detail-row">
									<span className="detail-icon">📞</span>
									<div className="detail-text">
										<span className="detail-label">연락처</span>
										<span className="detail-value">{acc.hostPhone}</span>
									</div>
								</div>
								<div className="host-detail-row">
									<span className="detail-icon">📅</span>
									<div className="detail-text">
										<span className="detail-label">등록일</span>
										<span className="detail-value">{acc.registeredDate}</span>
									</div>
								</div>
							</div>
						</div>

						<div className="accommodation-actions">
							{acc.status === 'pending' && (
								<>
									<button className="btn-approve-large" onClick={() => handleApprove(acc.id)}>
										✓ 승인
									</button>
									<button className="btn-reject-large" onClick={() => handleReject(acc.id)}>
										✕ 거부
									</button>
								</>
							)}
							{acc.status === 'approved' && (
								<button className="btn-reject-large" onClick={() => handleReject(acc.id)}>
									승인 취소
								</button>
							)}
							{acc.status === 'rejected' && (
								<button className="btn-approve-large" onClick={() => handleApprove(acc.id)}>
									재승인
								</button>
							)}
							<button className="btn-delete-large" onClick={() => handleDelete(acc.id)}>
								삭제
							</button>
						</div>
					</div>
				))}
			</div>

			{filteredAccommodations.length === 0 && (
				<div className="empty-state">
					<p>검색 결과가 없습니다.</p>
				</div>
			)}
		</div>
	);
};

export default PropertyManagement;
