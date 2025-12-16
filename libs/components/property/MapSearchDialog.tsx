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
} from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';

const tags: PropertyAmenityKorean[] = Object.values(PropertyAmenityKorean);
const otherTags: PropertyOtherAmenityKorean[] = Object.values(PropertyOtherAmenityKorean);
const SORT_OPTIONS = [
	{ value: 'createdAt', label: '추천순' },
	{ value: 'propertyRank', label: '평점높은순' },
	{ value: 'propertyComments', label: '리뷰많은순' },
	{ value: 'propertyPrice_DESC', label: '낮은가격순' },
	{ value: 'propertyRank_ASC', label: '높은가격순' },
	{ value: 'propertyReservations', label: '거리순' },
];

interface MapSearchDialogProps {
	open: boolean;
	onClose: () => void;
	initialInput: PropertiesInquiry;
}

const MapSearchDialog: React.FC<MapSearchDialogProps> = ({ open, onClose, initialInput }) => {
	const router = useRouter();
	const [spin, setSpin] = useState(false);
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const [price, setPrice] = useState<[number, number]>([0, 500000]);
	const [selectRatingIds, setSelectRatingIds] = useState<number[]>([]);
	const [selectTagIds, setSelectTagIds] = useState<PropertyAmenityKorean[]>([]);
	const [selectOtheragIds, setSelectOtherTagIds] = useState<PropertyOtherAmenityKorean[]>([]);
	const [openMoreTags, setOpenMoreTags] = useState<boolean>(false);
	const [openMoreOtherTags, setOpenMoreOtherTags] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [targetPropertyEl, setTargetPropertyEl] = useState<number | null>(null);
	const [sort, setSort] = useState('createdAt');
	const [type, setType] = useState('ALL');
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [total, setTotal] = useState<number>(10);
	const openAn = Boolean(anchorEl);

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
	}, [router]);

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

	const selectSortTypeHandler = (sort: string) => {
		setSort(sort);
		setAnchorEl(null);
		setSearchFilter({
			...searchFilter,
			sort: sort,
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
						height: '90%',
						width: '95%',
						margin: 'auto 0',
						position: 'absolute',
						left: '50px',
						top: '86px',
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
									{tags.map((tag) => {
										const isInc = selectTagIds.includes(tag);
										return (
											<div key={tag}>
												{isInc ? (
													<Chip
														key={tag}
														label={'#' + tag}
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
														label={'#' + tag}
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
									{otherTags.map((tag) => {
										const isInc = selectOtheragIds.includes(tag);
										return (
											<div key={tag}>
												{isInc ? (
													<Chip
														key={tag}
														label={'#' + tag}
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
														label={'#' + tag}
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
												onClick={() => selectSortTypeHandler(opt.value)}
												selected={selected}
												className="sort-menu-item"
											>
												<ListItemText
													primary={opt.label}
													style={selected ? { color: '#1976d2' } : {}}
													className={selected ? 'selected-text' : ''}
												/>
												{selected && (
													<ListItemIcon className="check-icon">
														<CheckIcon fontSize="small" style={selected ? { color: '#1976d2' } : {}} />
													</ListItemIcon>
												)}
											</MenuItem>
										);
									})}
								</Menu>
							</Box>

							<Box className="list-scroll">
								{/* --- card */}
								{[1, 2, 3, 4, 5, 6, 7].map((item) => {
									const isFav = favoriteIds.includes(item);
									return (
										<Card
											key={item}
											className="hotel-card"
											elevation={1}
											onMouseEnter={() => {
												setTargetPropertyEl(item);
											}}
											onMouseLeave={() => {
												setTargetPropertyEl(null);
											}}
										>
											<Box className="hotel-card-inner">
												<CardMedia
													component="img"
													image="https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800" // 여기 나중에 실제 이미지로 교체
													alt="room"
													className="hotel-image"
												/>
												<CardContent className="hotel-info">
													<Box className="hotel-header-row">
														<Box>
															<Typography className="hotel-type">모텔</Typography>
															<Typography className="hotel-title">잠실 라운지 호텔 - LOUNGE</Typography>
															<Typography className="hotel-location">몽토르성(잠실역) 도보 5분</Typography>
														</Box>
														<IconButton
															className="favorite-btn"
															onClick={(e) => {
																e.stopPropagation();
																setFavoriteIds((prev) =>
																	prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
																);
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
															<span className="rating-score">9.9</span>
														</Box>
														<Typography className="rating-count">411명 평가</Typography>
													</Box>

													<Typography className="hotel-checkin">숙박 14:00 체크인</Typography>

													<Box className="hotel-price-row">
														<Typography className="price-label">쿠폰 적용 시</Typography>
														<Typography className="price-value">221,666원/1박</Typography>
													</Box>
													<Typography className="price-warning">이 가격으로 남은 객실 1개</Typography>
												</CardContent>
											</Box>
										</Card>
									);
								})}
							</Box>
						</Box>

						{/* 오른쪽 지도 */}
						<Box className="map-dialog-column map-column">
							<Box className="map-area">
								<MapView targetPropertyEl={targetPropertyEl} />
							</Box>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default MapSearchDialog;
