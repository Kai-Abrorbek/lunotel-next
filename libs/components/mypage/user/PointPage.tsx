// PointPage.tsx
import React, { useMemo, useState } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type PointFilter = 'all' | 'earn' | 'use' | 'expire';
type PointType = 'earn' | 'use' | 'expire';

interface PointHistory {
	id: number;
	date: string; // '2024.11.26'
	description: string; // 예: '숙박 결제 적립'
	amount: number; // +는 적립, -는 사용/소멸
	type: PointType;
}

const POINT_HISTORY: PointHistory[] = [
	{ id: 1, date: '2024.11.01', description: '숙박 결제 적립', amount: 1500, type: 'earn' },
	{ id: 2, date: '2024.11.03', description: '리뷰 작성 적립', amount: 500, type: 'earn' },
	{ id: 3, date: '2024.11.10', description: '예약 결제 사용', amount: -1200, type: 'use' },
	{ id: 4, date: '2024.11.30', description: '포인트 소멸', amount: -300, type: 'expire' },
];

const PointPage: React.FC = () => {
	const [filter, setFilter] = useState<PointFilter>('all');

	const totalPoints = useMemo(() => POINT_HISTORY.reduce((sum, h) => sum + h.amount, 0), []);

	const expiringPoints = useMemo(
		() => POINT_HISTORY.filter((h) => h.type === 'expire').reduce((sum, h) => sum + Math.abs(h.amount), 0),
		[],
	);

	const filteredHistory = useMemo(() => {
		if (filter === 'all') return POINT_HISTORY;
		return POINT_HISTORY.filter((h) => h.type === filter);
	}, [filter]);

	const hasHistory = filteredHistory.length > 0;

	const formatAmount = (amount: number) => `${amount > 0 ? '+' : ''}${amount.toLocaleString()}P`;

	return (
		<Box className="point-page">
			<Box className="point-page__inner">
				<Typography className="point-page__title">포인트</Typography>

				{/* 요약 카드 */}
				<Paper className="point-summary" elevation={0}>
					<Box className="point-summary__header">
						<Typography className="point-summary__label">내 포인트</Typography>
						<IconButton size="small" className="point-summary__info-btn">
							<InfoOutlinedIcon fontSize="small" />
						</IconButton>
					</Box>

					<Typography className="point-summary__amount">{totalPoints.toLocaleString()}P</Typography>

					<Box className="point-summary__divider" />

					<Typography className="point-summary__expire">
						31일 내 {expiringPoints.toLocaleString()}P가 소멸될 예정이에요
					</Typography>
				</Paper>

				{/* 필터 버튼 */}
				<Box className="point-filter">
					{[
						{ key: 'all', label: '전체' },
						{ key: 'earn', label: '적립' },
						{ key: 'use', label: '사용' },
						{ key: 'expire', label: '소멸' },
					].map((item) => (
						<button
							key={item.key}
							type="button"
							onClick={() => setFilter(item.key as PointFilter)}
							className={'point-filter__chip' + (filter === item.key ? ' point-filter__chip--active' : '')}
						>
							{item.label}
						</button>
					))}
				</Box>

				{/* 내역 영역 */}
				{hasHistory ? (
					<Box className="point-history">
						{filteredHistory.map((h) => (
							<Box
								key={h.id}
								className={`point-history__item ${h.type === 'expire' || h.type === 'use' ? 'red' : 'blue'}`}
							>
								<Box className="point-history__left">
									<Typography className="point-history__desc">{h.description}</Typography>
									<Typography className="point-history__date">{h.date}</Typography>
								</Box>
								<Typography
									className={
										'point-history__amount ' +
										(h.amount > 0 ? 'point-history__amount--plus' : 'point-history__amount--minus')
									}
								>
									{formatAmount(h.amount)}
								</Typography>
							</Box>
						))}
					</Box>
				) : (
					<Box className="point-empty">
						<Typography className="point-empty__text">포인트 내역이 없어요</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default PointPage;
