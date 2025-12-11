import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Tabs, Tab, TextField, Grid, Paper, Chip, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import Link from 'next/link';
import AddPropertyModal from '../../../libs/components/mypage/property-management/AddPropertyModal';
import PropertyUpdateModal from '../../../libs/components/mypage/property-management/PropertyUpdateData ';
import { AgentPropertiesInquiry } from '../../../libs/types/property/property.input';

type PropertyStatus = '운영중' | '대기중' | '중지' | '차단';

interface Property {
	id: number;
	name: string;
	type: string;
	address: string;
	status: PropertyStatus;
	rooms: number;
	bookings: number;
	revenue: number;
	rating: number;
	image: string;
}

type TabKey = 'all' | PropertyStatus;

interface PropertyManagementPageProps {
	initialInput: AgentPropertiesInquiry;
}

const PropertyManagementPage = (props: PropertyManagementPageProps) => {
	const { initialInput } = props;
	const [selectedTab, setSelectedTab] = useState<TabKey>('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [addPropertyOpen, setAddPropertyOpen] = useState<boolean>(false);
	const [updatePropertyOpen, setUpdatePropertyOpen] = useState<boolean>(false);
	const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);
	const [properties] = useState<Property[]>([
		{
			id: 1,
			name: '서울 호텔 명동',
			type: '호텔',
			address: '서울시 중구 명동길 123',
			status: '운영중',
			rooms: 45,
			bookings: 38,
			revenue: 15420000,
			rating: 4.8,
			image: '',
		},
		{
			id: 2,
			name: '강남 비즈니스 호텔',
			type: '호텔',
			address: '서울시 강남구 테헤란로 456',
			status: '운영중',
			rooms: 62,
			bookings: 55,
			revenue: 22800000,
			rating: 4.6,
			image: '',
		},
		{
			id: 3,
			name: '제주 오션뷰 펜션',
			type: '펜션',
			address: '제주도 서귀포시 해안로 789',
			status: '대기중',
			rooms: 12,
			bookings: 0,
			revenue: 0,
			rating: 0,
			image: '',
		},
		{
			id: 4,
			name: '부산 해운대 모텔',
			type: '모텔',
			address: '부산시 해운대구 해변로 321',
			status: '운영중',
			rooms: 28,
			bookings: 24,
			revenue: 8950000,
			rating: 4.4,
			image: '',
		},
		{
			id: 5,
			name: '홍대 게스트하우스',
			type: '게스트하우스',
			address: '서울시 마포구 홍익로 147',
			status: '중지',
			rooms: 15,
			bookings: 0,
			revenue: 0,
			rating: 4.2,
			image: '',
		},
	]);

	const handleTabChange = (_: React.SyntheticEvent, value: TabKey) => {
		setSelectedTab(value);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredProperties = properties.filter((property) => {
		const matchesTab = selectedTab === 'all' || property.status === selectedTab;
		const lower = searchTerm.toLowerCase();
		const matchesSearch = property.name.toLowerCase().includes(lower) || property.address.toLowerCase().includes(lower);
		return matchesTab && matchesSearch;
	});

	const getStatusColor = (status: PropertyStatus) => {
		switch (status) {
			case '운영중':
				return '#10b981';
			case '대기중':
				return '#f59e0b';
			case '중지':
				return '#ef4444';
			default:
				return '#6b7280';
		}
	};

	const formatCurrency = (amount: number) => {
		return `₩${amount.toLocaleString()}`;
	};

	const totalBookings = properties.reduce((acc, p) => acc + p.bookings, 0);
	const totalRevenue = properties.reduce((acc, p) => acc + p.revenue, 0);

	const operatingCount = properties.filter((p) => p.status === '운영중').length;
	const waitingCount = properties.filter((p) => p.status === '대기중').length;
	const stoppedCount = properties.filter((p) => p.status === '중지').length;

	const handleOpenUpdatePropertyModal = (propertyId: number) => {
		setUpdatePropertyOpen(true);
		setSelectedPropertyId(propertyId);
	};
	return (
		<Box className="property-page">
			{/* 메인 컨테이너 */}
			<Stack className="container">
				{/* 타이틀 + 새 숙소 버튼 */}
				<Box className="property-page__header">
					<h1 className="property-page__title">숙소 관리</h1>
					<Button variant="contained" className="property-page__add-button" onClick={() => setAddPropertyOpen(true)}>
						+ 새 숙소 등록
					</Button>
					<AddPropertyModal open={addPropertyOpen} onClose={setAddPropertyOpen} />
				</Box>

				{/* 상단 통계 카드 4개 */}
				<Grid container spacing={2} className="property-page__stats-grid">
					<Grid item xs={12} sm={6} md={3}>
						<Paper className="property-page__stat-card" elevation={0}>
							<p className="property-page__stat-label">전체 숙소</p>
							<p className="property-page__stat-value">{properties.length}</p>
							<p className="property-page__stat-change property-page__stat-change--positive">↑ 2개 증가</p>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Paper className="property-page__stat-card" elevation={0}>
							<p className="property-page__stat-label">운영중 숙소</p>
							<p className="property-page__stat-value">{operatingCount}</p>
							<p className="property-page__stat-change property-page__stat-change--positive">↑ 1개 증가</p>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Paper className="property-page__stat-card" elevation={0}>
							<p className="property-page__stat-label">이번 달 예약</p>
							<p className="property-page__stat-value">{totalBookings}</p>
							<p className="property-page__stat-change property-page__stat-change--positive">↑ 12% 증가</p>
						</Paper>
					</Grid>
					<Grid item xs={12} sm={6} md={3}>
						<Paper className="property-page__stat-card" elevation={0}>
							<p className="property-page__stat-label">이번 달 매출</p>
							<p className="property-page__stat-value">{formatCurrency(totalRevenue)}</p>
							<p className="property-page__stat-change property-page__stat-change--positive">↑ 8% 증가</p>
						</Paper>
					</Grid>
				</Grid>

				{/* 탭 + 검색 박스 영역 */}
				<Paper elevation={0} className="property-page__controls">
					<Box className="property-page__tabs-row">
						<Tabs
							value={selectedTab}
							onChange={handleTabChange}
							className="property-page__tabs"
							variant="scrollable"
							scrollButtons="auto"
						>
							<Tab label={`전체 (${properties.length})`} value="all" className="property-page__tab" />
							<Tab label={`운영중 (${operatingCount})`} value="운영중" className="property-page__tab" />
							<Tab label={`대기중 (${waitingCount})`} value="대기중" className="property-page__tab" />
							<Tab label={`중지 (${stoppedCount})`} value="중지" className="property-page__tab" />
						</Tabs>
					</Box>

					<Box className="property-page__search-box">
						<TextField
							fullWidth
							size="small"
							value={searchTerm}
							onChange={handleSearchChange}
							placeholder="숙소명 또는 주소로 검색..."
							InputProps={{
								startAdornment: (
									<IconButton edge="start" disableRipple className="property-page__search-icon">
										<SearchIcon />
									</IconButton>
								),
							}}
						/>
					</Box>
				</Paper>

				{/* 숙소 카드 리스트 */}
				{filteredProperties.length > 0 ? (
					<Box className="property-page__cards-grid">
						{filteredProperties.map((property, index) => (
							<Box key={index} className="property-card">
								<Box className="property-card__image">
									<img
										src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
										alt=""
									/>
								</Box>

								<Box className="property-card__body">
									<Box className="property-card__header">
										<Box>
											<p className="property-card__title">{property.name}</p>
											<p className="property-card__type">{property.type}</p>
										</Box>
										<Chip
											className="property-card__status"
											label={property.status}
											style={{
												backgroundColor: getStatusColor(property.status),
												color: '#fff',
											}}
											size="small"
										/>
									</Box>

									<Box className="property-card__address">
										<span>📍</span>
										<p>{property.address}</p>
									</Box>

									{property.rating > 0 && (
										<Box className="property-card__rating">
											<StarIcon fontSize="small" />
											<p>{property.rating.toFixed(1)}</p>
										</Box>
									)}

									<Box className="property-card__stats">
										<Box className="property-card__stat">
											<p className="property-card__stat-label">객실 수</p>
											<p className="property-card__stat-value">{property.rooms}개</p>
										</Box>
										<Box className="property-card__stat">
											<p className="property-card__stat-label">이번 달 예약</p>
											<p className="property-card__stat-value">{property.bookings}건</p>
										</Box>
										<Box className="property-card__stat">
											<p className="property-card__stat-label">이번 달 매출</p>
											<p className="property-card__stat-value">{formatCurrency(property.revenue)}</p>
										</Box>
										<Box className="property-card__stat">
											<p className="property-card__stat-label">가동률</p>
											<p className="property-card__stat-value">
												{property.status === '운영중'
													? `${Math.round((property.bookings / property.rooms) * 100)}%`
													: '-'}
											</p>
										</Box>
									</Box>

									<Box className="property-card__actions">
										<Button variant="outlined" size="small" className="property-card__action-btn">
											상세보기
										</Button>
										<Button
											onClick={() => handleOpenUpdatePropertyModal(property.id)}
											variant="outlined"
											size="small"
											className="property-card__action-btn"
										>
											수정
										</Button>
										<Link href={`/mypage/property-management/deshboard?propertyId=${property.name}`}>
											<Button
												variant="contained"
												size="small"
												className="property-card__action-btn property-card__action-btn--primary"
											>
												대시보드
											</Button>
										</Link>
									</Box>
								</Box>
							</Box>
						))}
						<PropertyUpdateModal
							isOpen={updatePropertyOpen}
							setIsOpen={setUpdatePropertyOpen}
							selectedPropertyId={selectedPropertyId!}
							setSelectedPropertyId={setSelectedPropertyId}
						/>
						!
					</Box>
				) : (
					<Paper elevation={0} className="property-page__empty">
						<p className="property-page__empty-icon">🏨</p>
						<p className="property-page__empty-title">검색 결과가 없습니다</p>
						<p className="property-page__empty-description">다른 검색어로 시도해보세요.</p>
					</Paper>
				)}
			</Stack>
		</Box>
	);
};

PropertyManagementPage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default LayoutHome(PropertyManagementPage);
