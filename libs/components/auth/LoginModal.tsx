import {
	Modal,
	Box,
	Typography,
	TextField,
	Button,
	Divider,
	Tabs,
	Tab,
	Checkbox,
	FormControlLabel,
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { logIn, signUp } from '../../auth';
import { MemberType } from '../../enums/member.enum';
import { sweetErrorAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { emailRegex, phoneRegex } from '../../config';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

interface LoginModalProps {
	open: boolean;
	onClose: (v: boolean) => void;
}

const LoginModal = ({ open, onClose }: LoginModalProps) => {
	const { t } = useTranslation('common');
	const router = useRouter();
	const [tab, setTab] = useState(0);
	const [input, setInput] = useState({ name: '', email: '', password: '', phone: '', type: 'USER' });

	const handleInput = useCallback((name: string, value: string) => {
		setInput((prev) => ({ ...prev, [name]: value }));
	}, []);

	useEffect(() => {
		setInput({ name: '', email: '', password: '', phone: '', type: 'USER' });
	}, [open]);

	const handleLogin = useCallback(async () => {
		try {
			if (!input.email) return sweetErrorAlert(t('이메일을 입력해주세요'));
			if (!emailRegex.test(input.email))
				return sweetErrorAlert(t('이메일을 올바르게 입력해주세요! (예: test@gmail.com)'));
			if (!input.password) return sweetErrorAlert(t('비밀번호를 입력해주세요'));
			if (input.password.length < 6) return sweetErrorAlert(t('비밀번호를 6글자 이상 입력해주세요'));
			const result = await logIn(input.email, input.password);
			if (result) await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const handleSignup = useCallback(async () => {
		try {
			if (!input.name) return sweetErrorAlert(t('이름을 입력해주세요'));
			if (!input.email) return sweetErrorAlert(t('이메일을 입력해주세요'));
			if (!emailRegex.test(input.email))
				return sweetErrorAlert(t('이메일을 올바르게 입력해주세요! (예: test@gmail.com)'));
			if (!input.phone) return sweetErrorAlert(t('전화번호를 입력해주세요'));
			if (!phoneRegex.test(input.phone)) return sweetErrorAlert(t('전화번호를 올바르게 입력해주세요'));
			if (!input.password) return sweetErrorAlert(t('비밀번호를 입력해주세요'));
			if (input.password.length < 6) return sweetErrorAlert(t('비밀번호를 6글자 이상 입력해주세요'));
			await signUp(input.name, input.email, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	return (
		<Modal open={open} onClose={() => onClose(false)}>
			<Box className="login-modal">
				<Box className="login-modal__header">
					<Typography className="login-modal__title">{tab === 0 ? '로그인' : '회원가입'}</Typography>
					<Button className="login-modal__close" onClick={() => onClose(false)}>
						<CloseIcon />
					</Button>
				</Box>

				<Tabs
					value={tab}
					onChange={(_, v) => setTab(v)}
					className="login-modal__tabs"
					TabIndicatorProps={{ style: { backgroundColor: '#ff4e5b' } }}
				>
					<Tab label="로그인" className="login-modal__tab" />
					<Tab label="회원가입" className="login-modal__tab" />
				</Tabs>

				<Box className="login-modal__body">
					{tab === 0 ? (
						<>
							<TextField
								fullWidth
								label="이메일"
								type="email"
								value={input.email}
								onChange={(e) => handleInput('email', e.target.value)}
								className="login-modal__input"
								onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
							/>
							<TextField
								fullWidth
								label="비밀번호"
								type="password"
								value={input.password}
								onChange={(e) => handleInput('password', e.target.value)}
								className="login-modal__input"
								onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
							/>
							<Button
								fullWidth
								className="login-modal__submit"
								onClick={handleLogin}
								disabled={!input.email || !input.password}
							>
								로그인
							</Button>
						</>
					) : (
						<>
							<TextField
								fullWidth
								label="이름"
								value={input.name}
								onChange={(e) => handleInput('name', e.target.value)}
								className="login-modal__input"
							/>
							<TextField
								fullWidth
								label="전화번호"
								value={input.phone}
								onChange={(e) => handleInput('phone', e.target.value)}
								className="login-modal__input"
							/>
							<TextField
								fullWidth
								label="이메일"
								type="email"
								value={input.email}
								onChange={(e) => handleInput('email', e.target.value)}
								className="login-modal__input"
							/>
							<TextField
								fullWidth
								label="비밀번호"
								type="password"
								value={input.password}
								onChange={(e) => handleInput('password', e.target.value)}
								className="login-modal__input"
								onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
							/>
							<FormControlLabel
								control={
									<Checkbox
										onChange={(e) => handleInput('type', e.target.checked ? MemberType.AGENT : MemberType.USER)}
										sx={{ '&.Mui-checked': { color: '#ff4e5b' } }}
									/>
								}
								label="에이전트로 가입"
								className="login-modal__agent"
							/>
							<Button
								fullWidth
								className="login-modal__submit"
								onClick={handleSignup}
								disabled={!input.name || !input.email || !input.password || !input.phone}
							>
								회원가입
							</Button>
						</>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

export default LoginModal;
