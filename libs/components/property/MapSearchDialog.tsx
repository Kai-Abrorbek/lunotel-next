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
import { PropertyAmenityKorean, PropertyOtherAmenityKorean } from '../../enums/property.enum';
import { PropertiesInquiry } from '../../types/property/property.input';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';

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

interface MapSearchDialogProps {
	open: boolean;
	onClose: () => void;
}

const MapSearchDialog: React.FC<MapSearchDialogProps> = ({ open, onClose }) => {
	const [spin, setSpin] = useState(false);
	const router = useRouter();
	const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
	const [price, setPrice] = React.useState<[number, number]>([0, 500000]);
	const [selectRatingIds, setSelectRatingIds] = useState<number[]>([]);
	const [selectTagIds, setSelectTagIds] = useState<PropertyAmenityKorean[]>([]);
	const [selectOtheragIds, setSelectOtherTagIds] = useState<PropertyOtherAmenityKorean[]>([]);
	const [openMoreTags, setOpenMoreTags] = useState<boolean>(false);
	const [openMoreOtherTags, setOpenMoreOtherTags] = useState<boolean>(false);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [value, setValue] = React.useState('RATING_DESC');
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : null,
	);
	const [total, setTotal] = useState<number>(10);
	const raw = router.query.input;

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}
	}, [router]);

	useEffect(() => {
		if (typeof raw === 'string') {
			const parsed = JSON.parse(raw);
			setSearchFilter(parsed);
		}
	}, [raw]);

	/**HANDLERS**/
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

	const openAn = Boolean(anchorEl);
	const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => setAnchorEl(null);

	const handleSelect = (next: string) => {
		setValue(next);
		setAnchorEl(null);
		// 여기서 API 호출 or 정렬 변경 로직 넣으면 됨
	};

	const currentLabel = SORT_OPTIONS.find((o) => o.value === value)?.label ?? '정렬';

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
						height: '100%',
						width: '95%',
						margin: 'auto 0',
						position: 'absolute',
						left: '50px',
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

					{/* 본문 */}
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
								<RadioGroup defaultValue="all" className="roomtype-group">
									<FormControlLabel value="all" control={<Radio size="small" />} label="전체" />
									<FormControlLabel value="motel" control={<Radio size="small" />} label="모텔" />
									<FormControlLabel value="hotel" control={<Radio size="small" />} label="호텔·리조트" />
									<FormControlLabel value="pension" control={<Radio size="small" />} label="펜션" />
									<FormControlLabel value="homevilla" control={<Radio size="small" />} label="홈&빌라" />
									<FormControlLabel value="camping" control={<Radio size="small" />} label="캠핑" />
									<FormControlLabel value="guest" control={<Radio size="small" />} label="게하·한옥" />
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

						{/* 가운데 리스트 */}
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

							<Box className="list-scroll">
								{/* card */}
								{[1, 2, 3, 4, 5, 6, 7].map((item) => {
									const isFav = favoriteIds.includes(item);
									return (
										<Card key={item} className="hotel-card" elevation={1}>
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
								<MapView />
							</Box>
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default MapSearchDialog;
