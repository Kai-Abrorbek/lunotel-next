import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LayoutHome from '../../libs/components/layout/LayoutHome';
import LoginModal from '../../libs/components/auth/LoginModal';
import { signIn } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const LoginPage: React.FC = () => {
	const [isOn, setIsOn] = useState(false);

	const toggleLamp = () => setIsOn((prev) => !prev);

	const [open, setOpen] = useState<boolean>(false);

	const handleGoogleLogin = () => {
		signIn('google', { callbackUrl: '/' });
	};

	const handleKakaoLogin = () => {
		signIn('kakao', { callbackUrl: '/' });
	};

	const handleNaverLogin = () => {
		signIn('naver', { callbackUrl: '/' });
	};

	return (
		<div className={`lamp-scene ${isOn ? 'lamp-scene--on' : ''}`}>
			<div className="lamp">
				<button type="button" className="lamp__shade-btn">
					{isOn ? 'OFF' : 'ON'}
				</button>
				<div className="lamp__string" />
				<div className="lamp__bulb" onClick={toggleLamp} />
			</div>
			<Box className={`login-page ${isOn ? 'lamp-scene--on' : ''}`}>
				<Box className="login-page__card">
					{/* 로고 */}
					<img className="login-page__logo" src="/img/logo.png" alt="" />
					{/* <Typography className="login-page__logo">루나텔.</Typography> */}

					{/* 구분선 + 타이틀 */}
					<Divider className="login-page__divider" />
					<p style={{ marginBottom: '20px' }} className="login-page__subtitle">
						로그인/회원가입
					</p>

					{/* 버튼 영역 */}
					<Box className="login-page__buttons">
						<Button fullWidth className="login-page__btn login-page__btn--kakao" onClick={handleKakaoLogin}>
							<span className="login-page__btn-icon">💬</span>
							<span>카카오로 시작하기</span>
						</Button>

						<Button fullWidth className="login-page__btn login-page__btn--naver" onClick={handleNaverLogin}>
							<span className="login-page__btn-icon login-page__btn-icon--text">N</span>
							<span>네이버로 시작하기</span>
						</Button>

						<Button fullWidth className="login-page__btn login-page__btn--google" onClick={handleGoogleLogin}>
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
			<div className="lamp__light-cone" />
		</div>
	);
};

export default LayoutHome(LoginPage);
