import React, { useState } from 'react';
import {
	Container,
	Box,
	Typography,
	TextField,
	Button,
	Card,
	CardContent,
	Divider,
	Checkbox,
	FormControlLabel,
	IconButton,
	InputAdornment,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import LayoutHome from '../../../libs/components/layout/LayoutHome';
import { useRouter } from 'next/router';

const TIME_SLOTS = [
	'12:00',
	'12:30',
	'13:00',
	'13:30',
	'14:00',
	'14:30',
	'15:00',
	'15:30',
	'16:00',
	'16:30',
	'17:00',
	'17:30',
	'18:00',
	'18:30',
	'19:00',
];

const PAYMENT_METHODS = [
	'카카오페이',
	'토스페이',
	'신용/체크 카드',
	'네이버페이',
	'KB Pay',
	'PAYCO',
	'법인 카드',
	'휴대폰 결제',
	'간편 계좌이체',
];
const ReservationCheckoutPage = () => {
	const [selectedTime, setSelectedTime] = useState<string>('12:00');
	const [guestName, setGuestName] = useState('');
	const [phone, setPhone] = useState('010-8210-8335');
	const [visitMethod, setVisitMethod] = useState<'walk' | 'car'>('walk');
	const [paymentMethod, setPaymentMethod] = useState<string>('카카오페이');
	const [agreeAll, setAgreeAll] = useState(false);
	const router = useRouter();
	const query = router.query.staytype;
	const roomPrice = 25000;
	const discount = 0;
	const totalPrice = roomPrice - discount;

	return (
		<Container maxWidth="lg" className="container">
			<Box className="reservation-layout">
				{/* LEFT */}
				<Box className="reservation-main">
					<Typography variant="h5" className="reservation-title">
						예약 확인 및 결제
					</Typography>

					{/* 이용시간 */}
					{query === 'stay' && (
						<Box className="section">
							<Box className="section-header">
								<Typography className="section-title">이용시간</Typography>
								<Typography className="section-sub">최대 8시간 이용 가능</Typography>
							</Box>
							<Box className="time-chip-wrap">
								{TIME_SLOTS.map((time) => (
									<Button
										key={time}
										variant="outlined"
										className={'time-chip' + (selectedTime === time ? ' time-chip--selected' : '')}
										onClick={() => setSelectedTime(time)}
									>
										{time}
									</Button>
								))}
							</Box>
						</Box>
					)}

					{/* 예약자 정보 (폭 50%) */}
					<Box className="section section--half">
						<Typography className="section-title">예약자 정보</Typography>

						<Box className="field-group">
							<Typography className="field-label">예약자 이름</Typography>
							<TextField
								size="small"
								fullWidth
								placeholder="홍길동"
								value={guestName}
								onChange={(e) => setGuestName(e.target.value)}
								InputProps={{
									endAdornment: guestName && (
										<InputAdornment position="end">
											<IconButton size="small" onClick={() => setGuestName('')} edge="end">
												<ClearIcon fontSize="small" />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
						</Box>

						<Box className="field-group">
							<Typography className="field-label">휴대폰 번호</Typography>
							<TextField
								size="small"
								fullWidth
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								InputProps={{
									endAdornment: phone && (
										<InputAdornment position="end">
											<IconButton size="small" onClick={() => setPhone('')} edge="end">
												<ClearIcon fontSize="small" />
											</IconButton>
										</InputAdornment>
									),
								}}
							/>
							<Typography className="field-help">입력한 휴대폰 번호는 안심번호로 변경되어 숙소에 전달돼요.</Typography>
						</Box>

						<Box className="field-group">
							<Typography className="field-label">방문 방법</Typography>
							<Box className="visit-method-wrap">
								<Button
									className={'visit-btn' + (visitMethod === 'walk' ? ' visit-btn--active' : '')}
									onClick={() => setVisitMethod('walk')}
								>
									🚶 도보 방문
								</Button>
								<Button
									className={'visit-btn' + (visitMethod === 'car' ? ' visit-btn--active' : '')}
									onClick={() => setVisitMethod('car')}
								>
									🚗 차량 방문
								</Button>
							</Box>
						</Box>
					</Box>

					<Divider className="divider-lg" />

					{/* 결제 수단 */}
					<Box className="section">
						<Typography className="section-title">결제 수단</Typography>

						<Box className="payment-grid">
							{PAYMENT_METHODS.map((method) => (
								<Button
									key={method}
									className={'payment-chip' + (paymentMethod === method ? ' payment-chip--selected' : '')}
									onClick={() => setPaymentMethod(method)}
								>
									{method}
								</Button>
							))}
						</Box>

						<FormControlLabel
							className="remember-check"
							control={<Checkbox checked={agreeAll} onChange={(e) => setAgreeAll(e.target.checked)} size="small" />}
							label="이 결제 수단을 다음에도 사용"
						/>
					</Box>
				</Box>

				{/* RIGHT */}
				<Box className="reservation-sidebar">
					<Card className="room-card" variant="outlined">
						<CardContent>
							<Typography className="room-title">길동 MARI-마리</Typography>
							<Box className="room-info">
								<img
									className="room-thumb"
									src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"
								/>
								<Box className="room-meta">
									<Box className="room-meta-row">
										<span className="room-meta-label">객실</span>
										<span className="room-meta-value">B-타입(카운터에서 B타입 꼭 말씀해주세요, OTT 시청 가능)</span>
									</Box>
									<Box className="room-meta-row">
										<span className="room-meta-label">일정</span>
										<span className="room-meta-value">12.01 (월) {selectedTime} ~ 12.01 (월) 20:00 (대실)</span>
									</Box>
								</Box>
							</Box>
						</CardContent>
					</Card>

					<Card className="payment-card" variant="outlined">
						<CardContent>
							<Typography className="section-title mb-16">결제 정보</Typography>
							<Box className="payment-row">
								<span className="payment-label">객실 가격</span>
								<span className="payment-value">{roomPrice.toLocaleString()}원</span>
							</Box>
							<Box className="payment-row">
								<span className="payment-label">할인 금액</span>
								<span className="payment-value">{discount ? `-${discount}원` : '0원'}</span>
							</Box>
							<Divider className="divider-sm" />
							<Box className="payment-row total">
								<span className="payment-label">총 결제 금액</span>
								<span className="payment-total">{totalPrice.toLocaleString()}원</span>
							</Box>

							<Box className="agree-wrap">
								<FormControlLabel
									control={<Checkbox size="small" checked={agreeAll} onChange={(e) => setAgreeAll(e.target.checked)} />}
									label="약관 전체동의"
								/>
							</Box>

							<Button fullWidth className="pay-button" disabled={!agreeAll}>
								{totalPrice.toLocaleString()}원 결제하기
							</Button>
						</CardContent>
					</Card>
				</Box>
			</Box>
		</Container>
	);
};

export default LayoutHome(ReservationCheckoutPage);
