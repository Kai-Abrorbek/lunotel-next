import { withRouter } from 'next/router';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

const Top = () => {
	const device = useDeviceDetect();
	console.log(device);
	if (device === 'mobile') {
		return <h1>MOBILe</h1>;
	} else {
		return (
			<Stack className="navbar">
				<Box className="header-container container">
					{/* 로고 */}
					<Link href={'/'}>
						<Typography className="header-logo">루나텔.</Typography>
					</Link>

					{/* 오른쪽 버튼들 */}
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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

						<IconButton>
							<MenuIcon sx={{ fontSize: 30 }} />
						</IconButton>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default withRouter(Top);
