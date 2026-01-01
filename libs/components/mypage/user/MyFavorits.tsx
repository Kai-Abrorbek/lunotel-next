import React, { useMemo, useState } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../../apollo/store';
import { GET_FAVORITES } from '../../../../apollo/user/query';
import { Property } from '../../../types/property/property';
import { LIKE_TARGET_PROPERTY } from '../../../../apollo/user/mutation';
import { PropertyInquiry } from '../../../types/property/property.input';
import { useRouter } from 'next/router';
import { T } from '../../../types/common';
import { Message } from '../../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import { useTranslation } from 'react-i18next';

interface MyFavoritsProps {
	currentPage: number;
	setTotal: (v: number) => void;
}
const MyFavorits = (props: MyFavoritsProps) => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const user = useReactiveVar(userVar);
	const { currentPage, setTotal } = props;

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

	/** HANDLERS **/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await getMyFaoritesRefetch({
				input: {
					page: currentPage,
					limit: 10,
				},
			});
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	const checkInAndcheckOutDate = (day: number = 0): string => {
		const d = new Date();
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + day}`;
	};

	const pushPropertyDetailHandler = (property: Property) => {
		const propertyInqiry: PropertyInquiry = {
			_id: String(property._id),
			propertyName: encodeURIComponent(property.propertyName),
			checkInDate: checkInAndcheckOutDate(),
			checkOutDate: checkInAndcheckOutDate(1),
			personal: 2,
		};

		localStorage.setItem('propertyInqiry', JSON.stringify({ ...propertyInqiry }));
		router.push(
			`/property/propertyId=${property._id}?input=${JSON.stringify({ ...propertyInqiry })}`,
			`/property/propertyId=${property._id}?input=${JSON.stringify({ ...propertyInqiry })}`,
			{
				scroll: false,
			},
		);
	};

	return (
		<Box className="room-page">
			<Typography className="my-res-main-title">{t('찜 목록')}</Typography>

			<Box className="room-card-box">
				{myFavorits?.length !== 0 ? (
					myFavorits?.map((property: Property) => {
						const isFav = true;
						return (
							<Box key={property._id} className="room-card" onClick={() => pushPropertyDetailHandler(property)}>
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
												<Typography className="room-card-rating-text">
													{property.propertyComments}
													{t('명 평가')}
												</Typography>
											</Box>
										</Box>

										<IconButton
											className="room-card-like"
											onClick={(e) => {
												e.stopPropagation();
												likePropertyHandler(user, property._id);
											}}
										>
											<FavoriteIcon sx={{ color: 'red' }} />
										</IconButton>
									</Box>

									<Box className="room-card-middle">
										<Box className="room-card-line">
											<p className="room-card-line-label">{t('대실')}</p>
											<p className="room-card-line-value">
												{t('최대')} 8{t('시간')}
											</p>
										</Box>
										<Box className="room-card-line">
											<p className="room-card-line-label">{t('숙박')}</p>
											<p className="room-card-line-value">21:00 {t('체크인')}</p>
										</Box>
									</Box>

									<Box className="room-card-bottom">
										<p className="room-card-date-link">{t('다른 날짜 확인')}</p>
										<Box className="room-card-price-wrap">
											<Typography className="room-card-price">
												45,000<span className="room-card-price-unit">{t('원')}</span>
											</Typography>
											{/* <Typography className="room-card-remaining">이 가격으로 남은 객실 2개</Typography> */}
										</Box>
									</Box>
								</Box>
							</Box>
						);
					})
				) : (
					<div>
						<div className="no-data">
							<h1>{t('찜한 숙소가 없습니다')}~</h1>
						</div>
					</div>
				)}
			</Box>
		</Box>
	);
};

export default MyFavorits;
