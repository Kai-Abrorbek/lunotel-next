import React, { useState, useRef } from 'react';

const statusOptions = [
	{ value: 'ACTIVE', label: '운영중', color: '#10b981' },
	{ value: 'HOLD', label: '대기중', color: '#f59e0b' },
	{ value: 'SOLD', label: '판매완료', color: '#ef4444' },
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

interface PropertyUpdateData {
	_id: string;
	propertyStatus: 'ACTIVE' | 'HOLD' | 'SOLD';
	propertyType: 'HOTEL' | 'MOTEL' | 'PENSION' | 'GUESTHOUSE' | 'RESORT';
	propertyLocation:
		| 'SEOUL'
		| 'BUSAN'
		| 'INCHEON'
		| 'DAEGU'
		| 'DAEJEON'
		| 'GWANGJU'
		| 'ULSAN'
		| 'SEJONG'
		| 'GYEONGGI'
		| 'GANGWON'
		| 'CHUNGBUK'
		| 'CHUNGNAM'
		| 'JEONBUK'
		| 'JEONNAM'
		| 'GYEONGBUK'
		| 'GYEONGNAM'
		| 'JEJU';
	propertyAddress: string;
	propertyName: string;
	propertyPrice: number;
	propertyRooms: number;
	propertyStars: number;
	propertyImages: string[];
	propertyDesc: string;
	soldAt: boolean;
}
interface PropertyUpdateModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	selectedPropertyId: number;
	setSelectedPropertyId: (v: number | null) => void;
}
const PropertyUpdateModal = ({
	isOpen,
	setIsOpen,
	selectedPropertyId,
	setSelectedPropertyId,
}: PropertyUpdateModalProps) => {
	const [propertyData, setPropertyData] = useState<PropertyUpdateData>({
		_id: '6742property123',
		propertyStatus: 'ACTIVE',
		propertyType: 'HOTEL',
		propertyLocation: 'SEOUL',
		propertyAddress: '서울시 중구 명동길 123',
		propertyName: '서울 호텔 명동',
		propertyPrice: 80000,
		propertyRooms: 45,
		propertyStars: 4,
		propertyImages: [],
		propertyDesc:
			'명동 중심가에 위치한 프리미엄 비즈니스 호텔입니다. 지하철역과 도보 5분 거리에 있으며, 쇼핑과 관광에 최적화되어 있습니다.',
		soldAt: false,
	});
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleChange = (field: keyof PropertyUpdateData, value: any) => {
		setPropertyData({ ...propertyData, [field]: value });
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
		setSelectedPropertyId(null);
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

	return (
		<div className={`property-update-modal ${isOpen ? 'active' : ''}`}>
			<div className="modal-overlay" onClick={handleOverlayClick}>
				<div className="modal">
					<div className="modal-header">
						<div>
							<div className="modal-title">숙소 정보 수정</div>
							<div className="property-id">Property ID: {propertyData._id}</div>
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
											onClick={() => handleChange('propertyType', type.value)}
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
										onChange={(e) => handleChange('propertyLocation', e.target.value)}
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

							<div className="form-group">
								<label className="form-label">주소</label>
								<input
									type="text"
									className="form-input"
									value={propertyData.propertyAddress}
									onChange={(e) => handleChange('propertyAddress', e.target.value)}
									minLength={3}
									maxLength={100}
								/>
								<div className="char-count">{propertyData.propertyAddress.length}/100</div>
							</div>
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

							<div className="form-row">
								<div className="form-group">
									<label className="form-label">객실 수</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={propertyData.propertyRooms}
											onChange={(e) => handleChange('propertyRooms', parseInt(e.target.value))}
											min={1}
										/>
										<span className="input-unit">개</span>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">평균 가격</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={propertyData.propertyPrice}
											onChange={(e) => handleChange('propertyPrice', parseInt(e.target.value))}
											min={0}
										/>
										<span className="input-unit">원</span>
									</div>
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
								<div className="char-count">{propertyData.propertyDesc.length}/500</div>
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
							수정 완료
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PropertyUpdateModal;
