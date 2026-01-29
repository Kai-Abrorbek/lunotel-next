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
	PropertyAmenity,
	PropertyAmenityKorean,
	PropertyOtherAmenity,
	PropertyOtherAmenityKorean,
	PropertyType,
	PropertyTypeKorean,
	SORT_OPTIONS,
} from '../../libs/enums/property.enum';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckIcon from '@mui/icons-material/Check';
import MapSearchDialog from '../../libs/components/property/MapSearchDialog';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { GET_PROPERTIES } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Property } from '../../libs/types/property/property';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const tags_EN: PropertyAmenity[] = Object.values(PropertyAmenity);
const tags_KR: PropertyAmenityKorean[] = Object.values(PropertyAmenityKorean);
const otherTags_EN: PropertyOtherAmenity[] = Object.values(PropertyOtherAmenity);
const otherTags_KR: PropertyOtherAmenityKorean[] = Object.values(PropertyOtherAmenityKorean);

interface SearchResultPageProps {
	initialInput: PropertiesInquiry;
}

const SearchResultPage = (props: SearchResultPageProps) => {
	const { initialInput } = props;
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [price, setPrice] = React.useState<[number, number]>([0, 500000]);
	const [selectRatingIds, setSelectRatingIds] = useState<number[]>([]);
	const [selectTagIds, setSelectTagIds] = useState<PropertyAmenity[]>([]);
	const [selectOtheragIds, setSelectOtherTagIds] = useState<PropertyOtherAmenity[]>([]);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [openMoreTags, setOpenMoreTags] = useState<boolean>(false);
	const [openMoreOtherTags, setOpenMoreOtherTags] = useState<boolean>(false);
	const [spin, setSpin] = useState(false);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sort, setSort] = useState('createdAt');
	const [type, setType] = useState('ALL');
	const [mapOpen, setMapOpen] = useState(false);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [hasRouterApplied, setHasRouterApplied] = useState(false);
	const locationRef: any = useRef();
	const currentLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? '정렬';
	const open = Boolean(anchorEl);
	const [lang, setLang] = useState<string | null>(null);

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
		if (typeof window === 'undefined') return;
		const lang = localStorage.getItem('locale');
		setLang(lang);
	}, [router]);

	useEffect(() => {
		if (!router.isReady) return;

		if (router.query.input) {
			setSearchFilter(JSON.parse(router?.query?.input as string));
		}
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
		setHasRouterApplied(true);
	}, [router.isReady, router.query.input]);

	useEffect(() => {
		if (searchFilter?.search?.propertyStarsList?.length === 0) {
			delete searchFilter.search.propertyStarsList;
			router.replace(
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
			delete searchFilter.search.amenityList;
			router.replace(
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
			delete searchFilter.search.otherAmenityList;
			router.replace(
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
	}, [searchFilter, router]);
	/** --- HANDLER **/
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

	const paginationHandler = async (e: any, value: number) => {
		searchFilter.page = value;
		await router.push(
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

	const selectPropertyTypeHandler = async (value: any) => {
		await router.push(
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

	const selectSortTypeHandler = async (next: string, sort: string, direction: string) => {
		setSort(next);
		setAnchorEl(null);
		await router.push(
			`/property?input=${JSON.stringify({
				...searchFilter,
				sort: sort,
				direction: direction,
			})}`,
			`/property?input=${JSON.stringify({
				...searchFilter,
				sort: sort,
				direction: direction,
			})}`,
			{
				scroll: false,
			},
		);
	};

	const selectRangePriceHandler = async (price: number[]) => {
		await router.push(
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

	const selectStarsHandler = async (star: number, selected: boolean) => {
		if (!selected) {
			await router.push(
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
			await router.push(
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

	const selectAmenityListHandler = async (amenity: string, selected: boolean) => {
		if (!selected) {
			await router.push(
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
			await router.push(
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

	const selectOtehrAmenityListHandler = async (otherAmenity: string, selected: boolean) => {
		if (!selected) {
			await router.push(
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
			await router.push(
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

	return (
		<Stack className="container">
			{properties.length !== 0 && (
				<MapSearchDialog open={mapOpen} onClose={() => setMapOpen(false)} initialInput={searchFilter} />
			)}
			<Box className="search-page" ref={locationRef}>
				<Box className="search-layout">
					{/* LEFT : FILTER */}
					<Box className="filter-panel">
						{/* Map */}
						<Box className="map-card">
							<Box component={'img'} src="/img/map.webp" className="map-image" />
							<Button variant="contained" className="map-button" onClick={() => setMapOpen(true)}>
								{t('지도 보기')}
							</Button>
						</Box>

						{/* Filter title */}
						<Box className="filter-header">
							<Typography className="filter-title">{t('필터')}</Typography>
							<Button className="filter-reset" disableRipple onClick={resetSearchFilter}>
								<RestartAltIcon className={spin ? 'rotate-once' : ''} />
								{t('초기화')}
							</Button>
						</Box>

						<FormControlLabel
							control={<Checkbox size="small" />}
							label={t('매진 숙소 제외')}
							className="soldout-checkbox"
						/>

						<Divider className="filter-divider" />

						{/* 숙소 유형 */}
						<Box className="section">
							<Typography className="section-title">{t('숙소유형')}</Typography>
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
											label={t(`${type_krName}`)}
										/>
									);
								})}
							</RadioGroup>
						</Box>

						{/* Price */}
						<Box className="section">
							<Typography className="section-title">
								가격 <span className="section-sub">1{t('박 기준')}</span>
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
								{price[0].toLocaleString()}
								{t('원')} ~ {price[1].toLocaleString()}
								{t('원 이상')}
							</Typography>
						</Box>
						{/* Rating */}
						<Box className="section">
							<Typography className="section-title">{t('등급')}</Typography>
							<Box className="rating-list">
								{[5, 4, 3, 2].map((rating) => {
									const isInc = selectRatingIds.includes(rating);
									return (
										<div key={rating}>
											{isInc ? (
												<Chip
													key={rating}
													label={rating + t('성급')}
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
													label={rating + t('성급')}
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
							<Typography className="section-title">{t('시설')}</Typography>
							<Box className={`hashtag-list ${openMoreTags ? 'active' : ''}`}>
								{tags_EN.map((tag, idx) => {
									const isInc = selectTagIds.includes(tag);
									return (
										<div key={tag}>
											{isInc ? (
												<Chip
													key={tag}
													label={lang === 'en' ? `#${tag}` : `#${tags_KR[idx]}`}
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
													label={lang === 'en' ? `#${tag}` : `#${tags_KR[idx]}`}
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
								{t('더 보기')}
							</Button>

							<Typography className="section-title">{t('기타시설')}</Typography>
							<Box className={`hashtag-list ${openMoreOtherTags ? 'active' : ''}`}>
								{otherTags_EN.map((tag, idx) => {
									const isInc = selectOtheragIds.includes(tag);
									return (
										<div key={tag}>
											{isInc ? (
												<Chip
													key={tag}
													label={lang === 'en' ? `#${tag}` : `#${otherTags_KR[idx]}`}
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
													label={lang === 'en' ? `#${tag}` : `#${otherTags_KR[idx]}`}
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
								{t('더 보기')}
							</Button>
						</Box>
					</Box>

					{/* RIGHT : RESULTS */}
					<Box className="results-panel">
						{/* header */}
						<Box className="results-header">
							<Typography className="results-count">
								{searchFilter.search?.location} {t('검색 결과')} {total}
								{t('개')}
							</Typography>
							<Button
								variant="outlined"
								onClick={handleOpen}
								className={`sort-trigger ${open ? 'open' : ''}`}
								endIcon={<KeyboardArrowDownIcon className={open ? 'sort-arrow open' : 'sort-arrow'} />}
							>
								{t(`${currentLabel}`)}
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
											onClick={() => selectSortTypeHandler(opt.value, opt.sort, opt.direc)}
											selected={selected}
											className="sort-menu-item"
										>
											<ListItemText
												primary={t(`${opt.label}`)}
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
							{properties.length !== 0 ? (
								properties.map((property: Property, idx) => {
									const isFav = property?.meLiked?.[0]?.myFavorite;
									const checkin =
										property.rooms?.[0]?.stayPlans?.[1]?.inventories?.length !== 0
											? property.rooms?.[0]?.stayPlans?.[1]?.stayPlanRules?.checkInFrom
											: property.rooms?.[0]?.stayPlans?.[0]?.stayPlanRules?.windowStart;

									return (
										<Card
											key={property._id}
											className="hotel-card"
											elevation={1}
											onClick={() => pushPropertyDetailHandler(property)}
										>
											<Box className="hotel-card-inner">
												<CardMedia
													component="img"
													image={`${process.env.REACT_APP_API_URL}/${property.propertyImages[0]}`} // 여기 나중에 실제 이미지로 교체
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

						{properties.length !== 0 ? ( // 나중에 실제 데이터랑 변경
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
		direction: 'DESC',
		search: {},
	},
};

export default OtherLayout(SearchResultPage);
