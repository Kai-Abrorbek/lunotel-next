import React, { useState } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import AppleIcon from '@mui/icons-material/Apple';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LayoutHome from '../../libs/components/layout/LayoutHome';
import LoginModal from '../../libs/components/auth/LoginModal';

const LoginPage: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false);

	return (
		<Stack className="container">
			<Box className="login-page">
				<Box className="login-page__card">
					{/* 로고 */}
					<img className="login-page__logo" src="/img/logo.png" alt="" />
					{/* <Typography className="login-page__logo">루나텔.</Typography> */}

					{/* 구분선 + 타이틀 */}
					<Divider className="login-page__divider" />
					<Typography className="login-page__subtitle">로그인/회원가입</Typography>

					{/* 버튼 영역 */}
					<Box className="login-page__buttons">
						<Button fullWidth className="login-page__btn login-page__btn--kakao">
							<ChatBubbleOutlineIcon className="login-page__btn-icon" />
							<span>카카오로 시작하기</span>
						</Button>

						<Button fullWidth className="login-page__btn login-page__btn--naver">
							<span className="login-page__btn-icon login-page__btn-icon--text">N</span>
							<span>네이버로 시작하기</span>
						</Button>

						<Button fullWidth className="login-page__btn login-page__btn--google">
							<GoogleIcon className="login-page__btn-icon" />
							<span>구글로 시작하기</span>
						</Button>

						<Button fullWidth className="login-page__btn login-page__btn--email">
							<MailOutlineIcon className="login-page__btn-icon" />
							<span>이메일로 시작하기</span>
						</Button>
					</Box>

					{/* 하단 비즈니스 로그인 */}
					<Typography onClick={() => setOpen(true)} className="login-page__business">
						로그인/회원가입
					</Typography>
					<LoginModal open={open} onClose={() => setOpen(false)} />
				</Box>
			</Box>
		</Stack>
	);
};

export default LayoutHome(LoginPage);
