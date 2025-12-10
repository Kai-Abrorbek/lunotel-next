// SearchResultPage.jsx
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Box,
	Typography,
	Button,
	Card,
	CardContent,
	CardMedia,
	Checkbox,
	FormControlLabel,
	RadioGroup,
	Radio,
	Divider,
	Slider,
	Chip,
	IconButton,
	Stack,
	Pagination,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OtherLayout from '../../libs/components/layout/OtherLayout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { PropertiesInquiry, PropertyInquiry } from '../../libs/types/property/property.input';
import { useRouter } from 'next/router';
import {
	PropertyAmenityKorean,
	PropertyOtherAmenityKorean,
	PropertyType,
	PropertyTypeKorean,
} from '../../libs/enums/property.enum';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import MapSearchDialog from '../../libs/components/property/MapSearchDialog';
import { validate } from 'graphql';

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
interface SearchResultPageProps {
	initialInput: PropertiesInquiry;
}

const SearchResultPage = (props: SearchResultPageProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const [price, setPrice] = React.useState<[number, number]>([0, 500000]);
	const [selectRatingIds, setSelectRatingIds] = useState<number[]>([]);
	const [selectTagIds, setSelectTagIds] = useState<PropertyAmenityKorean[]>([]);
	const [selectOtheragIds, setSelectOtherTagIds] = useState<PropertyOtherAmenityKorean[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [openMoreTags, setOpenMoreTags] = useState<boolean>(false);
	const [openMoreOtherTags, setOpenMoreOtherTags] = useState<boolean>(false);
	const [spin, setSpin] = useState(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [sort, setSort] = React.useState('RATING_DESC');
	const [type, setType] = React.useState('ALL');
	const [mapOpen, setMapOpen] = useState(false);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [total, setTotal] = useState<number>(11);
	const locationRef: any = useRef();
	const currentLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? '정렬';
	const open = Boolean(anchorEl);

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
			setCurrentPage(inputObj.page);
		}
	}, [router]);

	useEffect(() => {
		if (searchFilter?.search.propertyStarsList?.length === 0) {
			delete searchFilter.search.propertyStarsList;
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

		if (searchFilter?.search.amenityList?.length === 0) {
			delete searchFilter.search.amenityList;
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

		if (searchFilter?.search.otherAmenityList?.length === 0) {
			delete searchFilter.search.otherAmenityList;
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
	/** HANDLERS **/

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

		const inputObj = localStorage.getItem('searchFilter');
		if (inputObj) {
			const data = JSON.parse(inputObj);
			setSearchFilter({ ...data });
			router.push(`/property?input=${JSON.stringify({ ...data })}`, `/property?input=${JSON.stringify({ ...data })}`, {
				scroll: false,
			});
		}
	};

	const handleClose = () => setAnchorEl(null);

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const paginationHandler = (e: any, value: number) => {
		searchFilter.page = value;
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
			{
				scroll: false,
			},
		);

		setCurrentPage(value);
	};

	const selectPropertyTypeHandler = (value: any) => {
		router.push(
			`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
					propertyType: value,
				},
			})}`,
			`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
					propertyType: value,
				},
			})}`,
			{
				scroll: false,
			},
		);
	};

	const selectSortTypeHandler = (next: string) => {
		setSort(next);
		setAnchorEl(null);
		router.push(
			`/property?input=${JSON.stringify({
				...searchFilter,
				sort: next,
			})}`,
			`/property?input=${JSON.stringify({
				...searchFilter,
				sort: next,
			})}`,
			{
				scroll: false,
			},
		);
	};

	const selectRangePriceHandler = (price: number[]) => {
		router.push(
			`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
					pricesRange: {
						start: price[0],
						end: price[1],
					},
				},
			})}`,
			`/property?input=${JSON.stringify({
				...searchFilter,
				search: {
					...searchFilter.search,
					pricesRange: {
						start: price[0],
						end: price[1],
					},
				},
			})}`,
			{
				scroll: false,
			},
		);
	};

	const selectStarsHandler = (star: number, selected: boolean) => {
		if (!selected) {
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						propertyStarsList: [...(searchFilter.search.propertyStarsList || []), star],
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						propertyStarsList: [...(searchFilter.search.propertyStarsList || []), star],
					},
				})}`,
				{
					scroll: false,
				},
			);
		} else if (selected) {
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						propertyStarsList: searchFilter?.search?.propertyStarsList?.filter((item: number) => item !== star),
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						propertyStarsList: searchFilter?.search?.propertyStarsList?.filter((item: number) => item !== star),
					},
				})}`,
				{
					scroll: false,
				},
			);
		}
	};

	const selectAmenityListHandler = (amenity: string, selected: boolean) => {
		if (!selected) {
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						amenityList: [...(searchFilter.search.amenityList || []), amenity],
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						amenityList: [...(searchFilter.search.amenityList || []), amenity],
					},
				})}`,
				{
					scroll: false,
				},
			);
		} else if (selected) {
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						amenityList: searchFilter?.search?.amenityList?.filter((item: string) => item !== amenity),
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						amenityList: searchFilter?.search?.amenityList?.filter((item: string) => item !== amenity),
					},
				})}`,
				{
					scroll: false,
				},
			);
		}
	};

	const selectOtehrAmenityListHandler = (otherAmenity: string, selected: boolean) => {
		if (!selected) {
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						otherAmenityList: [...(searchFilter.search.otherAmenityList || []), otherAmenity],
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						otherAmenityList: [...(searchFilter.search.otherAmenityList || []), otherAmenity],
					},
				})}`,
				{
					scroll: false,
				},
			);
		} else if (selected) {
			router.push(
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						otherAmenityList: searchFilter?.search?.otherAmenityList?.filter((item: string) => item !== otherAmenity),
					},
				})}`,
				`/property?input=${JSON.stringify({
					...searchFilter,
					search: {
						...searchFilter.search,
						otherAmenityList: searchFilter?.search?.otherAmenityList?.filter((item: string) => item !== otherAmenity),
					},
				})}`,
				{
					scroll: false,
				},
			);
		}
	};

	const pushPropertyDetailHandler = (item: number, name: string) => {
		const propertyInqiry: PropertyInquiry = {
			_id: String(item),
			propertyName: name,
			checkInDate: searchFilter?.search?.checkInDate!,
			checkOutDate: searchFilter?.search?.checkOutDate!,
			personal: searchFilter?.search?.personal!,
		};

		localStorage.setItem('propertyInqiry', JSON.stringify({ ...propertyInqiry }));
		router.push(
			`/property/propertyId=${item}?input=${JSON.stringify({ ...propertyInqiry })}`,
			`/property/propertyId=${item}?input=${JSON.stringify({ ...propertyInqiry })}`,
			{
				scroll: false,
			},
		);
	};

	return (
		<Stack className="container">
			<MapSearchDialog open={mapOpen} onClose={() => setMapOpen(false)} initialInput={searchFilter} />
			<Box className="search-page" ref={locationRef}>
				<Box className="search-layout">
					{/* LEFT : FILTER */}
					<Box className="filter-panel">
						{/* Map */}
						<Box className="map-card">
							<Box component={'img'} src="/img/map.webp" className="map-image" />
							<Button variant="contained" className="map-button" onClick={() => setMapOpen(true)}>
								지도 보기
							</Button>
						</Box>

						{/* Filter title */}
						<Box className="filter-header">
							<Typography className="filter-title">필터</Typography>
							<Button className="filter-reset" disableRipple onClick={resetSearchFilter}>
								<RestartAltIcon className={spin ? 'rotate-once' : ''} />
								초기화
							</Button>
						</Box>

						<FormControlLabel control={<Checkbox size="small" />} label="매진 숙소 제외" className="soldout-checkbox" />

						<Divider className="filter-divider" />

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

						{/* Price */}
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

					{/* RIGHT : RESULTS */}
					<Box className="results-panel">
						{/* header */}
						<Box className="results-header">
							<Typography className="results-count">
								{searchFilter.search?.location} 검색 결과 {total}개
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
								open={open}
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

						<Box className="hotel-card-box">
							{[1, 2, 3, 4, 5, 6, 7].length !== 0 ? (
								[1, 2, 3, 4, 5, 6, 7].map((item) => {
									const isFav = favoriteIds.includes(item);
									return (
										<Card
											key={item}
											className="hotel-card"
											elevation={1}
											onClick={() => pushPropertyDetailHandler(item, '잠실 라운지 호텔 - LOUNGE')}
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
								})
							) : (
								<div className="no-data">
									<h1>검색 결과가 없어요.</h1>
									<p>'asdd'에 대한 철자를 확인하거나 긴 문구는 띄어쓰기를 해보세요.</p>
								</div>
							)}
						</Box>

						{[1, 2, 3, 4, 5].length !== 0 ? (
							<Stack className="result-pagination">
								<Pagination
									count={Math.ceil(total / searchFilter?.limit!) || 1}
									page={currentPage}
									shape="circular"
									color="primary"
									onChange={paginationHandler}
								/>
							</Stack>
						) : (
							''
						)}
					</Box>
				</Box>
			</Box>
		</Stack>
	);
};

SearchResultPage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {
			location: '',
			checkInDate: '',
			checkOutDate: '',
			personal: '',
			propertyType: 'ALL',
		},
	},
};

export default OtherLayout(SearchResultPage);
