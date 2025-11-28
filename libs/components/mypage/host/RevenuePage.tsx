import React, { useState } from 'react';
import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
} from '@mui/material';
import {
	ResponsiveContainer,
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	PieChart,
	Pie,
	Cell,
	BarChart,
	Bar,
} from 'recharts';

const RevenuePage: React.FC = () => {
	const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'year'>('week');

	const revenueData = [
		{ date: '11/19', revenue: 4200, lastYear: 3800 },
		{ date: '11/20', revenue: 5100, lastYear: 4200 },
		{ date: '11/21', revenue: 3800, lastYear: 4500 },
		{ date: '11/22', revenue: 6200, lastYear: 5800 },
		{ date: '11/23', revenue: 7100, lastYear: 6200 },
		{ date: '11/24', revenue: 8500, lastYear: 7800 },
		{ date: '11/25', revenue: 6800, lastYear: 6500 },
	];

	const roomTypeData = [
		{ name: 'Deluxe Double', value: 35, amount: 28500 },
		{ name: 'Oceanview Suite', value: 28, amount: 22800 },
		{ name: 'Standard Twin', value: 22, amount: 17900 },
		{ name: 'Premium King', value: 15, amount: 12200 },
	];

	const channelData = [
		{ channel: '직접 예약', revenue: 32000 },
		{ channel: 'Booking.com', revenue: 24000 },
		{ channel: 'Airbnb', revenue: 18000 },
		{ channel: 'Expedia', revenue: 12000 },
		{ channel: '전화 예약', revenue: 8000 },
	];

	const transactions = [
		{ id: 'TXN-001', date: '2024-11-25', guest: 'John Doe', room: 'Deluxe Double', amount: 3200, status: '완료' },
		{ id: 'TXN-002', date: '2024-11-25', guest: 'Maria Kim', room: 'Oceanview Suite', amount: 4500, status: '완료' },
		{ id: 'TXN-003', date: '2024-11-24', guest: 'Daniel Choi', room: 'Standard Twin', amount: 2400, status: '완료' },
		{ id: 'TXN-004', date: '2024-11-24', guest: 'Sarah Park', room: 'Premium King', amount: 5100, status: '대기중' },
		{ id: 'TXN-005', date: '2024-11-23', guest: 'Mike Lee', room: 'Deluxe Double', amount: 3200, status: '완료' },
	];

	const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

	return (
		<Box className="revenue-page">
			{/* 헤더 */}
			<Box className="revenue-page__header">
				<Typography component="h2" className="revenue-page__title">
					Revenue
				</Typography>

				<Box className="revenue-page__period-tabs">
					{(['today', 'week', 'month', 'year'] as const).map((p) => (
						<Button
							key={p}
							onClick={() => setPeriod(p)}
							className={`revenue-page__period-button ${period === p ? 'revenue-page__period-button--active' : ''}`}
						>
							{p === 'today' ? '오늘' : p === 'week' ? '이번 주' : p === 'month' ? '이번 달' : '올해'}
						</Button>
					))}
				</Box>
			</Box>

			{/* 상단 통계 카드 */}
			<Box className="revenue-page__stats-grid">
				<Card className="revenue-page__stat-card">
					<CardContent>
						<Typography className="revenue-page__stat-label">총 수익 (Total Revenue)</Typography>
						<Typography className="revenue-page__stat-value">$94,280</Typography>
						<Typography className="revenue-page__stat-change revenue-page__stat-change--positive">
							↑ 12.5% vs 지난주
						</Typography>
					</CardContent>
				</Card>

				<Card className="revenue-page__stat-card">
					<CardContent>
						<Typography className="revenue-page__stat-label">평균 객실 요금 (ADR)</Typography>
						<Typography className="revenue-page__stat-value">$248</Typography>
						<Typography className="revenue-page__stat-change revenue-page__stat-change--positive">
							↑ 8.2% vs 지난주
						</Typography>
					</CardContent>
				</Card>

				<Card className="revenue-page__stat-card">
					<CardContent>
						<Typography className="revenue-page__stat-label">객실 점유율</Typography>
						<Typography className="revenue-page__stat-value">87.3%</Typography>
						<Typography className="revenue-page__stat-change revenue-page__stat-change--positive">
							↑ 5.1% vs 지난주
						</Typography>
					</CardContent>
				</Card>

				<Card className="revenue-page__stat-card">
					<CardContent>
						<Typography className="revenue-page__stat-label">RevPAR</Typography>
						<Typography className="revenue-page__stat-value">$217</Typography>
						<Typography className="revenue-page__stat-change revenue-page__stat-change--positive">
							↑ 14.3% vs 지난주
						</Typography>
					</CardContent>
				</Card>
			</Box>

			{/* 수익 추이 */}
			<Card className="revenue-page__trend-card">
				<CardContent>
					<Typography className="revenue-page__trend-title">수익 추이</Typography>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={revenueData}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
							<XAxis dataKey="date" stroke="#6b7280" />
							<YAxis stroke="#6b7280" />
							<Tooltip
								contentStyle={{
									backgroundColor: 'white',
									border: '1px solid #e5e7eb',
									borderRadius: 8,
								}}
							/>
							<Legend />
							<Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} name="올해" />
							<Line
								type="monotone"
								dataKey="lastYear"
								stroke="#94a3b8"
								strokeWidth={2}
								name="작년"
								strokeDasharray="5 5"
							/>
						</LineChart>
					</ResponsiveContainer>
				</CardContent>
			</Card>

			{/* 하단 그래프 두 개 */}
			<Box className="revenue-page__charts-row">
				{/* 객실 타입별 수익 */}
				<Card className="revenue-page__chart-card">
					<CardContent>
						<Typography className="revenue-page__section-title">객실 타입별 수익</Typography>
						<ResponsiveContainer width="100%" height={280}>
							<PieChart>
								<Pie
									data={roomTypeData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}
									outerRadius={80}
									fill="#8884d8"
									dataKey="value"
								>
									{roomTypeData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>

						<Box className="revenue-page__roomtype-legend">
							{roomTypeData.map((room, idx) => (
								<Box key={idx} className="revenue-page__roomtype-row">
									<Box className="revenue-page__roomtype-label">
										<Box className="revenue-page__roomtype-color" />
										<span className="revenue-page__roomtype-name">{room.name}</span>
									</Box>
									<span className="revenue-page__roomtype-amount">${room.amount.toLocaleString()}</span>
								</Box>
							))}
						</Box>
					</CardContent>
				</Card>

				{/* 예약 채널별 수익 */}
				<Card className="revenue-page__chart-card">
					<CardContent>
						<Typography className="revenue-page__section-title">예약 채널별 수익</Typography>
						<ResponsiveContainer width="100%" height={280}>
							<BarChart data={channelData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="channel" stroke="#6b7280" angle={-15} textAnchor="end" height={80} />
								<YAxis stroke="#6b7280" />
								<Tooltip
									contentStyle={{
										backgroundColor: 'white',
										border: '1px solid #e5e7eb',
										borderRadius: 8,
									}}
								/>
								<Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>
			</Box>

			{/* 최근 거래 내역 */}
			<Card className="revenue-page__transactions-card">
				<CardContent>
					<Typography className="revenue-page__transactions-title">최근 거래 내역</Typography>

					<Box className="revenue-page__transactions-table-wrapper">
						<Table className="revenue-page__transactions-table">
							<TableHead>
								<TableRow className="revenue-page__transactions-head-row">
									<TableCell className="revenue-page__transactions-header-cell">거래 ID</TableCell>
									<TableCell className="revenue-page__transactions-header-cell">날짜</TableCell>
									<TableCell className="revenue-page__transactions-header-cell">투숙객</TableCell>
									<TableCell className="revenue-page__transactions-header-cell">객실</TableCell>
									<TableCell className="revenue-page__transactions-header-cell" align="right">
										금액
									</TableCell>
									<TableCell className="revenue-page__transactions-header-cell" align="center">
										상태
									</TableCell>
								</TableRow>
							</TableHead>

							<TableBody>
								{transactions.map((txn) => (
									<TableRow key={txn.id} className="revenue-page__transactions-row">
										<TableCell className="revenue-page__txn-id">{txn.id}</TableCell>
										<TableCell className="revenue-page__txn-date">{txn.date}</TableCell>
										<TableCell className="revenue-page__txn-guest">{txn.guest}</TableCell>
										<TableCell className="revenue-page__txn-room">{txn.room}</TableCell>
										<TableCell className="revenue-page__txn-amount" align="right">
											${txn.amount.toLocaleString()}
										</TableCell>
										<TableCell className="revenue-page__txn-status-cell" align="center">
											<span
												className={`revenue-page__status ${
													txn.status === '완료' ? 'revenue-page__status--completed' : 'revenue-page__status--pending'
												}`}
											>
												{txn.status}
											</span>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};

export default RevenuePage;
