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

	const dateStr = `${comment.createdAt.toString().split('T')[0]}`;

	return (
		<Box className="rv-item">
			{/* 헤더: 아바타 + 이름 + 날짜 + 별점 */}
			<Box className="rv-item__header">
				<Avatar className="rv-item__avatar">{comment.memberData?.memberNick.charAt(0)}</Avatar>
				<Box className="rv-item__header-info">
					<Box className="rv-item__name-row">
						<Typography className="rv-item__name">{comment.memberData?.memberNick}</Typography>
						<Typography className="rv-item__date">{dateStr}</Typography>
					</Box>
					<Box className="rv-item__rating-row">
						<Rating value={comment.commentRating} precision={0.5} readOnly size="small" />
						<Typography className="rv-item__score">{comment.commentRating.toFixed(1)}</Typography>
					</Box>
					{comment.roomData?.roomName && <Typography className="rv-item__room">{comment.roomData.roomName}</Typography>}
				</Box>
			</Box>

			{/* 리뷰 텍스트 */}
			<Box className="rv-item__body">
				<Typography className="rv-item__text">{displayText}</Typography>
				{shouldClamp && (
					<Button variant="text" size="small" className="rv-item__more" onClick={() => setExpanded((p) => !p)}>
						{expanded ? '접기 ▲' : '더보기 ▼'}
					</Button>
				)}
			</Box>

			{/* 이미지 슬라이더 */}
			{comment.commentImages.length > 0 && (
				<Box className="rv-item__imgs">
					<Swiper modules={[Navigation]} navigation slidesPerView={'auto'} spaceBetween={8} className="rv-item__swiper">
						{comment.commentImages.map((img, idx) => (
							<SwiperSlide key={img} style={{ width: 160 }}>
								<Box
									className="rv-item__img-wrap"
									onClick={() => {
										handleSelectComment(comment._id);
										setOpenReviewImage(true);
										setReviewImgIndex(idx);
									}}
								>
									<img src={`${process.env.REACT_APP_API_URL}/${img}`} alt="" />
								</Box>
							</SwiperSlide>
						))}
					</Swiper>
				</Box>
			)}

			{/* 사장님 답변 */}
			{replyText && (
				<Box className="rv-item__reply">
					<Typography className="rv-item__reply-label">🏨 제휴점 답변</Typography>
					<Typography className="rv-item__reply-text">{replyText}</Typography>
				</Box>
			)}
		</Box>
	);
};

export default ReviewItem;
