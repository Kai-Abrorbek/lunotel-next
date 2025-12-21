import React, { useState, useRef, useEffect } from 'react';
import { PropertyInput } from '../../../types/property/property.input';
import {
	amenitiesList,
	locationOptions,
	otherAmenitiesList,
	PropertyAmenity,
	PropertyLocation,
	PropertyOtherAmenity,
	PropertyStatus,
	PropertyType,
	statusOptions,
	typeOptions,
} from '../../../enums/property.enum';
import { Box, Button, Grid, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useMutation } from '@apollo/client';
import { CREATE_PROPERTY } from '../../../../apollo/user/mutation';
import axios from 'axios';
import { getJwtToken } from '../../../auth';
import { sweetErrorAlert, sweetMixinErrorAlert } from '../../../sweetAlert';

declare global {
	interface Window {
		daum?: any;
	}
}

interface PropertyUpdateModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	initialInput?: PropertyInput;
	getMyPropertiesRefetch: (v: any) => void;
}
const PropertyAddModal = ({ isOpen, setIsOpen, initialInput, getMyPropertiesRefetch }: PropertyUpdateModalProps) => {
	const [propertyData, setPropertyData] = useState<PropertyInput>(initialInput!);
	const fileInputRef = useRef<any>(null);
	const token = getJwtToken();
	/** APOLLO REQUESTS **/
	const [createProperty] = useMutation(CREATE_PROPERTY);

	const doDisabledCheck = () => {
		if (
			propertyData.propertyType === ('' as PropertyType) || // @ts-ignore
			propertyData.propertyStatus === ('' as PropertyStatus) ||
			propertyData.propertyLocation === ('' as PropertyLocation) || // @ts-ignore
			propertyData.propertyAddress === '' || // @ts-ignore
			propertyData.propertyDetailAddress === '' || // @ts-ignore
			propertyData.propertyName === '' || // @ts-ignore
			propertyData.propertyStars === 0 ||
			propertyData.propertyImages!.length === 0 ||
			propertyData.propertyAmenities?.length === 0 ||
			propertyData.propertyOtherAmenities?.length === 0 ||
			propertyData.propertyLat === '' ||
			propertyData.propertyLng === ''
			// propertyData.propertyDesc === ''
		) {
			return true;
		}
	};

	const handleChange = <K extends keyof PropertyInput>(field: K, value: PropertyInput[K]) => {
		setPropertyData((prev) => ({ ...prev, [field]: value }));
	};

	const clearInput = (field: keyof PropertyInput) => {
		setPropertyData((prev) => ({ ...prev, [field]: '' as any }));
	};

	const handleImageUpload2 = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const newImages: string[] = [];
			Array.from(files).forEach((file) => {
				const reader = new FileReader();
				reader.onloadend = () => {
					newImages.push(reader.result as string);
					if (newImages.length === files.length) {
						setPropertyData({ ...propertyData, propertyImages: [...propertyData.propertyImages!, ...newImages] });
					}
				};
				reader.readAsDataURL(file);
			});
		}
	};

	async function handleImageUpload() {
		try {
			const formData = new FormData();
			const selectedFiles = fileInputRef?.current?.files;

			if (selectedFiles?.length === 0) return false;
			if (selectedFiles!.length > 5) throw new Error('Cannot upload more than 5 images!');

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
						imagesUploader(files: $files, target: $target)
				}`,
					variables: {
						files: [null, null, null, null, null],
						target: 'property',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages = response.data.data.imagesUploader;

			console.log('+responseImages: ', responseImages);
			setPropertyData({ ...propertyData, propertyImages: responseImages });
		} catch (err: any) {
			console.log('err: ', err.message);
			await sweetMixinErrorAlert(err.message);
		}
	}

	const removeImage = (index: number) => {
		const newImages = propertyData.propertyImages!.filter((_, i) => i !== index);
		setPropertyData({ ...propertyData, propertyImages: newImages });
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = async () => {
		try {
			await createProperty({ variables: { input: propertyData } });
			handleClose();
			await getMyPropertiesRefetch({
				variables: {
					input: {
						page: 1,
						limit: 10,
						sort: 'createdAt',
						direction: 'DESC',
						search: {},
					},
				},
			});
		} catch (err: any) {
			sweetErrorAlert(err.message);
		}
		console.log('Updated Property Data:', propertyData);
		setIsOpen(false);
	};

	const handleClose = () => {
		setPropertyData(initialInput!);
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

	const toggleAmenity = (amenityName: string) => {
		const amenities = propertyData.propertyAmenities!.includes(amenityName as PropertyAmenity)
			? propertyData.propertyAmenities!.filter((a) => a !== amenityName)
			: [...propertyData.propertyAmenities!, amenityName];
		setPropertyData({ ...propertyData, propertyAmenities: amenities as PropertyAmenity[] });
	};

	const toggleOtherAmenity = (amenityName: string) => {
		const amenities = propertyData.propertyOtherAmenities!.includes(amenityName as PropertyOtherAmenity)
			? propertyData.propertyOtherAmenities!.filter((a) => a !== amenityName)
			: [...propertyData.propertyOtherAmenities!, amenityName];
		setPropertyData({ ...propertyData, propertyOtherAmenities: amenities as PropertyOtherAmenity[] });
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
										value={propertyData?.propertyDetailAddress! ?? ''}
										onChange={(e) => handleChange('propertyDetailAddress', e.target.value)}
									/>
									{propertyData.propertyDetailAddress && (
										<IconButton
											size="small"
											className="property-modal__clear-button"
											onClick={() => clearInput('propertyDetailAddress')}
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
						{/* 편의시설 */}
						<div className="section">
							<div className="section-title">객실 편의시설</div>
							<div className="amenities-grid">
								{amenitiesList.map((amenity) => (
									<div
										key={amenity.name}
										className={`amenity-item ${
											propertyData.propertyAmenities!.includes(amenity.key as PropertyAmenity) ? 'selected' : ''
										}`}
										onClick={() => toggleAmenity(amenity.key)}
									>
										<input
											type="checkbox"
											className="amenity-checkbox"
											checked={propertyData.propertyAmenities!.includes(amenity.key as PropertyAmenity)}
											onChange={() => {}}
										/>
										<span className="amenity-icon">{amenity.icon}</span>
										{amenity.name}
									</div>
								))}
							</div>
						</div>
						{/* 기타시설 */}
						<div className="section">
							<div className="section-title">객실 기타시설</div>
							<div className="amenities-grid">
								{otherAmenitiesList.map((amenity) => (
									<div
										key={amenity.name}
										className={`amenity-item ${
											propertyData.propertyOtherAmenities!.includes(amenity.key as PropertyOtherAmenity)
												? 'selected'
												: ''
										}`}
										onClick={() => toggleOtherAmenity(amenity.key)}
									>
										<input
											type="checkbox"
											className="amenity-checkbox"
											checked={propertyData.propertyOtherAmenities!.includes(amenity.key as PropertyOtherAmenity)}
											onChange={() => {}}
										/>
										<span className="amenity-icon">{amenity.icon}</span>
										{amenity.name}
									</div>
								))}
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
								{propertyData.propertyImages!.length < 10 && (
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
								{propertyData.propertyImages!.length > 0 && (
									<div className="image-preview-grid">
										{propertyData.propertyImages!.map((img, index) => (
											<div key={index} className="image-preview">
												<img
													src={`${process.env.REACT_APP_API_URL}/${img}`}
													alt={`property ${index + 1}`}
													className="preview-image"
												/>
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
						<button className="btn btn-submit" onClick={handleSubmit} disabled={doDisabledCheck()}>
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
