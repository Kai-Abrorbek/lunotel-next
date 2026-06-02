import React, { useCallback, useEffect, useState } from 'react';
import { Moon, Sun, Globe, Search } from 'lucide-react';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Badge } from '@mui/material';
import MemberQuickMenu from './common/MemberQuickMenu';
import Link from 'next/link';
import { useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { GET_MY_NOTIFICATIONS } from '../../apollo/user/query';
import { Notification } from '../types/notification/notification';
import { useRouter } from 'next/router';

import { useTranslation } from 'react-i18next';
import MemberQuickMenuMobile from './common/MemberQuickMenuMobile';

const Header = () => {
	const user = useReactiveVar(userVar);
	const router = useRouter();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [language, setLanguage] = useState<string | null>('en');
	const [isLanguageOpen, setIsLanguageOpen] = useState(false);
	const device = useDeviceDetect();
	const { t, i18n } = useTranslation('common');

	const CATEGORIES = [
		{ label: '국내숙소', type: 'ALL' },
		{ label: '호텔', type: 'HOTEL' },
		{ label: '펜션', type: 'PENSION' },
		{ label: '모텔', type: 'MOTEL' },
		{ label: '캠핑', type: 'CAMPING' },
		{ label: '글램핑', type: 'GLAMPING' },
	];

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

	useEffect(() => {
		const saved = localStorage.getItem('theme');
		if (saved === 'dark') {
			setIsDarkMode(true);
			document.documentElement.classList.add('dark');
		}
	}, []);

	// toggleTheme도 localStorage 저장하게 수정
	const toggleTheme = () => {
		const next = !isDarkMode;
		setIsDarkMode(next);
		localStorage.setItem('theme', next ? 'dark' : 'light');
		if (next) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
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
				limit: 1000000,
				search: {},
			},
		},
		skip: !user._id,
		notifyOnNetworkStatusChange: true,
	});

	const notifications = getMyNotificationsData?.getMyNotifications?.list.filter(
		(notif: Notification) => !notif.isRead,
	).length;

	if (device === 'mobile') {
		return (
			<Box className="mobile-navbar">
				<Link href={'/'}>
					<ButtonBase className="mobile-logo" disableRipple>
						<img src="/img/logo.png" alt="logo" style={{ width: 58, height: 58, marginLeft: 10 }} />
					</ButtonBase>
				</Link>
				<Box className="mobile-nav-actions">
					<IconButton className="theme-button" onClick={toggleTheme}>
						{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
					</IconButton>
					{!user._id ? (
						<Link href={'/login'}>
							<ButtonBase className="mobile-login-btn" disableRipple>
								로그인
							</ButtonBase>
						</Link>
					) : (
						<Link href={'/mypage/user'}>
							<Avatar
								src={`${process.env.REACT_APP_API_URL}/${user.memberImage}`}
								alt={user.memberNick}
								sx={{ width: 32, height: 32 }}
							/>
						</Link>
					)}
					<IconButton onClick={() => setOpenMenu(!openMenu)}>
						<Badge
							badgeContent={notifications}
							color="error"
							overlap="circular"
							sx={{
								'& .MuiBadge-badge': {
									fontSize: '11px',
									height: '16px',
									minWidth: '16px',
									padding: '0 3px',
								},
							}}
						>
							<MenuIcon sx={{ fontSize: 24 }} />
						</Badge>
					</IconButton>
					{user._id && <MemberQuickMenuMobile open={openMenu} setOpen={setOpenMenu} notifications={notifications} />}
				</Box>
			</Box>
		);
	} else {
		return (
			<Box className={`navbar ${isDarkMode ? 'dark' : 'light'} `}>
				<Box className="container">
					<Box component="header" className="header">
						<Link href={'/'}>
							<ButtonBase className="logo-section" disableRipple>
								<Box className="logo" />
								<Box className="logo-text">LUNOTEL</Box>
							</ButtonBase>
						</Link>
						{/* 카테고리 메뉴 추가 */}
						<Box component="nav" className="nav-categories">
							{CATEGORIES.map((cat) => (
								<ButtonBase
									key={cat.type}
									className="nav-category"
									disableRipple
									onClick={() => router.push(`/property?type=${cat.type}`)}
								>
									{cat.label}
								</ButtonBase>
							))}
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

							{user._id && (
								<>
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
								</>
							)}
						</Box>
					</Box>
				</Box>
			</Box>
		);
	}
};

export default Header;
