import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField } from '@mui/material';

interface Review {
	id: string;
	guest: string;
	rating: number;
	date: string;
	room: string;
	roomType: string;
	comment: string;
	verified: boolean;
	response?: string;
}

const ReviewsPage = () => {
	const [filterRating, setFilterRating] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
	const [searchTerm, setSearchTerm] = useState('');

	const allReviews: Review[] = [
		{
			id: 'REV-001',
			guest: 'John Doe',
			rating: 5,
			date: '2024-11-20',
			room: 'R102',
			roomType: 'Deluxe Double Room',
			comment:
				'Absolutely wonderful stay! The room was immaculate, the staff was incredibly friendly and helpful. The location is perfect and the amenities exceeded our expectations. Will definitely return!',
			verified: true,
			response:
				'Thank you so much for your kind words! We are thrilled to hear you enjoyed your stay and look forward to welcoming you back soon!',
		},
		{
			id: 'REV-002',
			guest: 'Maria Kim',
			rating: 5,
			date: '2024-11-18',
			room: 'R202',
			roomType: 'Oceanview Suite',
			comment:
				'The ocean view was breathtaking! Woke up to beautiful sunrises every morning. The suite was spacious and luxurious. Highly recommend!',
			verified: true,
		},
		{
			id: 'REV-003',
			guest: 'Daniel Choi',
			rating: 4,
			date: '2024-11-15',
			room: 'R302',
			roomType: 'Standard Twin',
			comment:
				'Great value for money. Room was clean and comfortable. Only minor issue was the WiFi was a bit slow, but overall a pleasant experience.',
			verified: true,
			response:
				'Thank you for your feedback! We have recently upgraded our WiFi system to provide faster speeds for all our guests.',
		},
		{
			id: 'REV-004',
			guest: 'Sarah Park',
			rating: 5,
			date: '2024-11-12',
			room: 'R401',
			roomType: 'Premium King',
			comment:
				'Perfect for a romantic getaway! The room was beautifully decorated, very clean, and the jacuzzi was amazing. The staff went above and beyond to make our anniversary special.',
			verified: true,
		},
		{
			id: 'REV-005',
			guest: 'Alice Johnson',
			rating: 4,
			date: '2024-11-10',
			room: 'R101',
			roomType: 'Deluxe Double Room',
			comment:
				'Comfortable stay with excellent service. The breakfast buffet was delicious with lots of variety. Would have given 5 stars but the AC was a bit noisy.',
			verified: false,
		},
		{
			id: 'REV-006',
			guest: 'Bob Smith',
			rating: 3,
			date: '2024-11-08',
			room: 'R201',
			roomType: 'Oceanview Suite',
			comment:
				'Room was nice but there was some construction noise during our stay. Staff was apologetic and offered a partial refund which we appreciated.',
			verified: true,
			response:
				'We sincerely apologize for the inconvenience. The construction is now complete and we would love to welcome you back for a better experience.',
		},
	];

	const renderStars = (rating: number) => (
		<span className="reviews-page__stars">
			{[1, 2, 3, 4, 5].map((star) => (
				<span key={star} className={star <= rating ? 'reviews-page__star--filled' : 'reviews-page__star--empty'}>
					★
				</span>
			))}
		</span>
	);

	const filteredReviews = allReviews.filter((review) => {
		const matchesRating = filterRating === 'all' || review.rating === parseInt(filterRating, 10);
		const lower = searchTerm.toLowerCase();
		const matchesSearch = review.guest.toLowerCase().includes(lower) || review.comment.toLowerCase().includes(lower);
		return matchesRating && matchesSearch;
	});

	const averageRating = (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1);

	const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
		const count = allReviews.filter((r) => r.rating === rating).length;
		return {
			rating,
			count,
			percentage: (count / allReviews.length) * 100,
		};
	});

	return (
		<Box className="reviews-page">
			{/* 제목 */}
			<Typography component="h1" className="reviews-page__title">
				Reviews
			</Typography>

			{/* 평점 요약 */}
			<Card className="reviews-page__rating-overview">
				<CardContent>
					<Box className="reviews-page__rating-overview-content">
						<Box className="reviews-page__overall-rating">
							<div className="reviews-page__overall-rating-score">{averageRating}</div>
							<div className="reviews-page__overall-rating-stars">★★★★★</div>
							<div className="reviews-page__overall-rating-count">{allReviews.length}개 리뷰</div>
						</Box>

						<Box className="reviews-page__rating-breakdown">
							{ratingDistribution.map(({ rating, count, percentage }) => (
								<Box key={rating} className="reviews-page__rating-bar-row">
									<span className="reviews-page__rating-bar-label">{rating} ★</span>
									<div className="reviews-page__rating-bar">
										<div className="reviews-page__rating-bar-fill" style={{ width: `${percentage}%` }} />
									</div>
									<span className="reviews-page__rating-bar-count">{count}</span>
								</Box>
							))}
						</Box>
					</Box>
				</CardContent>
			</Card>

			{/* 검색 / 필터 */}
			<Card className="reviews-page__search-filter">
				<CardContent>
					<Box className="reviews-page__search-filter-row">
						<Box className="reviews-page__search-wrapper">
							<span className="reviews-page__search-icon">🔍</span>
							<TextField
								fullWidth
								variant="outlined"
								placeholder="투숙객 이름 또는 리뷰 내용으로 검색..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="reviews-page__search-input"
							/>
						</Box>
					</Box>

					<Box className="reviews-page__filter-rating">
						<Button
							className={`reviews-page__rating-filter-btn ${
								filterRating === 'all' ? 'reviews-page__rating-filter-btn--active' : ''
							}`}
							variant="outlined"
							onClick={() => setFilterRating('all')}
						>
							전체
						</Button>
						{[5, 4, 3, 2, 1].map((rating) => (
							<Button
								key={rating}
								className={`reviews-page__rating-filter-btn ${
									filterRating === rating.toString() ? 'reviews-page__rating-filter-btn--active' : ''
								}`}
								variant="outlined"
								onClick={() => setFilterRating(rating.toString() as any)}
							>
								{rating}★
							</Button>
						))}
					</Box>
				</CardContent>
			</Card>

			{/* 리뷰 리스트 / 빈 상태 */}
			{filteredReviews.length > 0 ? (
				filteredReviews.map((review) => (
					<Card key={review.id} className="reviews-page__review-card">
						<CardContent>
							<Box className="reviews-page__review-header">
								<Box className="reviews-page__review-author">
									<Box className="reviews-page__review-avatar">{review.guest.charAt(0)}</Box>
									<Box className="reviews-page__review-author-info">
										<div className="reviews-page__review-author-name">{review.guest}</div>
										<div className="reviews-page__review-author-meta">
											{review.verified && <span className="reviews-page__verified-badge">✓ 인증된 투숙</span>}
										</div>
									</Box>
								</Box>

								<Box className="reviews-page__review-rating">
									{renderStars(review.rating)}
									<div className="reviews-page__review-date">{review.date}</div>
								</Box>
							</Box>

							<Box className="reviews-page__review-content">
								<p className="reviews-page__review-text">{review.comment}</p>
							</Box>

							<Box className="reviews-page__review-footer">
								<div className="reviews-page__review-room-info">
									{review.room} · {review.roomType} 투숙
								</div>
								<Box className="reviews-page__review-actions">
									<Button variant="outlined" className="reviews-page__review-action-btn">
										👍 도움돼요
									</Button>
									<Button variant="outlined" className="reviews-page__review-action-btn">
										💬 답글 달기
									</Button>
								</Box>
							</Box>

							{review.response && (
								<Box className="reviews-page__review-response">
									<div className="reviews-page__review-response-header">🏨 호스트 답변</div>
									<div className="reviews-page__review-response-text">{review.response}</div>
								</Box>
							)}
						</CardContent>
					</Card>
				))
			) : (
				<Card className="reviews-page__empty-state">
					<CardContent>
						<div className="reviews-page__empty-state-icon">⭐</div>
						<div className="reviews-page__empty-state-title">조건에 맞는 리뷰가 없습니다</div>
						<div className="reviews-page__empty-state-text">검색어나 필터 조건을 변경해 보세요</div>
					</CardContent>
				</Card>
			)}
		</Box>
	);
};

export default ReviewsPage;
