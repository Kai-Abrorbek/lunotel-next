import React, { useEffect, useRef, useState } from 'react';
import {
	Box,
	Button,
	Card,
	CardContent,
	CardMedia,
	Checkbox,
	Chip,
	Dialog,
	DialogContent,
	Divider,
	FormControlLabel,
	IconButton,
	ListItemIcon,
	ListItemText,
	Menu,
	MenuItem,
	Radio,
	RadioGroup,
	Slider,
	Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MapView from './MapView';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
	PropertyAmenity,
	PropertyAmenityKorean,
	PropertyOtherAmenity,
	PropertyOtherAmenityKorean,
	PropertyType,
	PropertyTypeKorean,
	SORT_OPTIONS,
} from '../../enums/property.enum';
import { PropertiesInquiry, PropertyInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_PROPERTY } from '../../../apollo/user/mutation';
import { GET_PROPERTIES } from '../../../apollo/user/query';
import { Property } from '../../types/property/property';
import { T } from '../../types/common';
import { Direction, Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { userVar } from '../../../apollo/store';

const tags_EN: PropertyAmenity[] = Object.values(PropertyAmenity);
const tags_KR: PropertyAmenityKorean[] = Object.values(PropertyAmenityKorean);
const otherTags_EN: PropertyOtherAmenity[] = Object.values(PropertyOtherAmenity);
const otherTags_KR: PropertyOtherAmenityKorean[] = Object.values(PropertyOtherAmenityKorean);

interface MapSearchDialogProps {
	open: boolean;
	onClose: () => void;
	initialInput: PropertiesInquiry;
}

const MapSearchDialog: React.FC<MapSearchDialogProps> = ({ open, onClose, initialInput }) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [spin, setSpin] = useState(false);
	const [price, setPrice] = useState<[number, number]>([0, 500000]);
	const [selectRatingIds, setSelectRatingIds] = useState<number[]>([]);
	const [selectTagIds, setSelectTagIds] = useState<PropertyAmenity[]>([]);
	const [selectOtheragIds, setSelectOtherTagIds] = useState<PropertyOtherAmenity[]>([]);
	const [openMoreTags, setOpenMoreTags] = useState<boolean>(false);
	const [openMoreOtherTags, setOpenMoreOtherTags] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [targetPropertyId, setTargetPropertyId] = useState<string | null>(null);
	const [sort, setSort] = useState('createdAt');
	const [type, setType] = useState('ALL');
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [hasRouterApplied, setHasRouterApplied] = useState(false);
	const openAn = Boolean(anchorEl);
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	/** APOLLO REQUESTS **/
	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		skip: !hasRouterApplied,
	});

	const properties: Property[] = getPropertiesData?.getProperties?.list ?? [];
	const total: number = getPropertiesData?.getProperties?.metaCounter[0]?.total ?? 1;

	/** LIFECYCLES **/
	useEffect(() => {
		if (!router.isReady) return;

		if (router.query.input) {
			setSearchFilter(JSON.parse(router?.query?.input as string));
		}
		setHasRouterApplied(true);
	}, [router.isReady, router.query.input]);

	useEffect(() => {
		if (searchFilter?.search?.propertyStarsList?.length === 0) {
			delete searchFilter?.search?.propertyStarsList;
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
					},
				})}`,
				{ scroll: false },
			);
		}

		if (searchFilter?.search?.amenityList?.length === 0) {
			delete searchFilter?.search?.amenityList;
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
					},
				})}`,
				{ scroll: false },
			);
		}

		if (searchFilter?.search?.otherAmenityList?.length === 0) {
			delete searchFilter?.search?.otherAmenityList;
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
					},
				})}`,
				{ scroll: false },
			);
		}
	}, [searchFilter]);

	/**HANDLERS**/
	const likePropertyHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({ variables: { input: id } });
			await getPropertiesRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('ERROR, likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message);
		}
	};

	const resetSearchFilter = () => {
		setSpin(true);
		setType('ALL');
		setPrice([0, 500000]);
		setSelectRatingIds([]);
		setSelectTagIds([]);
		setSelectOtherTagIds([]);
		setTimeout(() => {
			setSpin(false);
		}, 500);

		setSearchFilter({ ...initialInput });
	};

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const handleClose = () => setAnchorEl(null);

	const selectPropertyTypeHandler = (value: any) => {
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				propertyType: value,
			},
		});
	};

	const selectSortTypeHandler = (next: string, sort: string, direction: string) => {
		setSort(next);
		setAnchorEl(null);
		setSearchFilter({
			...searchFilter,
			sort: sort,
			direction: direction,
		});
	};

	const selectRangePriceHandler = (price: number[]) => {
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				pricesRange: {
					...searchFilter.search.pricesRange,
					start: price[0],
					end: price[1],
				},
			},
		});
	};

	const selectStarsHandler = (star: number, selected: boolean) => {
		if (!selected) {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					propertyStarsList: [...(searchFilter.search.propertyStarsList || []), star],
				},
			});
		} else if (selected) {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					propertyStarsList: searchFilter?.search?.propertyStarsList?.filter((item: number) => item !== star),
				},
			});
		}
	};

	const selectAmenityListHandler = (amenity: string, selected: boolean) => {
		if (!selected) {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					amenityList: [...(searchFilter.search.amenityList || []), amenity as PropertyAmenity],
				},
			});
		} else if (selected) {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					amenityList: searchFilter?.search?.amenityList!.filter((item: string) => item !== amenity),
				},
			});
		}
	};

	const selectOtehrAmenityListHandler = (otherAmenity: string, selected: boolean) => {
		if (!selected) {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					otherAmenityList: [...(searchFilter.search.otherAmenityList || []), otherAmenity as PropertyOtherAmenity],
				},
			});
		} else if (selected) {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					otherAmenityList: searchFilter?.search?.otherAmenityList!.filter((item: string) => item !== otherAmenity),
				},
			});
		}
	};

	const pushPropertyDetailHandler = (property: Property) => {
		const propertyInqiry: PropertyInquiry = {
			_id: String(property._id),
			propertyName: encodeURIComponent(property.propertyName),
			checkInDate: searchFilter?.search?.checkInDate!,
			checkOutDate: searchFilter?.search?.checkOutDate!,
			personal: searchFilter?.search?.personal!,
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

	const currentLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? '정렬';

	return (
		<div className="dialog-container">
			<Dialog
				fullScreen
				maxWidth={'xl'}
				open={open}
				onClose={onClose}
				PaperProps={{
					style: {
						borderRadius: 20,
						padding: '0px 20px',
						height: 'calc(100vh - 106px)',
						width: 'calc(100% - 100px)',
						margin: 'auto',
						position: 'absolute',
						left: '50px',
						top: '86px',
						overflow: 'hidden',
					},
				}}
			>
				<DialogContent className="map-dialog">
					{/* 헤더 */}
					<Box className="map-dialog-header">
						<IconButton onClick={onClose} size="large">
							<CloseIcon />
						</IconButton>
						<Typography className="map-dialog-title">지도</Typography>
						<Box style={{ width: 48 }} /> {/* 가운데 정렬용 더미 */}
					</Box>

					{/* --- 본문  */}
					<Box className="map-dialog-body">
						{/* 왼쪽 필터 */}
						<Box className="map-dialog-column filter-column">
							<Box className="filter-top">
								<Typography className="filter-title">필터</Typography>
								<Button className="filter-reset" disableRipple onClick={resetSearchFilter}>
									<RestartAltIcon className={spin ? 'rotate-once' : ''} />
									초기화
								</Button>
							</Box>

							<FormControlLabel
								control={<Checkbox size="small" />}
								label="매진 숙소 제외"
								className="soldout-checkbox"
							/>

							<Divider className="column-divider" />

							{/* 숙소 유형 */}
							<Box className="section">
								<Typography className="section-title">숙소유형</Typography>
								<RadioGroup
									defaultValue={type}
									className="roomtype-group"
									value={type}
									onChange={(e) => {
										setType(e.target.value);
										selectPropertyTypeHandler(e.target.value);
									}}
								>
									{Object.values(PropertyType).map((type, idx) => {
										const type_krName = Object.values(PropertyTypeKorean)[idx];
										return (
											<FormControlLabel
												key={idx}
												value={`${type}`}
												control={<Radio size="small" />}
												label={`${type_krName}`}
											/>
										);
									})}
								</RadioGroup>
							</Box>

							{/* 가격 */}
							<Box className="section">
								<Typography className="section-title">
									가격 <span className="section-sub">1박 기준</span>
								</Typography>
								<Box className="price-slider-wrapper">
									<Slider
										value={price}
										onChange={(_, newValue) => {
											if (Array.isArray(newValue)) {
												setPrice(newValue as [number, number]);
												selectRangePriceHandler(newValue as [number, number]);
											}
										}}
										min={0}
										max={500000}
										step={10000}
									/>
								</Box>
								<Typography className="price-range">
									{price[0].toLocaleString()}원 ~ {price[1].toLocaleString()}원 이상
								</Typography>
							</Box>

							{/* Rating */}
							<Box className="section">
								<Typography className="section-title">등급</Typography>
								<Box className="rating-list">
									{[5, 4, 3, 2].map((rating) => {
										const isInc = selectRatingIds.includes(rating);
										return (
											<div key={rating}>
												{isInc ? (
													<Chip
														key={rating}
														label={rating + '성급'}
														className="rating-chip active"
														onClick={() => {
															selectStarsHandler(rating, isInc);
															setSelectRatingIds((prev) =>
																prev.includes(rating) ? prev.filter((x) => x !== rating) : [...prev, rating],
															);
														}}
													/>
												) : (
													<Chip
														key={rating}
														label={rating + '성급'}
														className="rating-chip"
														onClick={() => {
															selectStarsHandler(rating, isInc);
															setSelectRatingIds((prev) =>
																prev.includes(rating) ? prev.filter((x) => x !== rating) : [...prev, rating],
															);
														}}
													/>
												)}
											</div>
										);
									})}
								</Box>
							</Box>

							{/* Tags */}
							<Box className="section">
								<Typography className="section-title">시설</Typography>
								<Box className={`hashtag-list ${openMoreTags ? 'active' : ''}`}>
									{tags_EN.map((tag, idx) => {
										const isInc = selectTagIds.includes(tag);
										return (
											<div key={tag}>
												{isInc ? (
													<Chip
														key={tag}
														label={'#' + tags_KR[idx]}
														className="hashtag-chip active"
														onClick={() => {
															selectAmenityListHandler(tag, isInc);
															setSelectTagIds((prev) =>
																prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
															);
														}}
													/>
												) : (
													<Chip
														key={tag}
														label={'#' + tags_KR[idx]}
														className="hashtag-chip"
														onClick={() => {
															selectAmenityListHandler(tag, isInc);
															setSelectTagIds((prev) =>
																prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
															);
														}}
													/>
												)}
											</div>
										);
									})}
								</Box>
								<Button className="more-link" disableRipple onClick={() => setOpenMoreTags(!openMoreTags)}>
									더 보기
								</Button>

								<Typography className="section-title">기타시설</Typography>
								<Box className={`hashtag-list ${openMoreOtherTags ? 'active' : ''}`}>
									{otherTags_EN.map((tag, idx) => {
										const isInc = selectOtheragIds.includes(tag);
										return (
											<div key={tag}>
												{isInc ? (
													<Chip
														key={tag}
														label={'#' + otherTags_KR[idx]}
														className="hashtag-chip active"
														onClick={() => {
															selectOtehrAmenityListHandler(tag, isInc);
															setSelectOtherTagIds((prev) =>
																prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
															);
														}}
													/>
												) : (
													<Chip
														key={tag}
														label={'#' + otherTags_KR[idx]}
														className="hashtag-chip"
														onClick={() => {
															selectOtehrAmenityListHandler(tag, isInc);
															setSelectOtherTagIds((prev) =>
																prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
															);
														}}
													/>
												)}
											</div>
										);
									})}
								</Box>
								<Button className="more-link" disableRipple onClick={() => setOpenMoreOtherTags(!openMoreOtherTags)}>
									더 보기
								</Button>
							</Box>
						</Box>

						{/* --- 가운데 리스트 */}
						<Box className="map-dialog-column list-column">
							<Box className="list-header">
								<Typography className="results-count">
									'{searchFilter?.search?.location}' 검색 결과 {total}개
								</Typography>
								<Button
									variant="outlined"
									onClick={handleOpen}
									className={`sort-trigger ${open ? 'open' : ''}`}
									endIcon={<KeyboardArrowDownIcon className={open ? 'sort-arrow open' : 'sort-arrow'} />}
								>
									{currentLabel}
								</Button>
								<Menu
									anchorEl={anchorEl}
									open={openAn}
									onClose={handleClose}
									className="sort-menu"
									anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
									transformOrigin={{ vertical: 'top', horizontal: 'left' }}
								>
									{SORT_OPTIONS.map((opt) => {
										const selected = opt.value === sort;
										return (
											<MenuItem
												key={opt.value}
												onClick={() => selectSortTypeHandler(opt.value, opt.sort, opt.direc)}
												selected={selected}
												className="sort-menu-item"
											>
												<ListItemText
													primary={opt.label}
													style={selected ? { color: '#ff4e5b' } : {}}
													className={selected ? 'selected-text' : ''}
												/>
												{selected && (
													<ListItemIcon className="check-icon">
														<CheckIcon fontSize="small" style={selected ? { color: '#ff4e5b' } : {}} />
													</ListItemIcon>
												)}
											</MenuItem>
										);
									})}
								</Menu>
							</Box>

							<Box className="list-scroll">
								{/* --- card */}
								{properties.length !== 0 ? (
									properties.map((property: Property, idx) => {
										const isFav = property?.meLiked?.[0]?.myFavorite;
										const checkin = property.rooms?.[0]?.stayPlans?.[1]?.stayPlanRules?.checkInFrom;
										return (
											<Card
												key={property._id}
												className="hotel-card"
												elevation={1}
												onClick={() => pushPropertyDetailHandler(property)}
												onMouseEnter={() => {
													setTargetPropertyId(property._id);
												}}
												onMouseLeave={() => {
													setTargetPropertyId(null);
												}}
											>
												<Box className="hotel-card-inner">
													<CardMedia
														component="img"
														image={`${process.env.REACT_APP_API_URL}/${property.propertyImages[0]}`}
														alt="room"
														className="hotel-image"
													/>
													<CardContent className="hotel-info">
														<Box className="hotel-header-row">
															<Box>
																<Typography className="hotel-type">{property.propertyType}</Typography>
																<Typography className="hotel-title">{property.propertyName}</Typography>
																<Typography className="hotel-location">{property.propertyLocation}</Typography>
															</Box>
															<IconButton
																className="favorite-btn"
																onClick={(e) => {
																	e.stopPropagation();
																	likePropertyHandler(user, property._id);
																}}
															>
																{isFav ? (
																	<FavoriteIcon className="popular-fav-icon active" />
																) : (
																	<FavoriteBorderIcon className="popular-fav-icon" />
																)}
															</IconButton>
														</Box>

														<Box className="hotel-rating-row">
															<Box className="rating-badge">
																<StarIcon className="rating-star" fontSize="small" />
																<span className="rating-score">{property.propertyRank!.toFixed(1)}</span>
															</Box>
															<Typography className="rating-count">
																{property.propertyComments!.toLocaleString()}명 평가
															</Typography>
														</Box>

														<Typography className="hotel-checkin">숙박 {String(checkin)} 체크인</Typography>

														<Box className="hotel-price-row">
															<Typography className="price-label">쿠폰 적용 시</Typography>
															<Typography className="price-value">
																{property.propertyPrice!.toLocaleString()}원/1박
															</Typography>
														</Box>
														<Typography className="price-warning">이 가격으로 남은 객실 1개</Typography>
													</CardContent>
												</Box>
											</Card>
										);
									})
								) : (
									<div className="no-data">
										<h1>검색 결과가 없어요.</h1>
										<p>'{searchFilter?.search?.location}'에 대한 철자를 확인하거나 긴 문구는 띄어쓰기를 해보세요.</p>
									</div>
								)}
							</Box>
						</Box>

						{/* 오른쪽 지도 */}
						<Box className="map-dialog-column map-column">
							<Box className="map-area">
								{properties.length !== 0 && <MapView targetPropertyId={targetPropertyId} properties={properties} />}
							</Box>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default MapSearchDialog;
