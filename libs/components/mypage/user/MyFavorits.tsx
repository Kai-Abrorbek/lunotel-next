import React, { useState } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../../apollo/store';
import { GET_FAVORITES } from '../../../../apollo/user/query';
import { Property } from '../../../types/property/property';
import { LIKE_TARGET_PROPERTY } from '../../../../apollo/user/mutation';
import { REACT_APP_API_URL } from '../../../config';

interface MyFavoritsProps {
	currentPage: number;
	setTotal: (v: number) => void;
}
const MyFavorits = (props: MyFavoritsProps) => {
	const { currentPage, setTotal } = props;
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const user = useReactiveVar(userVar);

	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	/** APOLLO REQUEST **/
	const {
		loading: getMyFaoritesLoading,
		data: getMyFaoritesData,
		error: getMyFaoritesError,
		refetch: getMyFaoritesRefetch,
	} = useQuery(GET_FAVORITES, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: currentPage,
				limit: 10,
			},
		},
		notifyOnNetworkStatusChange: true,
		skip: !user._id,
	});

	const myFavorits = getMyFaoritesData?.getFavorites?.list;
	console.log(myFavorits);
	return (
		<Box className="room-page">
			<Typography className="my-res-main-title">찜 목록</Typography>

			<Box className="room-card-box">
				{myFavorits?.length !== 0 ? (
					myFavorits.map((property: Property) => {
						const isFav = true;
						return (
							<Box key={property._id} className="room-card">
								<Box className="room-card-image-wrap">
									{/* <Box className="room-card-badge">무제한 할인</Box> */}
									<img
										className="room-card-image"
										src={`${process.env.REACT_APP_API_URL}/${property?.propertyImages[0]}`}
										alt="객실 이미지"
									/>
								</Box>

								<Box className="room-card-content">
									<Box className="room-card-header">
										<Box>
											<Typography className="room-card-type">{property?.propertyType}</Typography>
											<Typography className="room-card-title">{property?.propertyName}</Typography>
											<Typography className="room-card-location">{property.propertyAddress}</Typography>

											<Box className="room-card-rating-row">
												<Chip
													icon={<StarIcon className="room-card-rating-star" />}
													label={property.propertyRank}
													size="small"
													className="room-card-rating-chip"
												/>
												<Typography className="room-card-rating-text">{property.propertyComments}명 평가</Typography>
											</Box>
										</Box>

										<IconButton
											className="room-card-like"
											onClick={(e) => {
												e.stopPropagation();
											}}
										>
											{isFav ? <FavoriteIcon sx={{ color: 'red' }} /> : <FavoriteBorderIcon />}
										</IconButton>
									</Box>

									<Box className="room-card-middle">
										<Box className="room-card-line">
											<p className="room-card-line-label">대실</p>
											<p className="room-card-line-value">최대 8시간</p>
										</Box>
										<Box className="room-card-line">
											<p className="room-card-line-label">숙박</p>
											<p className="room-card-line-value">21:00 체크인</p>
										</Box>
									</Box>

									<Box className="room-card-bottom">
										<p className="room-card-date-link">다른 날짜 확인</p>

										<Box className="room-card-price-wrap">
											<Typography className="room-card-price">
												45,000<span className="room-card-price-unit">원</span>
											</Typography>
											<Typography className="room-card-remaining">이 가격으로 남은 객실 2개</Typography>
										</Box>
									</Box>
								</Box>
							</Box>
						);
					})
				) : (
					<div></div>
				)}
			</Box>
		</Box>
	);
};

export default MyFavorits;
