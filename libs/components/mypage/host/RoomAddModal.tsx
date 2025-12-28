import React, { useState, useRef, useEffect } from 'react';
import { RoomStatus } from '../../../enums/propertyRoomtype.enum';
import { RoomTypeUpdate } from '../../../types/roomtype/roomtype.update';
import { sweetConfirmAlert, sweetErrorAlert, sweetTopSmallSuccessAlert } from '../../../sweetAlert';
import { Box, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { RoomTypeInput, SPRules } from '../../../types/roomtype/roomtype.input';
import { amenitiesList } from '../../../enums/property.enum';
import { getJwtToken } from '../../../auth';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { CREATE_ROOM } from '../../../../apollo/user/mutation';
import { useRouter } from 'next/router';
import PropertyId from '../../../../pages/property/[propertyId]';

interface RoomAddAndUpdateModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
	initialInput: RoomTypeInput;
	getMyProperttRoomsRefetch: (v: any) => void;
}

const RoomAddModal = ({ isOpen, setIsOpen, initialInput, getMyProperttRoomsRefetch }: RoomAddAndUpdateModalProps) => {
	const router = useRouter();
	const [roomImgfiles, setRoomImgfiles] = useState<File[]>([]);
	const [previewImages, setPreviewImages] = useState<string[]>([]);
	const [roomData, setRoomData] = useState<RoomTypeInput>(initialInput);
	const fileInputRef = useRef<any>(null);
	const token = getJwtToken();

	const [createRoom] = useMutation(CREATE_ROOM);
	/************
	 * LIFESICLE *
	 ***********/
	useEffect(() => {
		if (router.isReady) {
			setRoomData({ ...roomData, propertyId: router.query.propertyId as string });
		}
	}, [router.query.propertyId]);
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

			const responseImages = response.data.data.imagesUploader;
			const next = { ...roomData, roomImages: responseImages, propertyId: router.query.propertyId as string };
			setRoomData(next);
			await createRoom({ variables: { input: next } });
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
			await sweetTopSmallSuccessAlert('새 숙소가 추가 되었습니다!');
			console.log('+responseImages: ', responseImages);
		} catch (err: any) {
			await sweetErrorAlert(err.message);
		}
	};

	const handleClose = () => {
		setIsOpen(false);
		setRoomData(initialInput);
		setPreviewImages([]);
		setRoomImgfiles([]);
	};

	return (
		<div className={`add-room-page ${isOpen ? 'active' : ''}`}>
			<div className="modal-overlay">
				<div className="modal">
					<div className="modal-header">
						<div>
							<div className="modal-title">객실 정보 수정</div>
							{/* <div className="room-id">Room ID: {roomData._id}</div> */}
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
										value={roomData.roomName ?? ''}
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
							등록 완료
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

RoomAddModal.defaultProps = {
	initialInput: {
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
		stayPlanRules: {},
	},
};

export default RoomAddModal;
