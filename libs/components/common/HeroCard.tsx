import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, InputBase, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import PlaceIcon from '@mui/icons-material/Place';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PropertiesInquiry } from '../../types/property/property.input';
import { PropertyLocation } from '../../enums/property.enum';
import { bubbleAlert } from '../../sweetAlert';
import { useRouter } from 'next/router';

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

	const fm = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
	const fd = (d: Date) => d.getDate().toString().padStart(2, '0');
	const fw = (d: Date) => WEEK_DAYS[d.getDay()];

	return `${fm(checkIn)}.${fd(checkIn)} ${fw(checkIn)} - ${fm(checkOut)}.${fd(checkOut)} ${fw(checkOut)} (${nights}박)`;
}

function isSameDate(a: Date | undefined, b: Date | undefined) {
	if (!a || !b) return false;
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

interface HeroCardProps {
	initialInput: PropertiesInquiry;
	refElement: any;
}

const HeroCard = (props: HeroCardProps) => {
	const { initialInput, refElement } = props;
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(initialInput);
	const today = new Date();
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);
	const locationRef: any = useRef();
	const dateRef: any = useRef();
	const pesonalRef: any = useRef();
	const [locationInput, setLocationInput] = useState<string>('');
	const [activeTab, setActiveTab] = useState<TabKey>('domestic');
	const [propertyLocation, setPropertyLocation] = useState<PropertyLocation[]>(Object.values(PropertyLocation));
	const [checkIn, setCheckIn] = useState<Date | undefined>(toDate(initialInput.search?.checkInDate));
	const [checkOut, setCheckOut] = useState<Date | undefined>(toDate(initialInput.search?.checkOutDate));
	const [guestCount, setGuestCount] = useState(2);
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
		setSearchFilter({
			...searchFilter,
			search: {
				...searchFilter.search,
				personal: guestCount,
			},
		});
	}, [guestCount]);

	useEffect(() => {
		// TODO:  router change
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
	/**UTIL FANCTION**/

	/** HANDLER **/
	const handleDayClick = useCallback(
		async (day: Date) => {
			if (!checkIn || (checkIn && checkOut)) {
				setSearchFilter({
					// router => change
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
				setShowDatePicker(true);
				setShowKeywordPanel(false);
				setCheckOut(day);
			}
		},
		[searchFilter],
	);

	const openKeywordPanel = () => {
		setShowKeywordPanel(true);
	};

	const handleSelectKeyword = useCallback(
		async (word: string) => {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					location: word as PropertyLocation,
				},
			});
			setShowDatePicker(true);
			setShowKeywordPanel(false);
			setRecentSearches((prev) => {
				const updated = [word, ...prev.filter((w) => w !== word)];
				return updated.slice(0, 4);
			});
		},
		[searchFilter],
	);

	const handleRemoveRecent = (word: string) => {
		setRecentSearches((prev) => prev.filter((w) => w !== word));
	};

	const handleClearRecent = () => {
		setRecentSearches([]);
	};

	const handleSearch = async (location: string | undefined) => {
		if (!searchFilter.search?.location && !location) {
			await bubbleAlert('여행지를 선택해주세요!');
		} else {
			setSearchFilter({
				...searchFilter,
				search: {
					...searchFilter.search,
					location: location as PropertyLocation,
				},
			});
			await router.push(
				`/property?input=${JSON.stringify(searchFilter)}`,
				`/property?input=${JSON.stringify(searchFilter)}`,
				{
					scroll: false,
				},
			);
			console.log(searchFilter);
		}
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
						{tab.label}
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
								placeholder="여행지나 숙소를 검색해보세요."
								value={searchFilter?.search?.location}
								onChange={(e) =>
									setSearchFilter({
										...searchFilter,
										search: {
											...searchFilter.search,
											location: e.target.value as PropertyLocation,
										},
									})
								}
								onFocus={openKeywordPanel}
							/>
							{searchFilter?.search?.location && (
								<button
									className="clear-btn"
									onClick={() =>
										setSearchFilter({
											...searchFilter,
											search: {
												...searchFilter.search,
												location: '' as PropertyLocation,
											},
										})
									}
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
									현재 위치 주변
								</button>
							</Box>

							{/* 최근 검색 조건 */}
							<Box className="hero-keyword-section">
								<Box className="hero-keyword-section-header">
									<span>최근 검색 조건</span>
									<button className="hero-clear-btn" onClick={handleClearRecent}>
										전체삭제
									</button>
								</Box>

								<Box className="hero-recent-list">
									{recentSearches?.length === 0 && <div className="hero-empty-text">최근 검색어가 없습니다.</div>}
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
									<span>여기어때 검색 순위</span>
								</Box>

								<Box className="hero-ranking-list">
									{propertyLocation.map((city, idx) => (
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
					<span className="hero-field-text">인원 {guestCount}</span>
				</Box>

				{/* 검색 버튼 */}
				<Button className="hero-search-button" onClick={() => handleSearch(searchFilter.search?.location)}>
					검색
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

								const classes = [
									'hero-datepicker-cell',
									isStart ? 'start' : '',
									isEnd ? 'end' : '',
									inSelectedRange ? 'in-range' : '',
								]
									.filter(Boolean)
									.join(' ');

								return (
									<button key={day.toISOString()} className={classes} onClick={() => handleDayClick(day)}>
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

								const classes = [
									'hero-datepicker-cell',
									isStart ? 'start' : '',
									isEnd ? 'end' : '',
									inSelectedRange ? 'in-range' : '',
								]
									.filter(Boolean)
									.join(' ');

								return (
									<button key={day.toISOString()} className={classes} onClick={() => handleDayClick(day)}>
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
						<span className="hero-guest-label">인원</span>
						<div className="hero-guest-counter">
							<button
								onClick={(e) => {
									e.stopPropagation();
									setGuestCount((c) => Math.max(1, c - 1));
								}}
							>
								-
							</button>
							<span>{guestCount}</span>
							<button
								onClick={(e) => {
									e.stopPropagation();
									setGuestCount((c) => c + 1);
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
