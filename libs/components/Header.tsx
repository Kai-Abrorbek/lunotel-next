import React, { useState } from 'react';
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

const Header = () => {
	const user = useReactiveVar(userVar);
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [isDarkMode, setIsDarkMode] = useState(false);
	const [language, setLanguage] = useState('KO');
	const [isLanguageOpen, setIsLanguageOpen] = useState(false);
	const device = useDeviceDetect();

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

	const toggleTheme = () => setIsDarkMode(!isDarkMode);

	if (device === 'mobile') {
		return <h1>MOBILE</h1>;
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
											className={`language-option ${language === 'KO' ? 'active' : ''}`}
											onClick={() => {
												setLanguage('KO');
												setIsLanguageOpen(false);
											}}
										>
											한국어
										</Box>
										<Box
											className={`language-option ${language === 'EN' ? 'active' : ''}`}
											onClick={() => {
												setLanguage('EN');
												setIsLanguageOpen(false);
											}}
										>
											English
										</Box>
										<Box
											className={`language-option ${language === 'JA' ? 'active' : ''}`}
											onClick={() => {
												setLanguage('JA');
												setIsLanguageOpen(false);
											}}
										>
											日本語
										</Box>
										<Box
											className={`language-option ${language === 'ZH' ? 'active' : ''}`}
											onClick={() => {
												setLanguage('ZH');
												setIsLanguageOpen(false);
											}}
										>
											中文
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
											비회원 예약조회
										</ButtonBase>
									</Link>
									<Link href={'/login'}>
										{/* <ButtonBase className="auth-button login-button" disableRipple>
											로그인
										</ButtonBase> */}
										<ButtonBase className="auth-button signup-button" disableRipple>
											로그인/회원가입
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
									<MemberQuickMenu open={openMenu} setOpen={setOpenMenu} notifications={notifications} />
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
