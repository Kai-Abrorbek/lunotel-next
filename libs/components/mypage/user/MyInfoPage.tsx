import React, { useEffect, useState } from 'react';
import { Box, Paper, TextField, Typography, Button, Switch, IconButton, InputAdornment, Grid } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../../apollo/store';
import { MemberUpdate } from '../../../types/member/member.update';
import { sweetConfirmAlert, sweetErrorAlert, sweetMixinSuccessAlert } from '../../../sweetAlert';
import { UPDATE_MEMBER } from '../../../../apollo/user/mutation';
import { updateStorage, updateUserInfo } from '../../../auth';
import { useTranslation } from 'react-i18next';

const MyInfoPage = () => {
	const { t, i18n } = useTranslation('common');
	const [visible, setVisible] = useState(false);
	const user = useReactiveVar(userVar);
	const [userInfo, setUserInfo] = useState<MemberUpdate>({
		_id: user._id,
		memberNick: user.memberNick,
		memberPhone: user.memberPhone,
		memberEmail: user.memberEmail,
		memberFullName: user.memberFullName ?? '',
		memberImage: user.memberImage ?? '',
		memberAddress: user.memberAddress ?? '',
		memberDesc: user.memberDesc ?? '',
	});

	/** APOLLO REQUEST **/
	const [memberUpdate] = useMutation(UPDATE_MEMBER);

	useEffect(() => {
		setUserInfo(
			(prev) =>
				Object.fromEntries(
					Object.entries(prev).filter(([_, value]) => value !== '' && value !== null && value !== undefined),
				) as MemberUpdate,
		);
	}, []);

	const handleChange = (field: keyof MemberUpdate, value: string) => {
		setUserInfo((prev) => ({ ...prev, [field]: value }));
	};

	const handleClear = (field: keyof MemberUpdate) => {
		setUserInfo((prev) => ({ ...prev, [field]: '' }));
	};

	const maskText = (text: string) => {
		if (visible) return text;
		if (!text) return '';
		return '●'.repeat(text.length);
	};

	const handleUpdateMemberInfo = async () => {
		try {
			if (visible && (await sweetConfirmAlert('이메일 정보를 변경하시면 간편 로그인이 어렵습니다!!'))) {
				const result = await memberUpdate({ variables: { input: userInfo } });
				//@ts-ignore
				const jwtToken = result.data.updateMember?.accessToken;
				await updateStorage({ jwtToken });
				updateUserInfo(result.data.updateMember?.accessToken);
				await sweetMixinSuccessAlert('information updated successfully.');
			}
		} catch (err: any) {
			sweetErrorAlert(err.message);
		}
	};

	const handlePostcodeSearch = () => {
		if (!window.daum?.Postcode) return;
		new window.daum.Postcode({
			oncomplete: (data: any) => {
				const address = data.roadAddress || data.jibunAddress;
				handleChange('memberAddress', ` ${address}`);
				window.kakao.maps.load(() => {
					const geocoder = new window.kakao.maps.services.Geocoder();
					geocoder.addressSearch(address, (result: any, status: any) => {
						if (status === window.kakao.maps.services.Status.OK) {
							const { x, y } = result[0]; // x: lng, y: lat
						}
					});
				});
			},
		}).open();
	};

	return (
		<Box className="myinfo-page">
			<Box className="myinfo-header">
				<Typography className="myinfo-title">{t('내 정보 관리')}</Typography>
				<Button variant="contained" className="myinfo-save-btn" onClick={handleUpdateMemberInfo}>
					{t('저장')}
				</Button>
			</Box>

			<Typography className="myinfo-subtitle">{t('회원 정보')}</Typography>
			<Typography className="myinfo-text">{t('현재 정보 수정은 여기에서 가능합니다')}.</Typography>

			{/* visibility toggle */}
			<Paper className="myinfo-visibility-card">
				<Box className="visibility-row">
					<Switch checked={visible} onChange={(e) => setVisible(e.target.checked)} />
					<Typography className="visibility-text">
						{visible ? '내 정보가 보여지고 있어요.' : t('내 정보가 숨겨져 있어요')}
					</Typography>
				</Box>
			</Paper>

			<Box className={'myinfo-form' + (!visible ? ' myinfo-form--hidden' : '')}>
				{/* 닉네임 / 예약자 */}
				<Box className="form-row">
					<Box className="form-item">
						<Typography className="form-label">{t('닉네임')}</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.memberNick! ?? '')}
							placeholder={t('닉네임 입력')}
							onChange={(e) => handleChange('memberNick', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.memberNick && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('memberNick')} size="small">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>

					<Box className="form-item">
						<Typography className="form-label">{t('예약자 이름')}</Typography>
						<TextField
							fullWidth
							placeholder={t('예약자 이름')}
							value={maskText(userInfo.memberFullName! ?? '')}
							onChange={(e) => handleChange('memberFullName', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.memberFullName && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('memberFullName')} size="small">
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
						<Typography className="form-label">{t('휴대폰 번호')}</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.memberPhone! ?? '')}
							onChange={(e) => handleChange('memberPhone', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.memberPhone && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('memberPhone')} size="small">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>

					<Box className="form-item">
						<Typography className="form-label">{t('이메일')}</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.memberEmail! ?? '')}
							onChange={(e) => handleChange('memberEmail', e.target.value)}
							InputProps={{
								readOnly: !visible,
								endAdornment: userInfo.memberEmail && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('memberEmail')} size="small">
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
						<Typography className="form-label">{t('주소')}</Typography>
						<TextField
							fullWidth
							value={maskText(userInfo.memberAddress! ?? '')}
							onChange={(e) => handleChange('memberAddress', e.target.value)}
							InputProps={{
								readOnly: false,
								endAdornment: userInfo.memberAddress && visible && (
									<InputAdornment position="end">
										<IconButton onClick={() => handleClear('memberAddress')} size="small">
											<ClearIcon fontSize="small" />
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>
					<Grid item sx={{ marginBottom: '5px' }}>
						<Button
							onClick={handlePostcodeSearch}
							variant="outlined"
							size="small"
							className="property-modal__zipcode-button"
						>
							{t('우편번호 검색')}
						</Button>
					</Grid>
				</Box>
			</Box>

			{/* access device */}
			<Box className="myinfo-section">
				<Typography className="myinfo-device-title">{t('접속 기기 관리')}</Typography>
				<Typography className="myinfo-device-text">{t('로그인 된 모든 기기에서 로그아웃 돼요')}.</Typography>
				<Button className="logout-all">{t('전체 로그아웃')}</Button>
			</Box>

			<Box className="myinfo-footer">
				{t('더 이상 여기어때 이용을 원하지 않으신가요?')} <span className="leave-text">{t('회원탈퇴')}</span>
			</Box>
		</Box>
	);
};

export default MyInfoPage;
