import React, { useState } from 'react';
import { Box, Button, Divider, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LayoutHome from '../../libs/components/layout/LayoutHome';
import LoginModal from '../../libs/components/auth/LoginModal';
import { signIn } from 'next-auth/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const LoginPage: React.FC = () => {
	const { t } = useTranslation('common');
	const [open, setOpen] = useState<boolean>(false);

	const handleGoogleLogin = () => signIn('google', { callbackUrl: '/' });
	const handleKakaoLogin = () => signIn('kakao', { callbackUrl: '/' });
	const handleNaverLogin = () => signIn('naver', { callbackUrl: '/' });

	return (
		<Box className="login-page">
			<Box className="login-page__card">
				<img className="login-page__logo" src="/img/logo.png" alt="Lunotel" />
				<Typography className="login-page__title">로그인 / 회원가입</Typography>
				<Typography className="login-page__subtitle">SNS 계정으로 간편하게 시작하세요</Typography>

				<Box className="login-page__buttons">
					<Button fullWidth className="login-page__btn login-page__btn--kakao" onClick={handleKakaoLogin}>
						<span className="login-page__btn-icon">💬</span>
						카카오로 시작하기
					</Button>
					<Button fullWidth className="login-page__btn login-page__btn--naver" onClick={handleNaverLogin}>
						<span className="login-page__btn-icon login-page__btn-icon--text">N</span>
						네이버로 시작하기
					</Button>
					<Button fullWidth className="login-page__btn login-page__btn--google" onClick={handleGoogleLogin}>
						<GoogleIcon className="login-page__btn-icon" />
						구글로 시작하기
					</Button>
					<Button fullWidth className="login-page__btn login-page__btn--email" onClick={() => setOpen(true)}>
						<MailOutlineIcon className="login-page__btn-icon" />
						이메일로 시작하기
					</Button>
				</Box>

				<Divider sx={{ width: '100%', my: 2 }} />

				<Typography className="login-page__business" onClick={() => setOpen(true)}>
					비즈니스 계정으로 로그인
				</Typography>
			</Box>
			<LoginModal open={open} onClose={() => setOpen(false)} />
		</Box>
	);
};

export default LayoutHome(LoginPage);
