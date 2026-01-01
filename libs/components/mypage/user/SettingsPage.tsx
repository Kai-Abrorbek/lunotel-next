// SettingsPage.tsx
import React, { useMemo, useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, IconButton, Paper, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useTranslation } from 'react-i18next';
import { sweetTopSmallSuccessAlert } from '../../../sweetAlert';

type ChannelKey = 'sms' | 'email' | 'kakao';

interface ChannelState {
	sms: boolean;
	email: boolean;
	kakao: boolean;
}

const SettingsPage: React.FC = () => {
	const { t, i18n } = useTranslation('common');
	const [channels, setChannels] = useState<ChannelState>({
		sms: false,
		email: false,
		kakao: false,
	});

	const allChecked = useMemo(() => channels.sms && channels.email && channels.kakao, [channels]);
	const someChecked = useMemo(
		() => [channels.sms, channels.email, channels.kakao].some(Boolean) && !allChecked,
		[channels, allChecked],
	);

	const handleParentToggle = () => {
		const next = !allChecked;
		setChannels({ sms: next, email: next, kakao: next });
	};

	const handleChildToggle = (key: ChannelKey) => {
		setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	const handleSave = () => {
		sweetTopSmallSuccessAlert(t('설정이 저장되었습니다'));
		console.log('MARKETING SETTINGS:', channels);
	};

	return (
		<Box className="settings-page">
			<Box className="settings-page__inner">
				<Box className="settings-header">
					<Typography className="settings-title">{t('설정')}</Typography>
				</Box>

				<Typography className="settings-subtitle">{t('특가, 쿠폰 등 이벤트 정보를 빠르게 알려드릴게요')}.</Typography>

				{/* 안내 박스 */}
				<Paper className="settings-info" elevation={0}>
					<IconButton size="small" className="settings-info__icon">
						<InfoOutlinedIcon fontSize="small" />
					</IconButton>
					<Typography className="settings-info__text">
						{t('앱 잠금, 최근 본 상품 저장, 앱 푸시, 접근 권한 설정은 여기어때 앱에서 가능해요')}.
					</Typography>
				</Paper>

				{/* 마케팅 동의 */}
				<Box className="settings-marketing">
					<FormControlLabel
						className="settings-marketing__parent"
						control={<Checkbox checked={allChecked} indeterminate={someChecked} onChange={handleParentToggle} />}
						label={
							<Typography className="settings-marketing__parent-label">{t('마케팅 알림 수신 동의(선택)')}</Typography>
						}
					/>

					<Box className="settings-marketing__children">
						<FormControlLabel
							className="settings-marketing__child"
							control={<Checkbox checked={channels.sms} onChange={() => handleChildToggle('sms')} />}
							label={<Typography className="settings-marketing__child-label">{t('문자')}</Typography>}
						/>

						<FormControlLabel
							className="settings-marketing__child"
							control={<Checkbox checked={channels.email} onChange={() => handleChildToggle('email')} />}
							label={<Typography className="settings-marketing__child-label">{t('이메일')}</Typography>}
						/>

						<FormControlLabel
							className="settings-marketing__child"
							control={<Checkbox checked={channels.kakao} onChange={() => handleChildToggle('kakao')} />}
							label={<Typography className="settings-marketing__child-label">{t('카카오톡')}</Typography>}
						/>
					</Box>

					<Box className="settings-divider" />

					<Box className="settings-footer">
						<Button variant="contained" className="settings-save-btn" onClick={handleSave}>
							{t('저장')}
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default SettingsPage;
