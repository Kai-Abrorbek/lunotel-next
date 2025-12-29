import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Button, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PropertiesInquiry, PropertyInquiry } from '../../types/property/property.input';
import { PropertyLocation } from '../../enums/property.enum';
import { bubbleAlert } from '../../sweetAlert';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

type TabKey = 'domestic' | 'overseas' | 'package';

const TABS: { key: TabKey; label: string; badgeNew?: boolean }[] = [
	{ key: 'domestic', label: '국내 숙소' },
	{ key: 'overseas', label: '해외 숙소' },
	{ key: 'package', label: '패키지 여행', badgeNew: true },
];

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function formatRangeLabel(checkIn: Date | undefined, checkOut: Date | undefined) {
	if (!checkIn || !checkOut) return '날짜를 선택하세요';

	const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

	const fmonth = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
	const fday = (d: Date) => d.getDate().toString().padStart(2, '0');
	const fweek = (d: Date) => WEEK_DAYS[d.getDay()];

	return `${fmonth(checkIn)}.${fday(checkIn)} ${fweek(checkIn)} - ${fmonth(checkOut)}.${fday(checkOut)} ${fweek(
		checkOut,
	)} (${nights}박)`;
}

function isSameDate(a: Date | undefined, b: Date | undefined) {
	if (!a || !b) return false;
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface HeroCardProps {
	initialInput: PropertiesInquiry;
	refElement: any;
	setHeroCardOpen: (v: boolean) => void;
	propertyName: string | null;
}

const HeroCard = (props: HeroCardProps) => {
	const { t, i18n } = useTranslation('common');
	const { initialInput, refElement, setHeroCardOpen, propertyName } = props;
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const today = useMemo(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // 00:00
	}, []);
	const locationRef: any = useRef();
	const dateRef: any = useRef();
	const pesonalRef: any = useRef();
	const [activeTab, setActiveTab] = useState<TabKey>('domestic');
	const [checkIn, setCheckIn] = useState<Date | undefined>(toDate(initialInput.search?.checkInDate));
	const [checkOut, setCheckOut] = useState<Date | undefined>(toDate(initialInput.search?.checkOutDate));
	const [currentProperty, setCurrentProperty] = useState<string | null>(propertyName ? propertyName : null);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [showGuestPicker, setShowGuestPicker] = useState(false);
	const [showKeywordPanel, setShowKeywordPanel] = useState(false);
	const [recentSearches, setRecentSearches] = useState<string[]>([]);
	const [currentMonth, setCurrentMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth(), 1);
	});
	const [nextMonth, setNextMonth] = useState<Date>(() => {
		const d = new Date();
		return new Date(d.getFullYear(), d.getMonth() + 1, 1);
	});

	function toDate(value: string | undefined): Date | undefined {
		return value ? new Date(value) : undefined;
	}

	/** LIFESICLE **/
	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!locationRef?.current?.contains(event.target)) {
				setShowKeywordPanel(false);
			}

			if (!dateRef?.current?.contains(event.target)) {
				setShowDatePicker(false);
			}

			if (!pesonalRef?.current?.contains(event.target)) {
				setShowGuestPicker(false);
			}
		};

		document.addEventListener('mousedown', clickHandler);

		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, []);

	useEffect(() => {
		if (searchFilter) {
			localStorage.setItem('searchFilter', JSON.stringify(searchFilter));
		}
	}, [searchFilter]);
	/** LIFESICLE **/

	/**UTIL FANCTION**/
	const changeMonth = (offset: number) => {
		setCurrentMonth((prev) => {
			const year = prev.getFullYear();
			const month = prev.getMonth() + offset;
			return new Date(year, month, 1);
		});

		setNextMonth((prev) => {
			const year = prev.getFullYear();
			const month = prev.getMonth() + offset;
			return new Date(year, month, 1);
		});
	};

	const buildCalendarCells = (monthDate: Date) => {
		const year = monthDate.getFullYear();
		const month = monthDate.getMonth();
		const firstDay = new Date(year, month, 1);
		const firstDow = firstDay.getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();

		const cells: (Date | null)[] = [];

		for (let i = 0; i < firstDow; i++) cells.push(null);
		for (let d = 1; d <= daysInMonth; d++) {
			cells.push(new Date(year, month, d));
		}
		while (cells.length % 7 !== 0) cells.push(null);

		return cells;
	};

	const inRange = (day: Date) => {
		if (!checkIn || !checkOut) return false;
		const t = day.getTime();
		return t > checkIn.getTime() && t < checkOut.getTime();
	};

	function isPastDate(day: Date | null, baseMonth: Date) {
		if (!day) return false;
		const cellDate = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), day.getDate());
		return cellDate < today;
	}
	/**UTIL FANCTION**/

	/** HANDLER **/
	const handleSelectKeyword = useCallback(
		async (word: string) => {
			setRecentSearches((prev) => {
				const updated = [word, ...prev.filter((w) => w !== word)];
				return updated.slice(0, 4);
			});

			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					location: (word as PropertyLocation) || String,
				},
			});
			setShowKeywordPanel(false);

			searchFilter.search.location = word as PropertyLocation;
			await router.push(
				`/property?input=${JSON.stringify({ ...searchFilter })}`,
				`/property?input=${JSON.stringify({ ...searchFilter })}`,
				{
					scroll: true,
				},
			);
		},
		[searchFilter],
	);

	const handleSelectDay = useCallback(
		async (day: Date) => {
			if (!checkIn || (checkIn && checkOut)) {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						checkInDate: formatDate(day),
						checkOutDate: '',
					},
				});
				setCheckIn(day);
				setCheckOut(undefined);
				return;
			}

			if (day.getTime() < checkIn.getTime()) {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						checkInDate: formatDate(day),
						checkOutDate: formatDate(checkIn),
					},
				});
				setCheckOut(checkIn);
				setCheckIn(day);
			} else {
				setSearchFilter({
					...searchFilter,
					search: {
						...searchFilter.search,
						checkOutDate: formatDate(day),
					},
				});
				setShowDatePicker(false);
				setShowKeywordPanel(false);
				setShowGuestPicker(true);
				setCheckOut(day);
			}
		},
		[searchFilter],
	);

	const handleGuestCount = useCallback(
		async (count: number) => {
			if (count > 0) {
				setSearchFilter((prev) => ({
					...prev,
					search: { ...prev.search, personal: prev.search?.personal! + Math.ceil(+count) },
				}));
			} else if (count < 0 && searchFilter.search?.personal! > 1) {
				setSearchFilter((prev) => ({
					...prev,
					search: { ...prev.search, personal: prev.search?.personal! + Math.ceil(+count) },
				}));
			}
		},
		[searchFilter],
	);

	const pushSearchHandler = async () => {
		try {
			if (router.pathname === '/property/[propertyId]') {
				console.log(searchFilter);
				const propertyId = router.query.propertyId?.slice(11);
				const propertyInqiry: PropertyInquiry = {
					_id: propertyId! as string,
					propertyName: encodeURIComponent(propertyName!) ?? '',
					checkInDate: searchFilter.search.checkInDate!,
					checkOutDate: searchFilter.search.checkOutDate!,
					personal: searchFilter.search.personal!,
				};

				await router.push(
					`/property/propertyId=${propertyId}?input=${JSON.stringify({ ...propertyInqiry })}`,
					`/property/propertyId=${propertyId}?input=${JSON.stringify({ ...propertyInqiry })}`,
					{
						scroll: false,
					},
				);
				setHeroCardOpen(false);
			} else {
				if (!searchFilter.search?.location) {
					await bubbleAlert(t('여행지를 선택해주세요!'));
				} else {
					await router.push(
						`/property?input=${JSON.stringify({ ...searchFilter })}`,
						`/property?input=${JSON.stringify({ ...searchFilter })}`,
						{
							scroll: true,
						},
					);
				}
				setHeroCardOpen(false);
			}
		} catch (err: any) {
			console.log('ERROR : pushSearchHandler', err);
		}
	};

	const handleRemoveRecent = (word: string) => {
		setRecentSearches((prev) => prev.filter((w) => w !== word));
	};

	const handleClearRecent = () => {
		setRecentSearches([]);
	};

	const openKeywordPanel = () => {
		setShowKeywordPanel(true);
	};

	return (
		<Box className="hero-card" ref={refElement}>
			{/* 탭 */}
			<Box className="hero-tabs">
				{TABS.map((tab) => (
					<button
						key={tab.key}
						className={`hero-tab ${activeTab === tab.key ? 'active' : ''}`}
						onClick={() => setActiveTab(tab.key)}
					>
						{t(tab.label)}
						{tab.badgeNew && <span className="hero-tab-badge">N</span>}
					</button>
				))}
			</Box>

			{/* 검색 바 */}
			<Box className="hero-search-row">
				{/* 여행지 검색 */}
				<Box className="hero-field-wrapper">
					<Box className="hero-field hero-field-keyword" onClick={openKeywordPanel}>
						<SearchIcon className="hero-field-icon" />
						<div className="input-base-wrapper">
							<InputBase
								className="hero-input"
								placeholder={t('여행지나 숙소를 검색해보세요.')}
								value={currentProperty ? currentProperty : searchFilter?.search?.location}
								onChange={(e) => {
									setCurrentProperty(e.target.value);
									setSearchFilter({
										...searchFilter,
										search: {
											...searchFilter.search,
											location: e.target.value as PropertyLocation,
										},
									});
								}}
								onFocus={openKeywordPanel}
							/>
							{searchFilter?.search?.location && (
								<button
									className="clear-btn"
									onClick={() => {
										setCurrentProperty('');
										setSearchFilter({
											...searchFilter,
											search: {
												...searchFilter.search,
												location: '' as PropertyLocation,
											},
										});
									}}
								>
									×
								</button>
							)}
						</div>
					</Box>

					{showKeywordPanel && (
						<Box className="hero-keyword-panel" ref={locationRef}>
							{/* 현재 위치 주변 버튼 */}
							<Box className="hero-keyword-location">
								<button className="hero-location-btn">
									<PlaceIcon className="hero-location-icon" />
									{t('현재 위치 주변')}
								</button>
							</Box>

							{/* 최근 검색 조건 */}
							<Box className="hero-keyword-section">
								<Box className="hero-keyword-section-header">
									<span>{t('최근 검색 조건')}</span>
									<button className="hero-clear-btn" onClick={handleClearRecent}>
										{t('전체삭제')}
									</button>
								</Box>

								<Box className="hero-recent-list">
									{recentSearches?.length === 0 && (
										<div className="hero-empty-text">{t('최근 검색어가 없습니다')}.</div>
									)}
									{recentSearches?.map((word) => (
										<Box key={word} className="hero-recent-item">
											<button className="hero-recent-main" onClick={() => handleSelectKeyword(word)}>
												<AccessTimeIcon className="hero-recent-icon" />
												<span>{word}</span>
											</button>
											<button className="hero-recent-remove" onClick={() => handleRemoveRecent(word)}>
												<CloseIcon fontSize="small" />
											</button>
										</Box>
									))}
								</Box>
							</Box>

							<hr className="hero-keyword-divider" />

							{/* 여기어때 검색 순위 */}
							<Box className="hero-keyword-section">
								<Box className="hero-keyword-section-header">
									<span>{t('LUNOTEL 검색 순위')}</span>
								</Box>

								<Box className="hero-ranking-list">
									{Object.values(PropertyLocation).map((city, idx) => (
										<button key={city} className="hero-ranking-item" onClick={() => handleSelectKeyword(city)}>
											<span className="hero-ranking-index">{idx + 1}</span>
											<span>{city}</span>
										</button>
									))}
								</Box>
							</Box>
						</Box>
					)}
				</Box>

				{/* 날짜 선택 */}
				<Box
					className="hero-field hero-field-date"
					onClick={() => {
						setShowDatePicker((v) => !v);
						setShowGuestPicker(false);
					}}
				>
					<CalendarTodayIcon className="hero-field-icon" />
					<span className="hero-field-text">{formatRangeLabel(checkIn, checkOut)}</span>
				</Box>

				{/* 인원 선택 */}
				<Box
					className="hero-field hero-field-guest"
					onClick={() => {
						setShowGuestPicker((v) => !v);
						setShowDatePicker(false);
					}}
				>
					<PersonOutlineIcon className="hero-field-icon" />
					<span className="hero-field-text">
						{t('인원')} {searchFilter.search?.personal}
					</span>
				</Box>

				{/* 검색 버튼 */}
				<Button className="hero-search-button" onClick={pushSearchHandler}>
					{t('검색')}
				</Button>
			</Box>

			{/* 날짜 선택 팝업 */}
			{showDatePicker && (
				<Stack
					style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-evenly' }}
					ref={dateRef}
				>
					<Box className="hero-datepicker">
						<Box className="hero-datepicker-header">
							<button className="hero-datepicker-nav" onClick={() => changeMonth(-1)}>
								<NavigateBeforeIcon />
							</button>
							<span className="hero-datepicker-title">{currentMonth.toLocaleDateString().slice(0, 8)}</span>
							<button className="hero-datepicker-nav" onClick={() => changeMonth(1)}>
								<NavigateNextIcon />
							</button>
						</Box>

						<Box className="hero-datepicker-weekdays">
							{WEEK_DAYS.map((d) => (
								<div key={d} className="hero-datepicker-weekday">
									{d}
								</div>
							))}
						</Box>

						<Box className="hero-datepicker-grid">
							{buildCalendarCells(currentMonth).map((day, index) => {
								if (!day) {
									return <div key={index} className="hero-datepicker-cell empty" />;
								}

								const isStart = isSameDate(day, checkIn);
								const isEnd = isSameDate(day, checkOut);
								const inSelectedRange = inRange(day);
								const isPastDay = isPastDate(day, currentMonth);
								const classes = [
									'hero-datepicker-cell',
									isStart ? 'start' : '',
									isEnd ? 'end' : '',
									inSelectedRange ? 'in-range' : '',
									isPastDay ? 'past-day' : '',
								]
									.filter(Boolean)
									.join(' ');
								return (
									<button key={day.getTime()} className={classes} onClick={() => !isPastDay && handleSelectDay(day)}>
										{day.getDate()}
									</button>
								);
							})}
						</Box>
					</Box>
					<Box className="hero-datepicker">
						<Box className="hero-datepicker-header">
							<button className="hero-datepicker-nav" onClick={() => changeMonth(-1)}>
								<NavigateBeforeIcon />
							</button>
							<span className="hero-datepicker-title">{nextMonth.toLocaleDateString().slice(0, 8)}</span>
							<button className="hero-datepicker-nav" onClick={() => changeMonth(1)}>
								<NavigateNextIcon />
							</button>
						</Box>

						<Box className="hero-datepicker-weekdays">
							{WEEK_DAYS.map((d) => (
								<div key={d} className="hero-datepicker-weekday">
									{d}
								</div>
							))}
						</Box>

						<Box className="hero-datepicker-grid">
							{buildCalendarCells(nextMonth).map((day, index) => {
								if (!day) {
									return <div key={index} className="hero-datepicker-cell empty" />;
								}

								const isStart = isSameDate(day, checkIn);
								const isEnd = isSameDate(day, checkOut);
								const inSelectedRange = inRange(day);
								const isPastDay = isPastDate(day, nextMonth);
								const classes = [
									'hero-datepicker-cell',
									isStart ? 'start' : '',
									isEnd ? 'end' : '',
									inSelectedRange ? 'in-range' : '',
									isPastDay ? 'past-day' : '',
								]
									.filter(Boolean)
									.join(' ');

								return (
									<button key={day.getTime()} className={classes} onClick={() => !isPastDay && handleSelectDay(day)}>
										{day.getDate()}
									</button>
								);
							})}
						</Box>
					</Box>
				</Stack>
			)}

			{/* 인원 선택 팝업 */}
			{showGuestPicker && (
				<Box className="hero-guestpicker" ref={pesonalRef}>
					<div className="hero-guest-row">
						<span className="hero-guest-label">{t('인원')}</span>
						<div className="hero-guest-counter">
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleGuestCount(-1);
								}}
							>
								-
							</button>
							<span>{searchFilter.search?.personal}</span>
							<button
								onClick={(e) => {
									e.stopPropagation();
									handleGuestCount(1);
								}}
							>
								+
							</button>
						</div>
					</div>
				</Box>
			)}
		</Box>
	);
};

function formatDate(date: Date, day: number = 0) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate() + day).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

export default HeroCard;
