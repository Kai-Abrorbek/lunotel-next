import { useRouter, withRouter } from 'next/router';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Box, Button, Drawer, IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import MemberQuickMenu from './common/MemberQuickMenu';
import { useState } from 'react';

const Top = () => {
	const router = useRouter();
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const pathName = router.pathname.replace('/', '').trim();
	const user = false;
	const device = useDeviceDetect();
	if (device === 'mobile') {
		return <h1>MOBILE</h1>;
	} else {
		return (
			<Stack className="navbar">
				<Box className="header-container container">
					{/* 로고 */}
					<Link href={'/'}>
						<img className="header-logo" src="/img/logo.png" alt="" />
					</Link>

					{/* 오른쪽 버튼들 */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						{user || pathName === 'mypage' ? (
							<Link href={'/mypage/user'}>
								<Button
									variant="outlined"
									sx={{
										borderRadius: '10px',
										borderColor: '#2196f3',
										color: '#2196f3',
										px: 2.5,
										py: 1,
									}}
									size="large"
								>
									USER NAME
								</Button>
							</Link>
						) : pathName === 'login' || pathName === 'reservation/check' ? (
							<Link href={'/login'}>
								<Button
									variant="outlined"
									sx={{
										borderRadius: '10px',
										borderColor: '#2196f3',
										color: '#2196f3',
										px: 2.5,
										py: 1,
									}}
									size="large"
								>
									로그인/회원가입
								</Button>
							</Link>
						) : (
							<div>
								<Link href={'/reservation/check'}>
									<Button
										variant="outlined"
										sx={{
											bgcolor: '#fafafa',
											color: '#333',
											borderRadius: '10px',
											borderColor: '#ddd',
											px: 2.5,
											py: 1,
										}}
										size="large"
									>
										비회원 예약조회
									</Button>
								</Link>

								<Link href={'/login'}>
									<Button
										variant="outlined"
										sx={{
											borderRadius: '10px',
											borderColor: '#2196f3',
											color: '#2196f3',
											px: 2.5,
											py: 1,
										}}
										size="large"
									>
										로그인/회원가입
									</Button>
								</Link>
							</div>
						)}

						<IconButton onClick={() => setOpenMenu(!openMenu)}>
							<MenuIcon sx={{ fontSize: 30 }} />
						</IconButton>
						<MemberQuickMenu open={openMenu} setOpen={setOpenMenu} />
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default withRouter(Top);
