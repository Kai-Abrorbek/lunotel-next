// ReviewItem.tsx
import React, { useState } from 'react';
import { Box, Typography, Avatar, Button, Rating, IconButton } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';

type ReviewImage = {
	id: number;
	src: string;
	alt: string;
};

interface ReviewItemProps {
	badge?: string; // "베스트리뷰"
	nickname: string;
	statsText: string; // "리뷰 37 · 사진 58 · 장소 34"
	rating: number; // 4.5
	writtenAgo: string; // "1개월 전"
	roomName: string; // "A-타입(카운터에서 A타입 꼭 말씀해주세요, OTT 시청가능)"
	text: string;
	replyText?: string;
	replyAgo?: string;
	images: ReviewImage[];
	setOpenReviewImage: (v: boolean) => void;
	setReviewImgIndex: (v: number) => void;
}

const MAX_PREVIEW_LENGTH = 140;

const ReviewItem: React.FC<ReviewItemProps> = ({
	badge = '베스트리뷰',
	nickname,
	statsText,
	rating,
	writtenAgo,
	roomName,
	text,
	replyText,
	replyAgo,
	images,
	setOpenReviewImage,
	setReviewImgIndex,
}) => {
	const [expanded, setExpanded] = useState(false);
	const [index, setIndex] = useState(0);

	if (!images.length) return null;

	const maxIndex = images.length - 1;
	const shouldClamp = text.length > MAX_PREVIEW_LENGTH;
	const displayText = !expanded && shouldClamp ? text.slice(0, MAX_PREVIEW_LENGTH) + '…' : text;

	/** HANDLERS **/
	const handleToggle = () => {
		if (!shouldClamp) return;
		setExpanded((prev) => !prev);
	};

	return (
		<Box className="review-item">
			{/* 왼쪽 프로필 영역 */}
			<Box className="review-item__left">
				<Avatar className="review-item__avatar">{nickname.charAt(0)}</Avatar>
				<Box className="review-item__profile">
					{badge && <span className="review-item__badge">{badge}</span>}
					<Typography className="review-item__name">{nickname}</Typography>
					<Typography className="review-item__stats">{statsText}</Typography>
				</Box>
			</Box>

			{/* 오른쪽 리뷰 내용 */}
			<Box className="review-item__right">
				{/* 상단 별점 + 작성일 */}
				<Box className="review-item__meta">
					<Rating name="read-only-rating" value={rating} precision={0.5} readOnly size="small" />
					<Typography className="review-item__rating-score">{rating.toFixed(1)}</Typography>
					<Typography className="review-item__ago">{writtenAgo}</Typography>
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
						{images.map((img, idx) => (
							<SwiperSlide key={img.id}>
								<div
									className="review-swiper__item"
									onClick={() => {
										setOpenReviewImage(true);
										setReviewImgIndex(idx);
									}}
								>
									<img src={img.src} alt={img.alt} />
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				</Box>

				{/* 객실 이름 */}
				<Typography className="review-item__room-name">{roomName}</Typography>

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
						<Typography className="review-item__reply-meta">제휴점 답변 · {replyAgo ?? writtenAgo}</Typography>
						<Typography className="review-item__reply-text">{replyText}</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default ReviewItem;
