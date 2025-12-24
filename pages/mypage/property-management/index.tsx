import React, { useState, ChangeEvent, useEffect } from 'react';
import { Box, Button, Tabs, Tab, TextField, Grid, Paper, Chip, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import Link from 'next/link';
import PropertyUpdateModal from '../../../libs/components/mypage/property-management/PropertyUpdateData ';
import { AgentPropertiesInquiry } from '../../../libs/types/property/property.input';
import { PropertyStatus } from '../../../libs/enums/property.enum';
import { Property } from '../../../libs/types/property/property';
import PropertyAddModal from '../../../libs/components/mypage/property-management/PropertyAddData';
import { GET_AGENT_PROPERTIES } from '../../../apollo/user/query';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';

type TabKey = 'all' | PropertyStatus;

const PropertyManagementPage = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [selectedTab, setSelectedTab] = useState<TabKey>('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [addPropertyOpen, setAddPropertyOpen] = useState<boolean>(false);
	const [updatePropertyOpen, setUpdatePropertyOpen] = useState<boolean>(false);
	const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
	const [properties, setProperties] = useState<Property[]>([]);

	/** APOLLO REQUEST **/
	const {
		loading: getMyPropertiesLoading,
		data: getMyPropertiesData,
		error: getMyPropertiesError,
		refetch: getMyPropertiesRefetch,
	} = useQuery(GET_AGENT_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 10,
				sort: 'createdAt',
				direction: 'DESC',
				search: {},
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !user._id,
	});

	useEffect(() => {
		if (getMyPropertiesData?.getAgentProperties?.list.length !== 0) {
			setProperties(getMyPropertiesData?.getAgentProperties?.list);
		}
	}, [getMyPropertiesData]);

	const handleTabChange = (_: React.SyntheticEvent, value: TabKey) => {
		setSelectedTab(value);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredProperties = properties?.filter((property) => {
		const matchesTab = selectedTab === 'all' || property.propertyStatus === selectedTab;
		const lower = searchTerm.toLowerCase();
		const matchesSearch =
			property?.propertyName!.toLowerCase().includes(lower) || property?.propertyAddress!.toLowerCase().includes(lower);
		return matchesTab && matchesSearch;
	});

	const getStatusColor = (status: PropertyStatus) => {
		switch (status) {
			case PropertyStatus.ACTIVE:
				return '#10b981';
			case PropertyStatus.DRAFT:
				return '#f59e0b';
			case PropertyStatus.INACTIVE:
				return '#ef4444';
			default:
				return '#6b7280';
		}
	};

	const formatCurrency = (amount: number) => {
		return `₩${amount?.toLocaleString()}`;
	};

	const totalBookings = properties?.reduce((acc, p) => acc + p.propertyReservations!, 0);
	const totalRevenue = properties
		?.flatMap((p) => p.reservationData || [])
		.reduce((acc, r) => acc + (r.reservationTotalPrice || 0), 0);

	const operatingCount = properties?.filter((p) => p.propertyStatus === PropertyStatus.ACTIVE).length;
	const waitingCount = properties?.filter((p) => p.propertyStatus === PropertyStatus.DRAFT).length;
	const stoppedCount = properties?.filter((p) => p.propertyStatus === PropertyStatus.INACTIVE).length;

	const handleOpenUpdatePropertyModal = async (property: Property) => {
		setUpdatePropertyOpen(true);
		setSelectedProperty(property);
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
					<PropertyAddModal
						isOpen={addPropertyOpen}
						setIsOpen={setAddPropertyOpen}
						getMyPropertiesRefetch={getMyPropertiesRefetch}
					/>
				</Box>

				{/* 상단 통계 카드 4개 */}
				<Grid container spacing={2} className="property-page__stats-grid">
					<Grid item xs={12} sm={6} md={3}>
						<Paper className="property-page__stat-card" elevation={0}>
							<p className="property-page__stat-label">전체 숙소</p>
							<p className="property-page__stat-value">{properties?.length}</p>
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
							<Tab label={`전체 (${properties?.length})`} value="all" className="property-page__tab" />
							<Tab label={`운영중 (${operatingCount})`} value={PropertyStatus.ACTIVE} className="property-page__tab" />
							<Tab label={`대기중 (${waitingCount})`} value={PropertyStatus.DRAFT} className="property-page__tab" />
							<Tab label={`중지 (${stoppedCount})`} value={PropertyStatus.INACTIVE} className="property-page__tab" />
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
				{filteredProperties?.length > 0 ? (
					<Box className="property-page__cards-grid">
						{filteredProperties?.map((property, index) => (
							<Box key={index} className="property-card">
								<Box className="property-card__image">
									<img src={`${process.env.REACT_APP_API_URL}/${property?.propertyImages?.[0]}`} alt="" />
								</Box>

								<Box className="property-card__body">
									<Box className="property-card__header">
										<Box>
											<p className="property-card__title">{property.propertyName}</p>
											<p className="property-card__type">{property.propertyType}</p>
										</Box>
										<Chip
											className="property-card__status"
											label={property.propertyStatus}
											style={{
												backgroundColor: getStatusColor(property.propertyStatus!),
												color: '#fff',
											}}
											size="small"
										/>
									</Box>

									<Box className="property-card__address">
										<span>📍</span>
										<p>{property.propertyAddress}</p>
									</Box>

									{property.propertyRank! > 0 && (
										<Box className="property-card__rating">
											<StarIcon fontSize="small" />
											<p>{property.propertyRank!.toFixed(1)}</p>
										</Box>
									)}

									<Box className="property-card__stats">
										<Box className="property-card__stat">
											<p className="property-card__stat-label">객실 수</p>
											<p className="property-card__stat-value">{property.propertyRooms}개</p>
										</Box>
										<Box className="property-card__stat">
											<p className="property-card__stat-label">이번 달 예약</p>
											<p className="property-card__stat-value">{property.propertyReservations}건</p>
										</Box>
										<Box className="property-card__stat">
											<p className="property-card__stat-label">이번 달 매출</p>
											<p className="property-card__stat-value">
												{formatCurrency(
													property.reservationData?.reduce((acc, r) => acc + (r.reservationTotalPrice || 0), 0)!,
												)}
											</p>
										</Box>
										<Box className="property-card__stat">
											<p className="property-card__stat-label">가동률</p>
											<p className="property-card__stat-value">
												{property.propertyStatus === PropertyStatus.ACTIVE
													? `${Math.round((property.propertyReservations! ?? 0 / property?.propertyRooms!) * 100)}%`
													: '-'}
											</p>
										</Box>
									</Box>

									<Box className="property-card__actions">
										<Button variant="outlined" size="small" className="property-card__action-btn">
											상세보기
										</Button>
										<Button
											onClick={() => handleOpenUpdatePropertyModal(property)}
											variant="outlined"
											size="small"
											className="property-card__action-btn"
										>
											수정
										</Button>
										<Link href={`/mypage/property-management/deshboard?category=dashboard&propertyId=${property._id}`}>
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
						<Box>
							{selectedProperty && (
								<PropertyUpdateModal
									isOpen={updatePropertyOpen}
									setIsOpen={setUpdatePropertyOpen}
									selectedProperty={selectedProperty!}
									getMyPropertiesRefetch={getMyPropertiesRefetch}
								/>
							)}
						</Box>
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
