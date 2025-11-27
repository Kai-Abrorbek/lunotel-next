import React, { useState } from 'react';
import { Box, Paper, TextField, Typography, Button, Switch, IconButton, InputAdornment } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface UserInfo {
	nickname: string;
	reserverName: string;
	phone: string;
	birth: string;
	gender: string;
}

const MyInfoPage: React.FC = () => {
	const [visible, setVisible] = useState(false);

	const [userInfo, setUserInfo] = useState<UserInfo>({
		nickname: '재미있고바람직한글',
		reserverName: '',
		phone: '01082108335',
		birth: '1997년 02월 13일',
		gender: '남성',
	});

	const handleChange = (field: keyof UserInfo, value: string) => {
		setUserInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handleClear = (field: keyof UserInfo) => {
		setUserInfo((prev) => ({ ...prev, [field]: '' }));
	};

	const maskText = (text: string) => {
		if (visible) return text;
		if (!text) return '';
		return '●'.repeat(text.length);
	};

	const handleSave = () => {
		alert('저장되었습니다.');
		console.log('UPDATED USER:', userInfo);
	};

	return (
		<Box className="myinfo-page">
			<Box className="myinfo-header">
				<Typography className="myinfo-title">내 정보 관리</Typography>
				<Button variant="contained" className="myinfo-save-btn" onClick={handleSave}>
					저장
				</Button>
			</Box>

			<Typography className="myinfo-subtitle">회원 정보</Typography>
			<Typography className="myinfo-text">현재 정보 수정은 여기에서 가능합니다.</Typography>

			{/* visibility toggle */}
			<Paper className="myinfo-visibility-card">
				<Box className="visibility-row">
					<Switch checked={visible} onChange={(e) => setVisible(e.target.checked)} />
					<Typography className="visibility-text">
						{visible ? '내 정보가 보여지고 있어요.' : '내 정보가 숨겨져 있어요.'}
					</Typography>
				</Box>
			</Paper>

			<Box className={'myinfo-form' + (!visible ? ' myinfo-form--hidden' : '')}>
				{/* 닉네임 / 예약자 */}
				<Box className="form-row">
					<Box className="form-item">
						<Typography className="form-label">닉네임</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.nickname)}
							placeholder="닉네임 입력"
							onChange={(e) => handleChange('nickname', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.nickname && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('nickname')} size="small">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>

					<Box className="form-item">
						<Typography className="form-label">예약자 이름</Typography>
						<TextField
							fullWidth
							placeholder="예약자 이름"
							value={maskText(userInfo.reserverName)}
							onChange={(e) => handleChange('reserverName', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.reserverName && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('reserverName')} size="small">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>
				</Box>

				{/* 휴대폰 / 생일 */}
				<Box className="form-row">
					<Box className="form-item">
						<Typography className="form-label">휴대폰 번호</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.phone)}
							onChange={(e) => handleChange('phone', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.phone && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('phone')} size="small">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>

					<Box className="form-item">
						<Typography className="form-label">생년월일</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.birth)}
							onChange={(e) => handleChange('birth', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.birth && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('birth')} size="small">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>
				</Box>

				{/* 성별 */}
				<Box className="form-row">
					<Box className="form-item">
						<Typography className="form-label">성별</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.gender)}
							onChange={(e) => handleChange('gender', e.target.value)}
							InputProps={{
								readOnly: true,
								// endAdornment: userInfo.gender && visible && (
								// 	<InputAdornment position="end">
								// 		<IconButton onClick={() => handleClear('gender')} size="small">
								// 			<ClearIcon fontSize="small" />
								// 		</IconButton>
								// 	</InputAdornment>
								// ),
							}}
						/>
					</Box>
				</Box>
			</Box>

			{/* access device */}
			<Box className="myinfo-section">
				<Typography className="myinfo-device-title">접속 기기 관리</Typography>
				<Typography className="myinfo-device-text">로그인 된 모든 기기에서 로그아웃 돼요.</Typography>
				<Button className="logout-all">전체 로그아웃</Button>
			</Box>

			<Box className="myinfo-footer">
				더 이상 여기어때 이용을 원하지 않으신가요? <span className="leave-text">회원탈퇴</span>
			</Box>
		</Box>
	);
};

export default MyInfoPage;
