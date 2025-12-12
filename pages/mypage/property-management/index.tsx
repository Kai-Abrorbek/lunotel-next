import React, { useState, ChangeEvent } from 'react';
import { Box, Button, Tabs, Tab, TextField, Grid, Paper, Chip, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import Link from 'next/link';
import PropertyUpdateModal from '../../../libs/components/mypage/property-management/PropertyUpdateData ';
import { AgentPropertiesInquiry } from '../../../libs/types/property/property.input';
import {
	PropertyAmenity,
	PropertyLocation,
	PropertyOtherAmenity,
	PropertyStatus,
	PropertyStatusKorean,
	PropertyType,
} from '../../../libs/enums/property.enum';
import { Properties } from '../../../libs/types/property/property';
import { MemberAuthType, MemberStatus, MemberType } from '../../../libs/enums/member.enum';
import { ReservationStatus } from '../../../libs/enums/reservation';
import PropertyAddModal from '../../../libs/components/mypage/property-management/PropertyAddData';

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
	const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
	const [properties, setProperties] = useState<Properties>({
		list: [
			{
				_id: '6913f550384947fd65c52c03',
				propertyType: 'MOTEL' as PropertyType,
				propertyStatus: 'ACTIVE' as PropertyStatus,
				propertyLocation: 'SEOUL' as PropertyLocation,
				propertyAddress: '서울 광진구 화양동 23-15',
				propertyName: '건대 호텔 더디자이너스 프리미어 성수&건대',
				propertyPrice: 85500,
				propertyRooms: 1,
				propertyViews: 1,
				propertyLikes: 0,
				propertyComments: 0,
				propertyReservations: 7,
				propertyRank: 0,
				propertyStars: 5,
				propertyImages: [
					'uploads/property/0cb5c9ca-ad9a-4ffb-857f-a336d328b925.webp',
					'uploads/property/a1d591a7-cc93-4bad-8749-9ee6d4785a7f.webp',
					'uploads/property/33dd0d49-2c30-4d07-a33f-bd621fcbc65e.webp',
					'uploads/property/75daa390-ba80-47de-a6e9-7c0198fe2e0f.webp',
				],
				propertyAmenities: ['SPA', 'RESTAURANT', 'FINTESS', 'TV', 'CONDITIONER', 'NON_SMOKING'] as PropertyAmenity[],
				// propertyOtherAmenities: ['FREE_PARKING', 'PETS_ALLOWED', 'IN_ROOM_COOKING'] as PropertyOtherAmenity[],
				propertyDesc: '',
				memberId: '691032f99a16f7c754992c9d',
				soldAt: false,
				// createdAt: '2025-11-12T02:47:44.370Z',
				// updatedAt: '2025-11-12T18:58:13.955Z',
				// roomCount: null,
				memberData: {
					_id: '691032f99a16f7c754992c9d',
					memberType: 'AGENT' as MemberType,
					memberStatus: 'ACTIVE' as MemberStatus,
					memberAuthType: 'PHONE' as MemberAuthType,
					memberPhone: '01082108332',
					memberNick: 'Justin',
					memberEmail: 'jusitn@gmail.com',
					memberFullName: '',
					memberImage: 'uploads/member/fc47481b-1367-4ce9-b21b-9f6c76ae5303.jpg',
					memberAddress: '',
					memberDesc: '',
					memberProperties: 5,
					memberComments: 0,
					memberPoints: 0,
					memberWarnings: 0,
					memberBlocks: 0,
					// deletedAt: '',
					// createdAt: '2025-11-09T06:21:45.171Z',
					// updatedAt: '2025-11-12T02:47:44.396Z',
					accessToken: '',
				},
				reservationData: [
					{
						_id: '691a96023a1bbd53947a41db',
						memberId: 'null',
						propertyId: '6913f550384947fd65c52c03',
						roomTypeId: '6913f5f1384947fd65c52c06',
						stayPlanId: '6913f5f1384947fd65c52c09',
						reservationStatus: 'PENDING' as ReservationStatus,
						reservationQty: 1,
						reservationTotalPrice: 342000,
						reservationCheckIn: '2025-11-19',
						reservationCheckOut: '2025-11-23',
						reservationDate: '2025-11-19',
						reservationCheckInAt: '14:00',
						reservationCheckOutAt: '11:00',
						// createdAt: '2025-11-17T03:26:58.164Z',
						// updatedAt: '2025-11-17T03:56:00.143Z',
					},
					{
						_id: '6914b936651f20898fce7c9e',
						memberId: '690ceead4c60ff2014613937',
						propertyId: '6913f550384947fd65c52c03',
						roomTypeId: '6913f5f1384947fd65c52c06',
						stayPlanId: '6913f5f1384947fd65c52c09',
						reservationStatus: 'CANCELLED' as ReservationStatus,
						reservationQty: 1,
						reservationTotalPrice: 85500,
						reservationCheckIn: '2025-11-22',
						reservationCheckOut: '2025-11-23',
						reservationDate: '2025-11-22',
						reservationCheckInAt: '14:00',
						reservationCheckOutAt: '11:00',
						// createdAt: '2025-11-12T16:43:34.215Z',
						// updatedAt: '2025-12-10T11:08:37.583Z',
					},
					{
						_id: '691a88ec56038647791c0ccd',
						memberId: '690cf0a4838de13ecc016982',
						propertyId: '6913f550384947fd65c52c03',
						roomTypeId: '6913f5f1384947fd65c52c06',
						stayPlanId: '6913f5f1384947fd65c52c09',
						reservationStatus: 'PENDING' as ReservationStatus,
						reservationQty: 1,
						reservationTotalPrice: 85500,
						reservationCheckIn: '2025-11-22',
						reservationCheckOut: '2025-11-23',
						reservationDate: '2025-11-22',
						reservationCheckInAt: '14:00',
						reservationCheckOutAt: '11:00',
						// createdAt: '2025-11-17T02:31:08.685Z',
						// updatedAt: '2025-11-17T02:31:08.685Z',
					},
					{
						_id: '691a8a814cb71093bb4c88be',
						memberId: '690cf0a4838de13ecc016982',
						propertyId: '6913f550384947fd65c52c03',
						roomTypeId: '6913f5f1384947fd65c52c06',
						stayPlanId: '6913f5f1384947fd65c52c09',
						reservationStatus: 'PENDING' as ReservationStatus,
						reservationQty: 1,
						reservationTotalPrice: 85500,
						reservationCheckIn: '2025-11-22',
						reservationCheckOut: '2025-11-23',
						reservationDate: '2025-11-22',
						reservationCheckInAt: '14:00',
						reservationCheckOutAt: '11:00',
						// createdAt: '2025-11-17T02:37:53.474Z',
						// updatedAt: '2025-11-17T02:37:53.474Z',
					},
					{
						_id: '691a920dd9d778033d7e6fc1',
						memberId: 'null',
						propertyId: '6913f550384947fd65c52c03',
						roomTypeId: '6913f5f1384947fd65c52c06',
						stayPlanId: '6913f5f1384947fd65c52c09',
						reservationStatus: 'PENDING' as ReservationStatus,
						reservationQty: 1,
						reservationTotalPrice: 85500,
						reservationCheckIn: '2025-11-22',
						reservationCheckOut: '2025-11-23',
						reservationDate: '2025-11-22',
						reservationCheckInAt: '14:00',
						reservationCheckOutAt: '11:00',
						// createdAt: '2025-11-17T03:10:05.227Z',
						// updatedAt: '2025-11-17T03:10:05.227Z',
					},
					{
						_id: '691a955a3a1bbd53947a41c9',
						memberId: 'null',
						propertyId: '6913f550384947fd65c52c03',
						roomTypeId: '6913f5f1384947fd65c52c06',
						stayPlanId: '6913f5f1384947fd65c52c09',
						reservationStatus: 'PENDING' as ReservationStatus,
						reservationQty: 1,
						reservationTotalPrice: 342000,
						reservationCheckIn: '2025-11-22',
						reservationCheckOut: '2025-11-26',
						reservationDate: '2025-11-22',
						reservationCheckInAt: '14:00',
						reservationCheckOutAt: '11:00',
						// createdAt: '2025-11-17T03:24:10.560Z',
						// updatedAt: '2025-11-17T03:24:10.560Z',
					},
					{
						_id: '691aa97be5de018847677e09',
						memberId: '690cf0a4838de13ecc016982',
						propertyId: '6913f550384947fd65c52c03',
						roomTypeId: '6913f5f1384947fd65c52c06',
						stayPlanId: '6913f5f1384947fd65c52c09',
						reservationStatus: 'PENDING' as ReservationStatus,
						reservationQty: 1,
						reservationTotalPrice: 256500,
						reservationCheckIn: '2025-11-22',
						reservationCheckOut: '2025-11-26',
						reservationDate: '2025-11-22',
						reservationCheckInAt: '14:00',
						reservationCheckOutAt: '11:00',
						// createdAt: '2025-11-17T04:50:03.401Z',
						// updatedAt: '2025-11-17T04:50:03.401Z',
					},
				],
			},
			{
				_id: '69128c13777d98b25e2ad01f',
				propertyType: 'MOTEL' as PropertyType,
				propertyStatus: 'ACTIVE' as PropertyStatus,
				propertyLocation: 'SEOUL' as PropertyLocation,
				propertyAddress: '서울 강동구 길동 387-7',
				propertyName: '길동 MARI-마리',
				propertyPrice: 41000,
				propertyRooms: 4,
				propertyViews: 3,
				propertyLikes: 1,
				propertyComments: 3,
				propertyReservations: 0,
				propertyRank: 0,
				propertyStars: 3,
				propertyImages: [
					'uploads/property/377e5702-55e3-41af-9e85-8693fa065a90.webp',
					'uploads/property/5935349c-d554-49cf-ab49-6492d6ef24ef.webp',
					'uploads/property/d841d9c5-3028-42a1-9cbe-a1d5b5f021aa.webp',
					'uploads/property/9acdaf31-e752-4cb9-8814-c1ce94c7722d.webp',
					'uploads/property/f3841ae6-fb49-455f-b182-7fa4cf75d93a.webp',
				],
				propertyAmenities: ['SPA', 'RESTAURANT', 'FINTESS', 'TV', 'CONDITIONER', 'NON_SMOKING'] as PropertyAmenity[],
				// propertyOtherAmenities: ['FREE_PARKING', 'PETS_ALLOWED', 'IN_ROOM_COOKING'] as PropertyOtherAmenity[],
				propertyDesc: 'null',
				memberId: '691032f99a16f7c754992c9d',
				soldAt: false,
				// createdAt: '2025-11-11T01:06:27.712Z',
				// updatedAt: '2025-11-17T04:57:32.622Z',
				// roomCount: null,
				memberData: {
					_id: '691032f99a16f7c754992c9d',
					memberType: 'AGENT' as MemberType,
					memberStatus: 'ACTIVE' as MemberStatus,
					memberAuthType: 'PHONE' as MemberAuthType,
					memberPhone: '01082108332',
					memberNick: 'Justin',
					memberEmail: 'jusitn@gmail.com',
					memberFullName: '',
					memberImage: 'uploads/member/fc47481b-1367-4ce9-b21b-9f6c76ae5303.jpg',
					memberAddress: '',
					memberDesc: '',
					memberProperties: 5,
					memberComments: 0,
					memberPoints: 0,
					memberWarnings: 0,
					memberBlocks: 0,
					// deletedAt: null,
					// createdAt: '2025-11-09T06:21:45.171Z',
					// updatedAt: '2025-11-12T02:47:44.396Z',
					// accessToken: null,
				},
				reservationData: [],
			},
		],
		metaCounter: [
			{
				total: 2,
			},
		],
	});

	const handleTabChange = (_: React.SyntheticEvent, value: TabKey) => {
		setSelectedTab(value);
	};

	const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	const filteredProperties = properties?.list.filter((property) => {
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
		return `₩${amount.toLocaleString()}`;
	};

	const totalBookings = properties?.list.reduce((acc, p) => acc + p.propertyReservations!, 0);
	const totalRevenue = properties?.list
		.flatMap((p) => p.reservationData || [])
		.reduce((acc, r) => acc + (r.reservationTotalPrice || 0), 0);

	const operatingCount = properties?.list.filter((p) => p.propertyStatus === PropertyStatus.ACTIVE).length;
	const waitingCount = properties?.list.filter((p) => p.propertyStatus === PropertyStatus.DRAFT).length;
	const stoppedCount = properties?.list.filter((p) => p.propertyStatus === PropertyStatus.INACTIVE).length;

	const handleOpenUpdatePropertyModal = (propertyId: string) => {
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
					<PropertyAddModal isOpen={addPropertyOpen} setIsOpen={setAddPropertyOpen} />
				</Box>

				{/* 상단 통계 카드 4개 */}
				<Grid container spacing={2} className="property-page__stats-grid">
					<Grid item xs={12} sm={6} md={3}>
						<Paper className="property-page__stat-card" elevation={0}>
							<p className="property-page__stat-label">전체 숙소</p>
							<p className="property-page__stat-value">{properties?.list.length}</p>
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
							<Tab label={`전체 (${properties?.list.length})`} value="all" className="property-page__tab" />
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
				{filteredProperties.length > 0 ? (
					<Box className="property-page__cards-grid">
						{filteredProperties.map((property, index) => (
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
													? `${Math.round((property.propertyReservations! / property?.propertyRooms!) * 100)}%`
													: '-'}
											</p>
										</Box>
									</Box>

									<Box className="property-card__actions">
										<Button variant="outlined" size="small" className="property-card__action-btn">
											상세보기
										</Button>
										<Button
											onClick={() => handleOpenUpdatePropertyModal(property._id)}
											variant="outlined"
											size="small"
											className="property-card__action-btn"
										>
											수정
										</Button>
										<Link href={`/mypage/property-management/deshboard?propertyId=${property._id}`}>
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
							<PropertyUpdateModal
								isOpen={updatePropertyOpen}
								setIsOpen={setUpdatePropertyOpen}
								selectedPropertyId={selectedPropertyId!}
								setSelectedPropertyId={setSelectedPropertyId}
							/>
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
