import React, { useState } from 'react';
import {
	Box,
	Button,
	TextField,
	Typography,
	IconButton,
	Grid,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	FormHelperText,
} from '@mui/material';
import { BlobOptions } from 'buffer';

interface RoomForm {
	propertyId: string;
	roomName: string;
	roomMaxPersonal: number;
	roomStandPersonal: number;
	basePriceOvernight: number;
	basePriceDayUse: number;
	roomDiscountPrice: number | null;
	roombedInfo: string;
	roomImages: string[];
}
interface AddRoomModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
}

export default function AddRoomModal(props: AddRoomModalProps) {
	const { isOpen, setIsOpen } = props;
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<RoomForm>({
		propertyId: '',
		roomName: '',
		roomMaxPersonal: 1,
		roomStandPersonal: 1,
		basePriceOvernight: 0,
		basePriceDayUse: 0,
		roomDiscountPrice: null,
		roombedInfo: '',
		roomImages: [],
	});

	const [errors, setErrors] = useState<{ [key: string]: string }>({});
	const [imagePreview, setImagePreview] = useState<string[]>([]);

	const handleChange = (field: keyof RoomForm, value: string | number | null) => {
		setFormData({ ...formData, [field]: value });
		if (errors[field]) {
			setErrors({ ...errors, [field]: '' });
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files) {
			const fileArray = Array.from(files);
			const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
			setImagePreview([...imagePreview, ...imageUrls]);
			const mockUrls = fileArray.map((_, i) => `https://example.com/room-image-${Date.now()}-${i}.jpg`);
			setFormData({
				...formData,
				roomImages: [...formData.roomImages, ...mockUrls],
			});
		}
	};

	const removeImage = (index: number) => {
		const newPreviews = imagePreview.filter((_, i) => i !== index);
		const newImages = formData.roomImages.filter((_, i) => i !== index);
		setImagePreview(newPreviews);
		setFormData({ ...formData, roomImages: newImages });
	};

	const validateStep1 = () => {
		const newErrors: { [key: string]: string } = {};

		if (!formData.propertyId) {
			newErrors.propertyId = 'Property is required';
		}

		if (!formData.roomName || formData.roomName.length < 5 || formData.roomName.length > 100) {
			newErrors.roomName = 'Room name must be between 5 and 100 characters';
		}

		if (formData.roomMaxPersonal < 1) {
			newErrors.roomMaxPersonal = 'Maximum capacity must be at least 1';
		}

		if (formData.roomStandPersonal < 1) {
			newErrors.roomStandPersonal = 'Standard capacity must be at least 1';
		}

		if (formData.roomStandPersonal > formData.roomMaxPersonal) {
			newErrors.roomStandPersonal = 'Standard capacity cannot exceed maximum capacity';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep2 = () => {
		const newErrors: { [key: string]: string } = {};

		if (formData.basePriceOvernight < 1) {
			newErrors.basePriceOvernight = 'Overnight price must be at least 1';
		}

		if (formData.basePriceDayUse < 1) {
			newErrors.basePriceDayUse = 'Day use price must be at least 1';
		}

		if (formData.roomDiscountPrice !== null && formData.roomDiscountPrice < 0) {
			newErrors.roomDiscountPrice = 'Discount price cannot be negative';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const validateStep3 = () => {
		const newErrors: { [key: string]: string } = {};

		if (formData.roomImages.length === 0) {
			newErrors.roomImages = 'At least one image is required';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const nextStep = () => {
		let isValid = false;

		if (step === 1) isValid = validateStep1();
		else if (step === 2) isValid = validateStep2();

		if (isValid && step < 3) setStep(step + 1);
	};

	const prevStep = () => {
		if (step > 1) setStep(step - 1);
	};

	const handleSubmit = () => {
		if (validateStep3()) {
			console.log('Room created:', formData);
			alert('Room created successfully!');
			setIsOpen(false);
			setStep(1);
			setFormData({
				propertyId: '',
				roomName: '',
				roomMaxPersonal: 1,
				roomStandPersonal: 1,
				basePriceOvernight: 0,
				basePriceDayUse: 0,
				roomDiscountPrice: null,
				roombedInfo: '',
				roomImages: [],
			});
			setImagePreview([]);
			setErrors({});
		}
	};

	const properties = [
		{ id: '1', name: 'Grand Hotel Seoul' },
		{ id: '2', name: 'Luxury Resort Busan' },
		{ id: '3', name: 'Business Hotel Incheon' },
	];

	return (
		<Box className="add-room">
			<Button className="add-room__trigger-btn" variant="contained" onClick={() => setIsOpen(true)}>
				<span role="img" aria-label="hotel">
					🏨
				</span>
				<span style={{ color: 'white', fontWeight: '600' }}>+ 객실 추가</span>
			</Button>

			{isOpen && (
				<Box className="add-room__overlay" onClick={() => setIsOpen(false)}>
					<Box className="add-room__modal" onClick={(e) => e.stopPropagation()}>
						{/* Header */}
						<Box className="add-room__header">
							<IconButton className="add-room__close-btn" onClick={() => setIsOpen(false)} size="small">
								✕
							</IconButton>

							<Typography className="add-room__title">Add New Room</Typography>
							<Typography className="add-room__subtitle">Step {step} of 3</Typography>

							<Box className="add-room__progress">
								<Box className={`add-room__progress-step ${step >= 1 ? 'add-room__progress-step--active' : ''}`} />
								<Box className={`add-room__progress-step ${step >= 2 ? 'add-room__progress-step--active' : ''}`} />
								<Box className={`add-room__progress-step ${step >= 3 ? 'add-room__progress-step--active' : ''}`} />
							</Box>
						</Box>

						{/* Body */}
						<Box className="add-room__body">
							{step === 1 && (
								<Box className="add-room__section">
									<Typography className="add-room__section-title">🏨 Basic Information</Typography>

									<Box className="add-room__field">
										<FormControl fullWidth error={!!errors.propertyId} className="add-room__form-control">
											<InputLabel>Property</InputLabel>
											<Select
												label="Property"
												value={formData.propertyId}
												onChange={(e) => handleChange('propertyId', e.target.value)}
											>
												<MenuItem value="">
													<em>Select a property</em>
												</MenuItem>
												{properties.map((prop) => (
													<MenuItem key={prop.id} value={prop.id}>
														{prop.name}
													</MenuItem>
												))}
											</Select>
											{errors.propertyId && <FormHelperText>{errors.propertyId}</FormHelperText>}
										</FormControl>
									</Box>

									<Box className="add-room__field">
										<TextField
											label="Room Name"
											fullWidth
											placeholder="e.g., Deluxe Ocean View Suite"
											value={formData.roomName}
											onChange={(e) => handleChange('roomName', e.target.value)}
											error={!!errors.roomName}
											helperText={errors.roomName || '5-100 characters'}
											className="add-room__input"
										/>
									</Box>

									<Grid container spacing={2} className="add-room__grid-row">
										<Grid item xs={6}>
											<TextField
												label="Standard Capacity"
												type="number"
												fullWidth
												value={formData.roomStandPersonal}
												onChange={(e) => handleChange('roomStandPersonal', parseInt(e.target.value || '0', 10))}
												error={!!errors.roomStandPersonal}
												helperText={errors.roomStandPersonal}
												className="add-room__input"
											/>
										</Grid>
										<Grid item xs={6}>
											<TextField
												label="Max Capacity"
												type="number"
												fullWidth
												value={formData.roomMaxPersonal}
												onChange={(e) => handleChange('roomMaxPersonal', parseInt(e.target.value || '0', 10))}
												error={!!errors.roomMaxPersonal}
												helperText={errors.roomMaxPersonal}
												className="add-room__input"
											/>
										</Grid>
									</Grid>

									<Box className="add-room__field">
										<TextField
											label="Bed Information"
											fullWidth
											placeholder="e.g., 1 King Bed or 2 Twin Beds"
											value={formData.roombedInfo}
											onChange={(e) => handleChange('roombedInfo', e.target.value)}
											helperText="Optional"
											className="add-room__input"
										/>
									</Box>
								</Box>
							)}

							{step === 2 && (
								<Box className="add-room__section">
									<Typography className="add-room__section-title">💰 Pricing</Typography>

									<Box className="add-room__info-card">
										<Typography className="add-room__info-card-title">💡 Pricing Tips</Typography>
										<Typography className="add-room__info-card-text">
											Set competitive prices based on room type, amenities, and season.
										</Typography>
									</Box>

									<Box className="add-room__field">
										<Box className="add-room__input-group">
											<span className="add-room__input-prefix">$</span>
											<TextField
												label="Overnight Price"
												type="number"
												fullWidth
												value={formData.basePriceOvernight}
												onChange={(e) => handleChange('basePriceOvernight', parseInt(e.target.value || '0', 10))}
												error={!!errors.basePriceOvernight}
												helperText={errors.basePriceOvernight}
												className="add-room__input add-room__input--with-prefix"
											/>
										</Box>
									</Box>

									<Box className="add-room__field">
										<Box className="add-room__input-group">
											<span className="add-room__input-prefix">$</span>
											<TextField
												label="Day Use Price"
												type="number"
												fullWidth
												value={formData.basePriceDayUse}
												onChange={(e) => handleChange('basePriceDayUse', parseInt(e.target.value || '0', 10))}
												error={!!errors.basePriceDayUse}
												helperText={errors.basePriceDayUse || 'For guests who use the room during daytime only'}
												className="add-room__input add-room__input--with-prefix"
											/>
										</Box>
									</Box>

									<Box className="add-room__field">
										<Box className="add-room__input-group">
											<span className="add-room__input-prefix">$</span>
											<TextField
												label="Discount Price"
												type="number"
												fullWidth
												placeholder="Optional"
												value={formData.roomDiscountPrice ?? ''}
												onChange={(e) =>
													handleChange('roomDiscountPrice', e.target.value ? parseInt(e.target.value, 10) : null)
												}
												error={!!errors.roomDiscountPrice}
												helperText={errors.roomDiscountPrice || 'Special promotional price (optional)'}
												className="add-room__input add-room__input--with-prefix"
											/>
										</Box>
									</Box>
								</Box>
							)}

							{step === 3 && (
								<Box className="add-room__section">
									<Typography className="add-room__section-title">📷 Room Images</Typography>

									<Box className="add-room__field">
										<Typography className="add-room__label">
											Upload Images <span className="add-room__required">*</span>
										</Typography>

										<input
											type="file"
											id="room-images"
											accept="image/*"
											multiple
											onChange={handleImageUpload}
											style={{ display: 'none' }}
										/>

										<Box
											component="label"
											htmlFor="room-images"
											className={`add-room__upload-area ${errors.roomImages ? 'add-room__upload-area--error' : ''}`}
										>
											<div className="add-room__upload-icon">📷</div>
											<div className="add-room__upload-text">Click to upload images</div>
											<div className="add-room__upload-hint">JPG, PNG or JPEG (Max 5MB each)</div>
										</Box>

										{errors.roomImages && <Typography className="add-room__error">{errors.roomImages}</Typography>}
									</Box>

									{imagePreview.length > 0 && (
										<Box className="add-room__image-grid">
											{imagePreview.map((img, index) => (
												<Box key={index} className="add-room__image-item">
													<img src={img} alt={`Preview ${index + 1}`} />
													<button type="button" className="add-room__image-remove" onClick={() => removeImage(index)}>
														✕
													</button>
												</Box>
											))}
										</Box>
									)}

									<Box className="add-room__info-card add-room__info-card--bottom">
										<Typography className="add-room__info-card-title">📸 Image Guidelines</Typography>
										<Typography className="add-room__info-card-text">
											• Upload high-quality images (minimum 1920x1080)
											<br />
											• Show different angles of the room
											<br />
											• Include bathroom and amenities
											<br />• At least one image is required
										</Typography>
									</Box>
								</Box>
							)}
						</Box>

						{/* Footer */}
						<Box className="add-room__footer">
							{step > 1 && (
								<Button className="add-room__btn add-room__btn--secondary" onClick={prevStep}>
									← Back
								</Button>
							)}
							{step < 3 ? (
								<Button className="add-room__btn add-room__btn--primary" onClick={nextStep}>
									Next →
								</Button>
							) : (
								<Button className="add-room__btn add-room__btn--primary" onClick={handleSubmit}>
									✓ Create Room
								</Button>
							)}
						</Box>
					</Box>
				</Box>
			)}
		</Box>
	);
}
