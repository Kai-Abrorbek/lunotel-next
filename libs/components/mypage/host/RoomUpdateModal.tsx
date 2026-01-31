import React, { useState, useRef, useEffect } from 'react';
import { RoomStatus } from '../../../enums/propertyRoomtype.enum';
import { RoomTypeUpdate } from '../../../types/roomtype/roomtype.update';
import { sweetErrorAlert, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import { InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { SPRules } from '../../../types/roomtype/roomtype.input';
import { useRouter } from 'next/router';
import { RoomType } from '../../../types/roomtype/roomtype';
import { amenitiesList } from '../../../enums/property.enum';
import axios from 'axios';
import { getJwtToken } from '../../../auth';
import { UPDATE_ROOM } from '../../../../apollo/user/mutation';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';

interface RoomUpdateData {
	_id: string;
	propertyId: string;
	roomName: string;
	roomMaxPersonal: number;
	roomStandPersonal: number;
	basePriceDayUse: number;
	basePriceOvernight: number;
	roomDiscountPrice: number;
	roomAmenities: string[];
	roomImages: string[];
	roomStatus: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
}

interface RoomAddAndUpdateModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	initialInput: RoomTypeUpdate;
	selectRoom: RoomType;
	getMyProperttRoomsRefetch: (v: any) => void;
}

const RoomUpdateModal = ({
	isOpen,
	setIsOpen,
	initialInput,
	selectRoom,
	getMyProperttRoomsRefetch,
}: RoomAddAndUpdateModalProps) => {
	const router = useRouter();
	const { t, i18n } = useTranslation('common');
	const [roomImgfiles, setRoomImgfiles] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [roomData, setRoomData] = useState<RoomTypeUpdate>(initialInput);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const token = getJwtToken();

	const [updateRoom] = useMutation(UPDATE_ROOM);

	/************
	 * LIFESICLE *
	 ***********/
	useEffect(() => {
		setRoomData({
			...roomData,
			_id: selectRoom._id,
			propertyId: selectRoom.propertyId ?? '',
			roomName: selectRoom.roomName ?? '',
			roomMaxPersonal: selectRoom.roomMaxPersonal ?? 0,
			roomStandPersonal: selectRoom.roomStandPersonal ?? 0,
			basePriceDayUse: selectRoom.basePriceDayUse ?? '',
			basePriceOvernight: selectRoom.basePriceOvernight ?? '',
			roomDiscountPrice: selectRoom.roomDiscountPrice ?? 0,
			roomAmenities: selectRoom.roomAmenities ?? [],
			roomImages: selectRoom.roomImages ?? [],
			roomStatus: selectRoom.roomStatus ?? '',
			stayPlanRules: selectRoom?.stayPlans?.[0].stayPlanRules,
		});

		setPreviewImages(selectRoom.roomImages);
	}, [selectRoom]);

	/************
	 * HANDLER *
	 ***********/
	const handleChange = (field: keyof RoomUpdateData, value: any) => {
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
		const result = roomImgfiles.filter((_, i) => i !== index);
		setPreviewImages(newImages);
		setRoomImgfiles(result);
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const handleSubmit = async () => {
		try {
			const formData = new FormData();
			const selectedFiles = roomImgfiles;
			let responseImages = previewImages;
			if (selectedFiles.length !== 0) {
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
							target: 'rooms',
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

				responseImages = [...responseImages, ...response.data.data.imagesUploader];
			}

			responseImages = responseImages.filter((img) => img.startsWith('uploads'));
			const next = { ...roomData, roomImages: responseImages };
			setRoomData(next);
			await updateRoom({ variables: { input: next } });
			handleClose();
			await getMyProperttRoomsRefetch({
				variables: {
					input: {
						page: 1,
						limit: 20,
						sort: 'createdAt',
						direction: 'DESC',
						search: {
							propertyId: router.query.propertyId,
						},
					},
				},
			});
			await sweetTopSmallSuccessAlert(t('방이 정보가 변경되었습니다')!);
			console.log('+responseImages: ', responseImages);
		} catch (err: any) {
			await sweetErrorAlert(err.message);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<div className={`add-room-page ${isOpen ? 'active' : ''}`}>
			<div className="modal-overlay">
				<div className="modal">
					<div className="modal-header">
						<div>
							<div className="modal-title">{t('객실 정보 수정')}</div>
							<div className="room-id">Room ID: {selectRoom._id}</div>
						</div>
						<button className="close-btn" onClick={handleClose}>
							✕
						</button>
					</div>

					<div className="modal-body">
						{/* 기본 정보 */}
						<div className="section">
							<div className="section-title">
								{t('기본 정보')} <span className="required">*</span>
							</div>

							<div className="form-group">
								<label className="form-label">{t('객실명')}</label>
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
									<label className="form-label">{t('기준 인원')}</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={roomData.roomStandPersonal}
											onChange={(e) => handleChange('roomStandPersonal', parseInt(e.target.value))}
											min={1}
										/>
										<span className="input-unit">{t('명')}</span>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">{t('최대 인원')}</label>
									<div className="input-wrapper">
										<input
											type="number"
											className="form-input with-unit"
											value={roomData.roomMaxPersonal}
											onChange={(e) => handleChange('roomMaxPersonal', parseInt(e.target.value))}
											min={1}
										/>
										<span className="input-unit">{t('명')}</span>
									</div>
								</div>
							</div>

							<div className="form-group">
								<div>
									<div className="room-time-row">
										<label className="form-label">{t('체크인 시간')}</label>
										<TextField
											type="time"
											size="small"
											sx={{ width: 160 }}
											value={roomData.stayPlanRules?.windowStart ?? ''}
											onChange={(e) => roomRelatedTimeChange('windowStart', e.target.value as string)}
										/>
									</div>
									<div className="room-time-row">
										<label className="form-label">{t('체크아웃 시간')}</label>
										<TextField
											type="time"
											size="small"
											sx={{ width: 160 }}
											value={roomData.stayPlanRules?.windowEnd ?? ''}
											onChange={(e) => roomRelatedTimeChange('windowEnd', e.target.value as string)}
										/>
									</div>
									<div className="room-time-row">
										<label className="form-label">{t('마지막 체크인 시간')}</label>
										<TextField
											type="time"
											size="small"
											style={{ width: '100%' }}
											value={roomData?.stayPlanRules?.lastCheckInBy ?? ''}
											onChange={(e) => roomRelatedTimeChange('lastCheckInBy', e.target.value as string)}
										/>
									</div>
								</div>
							</div>

							<div className="form-group">
								<InputLabel className="form-label" id="check-in-label">
									{t('최대 이용 시간')}
								</InputLabel>
								<Select
									sx={{ width: '20%' }}
									labelId="check-in-label"
									label="check-in-label"
									value={roomData?.stayPlanRules?.durationHours ?? ''}
									onChange={(e) => {
										const v = e.target.value;
										roomRelatedTimeChange('durationHours', v === '' ? undefined : Number(v));
									}}
								>
									<MenuItem value={'5'}>5</MenuItem>
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
								{t('가격 정보')} <span className="required">*</span>
							</div>

							<div className="form-row">
								<div className="form-group">
									<label className="form-label">{t('대실 기본가')}</label>
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
										<span className="input-unit">{t('원')}</span>
									</div>
								</div>

								<div className="form-group">
									<label className="form-label">{t('숙박 기본가')}</label>
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
										<span className="input-unit">{t('원')}</span>
									</div>
								</div>
							</div>

							<div className="form-group">
								<label className="form-label">{t('할인가')}</label>
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
									<span className="input-unit">{t('원')}</span>
								</div>
							</div>

							<div className="price-info">
								<div className="price-row">
									<span className="price-label">{t('대실 할인 적용가')}</span>
									<span className="price-value discount">
										{(roomData.basePriceDayUse! - roomData.roomDiscountPrice!).toLocaleString()}원
									</span>
								</div>
								<div className="price-row">
									<span className="price-label">{t('숙박 할인 적용가')}</span>
									<span className="price-value discount">
										{(roomData.basePriceOvernight! - roomData.roomDiscountPrice!).toLocaleString()}원
									</span>
								</div>
							</div>
						</div>

						{/* 객실 상태 */}
						<div className="section">
							<div className="section-title">{t('객실 상태')}</div>
							<div>
								<div
									className={`status-badge available ${roomData.roomStatus === 'AVAILABLE' ? 'selected' : ''}`}
									onClick={() => handleChange('roomStatus', 'AVAILABLE')}
								>
									{roomData.roomStatus === 'AVAILABLE' && '✓ '}
									{t('예약 가능')}
								</div>
								<div
									className={`status-badge unavailable ${
										roomData.roomStatus === RoomStatus.UNAVAILABLE ? 'selected' : ''
									}`}
									onClick={() => handleChange('roomStatus', 'UNAVAILABLE')}
								>
									{roomData.roomStatus === RoomStatus.UNAVAILABLE && '✓ '}
									{t('예약 불가')}
								</div>
								<div
									className={`status-badge maintenance ${roomData.roomStatus === 'MAINTENANCE' ? 'selected' : ''}`}
									onClick={() => handleChange('roomStatus', 'MAINTENANCE')}
								>
									{roomData.roomStatus === 'MAINTENANCE' && '✓ '}
									{t('정비 중')}
								</div>
								<div
									className={`status-badge maintenance ${roomData.roomStatus === 'OCCUPIED' ? 'selected' : ''}`}
									onClick={() => handleChange('roomStatus', 'OCCUPIED')}
								>
									{roomData.roomStatus === 'OCCUPIED' && '✓ '}
									{t('투숙 중')}
								</div>
								<div
									className={`status-badge maintenance ${roomData.roomStatus === 'CLEANING' ? 'selected' : ''}`}
									onClick={() => handleChange('roomStatus', 'CLEANING')}
								>
									{roomData.roomStatus === 'CLEANING' && '✓ '}
									{t('청소 중')}
								</div>
							</div>
						</div>

						{/* 편의시설 */}
						<div className="section">
							<div className="section-title">{t('객실 편의시설')}</div>
							<div className="amenities-grid">
								{amenitiesList.map((amenity) => (
									<div
										key={amenity.name}
										className={`amenity-item ${roomData?.roomAmenities!.includes(amenity.key) ? 'selected' : ''}`}
										onClick={() => toggleAmenity(amenity.key)}
									>
										<input
											type="checkbox"
											className="amenity-checkbox"
											checked={roomData?.roomAmenities!.includes(amenity.key)}
											onChange={() => {}}
										/>
										<span className="amenity-icon">{amenity.icon}</span>
										{localStorage.getItem('locale') === 'kr' ? amenity.name : amenity.en}
									</div>
								))}
							</div>
						</div>

						{/* 객실 이미지 */}
						<div className="section">
							<div className="section-title">{t('객실 이미지')}</div>
							<div className="image-upload-section">
								{previewImages.length < 10 && (
									<div className="upload-area" onClick={triggerFileInput}>
										<div className="upload-icon">📤</div>
										<div className="upload-text">{t('객실 사진을 업로드해주세요')}</div>
										<div className="upload-hint">{t('최대 10장까지 업로드 가능')}</div>
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
								{previewImages!.length > 0 && (
									<div className="image-preview-grid">
										{previewImages!.map((img, index) => {
											const imgUrl = img.startsWith('data') ? img : `${process.env.REACT_APP_API_URL}/${img}`;
											return (
												<div key={index} className="image-preview">
													<img src={imgUrl} alt={`room ${index + 1}`} className="preview-image" />
													<button className="remove-image" onClick={() => removeImage(index)}>
														✕
													</button>
												</div>
											);
										})}
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="modal-footer">
						<button className="btn btn-cancel" onClick={handleClose}>
							{t('취소')}
						</button>
						<button className="btn btn-submit" onClick={handleSubmit}>
							{t('수정 완료')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

RoomUpdateModal.defaultProps = {
	initialInput: {
		_id: '',
		propertyId: '',
		roomName: '',
		roomMaxPersonal: 0,
		roomStandPersonal: 0,
		basePriceDayUse: 0,
		basePriceOvernight: 0,
		roomDiscountPrice: 0,
		roomAmenities: [],
		roomImages: [],
		roomStatus: '',
		stayPlanRules: {
			durationHours: '',
			windowStart: '',
			windowEnd: '',
			lastCheckInBy: '',
		},
	},
};

export default RoomUpdateModal;
