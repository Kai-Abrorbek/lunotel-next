import React, { useState, useRef } from 'react';
import { PropertyInput } from '../../../types/property/property.input';
import { PropertyLocation, PropertyStatus, PropertyType } from '../../../enums/property.enum';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface StatusOption {
	value: PropertyStatus;
	label: string;
	color: string;
}

const statusOptions: StatusOption[] = [
	{ value: PropertyStatus.ACTIVE, label: '운영중', color: '#10b981' },
	{ value: PropertyStatus.DRAFT, label: '대기중', color: '#f59e0b' },
	{ value: PropertyStatus.INACTIVE, label: '판매완료', color: '#e6e22fff' },
	{ value: PropertyStatus.BLOCKED, label: '중지', color: '#ef4444' },
];

const typeOptions = [
	{ value: 'HOTEL', label: '호텔', icon: '🏨' },
	{ value: 'MOTEL', label: '모텔', icon: '🏩' },
	{ value: 'PENSION', label: '펜션', icon: '🏡' },
	{ value: 'POLL_VILLA', label: '풀빌라', icon: '🏘️' },
	{ value: 'RESORT', label: '리조트', icon: '🏖️' },
	{ value: 'CAMPING', label: '캠핑', icon: '🏕️' },
	{ value: 'GLAMPING', label: '캠핑', icon: '🏕️' },
];
const locationOptions = [
	{ value: 'SEOUL', label: '서울' },
	{ value: 'BUSAN', label: '부산' },
	{ value: 'INCHEON', label: '인천' },
	{ value: 'DAEGU', label: '대구' },
	{ value: 'DAEJEON', label: '대전' },
	{ value: 'GWANGJU', label: '광주' },
	{ value: 'ULSAN', label: '울산' },
	{ value: 'SEJONG', label: '세종' },
	{ value: 'GYEONGGI', label: '경기' },
	{ value: 'GANGWON', label: '강원' },
	{ value: 'CHUNGBUK', label: '충북' },
	{ value: 'CHUNGNAM', label: '충남' },
	{ value: 'JEONBUK', label: '전북' },
	{ value: 'JEONNAM', label: '전남' },
	{ value: 'GYEONGBUK', label: '경북' },
	{ value: 'GYEONGNAM', label: '경남' },
	{ value: 'JEJU', label: '제주' },
];

declare global {
	interface Window {
		daum?: any;
	}
}

interface PropertyUpdateModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	initialInput?: PropertyInput;
}
const PropertyAddModal = ({ isOpen, setIsOpen, initialInput }: PropertyUpdateModalProps) => {
	const [propertyData, setPropertyData] = useState<PropertyInput>(initialInput!);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChange = <K extends keyof PropertyInput>(field: K, value: PropertyInput[K]) => {
		setPropertyData((prev) => ({ ...prev, [field]: value }));
	};

	const clearInput = (field: keyof PropertyInput) => {
		setPropertyData((prev) => ({ ...prev, [field]: '' as any }));
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages: string[] = [];
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					newImages.push(reader.result as string);
					if (newImages.length === files.length) {
						setPropertyData({ ...propertyData, propertyImages: [...propertyData.propertyImages, ...newImages] });
					}
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeImage = (index: number) => {
		const newImages = propertyData.propertyImages.filter((_, i) => i !== index);
		setPropertyData({ ...propertyData, propertyImages: newImages });
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = () => {
		console.log('Updated Property Data:', propertyData);
		setIsOpen(false);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	const renderStars = () => {
		return (
			<div className="stars-container">
				{[1, 2, 3, 4, 5].map((star) => (
					<span
						key={star}
						className={`star ${star <= propertyData.propertyStars ? 'filled' : ''}`}
						onClick={() => handleChange('propertyStars', star)}
					>
						★
					</span>
				))}
			</div>
		);
	};

	const handlePostcodeSearch = () => {
		if (!window.daum?.Postcode) return;
		new window.daum.Postcode({
			oncomplete: (data: any) => {
				const address = data.roadAddress || data.jibunAddress;
				handleChange('propertyAddress', ` ${address}`);
				window.kakao.maps.load(() => {
					const geocoder = new window.kakao.maps.services.Geocoder();
					geocoder.addressSearch(address, (result: any, status: any) => {
						if (status === window.kakao.maps.services.Status.OK) {
							const { x, y } = result[0]; // x: lng, y: lat
							console.log('좌표', x, y);
							handleChange('propertyLat', y);
							handleChange('propertyLng', x);
						}
					});
				});
			},
		}).open();
	};

	return (
		<div className={`property-update-modal ${isOpen ? 'active' : ''}`}>
			<div className="modal-overlay" onClick={handleOverlayClick}>
				<div className="modal">
					<div className="modal-header">
						<div>
							<div className="modal-title">숙소 생선</div>
						</div>
						<button className="close-btn" onClick={handleClose}>
							✕
						</button>
					</div>

					<div className="modal-body">
						{/* 기본 정보 */}
						<div className="section">
							<div className="section-title">
								기본 정보 <span className="required">*</span>
							</div>

							<div className="form-group">
								<label className="form-label">숙소명</label>
								<input
									type="text"
									className="form-input"
									value={propertyData.propertyName}
									onChange={(e) => handleChange('propertyName', e.target.value)}
									minLength={5}
									maxLength={100}
								/>
								<div className="char-count">{propertyData.propertyName.length}/100</div>
							</div>

							<div className="form-group">
								<label className="form-label">숙소 유형</label>
								<div className="type-options">
									{typeOptions.map((type) => (
										<div
											key={type.value}
											className={`type-option ${propertyData.propertyType === type.value ? 'selected' : ''}`}
											onClick={() => handleChange('propertyType', type.value as PropertyType)}
										>
											<span className="type-icon">{type.icon}</span>
											<span>{type.label}</span>
										</div>
									))}
								</div>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label className="form-label">지역</label>
									<select
										className="form-select"
										value={propertyData.propertyLocation}
										onChange={(e) => handleChange('propertyLocation', e.target.value as PropertyLocation)}
									>
										{locationOptions.map((location) => (
											<option key={location.value} value={location.value}>
												{location.label}
											</option>
										))}
									</select>
								</div>

								<div className="form-group">
									<label className="form-label">별점</label>
									{renderStars()}
								</div>
							</div>

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
												value={propertyData.propertyAddress}
												onChange={(e) => handleChange('propertyAddress', e.target.value)}
											/>
											{propertyData.propertyAddress && (
												<IconButton
													size="small"
													className="property-modal__clear-button"
													onClick={() => clearInput('propertyAddress')}
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
										value={propertyData.propertydetailAddress}
										onChange={(e) => handleChange('propertydetailAddress', e.target.value)}
									/>
									{propertyData.propertydetailAddress && (
										<IconButton
											size="small"
											className="property-modal__clear-button"
											onClick={() => clearInput('propertydetailAddress')}
										>
											<CloseIcon fontSize="small" />
										</IconButton>
									)}
								</Box>
							</Box>
						</div>

						{/* 운영 정보 */}
						<div className="section">
							<div className="section-title">운영 정보</div>

							<div className="form-group">
								<label className="form-label">운영 상태</label>
								<div className="status-options">
									{statusOptions.map((status) => (
										<div
											key={status.value}
											className={`status-option ${propertyData.propertyStatus === status.value ? 'selected' : ''}`}
											style={{
												color: propertyData.propertyStatus === status.value ? 'white' : status.color,
												borderColor: status.color,
												background: propertyData.propertyStatus === status.value ? status.color : 'white',
											}}
											onClick={() => handleChange('propertyStatus', status.value)}
										>
											{status.label}
										</div>
									))}
								</div>
							</div>

							<div className="form-group">
								<div
									className="toggle-container"
									onClick={() => handleChange('soldAt', !propertyData.soldAt)}
									style={{ cursor: 'pointer' }}
								>
									<span className="toggle-label">판매 완료 여부</span>
									<div className={`toggle-switch ${propertyData.soldAt ? 'active' : ''}`}>
										<div className="toggle-slider"></div>
									</div>
								</div>
							</div>
						</div>

						{/* 상세 설명 */}
						<div className="section">
							<div className="section-title">상세 설명</div>

							<div className="form-group">
								<label className="form-label">숙소 설명</label>
								<textarea
									className="form-textarea"
									value={propertyData.propertyDesc}
									onChange={(e) => handleChange('propertyDesc', e.target.value)}
									minLength={5}
									maxLength={500}
									placeholder="숙소의 특징, 위치, 편의시설 등을 자세히 설명해주세요."
								/>
								<div className="char-count">{propertyData?.propertyDesc?.length}/500</div>
							</div>

							<div className="info-box">
								<div className="info-text">
									💡 상세한 설명은 예약률을 높이는데 도움이 됩니다. 숙소의 강점과 특별한 점을 강조해주세요.
								</div>
							</div>
						</div>

						{/* 숙소 이미지 */}
						<div className="section">
							<div className="section-title">숙소 이미지</div>
							<div className="image-upload-section">
								{propertyData.propertyImages.length < 10 && (
									<div className="upload-area" onClick={triggerFileInput}>
										<div className="upload-icon">📤</div>
										<div className="upload-text">숙소 사진을 업로드해주세요</div>
										<div className="upload-hint">최대 10장까지 업로드 가능 (JPG, PNG)</div>
									</div>
								)}
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									multiple
									style={{ display: 'none' }}
									onChange={handleImageUpload}
								/>
								{propertyData.propertyImages.length > 0 && (
									<div className="image-preview-grid">
										{propertyData.propertyImages.map((img, index) => (
											<div key={index} className="image-preview">
												<img src={img} alt={`property ${index + 1}`} className="preview-image" />
												<button className="remove-image" onClick={() => removeImage(index)}>
													✕
												</button>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="modal-footer">
						<button className="btn btn-cancel" onClick={handleClose}>
							취소
						</button>
						<button className="btn btn-submit" onClick={handleSubmit}>
							등록 완료
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

PropertyAddModal.defaultProps = {
	initialInput: {
		propertyType: '',
		propertyLocation: '',
		propertyAddress: '',
		propertyName: '',
		propertyStars: 0,
		propertyImages: [],
		propertyAmenities: [],
		propertyOtherAmenities: [],
	},
};

export default PropertyAddModal;
