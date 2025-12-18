// ReviewItem.tsx
import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, Rating } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { Comment } from '../../types/comment/comment';

interface ReviewItemProps {
	replyText?: string;
	comment: Comment;
	setOpenReviewImage: (v: boolean) => void;
	setReviewImgIndex: (v: number) => void;
	setselectCommentImg: (v: string[]) => void;
}

const MAX_PREVIEW_LENGTH = 140;

const ReviewItem: React.FC<ReviewItemProps> = ({
	// badge = '베스트리뷰',
	setselectCommentImg,
	replyText,
	setOpenReviewImage,
	setReviewImgIndex,
	comment,
}) => {
	const [expanded, setExpanded] = useState(false);

	if (!comment.commentImages.length) return null;

	const handleSelectComment = (commentId: string) => {
		if (comment._id === commentId) setselectCommentImg(comment.commentImages);
	};

	const shouldClamp = comment.commentContent.length > MAX_PREVIEW_LENGTH;
	const displayText =
		!expanded && shouldClamp ? comment.commentContent.slice(0, MAX_PREVIEW_LENGTH) + '…' : comment.commentContent;

	/** HANDLERS **/
	const handleToggle = () => {
		if (!shouldClamp) return;
		setExpanded((prev) => !prev);
	};

	return (
		<Box className="review-item">
			{/* 왼쪽 프로필 영역 */}
			<Box className="review-item__left">
				<Avatar className="review-item__avatar">{comment.memberData?.memberNick.charAt(0)}</Avatar>
				<Box className="review-item__profile">
					{/* {badge && <span className="review-item__badge">{badge}</span>} */}
					<Typography className="review-item__name">{comment.memberData?.memberNick}</Typography>
					{/* <Typography className="review-item__stats">{statsText}</Typography> */}
				</Box>
			</Box>
			{/* 오른쪽 리뷰 내용 */}
			<Box className="review-item__right">
				{/* 상단 별점 + 작성일 */}
				<Box className="review-item__meta">
					<Rating name="read-only-rating" value={comment.commentRating} precision={0.5} readOnly size="small" />
					<Typography className="review-item__rating-score">{comment.commentRating.toFixed(1)}</Typography>
					<Typography className="review-item__ago">{`${comment.createdAt.toString().split('T')[0]} ${comment.createdAt
						.toString()
						.split('T')[1]
						.slice(0, 8)}`}</Typography>
				</Box>

				{/* 사진 영역 */}
				<Box className="review-swiper">
					<Swiper
						modules={[Navigation]}
						navigation
						slidesPerView={4}
						spaceBetween={10}
						className="review-swiper__inner"
					>
						{comment.commentImages.map((img, idx) => (
							<SwiperSlide key={img}>
								<div
									className="review-swiper__item"
									onClick={() => {
										setOpenReviewImage(true);
										setReviewImgIndex(idx);
									}}
								>
									<img
										src={`${process.env.REACT_APP_API_URL}/${img}`}
										alt={img}
										onClick={() => handleSelectComment(comment._id)}
									/>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</Box>

				{/* 객실 이름 */}
				<Typography className="review-item__room-name">{comment.roomDate?.roomName}</Typography>

				{/* 리뷰 텍스트 + 더보기 */}
				<Box className="review-item__text-wrap">
					<Typography className="review-item__text">{displayText}</Typography>
					{shouldClamp && (
						<Button variant="text" size="small" className="review-item__more-btn" onClick={handleToggle}>
							{expanded ? '접기 ▲' : '더보기 ▼'}
						</Button>
					)}
				</Box>

				{/* 사장님 답변 */}
				{replyText && (
					<Box className="review-item__reply">
						<Typography className="review-item__reply-meta">제휴점 답변 · {comment.createdAt.toString()}</Typography>
						<Typography className="review-item__reply-text">{replyText}</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default ReviewItem;
