import React from 'react';
import { Badge, Box, Card, IconButton, Modal, Stack } from '@mui/material';
import Link from 'next/link';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { signOut } from 'next-auth/react';
import { logOut } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import LogoutButton from './LogoutButton';
import { useTranslation } from 'react-i18next';

interface MemberQuickMenuMobileProps {
	open: boolean;
	setOpen: (v: boolean) => void;
	notifications: number;
}

export default function MemberQuickMenuMobile({ open, setOpen, notifications }: MemberQuickMenuMobileProps) {
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	const handleLogOut = async () => {
		await signOut({ redirect: false });
		logOut();
	};

	return (
		<Modal
			BackdropProps={{ sx: { backgroundColor: 'rgba(0,0,0,0)' } }}
			open={open}
			onClose={() => setOpen(false)}
			style={{ backgroundColor: 'rgba(0,0,0,0)' }}
		>
			<Box className={`mobile-quick-menu ${open ? 'active' : ''}`}>
				<Card elevation={3} className="mobile-quick-menu__card" sx={{ padding: '0px' }}>
					<Box className="mobile-quick-menu__header">
						<Link href={'/mypage/user'}>
							<Stack style={{ flexDirection: 'row' }}>
								<Box className="mobile-quick-menu__avatar">
									<span>🙂</span>
								</Box>
								<Box className="mobile-quick-menu__profile">
									<p className="mobile-quick-menu__nickname">{user.memberNick}</p>
									<p className="mobile-quick-menu__grade">
										<span className="mobile-quick-menu__grade-label">{user.memberType}</span>
										<span className="mobile-quick-menu__grade-sub">{t('회원')}</span>
									</p>
								</Box>
							</Stack>
						</Link>
						<Link href={'/mypage/user?category=notifications'}>
							<Box>
								<IconButton>
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
										<NotificationsNoneIcon fontSize="small" />
									</Badge>
								</IconButton>
							</Box>
						</Link>
					</Box>

					<Box className="mobile-quick-menu__section mobile-quick-menu__section--border">
						<Link href={'/mypage/user/?category=reservation-details'}>
							<button className="mobile-quick-menu__item">{t('예약 내역')}</button>
						</Link>
						<Link href={'/mypage/user/?category=my-favorits'}>
							<button className="mobile-quick-menu__item">{t('찜 목록')}</button>
						</Link>
						<Link href={'/mypage/user/?category=points'}>
							<button className="mobile-quick-menu__item">{t('포인트')}</button>
						</Link>
						<Link href={'/mypage/user/?category=my-info'}>
							<button className="mobile-quick-menu__item">{t('내 정보 관리')}</button>
						</Link>
						<Link href={'/mypage/user/?category=settings'}>
							<button className="mobile-quick-menu__item">{t('설정')}</button>
						</Link>
						<Link href={'/cs'}>
							<button className="mobile-quick-menu__item">{t('고객 센터')}</button>
						</Link>
					</Box>

					<Box className="mobile-quick-menu__section mobile-quick-menu__section--last">
						<LogoutButton onLogout={handleLogOut} />
					</Box>
				</Card>
			</Box>
		</Modal>
	);
}
