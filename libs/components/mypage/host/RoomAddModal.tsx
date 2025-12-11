import React, { useState, useRef, useEffect } from 'react';
import { RoomStatus } from '../../../enums/propertyRoomtype.enum';
import { RoomTypeUpdate } from '../../../types/roomtype/roomtype.update';
import { sweetConfirmAlert } from '../../../sweetAlert';
import { Box, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { SPRules } from '../../../types/roomtype/roomtype.input';

interface RoomAddAndUpdateModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	initialInput: RoomTypeUpdate;
}

const amenitiesList = [
	{ key: 'wifi', name: '무료 Wi-Fi', en: 'Free Wi-Fi', icon: '📶' },
	{ key: 'air_conditioner', name: '에어컨', en: 'Air Conditioner', icon: '❄️' },
	{ key: 'tv', name: 'TV', en: 'Television', icon: '📺' },
	{ key: 'minibar', name: '미니바', en: 'Minibar', icon: '🍷' },
	{ key: 'refrigerator', name: '냉장고', en: 'Refrigerator', icon: '🧊' },
	{ key: 'coffee_machine', name: '커피머신', en: 'Coffee Machine', icon: '☕' },
	{ key: 'hair_dryer', name: '헤어드라이어', en: 'Hair Dryer', icon: '💨' },
	{ key: 'bathtub', name: '욕조', en: 'Bathtub', icon: '🛁' },
	{ key: 'shower_booth', name: '샤워부스', en: 'Shower Booth', icon: '🚿' },
	{ key: 'microwave', name: '전자레인지', en: 'Microwave', icon: '🔥' },
	{ key: 'washing_machine', name: '세탁기', en: 'Washing Machine', icon: '🧺' },
	{ key: 'iron', name: '다리미', en: 'Iron', icon: '👔' },
	{ key: 'safe', name: '금고', en: 'Safe', icon: '🔐' },
	{ key: 'balcony', name: '발코니', en: 'Balcony', icon: '🌅' },
	{ key: 'bed', name: '침대', en: 'Bed', icon: '🛏️' },
	{ key: 'sofa', name: '소파', en: 'Sofa', icon: '🛋️' },
	{ key: 'desk', name: '책상', en: 'Desk', icon: '🪑' },
	{ key: 'wardrobe', name: '옷장', en: 'Wardrobe', icon: '👗' },
	{ key: 'slippers', name: '슬리퍼', en: 'Slippers', icon: '🩴' },
	{ key: 'towels', name: '수건', en: 'Towels', icon: '🧻' },
	{ key: 'shampoo', name: '샴푸', en: 'Shampoo', icon: '🧴' },
	{ key: 'body_wash', name: '바디워시', en: 'Body Wash', icon: '🧼' },
	{ key: 'toothbrush', name: '칫솔', en: 'Toothbrush', icon: '🪥' },
	{ key: 'telephone', name: '전화기', en: 'Telephone', icon: '☎️' },
	{ key: 'clock', name: '시계', en: 'Clock', icon: '⏰' },
	{ key: 'blinds', name: '블라인드', en: 'Blinds', icon: '🪟' },
	{ key: 'air_purifier', name: '공기청정기', en: 'Air Purifier', icon: '🌬️' },
	{ key: 'humidifier', name: '가습기', en: 'Humidifier', icon: '💧' },
	{ key: 'heating', name: '난방', en: 'Heating', icon: '🔥' },
	{ key: 'non_smoking', name: '객실금연', en: 'Non-Smoking Room', icon: '🚭' },
];

const RoomAddModal = ({ isOpen, setIsOpen, initialInput }: RoomAddAndUpdateModalProps) => {
	const [roomImgfiles, setRoomImgfiles] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [roomData, setRoomData] = useState<RoomTypeUpdate>(initialInput);
	const fileInputRef = useRef<HTMLInputElement>(null);

	/************
	 * LIFESICLE *
	 ***********/

	/************
	 * HANDLER *
	 ***********/
	const handleChange = (field: keyof RoomTypeUpdate, value: any) => {
		setRoomData({ ...roomData, [field]: value });
	};

	const roomRelatedTimeChange = (field: keyof SPRules, value: any) => {
		setRoomData({
			...roomData,
			stayPlanRules: {
				...roomData.stayPlanRules,
				[field]: value,
			},
		});
	};

	const toggleAmenity = (amenityName: string) => {
		const amenities = roomData.roomAmenities!.includes(amenityName)
			? roomData.roomAmenities!.filter((a) => a !== amenityName)
			: [...roomData.roomAmenities!, amenityName];
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
						setRoomImgfiles([...roomImgfiles, ...Array.from(files)]);
						setPreviewImages([...previewImages, ...newImages]);
					}
				};
				reader.readAsDataURL(file);
			});
		}
	};

	const removeImage = (index: number) => {
		const newImages = previewImages.filter((_, i) => i !== index);
		setPreviewImages(newImages);
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = async () => {
		if (await sweetConfirmAlert('방 정보 수정하시겠슨니까?')) {
			console.log('Updated Room Data:', roomData);
			console.log(roomImgfiles);
			setIsOpen(false);
			setRoomData(initialInput);
			setPreviewImages([]);
			setRoomImgfiles([]);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
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
								<div>
									<div className="room-time-row">
										<label className="form-label">체크인 시간</label>
										<TextField
											type="time"
											size="small"
											sx={{ width: 160 }}
											value={roomData.stayPlanRules?.windowStart ?? ''}
											onChange={(e) => roomRelatedTimeChange('windowStart', e.target.value as string)}
										/>
									</div>
									<div className="room-time-row">
										<label className="form-label">체크아웃 시간</label>
										<TextField
											type="time"
											size="small"
											sx={{ width: 160 }}
											value={roomData.stayPlanRules?.windowEnd ?? ''}
											onChange={(e) => roomRelatedTimeChange('windowEnd', e.target.value as string)}
										/>
									</div>
									<div className="room-time-row">
										<label className="form-label">마지막 체크인 시간</label>
										<TextField
											type="time"
											size="small"
											sx={{ width: 160 }}
											value={roomData.stayPlanRules?.lastCheckInBy ?? ''}
											onChange={(e) => roomRelatedTimeChange('lastCheckInBy', e.target.value as string)}
										/>
									</div>
								</div>
							</div>

							<div className="form-group">
								<InputLabel className="form-label" id="check-in-label">
									최대 이용 시간
								</InputLabel>
								<Select
									sx={{ width: '20%' }}
									labelId="check-in-label"
									label="체크인"
									value={roomData.stayPlanRules?.durationHours ?? ''}
									onChange={(e) => roomRelatedTimeChange('durationHours', e.target.value as string)}
								>
									<MenuItem value="5">5</MenuItem>
									<MenuItem value="6">6</MenuItem>
									<MenuItem value="7">7</MenuItem>
									<MenuItem value="8">8</MenuItem>
									<MenuItem value="9">9</MenuItem>
								</Select>
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
											onChange={(e) => {
												const n = Number(e.target.value);
												handleChange('basePriceDayUse', isNaN(n) ? 0 : n);
											}}
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
											onChange={(e) => {
												const n = Number(e.target.value);
												handleChange('basePriceOvernight', isNaN(n) ? 0 : n);
											}}
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
										value={roomData.roomDiscountPrice ?? 0}
										onChange={(e) => {
											const n = Number(e.target.value);
											handleChange('roomDiscountPrice', isNaN(n) ? 0 : n);
										}}
										min={0}
									/>
									<span className="input-unit">원</span>
								</div>
							</div>

							<div className="price-info">
								<div className="price-row">
									<span className="price-label">대실 할인 적용가</span>
									<span className="price-value discount">
										{(roomData.basePriceDayUse! - roomData.roomDiscountPrice!).toLocaleString()}원
									</span>
								</div>
								<div className="price-row">
									<span className="price-label">숙박 할인 적용가</span>
									<span className="price-value discount">
										{(roomData.basePriceOvernight! - roomData.roomDiscountPrice!).toLocaleString()}원
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
									className={`status-badge unavailable ${
										roomData.roomStatus === RoomStatus.UNAVAILABLE ? 'selected' : ''
									}`}
									onClick={() => handleChange('roomStatus', 'UNAVAILABLE')}
								>
									{roomData.roomStatus === RoomStatus.UNAVAILABLE && '✓ '}예약 불가
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
										className={`amenity-item ${roomData.roomAmenities!.includes(amenity.key) ? 'selected' : ''}`}
										onClick={() => toggleAmenity(amenity.key)}
									>
										<input
											type="checkbox"
											className="amenity-checkbox"
											checked={roomData.roomAmenities!.includes(amenity.key)}
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
								{previewImages.length < 10 && (
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
								{previewImages.length > 0 && (
									<div className="image-preview-grid">
										{previewImages.map((img, index) => (
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
};

RoomAddModal.defaultProps = {
	initialInput: {
		_id: '',
		propertyId: '',
		roomName: '',
		roomMaxPersonal: 0,
		roomStandPersonal: 0,
		basePriceDayUse: 0,
		basePriceOvernight: 0,
		roomDiscountPrice: 0,
		roombedInfo: '',
		roomAmenities: [],
		roomStatus: RoomStatus.AVAILABLE,
		stayPlanRules: {},
	},
};

export default RoomAddModal;
