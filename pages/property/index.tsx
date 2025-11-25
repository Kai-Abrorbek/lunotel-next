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
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { useRouter } from 'next/router';
import { PropertyAmenityKorean, PropertyOtherAmenityKorean } from '../../libs/enums/property.enum';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import MapSearchDialog from '../../libs/components/property/MapSearchDialog';

const tags: PropertyAmenityKorean[] = Object.values(PropertyAmenityKorean);
const otherTags: PropertyOtherAmenityKorean[] = Object.values(PropertyOtherAmenityKorean);
const SORT_OPTIONS = [
	{ value: 'RECOMMEND', label: '추천순' },
	{ value: 'RATING_DESC', label: '평점높은순' },
	{ value: 'REVIEW_DESC', label: '리뷰많은순' },
	{ value: 'PRICE_ASC', label: '낮은가격순' },
	{ value: 'PRICE_DESC', label: '높은가격순' },
	{ value: 'DISTANCE_ASC', label: '거리순' },
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
	const [value, setValue] = React.useState('RATING_DESC');
	const [mapOpen, setMapOpen] = useState(false);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [total, setTotal] = useState<number>(11);
	const locationRef: any = useRef();
	const raw = router.query.input;
	const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label ?? '정렬';
	const open = Boolean(anchorEl);

	/** LIFECYCLES **/
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('searchFilter');
		if (!saved) return;
		const parsed = JSON.parse(saved);
		setSearchFilter(parsed);
		setCurrentPage(searchFilter?.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		if (typeof raw === 'string') {
			const parsed = JSON.parse(raw);
			setSearchFilter(parsed);
		}
	}, [raw]);

	/** HANDLERS **/
	const paginationHandler = (e: any, value: number) => {
		searchFilter.page = value;
		router.push(`/property?input=${JSON.stringify(searchFilter)}`, `/property?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});

		localStorage.setItem('searchFilter', JSON.stringify(searchFilter));
		setCurrentPage(value);
	};

	const selectPropertyType = (value: any) => {
		console.log(value);
	};

	const resetSearchFilter = () => {
		setSpin(true);
		setPrice([0, 500000]);
		setSelectRatingIds([]);
		setSelectTagIds([]);
		setSelectOtherTagIds([]);
		setTimeout(() => {
			setSpin(false);
		}, 500);
	};

	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => setAnchorEl(null);
	const handleSelect = (next: string) => {
		setValue(next);
		setAnchorEl(null);
		// 여기서 API 호출 or 정렬 변경 로직 넣으면 됨
	};

	const pushPropertyDetailHandler = (item: number, name: string) => {
		if (searchFilter.search) searchFilter.search.propertyName = name;
		localStorage.setItem('searchFilter', JSON.stringify(searchFilter));
		router.push(
			`/property/propertyId=${item}?input=${JSON.stringify(searchFilter)}`,
			`/property/propertyId=${item}?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
	};

	return (
		<Stack className="container">
			<MapSearchDialog open={mapOpen} onClose={() => setMapOpen(false)} />
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
								defaultValue="all"
								className="roomtype-group"
								onChange={(e) => selectPropertyType(e.target.value)}
							>
								<FormControlLabel value="all" control={<Radio size="small" />} label="전체" />
								<FormControlLabel value="motel" control={<Radio size="small" />} label="모텔" />
								<FormControlLabel value="hotel" control={<Radio size="small" />} label="호텔·리조트" />
								<FormControlLabel value="pension" control={<Radio size="small" />} label="펜션" />
								<FormControlLabel value="homevilla" control={<Radio size="small" />} label="홈&빌라" />
								<FormControlLabel value="camping" control={<Radio size="small" />} label="캠핑" />
								<FormControlLabel value="guest" control={<Radio size="small" />} label="게하·한옥" />
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
													onClick={() =>
														setSelectRatingIds((prev) =>
															prev.includes(rating) ? prev.filter((x) => x !== rating) : [...prev, rating],
														)
													}
												/>
											) : (
												<Chip
													key={rating}
													label={rating + '성급'}
													className="rating-chip"
													onClick={() =>
														setSelectRatingIds((prev) =>
															prev.includes(rating) ? prev.filter((x) => x !== rating) : [...prev, rating],
														)
													}
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
													onClick={() =>
														setSelectTagIds((prev) =>
															prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
														)
													}
												/>
											) : (
												<Chip
													key={tag}
													label={'#' + tag}
													className="hashtag-chip"
													onClick={() =>
														setSelectTagIds((prev) =>
															prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
														)
													}
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
													onClick={() =>
														setSelectOtherTagIds((prev) =>
															prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
														)
													}
												/>
											) : (
												<Chip
													key={tag}
													label={'#' + tag}
													className="hashtag-chip"
													onClick={() =>
														setSelectOtherTagIds((prev) =>
															prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag],
														)
													}
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
									const selected = opt.value === value;
									return (
										<MenuItem
											key={opt.value}
											onClick={() => handleSelect(opt.value)}
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

						{/* card */}
						{[1, 2, 3, 4, 5, 6, 7].map((item) => {
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
						})}

						<Divider className="result-divider" />
						<Stack className="result-pagination">
							<Pagination
								count={Math.ceil(total / searchFilter?.limit!) || 1}
								page={currentPage}
								shape="circular"
								color="primary"
								onChange={paginationHandler}
							/>
						</Stack>
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
		search: {
			location: undefined,
			checkInDate: undefined,
			checkOutDate: undefined,
			personal: undefined,
		},
	},
};

export default OtherLayout(SearchResultPage);
