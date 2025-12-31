import React, { useEffect, useRef, useState } from 'react';
import { Moon, Sun, Globe, Search, SearchIcon } from 'lucide-react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Badge } from '@mui/material';
import MemberQuickMenu from './common/MemberQuickMenu';
import { useRouter } from 'next/router';
import Link from 'next/link';
import HeroCard from './common/HeroCard';
import { PropertiesInquiry } from '../types/property/property.input';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_MY_NOTIFICATIONS } from '../../apollo/user/query';
import { Notification } from '../types/notification/notification';
import { useTranslation } from 'react-i18next';

interface MiniHeaderProps {
	initialInput: PropertiesInquiry;
}

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
function formatRangeLabel(checkIn: Date | undefined, checkOut: Date | undefined) {
	if (!checkIn || !checkOut) return '날짜를 선택하세요';

	const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

	const fm = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
	const fd = (d: Date) => d.getDate().toString().padStart(2, '0');
	const fw = (d: Date) => WEEK_DAYS[d.getDay()];

	return `${fm(checkIn)}.${fd(checkIn)} ${fw(checkIn)} - ${fm(checkOut)}.${fd(checkOut)} ${fw(checkOut)} (${nights}박)`;
}

function toDate(value: string | undefined): Date | undefined {
	return value ? new Date(value) : undefined;
}

const OtherHeader = (props: MiniHeaderProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [language, setLanguage] = useState<string | null>('en');
	const [isLanguageOpen, setIsLanguageOpen] = useState(false);
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [heroCardOpen, setHeroCardOpen] = useState<boolean>(false);
	const refElement: any = useRef();
	const locationLabel = searchFilter?.search?.location;
	const dateLabel = formatRangeLabel(
		toDate(searchFilter?.search?.checkInDate),
		toDate(searchFilter?.search?.checkOutDate),
	);
	const guestLabel = searchFilter?.search?.personal;
	const property = router?.query?.input ? JSON.parse(router?.query?.input as string) : '';

	/** LIFECYCLES **/
	useEffect(() => {
		if (localStorage.getItem('locale') === null) {
			localStorage.setItem('locale', 'kr');
			setLanguage('kr');
		} else {
			setLanguage(localStorage.getItem('locale'));
		}
	}, [router]);

	const langChoice = async (e: any) => {
		setLanguage(e.target.id);
		localStorage.setItem('locale', e.target.id);
		await router.push(router.asPath, router.asPath, { locale: e.target.id });
	};
	/** APOLLO REQUESTS **/
	const {
		loading: getMyNotificationsLoading,
		data: getMyNotificationsData,
		error: getMyNotificationsError,
		refetch: getMyNotificationsRefetch,
	} = useQuery(GET_MY_NOTIFICATIONS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 20,
				search: {},
			},
		},
		skip: !user._id,
		notifyOnNetworkStatusChange: true,
	});

	const notifications = getMyNotificationsData?.getMyNotifications?.list.filter(
		(notif: Notification) => !notif.isRead,
	).length;

	/** LIFESICLE **/
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('searchFilter');
		if (!saved) return;
		const parsed = JSON.parse(saved);
		setSearchFilter(parsed);
	}, [router]);

	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!refElement?.current?.contains(event.target)) {
				setHeroCardOpen(false);
			}
		};
		document.addEventListener('mousedown', clickHandler);
		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, [refElement]);

	/**HANDLERS**/
	const openHeroCardHandler = () => {
		setHeroCardOpen(true);
	};
	const toggleTheme = () => setIsDarkMode(!isDarkMode);

	if (device === 'mobile') {
		return <h1>MOBILE</h1>;
	} else {
		return (
			<Box className={`navbar ${isDarkMode ? 'dark' : 'light'} `}>
				<Box className="container">
					<Box component="header" className="header">
						<Box className="mini-left-header">
							{/* 로고 */}
							<Link href={'/'}>
								<ButtonBase className="logo-section" disableRipple>
									<Box className="logo" />
									<Box className="logo-text">LUNOTEL</Box>
								</ButtonBase>
							</Link>
							{heroCardOpen ? (
								<HeroCard
									initialInput={searchFilter!}
									refElement={refElement}
									setHeroCardOpen={setHeroCardOpen}
									propertyName={property.propertyName}
								/>
							) : (
								<Box className="mini-header-center">
									<Box className="mini-search-bar" onClick={openHeroCardHandler}>
										<SearchIcon className="mini-search-icon" />
										<span className="mini-search-text mini-search-location" style={{ flex: 4 }}>
											{property.propertyName ? property.propertyName : locationLabel}
										</span>
										<span className="mini-search-divider">|</span>
										<span className="mini-search-text mini-search-date" style={{ flex: 4 }}>
											{dateLabel}
										</span>
										<span className="mini-search-divider">|</span>
										<span className="mini-search-text mini-search-guest" style={{ flex: 1 }}>
											{guestLabel}
										</span>
									</Box>
								</Box>
							)}
						</Box>
						<Box component="nav" className="nav-actions">
							<Box className="language-selector">
								<ButtonBase
									className="language-button"
									disableRipple
									onClick={() => setIsLanguageOpen(!isLanguageOpen)}
								>
									<Globe size={16} />
									{language}
								</ButtonBase>

								{isLanguageOpen && (
									<Box className="language-dropdown">
										<Box
											id={'kr'}
											className={`language-option ${language === 'KR' ? 'active' : ''}`}
											onClick={(e) => {
												langChoice(e);
												setLanguage('KR');
												setIsLanguageOpen(false);
											}}
										>
											한국어
										</Box>
										<Box
											id={'en'}
											className={`language-option ${language === 'EN' ? 'active' : ''}`}
											onClick={(e) => {
												langChoice(e);
												setLanguage('EN');
												setIsLanguageOpen(false);
											}}
										>
											English
										</Box>
										<Box
											id={'uz'}
											className={`language-option ${language === 'UZ' ? 'active' : ''}`}
											onClick={(e) => {
												langChoice(e);
												setLanguage('UZ');
												setIsLanguageOpen(false);
											}}
										>
											Uzbek
										</Box>
										<Box
											id={'ru'}
											className={`language-option ${language === 'RU' ? 'active' : ''}`}
											onClick={(e) => {
												langChoice(e);
												setLanguage('RU');
												setIsLanguageOpen(false);
											}}
										>
											Russia
										</Box>
									</Box>
								)}
							</Box>

							<IconButton className="theme-button" onClick={toggleTheme}>
								{isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
							</IconButton>

							{!user._id ? (
								<>
									<Link href={'/reservation/check'}>
										<ButtonBase className="guest-booking-button" disableRipple>
											<Search size={16} />
											{t('비회원 예약조회')}
										</ButtonBase>
									</Link>
									<Link href={'/login'}>
										{/* <ButtonBase className="auth-button login-button" disableRipple>
											로그인
										</ButtonBase> */}
										<ButtonBase className="auth-button signup-button" disableRipple>
											{t('로그인/회원가입')}
										</ButtonBase>
									</Link>
								</>
							) : (
								<Link href={'/mypage/user'}>
									<ButtonBase className="user-profile" disableRipple>
										<Avatar
											src={`${process.env.REACT_APP_API_URL}/${user.memberImage}`}
											alt={user.memberNick}
											className="user-avatar"
										/>
										<Box className="user-info">
											<Box className="user-name">{user.memberNick}</Box>
											<Box className="user-type">{user.memberType}</Box>
										</Box>
									</ButtonBase>
								</Link>
							)}

							<IconButton onClick={() => setOpenMenu(!openMenu)}>
								<Badge
									badgeContent={notifications} // 알림 개수
									color="error" // 빨간색 뱃지
									overlap="circular"
									sx={{
										'& .MuiBadge-badge': {
											fontSize: '13px', // 글씨 크기
											height: '18px', // 뱃지 높이
											minWidth: '18px', // 뱃지 최소 너비
											padding: '0 4px', // 내부 여백
										},
									}}
								>
									<MenuIcon sx={{ fontSize: 30 }} />
								</Badge>
							</IconButton>
							{user._id && <MemberQuickMenu open={openMenu} setOpen={setOpenMenu} notifications={notifications} />}
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}
};

function formatDate(date: Date, day: number = 0) {
	if (date.getMonth() === 11 && date.getDate() === 31 && day === 1) {
		const y = date.getFullYear() + 1;
		const m = String(1).padStart(2, '0');
		const d = String(1).padStart(2, '0');
		return `${y}-${m}-${d}`;
	} else {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate() + day).padStart(2, '0');
		return `${y}-${m}-${d}`;
	}
}

OtherHeader.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		search: {
			location: '',
			checkInDate: formatDate(new Date(), 0),
			checkOutDate: formatDate(new Date(), 1),
			personal: 2,
			propertyType: 'ALL',
		},
	},
};

export default OtherHeader;
