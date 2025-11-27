// RoomResultCard.tsx
import React from 'react';
import { Box, Button, Chip, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';

const RoomResultCard: React.FC = () => {
	return (
		<Box className="room-page">
			<Typography className="my-res-main-title">찜 목록</Typography>

			<Box className="room-card">
				<Box className="room-card-image-wrap">
					<Box className="room-card-badge">무제한 할인</Box>
					<img
						className="room-card-image"
						src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=320&h=200
"
						alt="객실 이미지"
					/>
				</Box>

				<Box className="room-card-content">
					<Box className="room-card-header">
						<Box>
							<Typography className="room-card-type">모텔</Typography>
							<Typography className="room-card-title">길동 MARI-마리</Typography>
							<Typography className="room-card-location">길동역 도보 3분</Typography>

							<Box className="room-card-rating-row">
								<Chip
									icon={<StarIcon className="room-card-rating-star" />}
									label="9.3"
									size="small"
									className="room-card-rating-chip"
								/>
								<Typography className="room-card-rating-text">4,985명 평가</Typography>
							</Box>
						</Box>

						<IconButton className="room-card-like">
							<FavoriteBorderIcon />
						</IconButton>
					</Box>

					<Box className="room-card-middle">
						<Box className="room-card-line">
							<Typography className="room-card-line-label">대실</Typography>
							<Typography className="room-card-line-value">최대 8시간</Typography>
						</Box>
						<Box className="room-card-line">
							<Typography className="room-card-line-label">숙박</Typography>
							<Typography className="room-card-line-value">21:00 체크인</Typography>
						</Box>
					</Box>

					<Box className="room-card-bottom">
						<Typography className="room-card-date-link">다른 날짜 확인</Typography>

						<Box className="room-card-price-wrap">
							<Typography className="room-card-price">
								45,000<span className="room-card-price-unit">원</span>
							</Typography>
							<Typography className="room-card-remaining">이 가격으로 남은 객실 2개</Typography>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default RoomResultCard;
