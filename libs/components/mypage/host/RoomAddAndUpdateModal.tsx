import React, { useState, useRef } from 'react';

interface RoomUpdateData {
	_id: string;
	propertyId: string;
	roomName: string;
	roomMaxPersonal: number;
	roomStandPersonal: number;
	basePriceDayUse: number;
	basePriceOvernight: number;
	roomDiscountPrice: number;
	roombedInfo: string;
	roomAmenities: string[];
	roomImages: string[];
	roomStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
}

interface RoomAddAndUpdateModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	isOpenModalType: string;
	setIsOpenModalType: (s: string) => void;
	selectedRoomId: string;
	setSelectedRoomId: (v: string | null) => void;
}

const RoomAddAndUpdateModal = React.memo(function ({
	isOpen,
	setIsOpen,
	isOpenModalType,
	setIsOpenModalType,
	selectedRoomId,
	setSelectedRoomId,
}: RoomAddAndUpdateModalProps) {
	const [roomData, setRoomData] = useState<RoomUpdateData>({
		_id: '6742abc123def456',
		propertyId: '6742xyz789ghi012',
		roomName: '디럭스 더블룸',
		roomMaxPersonal: 4,
		roomStandPersonal: 2,
		basePriceDayUse: 50000,
		basePriceOvernight: 80000,
		roomDiscountPrice: 10000,
		roombedInfo: '더블베드 1개',
		roomAmenities: ['무료 Wi-Fi', '에어컨', 'TV', '미니바'],
		roomImages: [],
		roomStatus: 'AVAILABLE',
	});

	console.log(selectedRoomId);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const amenitiesList = [
		{ name: '무료 Wi-Fi', icon: '📶' },
		{ name: '에어컨', icon: '❄️' },
		{ name: 'TV', icon: '📺' },
		{ name: '미니바', icon: '🍷' },
		{ name: '냉장고', icon: '🧊' },
		{ name: '커피머신', icon: '☕' },
		{ name: '헤어드라이어', icon: '💨' },
		{ name: '욕조', icon: '🛁' },
		{ name: '샤워부스', icon: '🚿' },
		{ name: '전자레인지', icon: '🔥' },
		{ name: '세탁기', icon: '🧺' },
		{ name: '다리미', icon: '👔' },
		{ name: '금고', icon: '🔐' },
		{ name: '발코니', icon: '🌅' },
		{ name: '침대', icon: '🛏️' },
		{ name: '소파', icon: '🛋️' },
		{ name: '책상', icon: '🪑' },
		{ name: '옷장', icon: '👗' },
		{ name: '슬리퍼', icon: '🩴' },
		{ name: '수건', icon: '🧻' },
		{ name: '샴푸', icon: '🧴' },
		{ name: '바디워시', icon: '🧼' },
		{ name: '칫솔', icon: '🪥' },
		{ name: '전화기', icon: '☎️' },
		{ name: '시계', icon: '⏰' },
		{ name: '블라인드', icon: '🪟' },
		{ name: '공기청정기', icon: '🌬️' },
		{ name: '가습기', icon: '💧' },
		{ name: '난방', icon: '🔥' },
		{ name: '객실금연', icon: '🚭' },
	];

	const handleChange = (field: keyof RoomUpdateData, value: any) => {
		setRoomData({ ...roomData, [field]: value });
	};

	const toggleAmenity = (amenityName: string) => {
		const amenities = roomData.roomAmenities.includes(amenityName)
			? roomData.roomAmenities.filter((a) => a !== amenityName)
			: [...roomData.roomAmenities, amenityName];
		setRoomData({ ...roomData, roomAmenities: amenities });
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
						setRoomData({ ...roomData, roomImages: [...roomData.roomImages, ...newImages] });
					}
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeImage = (index: number) => {
		const newImages = roomData.roomImages.filter((_, i) => i !== index);
		setRoomData({ ...roomData, roomImages: newImages });
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = () => {
		console.log('Updated Room Data:', roomData);
		setIsOpen(false);
		setIsOpenModalType('');
	};

	const handleClose = () => {
		setIsOpen(false);
		setIsOpenModalType('');
		setSelectedRoomId(null);
	};

	const handleOverlayClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleClose();
		}
	};

	return (
		<div className={`add-room-page ${isOpen ? 'active' : ''}`}>
			<div className="modal-overlay" onClick={handleOverlayClick}>
				<div className="modal">
					<div className="modal-header">
						<div>
							<div className="modal-title">객실 정보 수정</div>
							<div className="room-id">Room ID: {roomData._id}</div>
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
								<label className="form-label">객실명</label>
								<div className="input-wrapper">
									<input
										type="text"
										className="form-input"
										value={roomData.roomName}
										onChange={(e) => handleChange('roomName', e.target.value)}
									/>
								</div>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label className="form-label">기준 인원</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={roomData.roomStandPersonal}
											onChange={(e) => handleChange('roomStandPersonal', parseInt(e.target.value))}
											min={1}
										/>
										<span className="input-unit">명</span>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">최대 인원</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={roomData.roomMaxPersonal}
											onChange={(e) => handleChange('roomMaxPersonal', parseInt(e.target.value))}
											min={1}
										/>
										<span className="input-unit">명</span>
									</div>
								</div>
							</div>

							<div className="form-group">
								<label className="form-label">침대 정보</label>
								<input
									type="text"
									className="form-input"
									value={roomData.roombedInfo}
									onChange={(e) => handleChange('roombedInfo', e.target.value)}
									placeholder="예: 더블베드 1개"
									maxLength={100}
								/>
								<div className="helper-text">5-100자 사이로 입력해주세요</div>
							</div>
						</div>

						{/* 가격 정보 */}
						<div className="section">
							<div className="section-title">
								가격 정보 <span className="required">*</span>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label className="form-label">대실 기본가</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={roomData.basePriceDayUse}
											onChange={(e) => handleChange('basePriceDayUse', parseInt(e.target.value))}
											min={0}
										/>
										<span className="input-unit">원</span>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">숙박 기본가</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={roomData.basePriceOvernight}
											onChange={(e) => handleChange('basePriceOvernight', parseInt(e.target.value))}
											min={0}
										/>
										<span className="input-unit">원</span>
									</div>
								</div>
							</div>

							<div className="form-group">
								<label className="form-label">할인가</label>
								<div className="input-wrapper">
									<input
										type="number"
										className="form-input with-unit"
										value={roomData.roomDiscountPrice}
										onChange={(e) => handleChange('roomDiscountPrice', parseInt(e.target.value))}
										min={0}
									/>
									<span className="input-unit">원</span>
								</div>
							</div>

							<div className="price-info">
								<div className="price-row">
									<span className="price-label">대실 할인 적용가</span>
									<span className="price-value discount">
										{(roomData.basePriceDayUse - roomData.roomDiscountPrice).toLocaleString()}원
									</span>
								</div>
								<div className="price-row">
									<span className="price-label">숙박 할인 적용가</span>
									<span className="price-value discount">
										{(roomData.basePriceOvernight - roomData.roomDiscountPrice).toLocaleString()}원
									</span>
								</div>
							</div>
						</div>

						{/* 객실 상태 */}
						<div className="section">
							<div className="section-title">객실 상태</div>
							<div>
								<div
									className={`status-badge available ${roomData.roomStatus === 'AVAILABLE' ? 'selected' : ''}`}
									onClick={() => handleChange('roomStatus', 'AVAILABLE')}
								>
									{roomData.roomStatus === 'AVAILABLE' && '✓ '}예약 가능
								</div>
								<div
									className={`status-badge unavailable ${roomData.roomStatus === 'UNAVAILABLE' ? 'selected' : ''}`}
									onClick={() => handleChange('roomStatus', 'UNAVAILABLE')}
								>
									{roomData.roomStatus === 'UNAVAILABLE' && '✓ '}예약 불가
								</div>
								<div
									className={`status-badge maintenance ${roomData.roomStatus === 'MAINTENANCE' ? 'selected' : ''}`}
									onClick={() => handleChange('roomStatus', 'MAINTENANCE')}
								>
									{roomData.roomStatus === 'MAINTENANCE' && '✓ '}정비 중
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
										className={`amenity-item ${roomData.roomAmenities.includes(amenity.name) ? 'selected' : ''}`}
										onClick={() => toggleAmenity(amenity.name)}
									>
										<input
											type="checkbox"
											className="amenity-checkbox"
											checked={roomData.roomAmenities.includes(amenity.name)}
											onChange={() => {}}
										/>
										<span className="amenity-icon">{amenity.icon}</span>
										{amenity.name}
									</div>
								))}
							</div>
						</div>

						{/* 객실 이미지 */}
						<div className="section">
							<div className="section-title">객실 이미지</div>
							<div className="image-upload-section">
								{roomData.roomImages.length < 10 && (
									<div className="upload-area" onClick={triggerFileInput}>
										<div className="upload-icon">📤</div>
										<div className="upload-text">객실 사진을 업로드해주세요</div>
										<div className="upload-hint">최대 10장까지 업로드 가능</div>
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
								{roomData.roomImages.length > 0 && (
									<div className="image-preview-grid">
										{roomData.roomImages.map((img, index) => (
											<div key={index} className="image-preview">
												<img src={img} alt={`room ${index + 1}`} className="preview-image" />
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
});

export default RoomAddAndUpdateModal;
