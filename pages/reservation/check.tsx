import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Divider } from '@mui/material';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LayoutHome from '../../libs/components/layout/LayoutHome';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const mockReservation = {
	propertyName: '루나호텔 해운대',
	reservationCode: 'LNT-2025-0301-1234',
	checkIn: '2025-03-01',
	checkOut: '2025-03-03',
	nights: 2,
	guests: 2,
	roomType: '디럭스 오션뷰',
	totalAmount: 248000,
	status: '결제완료',
	bookedAt: '2025-02-10 21:32',
};

const GuestReservationLookup: React.FC = () => {
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [code, setCode] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: 비회원 예약 조회 API 연결
		console.log({ name, phone, code });
	};

	return (
		<Box className="guest-lookup-page">
			<Box className="guest-lookup-wrapper">
				<Paper elevation={4} className="guest-lookup-card">
					{/* 헤더 */}
					<Box className="guest-lookup-header">
						<Box className="guest-lookup-icon-circle">
							<ConfirmationNumberOutlinedIcon />
						</Box>
						<div>
							<Typography className="guest-lookup-title">비회원 예약조회</Typography>
							<Typography className="guest-lookup-sub">예약번호와 연락처로 예약 내역을 확인할 수 있어요.</Typography>
						</div>
					</Box>

					<Divider className="guest-lookup-divider" />

					{/* 폼 */}
					<Box component="form" onSubmit={handleSubmit} className="guest-lookup-form">
						<div className="guest-lookup-row">
							<div className="guest-field">
								<label className="guest-label">
									이름
									<span className="required-dot" />
								</label>
								<TextField
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="예약자 이름을 입력하세요"
									fullWidth
									size="small"
									className="guest-input"
									InputProps={{
										startAdornment: (
											<span className="guest-input-icon">
												<PersonOutlineIcon fontSize="small" />
											</span>
										),
										endAdornment: name && (
											<button type="button" className="clear-btn" onClick={() => setName('')}>
												×
											</button>
										),
									}}
								/>
							</div>

							<div className="guest-field">
								<label className="guest-label">
									휴대폰 번호
									<span className="required-dot" />
								</label>
								<TextField
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									placeholder="예: 010-1234-5678"
									fullWidth
									size="small"
									className="guest-input"
									InputProps={{
										startAdornment: (
											<span className="guest-input-icon">
												<PhoneIphoneOutlinedIcon fontSize="small" />
											</span>
										),
										endAdornment: phone && (
											<button type="button" className="clear-btn" onClick={() => setPhone('')}>
												×
											</button>
										),
									}}
								/>
							</div>
						</div>

						<div className="guest-field">
							<label className="guest-label">
								예약번호
								<span className="required-dot" />
							</label>
							<TextField
								value={code}
								onChange={(e) => setCode(e.target.value)}
								placeholder="예약 완료 시 안내받은 번호를 입력하세요"
								fullWidth
								size="small"
								className="guest-input"
								InputProps={{
									startAdornment: (
										<span className="guest-input-icon">
											<ConfirmationNumberOutlinedIcon fontSize="small" />
										</span>
									),
									endAdornment: code && (
										<button type="button" className="clear-btn" onClick={() => setCode('')}>
											×
										</button>
									),
								}}
							/>
						</div>

						<Box className="guest-lookup-help">
							<HelpOutlineOutlinedIcon className="guest-help-icon" />
							<span>예약번호는 카카오톡/문자/이메일로 발송된 안내메시지에서 확인할 수 있어요.</span>
						</Box>

						<Box className="guest-lookup-actions">
							<Button
								type="submit"
								variant="contained"
								className="guest-submit-btn"
								startIcon={<SearchRoundedIcon />}
								fullWidth
							>
								예약조회하기
							</Button>
						</Box>
					</Box>

					{/* 결과 영역(임시) */}
					{mockReservation ? (
						<Box className="guest-result-placeholder">
							<Typography className="guest-result-title">조회된 예약 내역입니다.</Typography>

							<div className="guest-result-row">
								<span className="label">숙소명</span>
								<span className="value">{mockReservation.propertyName}</span>
							</div>

							<div className="guest-result-row">
								<span className="label">예약번호</span>
								<span className="value">{mockReservation.reservationCode}</span>
							</div>

							<div className="guest-result-row">
								<span className="label">이용일</span>
								<span className="value">
									{mockReservation.checkIn} ~ {mockReservation.checkOut}
									{'  '}
									<span className="sub">({mockReservation.nights}박)</span>
								</span>
							</div>

							<div className="guest-result-row">
								<span className="label">인원</span>
								<span className="value">{mockReservation.guests}명</span>
							</div>

							<div className="guest-result-row">
								<span className="label">객실타입</span>
								<span className="value">{mockReservation.roomType}</span>
							</div>

							<div className="guest-result-row">
								<span className="label">결제금액</span>
								<span className="value highlight">{mockReservation.totalAmount.toLocaleString()}원</span>
							</div>

							<div className="guest-result-row">
								<span className="label">예약상태</span>
								<span className="value status">{mockReservation.status}</span>
							</div>

							<div className="guest-result-row last">
								<span className="label">예약일시</span>
								<span className="value">{mockReservation.bookedAt}</span>
							</div>
						</Box>
					) : (
						<Box className="guest-result-placeholder">
							<Typography className="guest-result-title">조회된 예약 내역이 없습니다.</Typography>
						</Box>
					)}
				</Paper>
			</Box>
		</Box>
	);
};

export default LayoutHome(GuestReservationLookup);
