import React, { useState, useRef, ChangeEvent } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Box,
	TextField,
	Select,
	MenuItem,
	Button,
	IconButton,
	Grid,
	FormGroup,
	FormControlLabel,
	Checkbox,
	Chip,
	FormControl,
	InputLabel,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { FACILITY_ITEMS } from '../../../facilities/facility';

interface PropertyForm {
	propertyName: string;
	propertyType: string;
	address: string;
	detailAddress: string;
	roomType: string;
	capacity: string;
	bedType: string;
	roomSize: string;
	facilities: string[];
	images: string[];
	checkInTime: string;
	checkOutTime: string;
	minGuests: number;
	maxGuests: number;
	minStay: number;
	maxStay: number;
	smoking: boolean;
	additionalRules: string;
	options: string[];
	lat: string;
	lng: string;
}

declare global {
	interface Window {
		daum?: any;
	}
}
interface PropertyRegistrationModalProps {
	open: boolean;
	onClose: (v: boolean) => void;
}

const AddPropertyModal = ({ open, onClose }: PropertyRegistrationModalProps) => {
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<PropertyForm>({
		propertyName: '',
		propertyType: '호텔',
		address: '',
		detailAddress: '',
		roomType: '',
		capacity: '2 / 4',
		bedType: '',
		roomSize: '',
		facilities: ['무료 Wi-Fi', '주차 가능', '파티룸'],
		images: [],
		checkInTime: '15:00',
		checkOutTime: '11:00',
		minGuests: 2,
		maxGuests: 4,
		minStay: 1,
		maxStay: 4,
		smoking: false,
		additionalRules: '',
		options: [],
		lat: '',
		lng: '',
	});
	const fileInputRef = useRef<HTMLInputElement | null>(null);

	const handlePostcodeSearch = () => {
		if (!window.daum?.Postcode) return;

		new window.daum.Postcode({
			oncomplete: (data: any) => {
				const address = data.roadAddress || data.jibunAddress;

				// 주소 저장
				handleChange('address', ` ${address}`);

				// ⬇ 여기서 좌표 변환
				window.kakao.maps.load(() => {
					const geocoder = new window.kakao.maps.services.Geocoder();

					geocoder.addressSearch(address, (result: any, status: any) => {
						if (status === window.kakao.maps.services.Status.OK) {
							const { x, y } = result[0]; // x: lng, y: lat
							console.log('좌표', x, y);
							handleChange('lat', y);
							handleChange('lng', x);
						}
					});
				});
			},
		}).open();
	};

	const handleChange = <K extends keyof PropertyForm>(field: K, value: PropertyForm[K]) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const clearInput = (field: keyof PropertyForm) => {
		setFormData((prev) => ({ ...prev, [field]: '' as any }));
	};

	const toggleFacility = (facilityLabel: string) => {
		setFormData((prev) => ({
			...prev,
			facilities: prev.facilities.includes(facilityLabel)
				? prev.facilities.filter((f) => f !== facilityLabel)
				: [...prev.facilities, facilityLabel],
		}));
	};

	const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files || files.length === 0) return;

		const readers: Promise<string>[] = Array.from(files).map((file) => {
			return new Promise((resolve) => {
				const reader = new FileReader();
				reader.onloadend = () => resolve(reader.result as string);
				reader.readAsDataURL(file);
			});
		});

		Promise.all(readers).then((newImages) => {
			setFormData((prev) => ({
				...prev,
				images: [...prev.images, ...newImages],
			}));
		});
	};

	const removeImage = (index: number) => {
		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
		}));
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const nextStep = () => {
		setCurrentStep((prev) => Math.min(prev + 1, 3));
	};

	const prevStep = () => {
		setCurrentStep((prev) => Math.max(prev - 1, 1));
	};

	const handleSubmit = () => {
		alert('숙소 등록이 완료되었습니다!');
		console.log(formData);
		onClose(false);
	};

	const activeWidth = `${((currentStep - 1) / 2) * 100}%`;

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="md" className="property-modal">
			<DialogTitle className="property-modal__title-row">
				<p className="property-modal__title">새로운 숙소 등록하기</p>
				<IconButton size="small" onClick={() => onClose(false)} className="property-modal__close-button">
					<CloseIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent className="property-modal__content">
				{/* progress */}
				<Box className="property-modal__progress">
					<Box className="property-modal__progress-line" />
					<Box
						className="property-modal__progress-line property-modal__progress-line--active"
						sx={{ width: activeWidth }}
					/>
					<Box className="property-modal__progress-steps">
						<Box
							className={`property-modal__progress-step ${currentStep === 1 ? 'is-active' : ''} ${
								currentStep > 1 ? 'is-completed' : ''
							}`}
						>
							<Box className="property-modal__step-number">1</Box>
							<p className="property-modal__step-label">1단계: 기본 정보</p>
						</Box>
						<Box
							className={`property-modal__progress-step ${currentStep === 2 ? 'is-active' : ''} ${
								currentStep > 2 ? 'is-completed' : ''
							}`}
						>
							<Box className="property-modal__step-number">2</Box>
							<p className="property-modal__step-label">2단계: 시설·사진</p>
						</Box>
						<Box className={`property-modal__progress-step ${currentStep === 3 ? 'is-active' : ''}`}>
							<Box className="property-modal__step-number">3</Box>
							<p className="property-modal__step-label">3단계: 규칙·인원</p>
						</Box>
					</Box>
				</Box>

				{/* STEP 1 */}
				{currentStep === 1 && (
					<Box className="property-modal__card">
						<p className="property-modal__section-title">1단계: 기본 정보 입력</p>

						<Box className="property-modal__form-group">
							<p className="property-modal__label">
								숙소명 <span className="property-modal__required">*</span>
							</p>
							<Box className="property-modal__input-wrapper">
								<TextField
									fullWidth
									size="small"
									value={formData.propertyName}
									onChange={(e) => handleChange('propertyName', e.target.value)}
								/>
								{formData.propertyName && (
									<IconButton
										size="small"
										className="property-modal__clear-button"
										onClick={() => clearInput('propertyName')}
									>
										<CloseIcon fontSize="small" />
									</IconButton>
								)}
							</Box>
						</Box>

						<Box className="property-modal__form-group">
							<p className="property-modal__label">
								숙소 유형 <span className="property-modal__required">*</span>
							</p>
							<FormControl fullWidth size="small">
								<Select
									value={formData.propertyType}
									onChange={(e) => handleChange('propertyType', e.target.value as string)}
								>
									<MenuItem value="호텔">호텔</MenuItem>
									<MenuItem value="모텔">모텔</MenuItem>
									<MenuItem value="펜션">펜션</MenuItem>
									<MenuItem value="게스트하우스">게스트하우스</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<Box className="property-modal__form-group">
							<p className="property-modal__label">
								주소 <span className="property-modal__required">*</span>
							</p>

							<Grid container spacing={1} mb={1}>
								<Grid item xs>
									<Box className="property-modal__input-wrapper">
										<TextField
											fullWidth
											size="small"
											placeholder="우편번호 검색"
											value={formData.address}
											onChange={(e) => handleChange('address', e.target.value)}
										/>
										{formData.address && (
											<IconButton
												size="small"
												className="property-modal__clear-button"
												onClick={() => clearInput('address')}
											>
												<CloseIcon fontSize="small" />
											</IconButton>
										)}
									</Box>
								</Grid>
								<Grid item>
									<Button
										onClick={handlePostcodeSearch}
										variant="outlined"
										size="small"
										className="property-modal__zipcode-button"
									>
										우편번호 검색
									</Button>
								</Grid>
							</Grid>

							<Box className="property-modal__input-wrapper">
								<TextField
									fullWidth
									size="small"
									placeholder="상세 주소"
									value={formData.detailAddress}
									onChange={(e) => handleChange('detailAddress', e.target.value)}
								/>
								{formData.detailAddress && (
									<IconButton
										size="small"
										className="property-modal__clear-button"
										onClick={() => clearInput('detailAddress')}
									>
										<CloseIcon fontSize="small" />
									</IconButton>
								)}
							</Box>
						</Box>

						<Box className="property-modal__form-group">
							<p className="property-modal__label">대표 사진 업로드</p>

							<Grid container spacing={1} mb={1}>
								{formData.images.map((img, index) => (
									<Grid item xs={3} key={index}>
										<Box
											className="property-modal__image-slot"
											sx={{
												backgroundImage: `url(${img})`,
											}}
										>
											<IconButton
												size="small"
												className="property-modal__image-remove"
												onClick={() => removeImage(index)}
											>
												<CloseIcon fontSize="small" />
											</IconButton>
										</Box>
									</Grid>
								))}

								{formData.images.length < 10 && (
									<Grid item xs={3}>
										<Box
											className="property-modal__image-slot property-modal__image-slot--add"
											onClick={triggerFileInput}
										>
											<p color="text.secondary">+</p>
										</Box>
									</Grid>
								)}
							</Grid>

							<Button
								variant="outlined"
								size="small"
								onClick={triggerFileInput}
								className="property-modal__add-image-button"
							>
								이미지 추가
							</Button>

							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								multiple
								onChange={handleImageUpload}
								style={{ display: 'none' }}
							/>
						</Box>
					</Box>
				)}

				{/* STEP 2 */}
				{currentStep === 2 && (
					<Box className="property-modal__card">
						<p className="property-modal__section-title">2단계: 시설 및 사진 정보</p>

						<Box className="property-modal__form-group">
							<p className="property-modal__label">시설 및 서비스</p>
							<FormGroup className="property-modal__facilities">
								{FACILITY_ITEMS.map((item) => (
									<FormControlLabel
										key={item.key}
										control={
											<Checkbox
												checked={formData.facilities.includes(item.label)}
												onChange={() => toggleFacility(item.label)}
											/>
										}
										label={
											<Box className="property-modal__facility-label">
												<span className="property-modal__facility-icon">{item.icon}</span>
												<span>{item.label}</span>
											</Box>
										}
									/>
								))}
							</FormGroup>
						</Box>
					</Box>
				)}

				{/* STEP 3 */}
				{currentStep === 3 && (
					<Box className="property-modal__card">
						<p className="property-modal__section-title">3단계: 숙박 규칙 및 인원 설정</p>

						<Box className="property-modal__form-group">
							<Box className="property-modal__time-row">
								<p className="property-modal__time-label">체크인 시간</p>
								<FormControl size="small" sx={{ width: 160 }}>
									<InputLabel id="check-in-label">체크인</InputLabel>
									<Select
										labelId="check-in-label"
										label="체크인"
										value={formData.checkInTime}
										onChange={(e) => handleChange('checkInTime', e.target.value as string)}
									>
										<MenuItem value="14:00">14:00</MenuItem>
										<MenuItem value="15:00">15:00</MenuItem>
										<MenuItem value="16:00">16:00</MenuItem>
									</Select>
								</FormControl>
							</Box>
						</Box>

						<Box className="property-modal__form-group">
							<Box className="property-modal__time-row">
								<p className="property-modal__time-label">체크아웃 시간</p>
								<TextField
									type="time"
									size="small"
									sx={{ width: 160 }}
									value={formData.checkOutTime}
									onChange={(e) => handleChange('checkOutTime', e.target.value as string)}
								/>
							</Box>
						</Box>

						<Box className="property-modal__form-group">
							<Box className="property-modal__capacity-row">
								<p className="property-modal__capacity-label">기준 / 최대 인원</p>
								<TextField
									type="number"
									size="small"
									className="property-modal__capacity-input"
									value={formData.minGuests}
									onChange={(e) => handleChange('minGuests', Number(e.target.value))}
								/>
								<TextField
									type="number"
									size="small"
									className="property-modal__capacity-input"
									value={formData.maxGuests}
									onChange={(e) => handleChange('maxGuests', Number(e.target.value))}
								/>
							</Box>

							<Box className="property-modal__capacity-row">
								<p className="property-modal__capacity-label">최소 / 최대 숙박일</p>
								<TextField
									type="number"
									size="small"
									className="property-modal__capacity-input"
									value={formData.minStay}
									onChange={(e) => handleChange('minStay', Number(e.target.value))}
								/>
								<TextField
									type="number"
									size="small"
									className="property-modal__capacity-input"
									value={formData.maxStay}
									onChange={(e) => handleChange('maxStay', Number(e.target.value))}
								/>
							</Box>

							<FormControlLabel
								control={
									<Checkbox
										checked={formData.smoking}
										onChange={(e) => handleChange('smoking', e.target.checked as boolean)}
									/>
								}
								label="흡연 / 반려동물 동반 / 파티 등 추가 규칙이 있는 경우 안내"
							/>
						</Box>

						<Box className="property-modal__form-group">
							<p className="property-modal__label">요금 특이 사항</p>
							<Chip label="추가 인원 1인당 20,000원" onDelete={() => {}} className="property-modal__option-chip" />
							<p className="property-modal__option-hint">예) 성수기 추가요금, 인원 추가요금 등</p>
						</Box>
					</Box>
				)}
			</DialogContent>

			<DialogActions className="property-modal__actions">
				{currentStep > 1 && (
					<Button
						variant="outlined"
						className="property-modal__button property-modal__button--secondary"
						onClick={prevStep}
					>
						이전 단계
					</Button>
				)}
				{currentStep < 3 ? (
					<Button
						variant="contained"
						className="property-modal__button property-modal__button--primary"
						onClick={nextStep}
					>
						다음 단계로 이동
					</Button>
				) : (
					<Button
						variant="contained"
						className="property-modal__button property-modal__button--primary"
						onClick={handleSubmit}
					>
						등록 완료
					</Button>
				)}
			</DialogActions>
		</Dialog>
	);
};

export default AddPropertyModal;
