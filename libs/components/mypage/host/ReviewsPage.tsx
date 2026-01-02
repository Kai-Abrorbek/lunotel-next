import React, { useMemo, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { GET_COMMENTS } from '../../../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { Comment } from '../../../types/comment/comment';
import { UPDATE_COMMENT } from '../../../../apollo/user/mutation';
import { sweetErrorAlert } from '../../../sweetAlert';

const ReviewsPage = () => {
	const router = useRouter();
	const [filterRating, setFilterRating] = useState<'all' | '1' | '2' | '3' | '4' | '5'>('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [replyOpenId, setReplyOpenId] = useState<string | null>(null);
	const [replyText, setReplyText] = useState('');
	const [expandedId, setExpandedId] = useState<string | null>(null);
	const MAX_PREVIEW_LENGTH = 140;

	const [updateComment] = useMutation(UPDATE_COMMENT);
	/** APOLLO REQUEST **/
	const { data: getMyReviewsData, refetch: getMyReviewsRefetch } = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 20,
				sort: 'createdAt',
				direction: 'DESC',
				search: {
					commentRefId: router.query.propertyId,
				},
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !router.query.propertyId,
	});

	const allReviews: Comment[] = getMyReviewsData?.getComments?.list ?? [];

	/** HANDLERS **/
	const handleToggle = (reviewId: string) => {
		setExpandedId((prev) => (prev === reviewId ? null : reviewId));
	};

	const renderStars = (rating: number) => (
		<span className="reviews-page__stars">
			{[1, 2, 3, 4, 5].map((star) => (
				<span key={star} className={star <= rating ? 'reviews-page__star--filled' : 'reviews-page__star--empty'}>
					★
				</span>
			))}
		</span>
	);

	const reviewsWithPreview = useMemo(() => {
		return allReviews.map((review) => {
			const shouldClamp = (review.commentContent ?? '').length > MAX_PREVIEW_LENGTH;
			const isExpanded = expandedId === review._id;

			const displayText =
				!isExpanded && shouldClamp
					? (review.commentContent ?? '').slice(0, MAX_PREVIEW_LENGTH) + '…'
					: review.commentContent ?? '';

			return {
				...review,
				shouldClamp,
				displayText,
				isExpanded,
			};
		});
	}, [allReviews, expandedId]);

	const filteredReviews = useMemo(() => {
		const lower = searchTerm.toLowerCase();

		return reviewsWithPreview.filter((review) => {
			const matchesRating = filterRating === 'all' || review.commentRating === parseInt(filterRating, 10);

			const nick = (review?.memberData?.memberNick ?? '').toLowerCase();
			const content = (review.commentContent ?? '').toLowerCase();

			const matchesSearch = nick.includes(lower) || content.includes(lower);

			return matchesRating && matchesSearch;
		});
	}, [reviewsWithPreview, filterRating, searchTerm]);

	const averageRating = useMemo(() => {
		if (!allReviews.length) return '0.0';
		const avg = allReviews.reduce((sum, r) => sum + (r.commentRating ?? 0), 0) / allReviews.length;
		return avg.toFixed(1);
	}, [allReviews]);

	const ratingDistribution = useMemo(() => {
		const total = allReviews.length || 1;
		return [5, 4, 3, 2, 1].map((rating) => {
			const count = allReviews.filter((r) => r.commentRating === rating).length;
			return { rating, count, percentage: (count / total) * 100 };
		});
	}, [allReviews]);

	const handleSubmitReply = async (reviewId: string) => {
		try {
			await updateComment({
				variables: {
					input: {
						_id: reviewId,
						commentResponse: replyText,
					},
				},
			});
			setReplyText('');
			setReplyOpenId(null);
			getMyReviewsRefetch({
				variables: {
					input: {
						page: 1,
						limit: 20,
						sort: 'createdAt',
						direction: 'DESC',
						search: {
							commentRefId: router.query.propertyId,
						},
					},
				},
			});
		} catch (err: any) {
			await sweetErrorAlert(err.message);
		}
	};

	return (
		<Box className="reviews-page">
			<Typography component="h1" className="reviews-page__title">
				리뷰
			</Typography>

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

			{filteredReviews.length > 0 ? (
				filteredReviews.map((review: any) => (
					<Card key={review._id} className="reviews-page__review-card">
						<CardContent>
							<Box className="reviews-page__review-header">
								<Box className="reviews-page__review-author">
									<Box className="reviews-page__review-avatar">{review?.memberData?.memberNick?.charAt(0)}</Box>
									<Box className="reviews-page__review-author-info">
										<div className="reviews-page__review-author-name">{review?.memberData?.memberNick}</div>
										<div className="reviews-page__review-author-meta">
											{review.memberData && <span className="reviews-page__verified-badge">✓ 인증된 투숙</span>}
										</div>
									</Box>
								</Box>

								<Box className="reviews-page__review-rating">
									{renderStars(review.commentRating)}
									<div className="reviews-page__review-date">{String(review.createdAt)}</div>
								</Box>
							</Box>

							<Box className="reviews-page__review-content">
								<p className="reviews-page__review-text">{review.displayText}</p>

								{review.shouldClamp && (
									<Button
										variant="text"
										size="small"
										className="review-item__more-btn"
										onClick={() => handleToggle(review._id)}
									>
										{review.isExpanded ? '접기 ▲' : '더보기 ▼'}
									</Button>
								)}
							</Box>

							<Box className="reviews-page__review-footer">
								<div className="reviews-page__review-room-info">
									R:{review?.roomData?._id?.slice(0, 10)} · {review?.roomData?.roomName} 투숙
								</div>

								<Box className="reviews-page__review-actions">
									<Button variant="outlined" className="reviews-page__review-action-btn">
										👍 도움돼요
									</Button>

									<Button
										variant="outlined"
										className="reviews-page__review-action-btn"
										onClick={() => {
											if (replyOpenId === review._id) {
												setReplyOpenId(null);
												setReplyText('');
											} else {
												setReplyOpenId(review._id);
												setReplyText(review.commentResponse ?? '');
											}
										}}
									>
										💬 답글 달기
									</Button>
								</Box>
							</Box>

							{review.commentResponse && (
								<Box className="reviews-page__review-response">
									<div className="reviews-page__review-response-header">🏨 호스트 답변</div>
									<div className="reviews-page__review-response-text">{review.commentResponse}</div>
								</Box>
							)}

							{replyOpenId === review._id && (
								<Box className="reviews-page__reply-section">
									<div className="reviews-page__reply-header">🏨 호스트 답변 작성</div>
									<TextField
										multiline
										minRows={3}
										fullWidth
										placeholder="답글을 입력하세요..."
										value={replyText}
										onChange={(e) => setReplyText(e.target.value)}
										className="reviews-page__reply-textfield"
									/>
									<Box className="reviews-page__reply-actions">
										<Button
											variant="outlined"
											onClick={() => {
												setReplyOpenId(null);
												setReplyText('');
											}}
										>
											취소
										</Button>
										<Button
											variant="contained"
											onClick={() => handleSubmitReply(review._id)}
											disabled={!replyText.trim()}
										>
											답글 등록
										</Button>
									</Box>
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
