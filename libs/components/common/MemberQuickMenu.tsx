import React from 'react';
import { Badge, Box, Card, IconButton, Modal, Stack } from '@mui/material';
import Link from 'next/link';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

interface MemberQuickMenuProps {
	open: boolean;
	setOpen: (v: boolean) => void;
}
export default function MemberQuickMenu({ open, setOpen }: MemberQuickMenuProps) {
	return (
		<Modal
			BackdropProps={{
				sx: { backgroundColor: 'rgba(0,0,0,0)' }, // 혹은 'rgba(0,0,0,0)'
			}}
			open={open}
			onClose={() => setOpen(false)}
			style={{ backgroundColor: 'rgba(0,0,0,0)' }}
		>
			<Box className={`member-menu ${open ? 'active' : ''}`}>
				<Card elevation={3} className="member-menu__card">
					{/* 상단 프로필 영역 */}

					<Box className="member-menu__header">
						<Link href={'/mypage/user'}>
							<Stack style={{ flexDirection: 'row' }}>
								<Box className="member-menu__avatar">
									<span>🙂</span>
								</Box>
								<Box className="member-menu__profile">
									<p className="member-menu__nickname">재미있고바람직한글</p>
									<p className="member-menu__grade">
										<span className="member-menu__grade-label">Basic</span>
										<span className="member-menu__grade-sub">회원</span>
									</p>
								</Box>
							</Stack>
						</Link>
						<Link href={'/mypage/user?category=notifications'}>
							<Box>
								<IconButton>
									<Badge
										badgeContent={3}
										color="error"
										overlap="circular"
										sx={{
											'& .MuiBadge-badge': {
												fontSize: '13px',
												height: '18px',
												minWidth: '18px',
												padding: '0 4px',
											},
										}}
									>
										<NotificationsNoneIcon fontSize="medium" />
									</Badge>
								</IconButton>
							</Box>
						</Link>
					</Box>

					{/* 1차 메뉴 */}
					<Box className="member-menu__section member-menu__section--border">
						<Link href={'/mypage/user/?category=reservation-details'}>
							<button className="member-menu__item">예약 내역</button>
						</Link>
						<Link href={'/mypage/user/?category=my-favorits'}>
							<button className="member-menu__item">찜 목록</button>
						</Link>
						<Link href={'/mypage/user/?category=points'}>
							<button className="member-menu__item">포인트</button>
						</Link>
						<Link href={'/mypage/user/?category=my-info'}>
							<button className="member-menu__item">내 정보 관리</button>
						</Link>
						<Link href={'/mypage/user/?category=settings'}>
							<button className="member-menu__item">설정</button>
						</Link>
						<Link href={'/mypage/user/?category=settings'}>
							<button className="member-menu__item">고객 센터</button>
						</Link>
					</Box>
					<Box className="member-menu__section member-menu__section--last">
						<button className="member-menu__item member-menu__item--logout">로그아웃</button>
					</Box>
				</Card>
			</Box>
		</Modal>
	);
}
