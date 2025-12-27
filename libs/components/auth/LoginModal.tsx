import { Modal } from '@mui/material';
import React, { useCallback, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { LoginInput } from '../../types/member/member.input';
import { logIn, signUp } from '../../auth';
import { MemberType } from '../../enums/member.enum';
import { sweetErrorAlert, sweetMixinErrorAlert } from '../../sweetAlert';
import { emailRegex, phoneRegex } from '../../config';
import { AwardIcon } from 'lucide-react';
import { useRouter } from 'next/router';

interface LoginModalProps {
	open: boolean;
	onClose: (v: boolean) => void;
}
const LoginModal = (props: LoginModalProps) => {
	const { onClose, open } = props;
	const router = useRouter();
	const [input, setInput] = useState({ name: '', email: '', password: '', phone: '', type: 'USER' });

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const handleSignupSubmit = useCallback(async () => {
		try {
			if (!input.name) return sweetErrorAlert('이름을 입력해주세요');
			if (!input.email) return sweetErrorAlert('이메일을 입력해주세요');
			if (!emailRegex.test(input.email)) return sweetErrorAlert('이메일을 올바르게 입력해주세요! (예: test@gmail.com)');
			if (!input.phone) return sweetErrorAlert('전화번호를 입력해주세요');
			if (!phoneRegex.test(input.phone)) return sweetErrorAlert('전화번호를 올바르게 입력해주세요!');
			if (!input.password) return sweetErrorAlert('비밀번호를 입력해주세요');
			if (input.password.length < 6) return sweetErrorAlert('비밀번호를 6글자 이상 입력해주세요!');

			await signUp(input.name, input.email, input.password, input.phone, MemberType.USER);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const handleLoginSubmit = useCallback(async () => {
		try {
			if (!input.email) return sweetErrorAlert('이메일을 입력해주세요');
			if (!emailRegex.test(input.email)) return sweetErrorAlert('이메일을 올바르게 입력해주세요! (예: test@gmail.com)');
			if (!input.password) return sweetErrorAlert('비밀번호를 입력해주세요');
			if (input.password.length < 6) return sweetErrorAlert('비밀번호를 6글자 이상 입력해주세요!');

			const result = await logIn(input.email, input.password);
			if (result) await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			await sweetMixinErrorAlert(err.message);
		}
	}, [input]);

	const handleChangeRegLog = () => {
		setInput({ name: '', email: '', password: '', phone: '', type: '' });
	};
	return (
		<Modal open={open} onClose={onClose}>
			<div className="auth3d-page">
				<div className="section">
					<div className="container">
						<div className="row full-height justify-content-center">
							<div className="col-12 text-center align-self-center py-5">
								<button className="close-btn" onClick={() => onClose(false)}>
									<ClearIcon />
								</button>
								<div className="section pb-5 pt-5 pt-sm-2 text-center">
									<h6 className="mb-0 pb-3">
										<span>Log In </span>
										<span>Sign Up</span>
									</h6>

									<input
										className="checkbox"
										onClick={handleChangeRegLog}
										type="checkbox"
										id="reg-log"
										name="reg-log"
									/>
									<label htmlFor="reg-log"></label>

									<div className="card-3d-wrap mx-auto">
										<div className="card-3d-wrapper">
											{/* front - Login */}
											<div className="card-front">
												<div className="center-wrap">
													<div className="section text-center">
														<h4 className="mb-4 pb-3">Log In</h4>

														<div className="form-group">
															<input
																type="email"
																name="logemail"
																className="form-style"
																placeholder="Your Email"
																id="logemail"
																autoComplete="off"
																value={input.email}
																onChange={(e) => handleInput('email', e.target.value)}
															/>
															<i className="input-icon uil uil-at" />
														</div>

														<div className="form-group mt-2">
															<input
																type="password"
																name="logpass"
																className="form-style"
																placeholder="Your Password"
																id="logpass"
																autoComplete="off"
																value={input.password}
																onKeyDown={(e) => {
																	if (e.key === 'Enter') {
																		handleLoginSubmit();
																	}
																}}
																onChange={(e) => handleInput('password', e.target.value)}
															/>
															<i className="input-icon uil uil-lock-alt" />
														</div>

														<button
															disabled={input.email == '' || input.password == ''}
															className="btn mt-4"
															onClick={handleLoginSubmit}
														>
															submit
														</button>

														<p className="mb-0 mt-4 text-center">
															<a href="#0" className="link">
																Forgot your password?
															</a>
														</p>
													</div>
												</div>
											</div>

											{/* back - Sign Up */}
											<div className="card-back">
												<div className="center-wrap">
													<div className="section text-center">
														<h4 className="mb-4 pb-3">Sign Up</h4>

														<div className="form-group">
															<input
																type="text"
																name="logname"
																className="form-style"
																placeholder="Your Full Name"
																id="logname"
																autoComplete="off"
																value={input.name}
																onChange={(e) => handleInput('name', e.target.value)}
															/>
															<i className="input-icon uil uil-user" />
														</div>

														<div className="form-group mt-2">
															<input
																type="text"
																name="logphone"
																className="form-style"
																placeholder="Your Phone Number"
																id="logphone"
																autoComplete="off"
																value={input.phone}
																onChange={(e) => handleInput('phone', e.target.value)}
															/>
															<i className="input-icon uil uil-phone" />
														</div>

														<div className="form-group mt-2">
															<input
																type="email"
																name="logemail"
																className="form-style"
																placeholder="Your Email"
																id="logemail-signup"
																autoComplete="off"
																value={input.email}
																onChange={(e) => handleInput('email', e.target.value)}
															/>
															<i className="input-icon uil uil-at" />
														</div>

														<div className="form-group mt-2">
															<input
																type="password"
																name="logpass"
																className="form-style"
																placeholder="Your Password"
																id="logpass-signup"
																autoComplete="off"
																value={input.password}
																onChange={(e) => handleInput('password', e.target.value)}
															/>
															<i className="input-icon uil uil-lock-alt" />
														</div>

														<button
															disabled={
																input.name == '' || input.email == '' || input.password == '' || input.phone == ''
															}
															className="btn mt-4"
															onClick={handleSignupSubmit}
														>
															submit
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default LoginModal;
