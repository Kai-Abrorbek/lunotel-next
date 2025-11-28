import React, { useRef, useState } from 'react';
import {
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Checkbox,
	FormControlLabel,
	Button,
} from '@mui/material';

type AmenitiesState = {
	wifi: boolean;
	parking: boolean;
	pool: boolean;
	gym: boolean;
	restaurant: boolean;
	bar: boolean;
	spa: boolean;
	petFriendly: boolean;
};

function PropertySettingsPage() {
	const [propertyName, setPropertyName] = useState('Grand Hotel');
	const [propertyType, setPropertyType] = useState('hotel');
	const [address, setAddress] = useState('123 Main Street');
	const [city, setCity] = useState('Seoul');
	const [country, setCountry] = useState('South Korea');
	const [phone, setPhone] = useState('+82 2-1234-5678');
	const [email, setEmail] = useState('info@grandhotel.com');
	const [website, setWebsite] = useState('www.grandhotel.com');
	const [description, setDescription] = useState('A luxurious hotel in the heart of the city');
	const [checkInTime, setCheckInTime] = useState('15:00');
	const [checkOutTime, setCheckOutTime] = useState('11:00');
	const [currency, setCurrency] = useState('USD');
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const MAX_FILES = 10;

	const [amenities, setAmenities] = useState<AmenitiesState>({
		wifi: true,
		parking: true,
		pool: false,
		gym: true,
		restaurant: true,
		bar: false,
		spa: false,
		petFriendly: false,
	});

	const handleAmenityChange = (amenity: keyof AmenitiesState) => {
		setAmenities((prev) => ({
			...prev,
			[amenity]: !prev[amenity],
		}));
	};

	const handleSave = () => {
		alert('Settings saved successfully!');
	};

	const handleImageUploadClick = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleImageFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!files || files.length === 0) return;

		let fileList = Array.from(files);

		if (fileList.length > MAX_FILES) {
			alert(`최대 ${MAX_FILES}개까지만 처리합니다. 앞에서 ${MAX_FILES}개만 업로드됩니다.`);
			fileList = fileList.slice(0, MAX_FILES);
		}

		console.log('실제로 사용할 파일들:', fileList);

		// TODO: 여기서 서버 업로드 or state에 저장
	};

	return (
		<div className="settings-container">
			<h2 className="page-title">Property Settings</h2>

			{/* Basic Information */}
			<div className="settings-section">
				<h3 className="settings-section-title">Basic Information</h3>

				<div className="form-group">
					<label className="form-label">Property Name</label>
					<TextField
						size="small"
						fullWidth
						value={propertyName}
						onChange={(e) => setPropertyName(e.target.value)}
						className="form-input"
					/>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Property Type</label>
						<FormControl size="small" fullWidth className="form-select">
							<InputLabel id="property-type-label">Property Type</InputLabel>
							<Select
								labelId="property-type-label"
								value={propertyType}
								label="Property Type"
								onChange={(e) => setPropertyType(e.target.value as string)}
							>
								<MenuItem value="hotel">Hotel</MenuItem>
								<MenuItem value="resort">Resort</MenuItem>
								<MenuItem value="motel">Motel</MenuItem>
								<MenuItem value="hostel">Hostel</MenuItem>
								<MenuItem value="guesthouse">Guest House</MenuItem>
							</Select>
						</FormControl>
					</div>

					<div className="form-group">
						<label className="form-label">Currency</label>
						<FormControl size="small" fullWidth className="form-select">
							<InputLabel id="currency-label">Currency</InputLabel>
							<Select
								labelId="currency-label"
								value={currency}
								label="Currency"
								onChange={(e) => setCurrency(e.target.value as string)}
							>
								<MenuItem value="USD">USD ($)</MenuItem>
								<MenuItem value="EUR">EUR (€)</MenuItem>
								<MenuItem value="KRW">KRW (₩)</MenuItem>
								<MenuItem value="JPY">JPY (¥)</MenuItem>
							</Select>
						</FormControl>
					</div>
				</div>

				<div className="form-group">
					<label className="form-label">Description</label>
					<TextField
						minRows={3}
						fullWidth
						size="small"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="form-textarea"
						placeholder="Describe your property..."
					/>
				</div>
			</div>

			{/* Location */}
			<div className="settings-section">
				<h3 className="settings-section-title">Location</h3>

				<div className="form-group">
					<label className="form-label">Address</label>
					<TextField
						size="small"
						fullWidth
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						className="form-input"
					/>
				</div>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">City</label>
						<TextField
							size="small"
							fullWidth
							value={city}
							onChange={(e) => setCity(e.target.value)}
							className="form-input"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Country</label>
						<TextField
							size="small"
							fullWidth
							value={country}
							onChange={(e) => setCountry(e.target.value)}
							className="form-input"
						/>
					</div>
				</div>
			</div>

			{/* Contact Information */}
			<div className="settings-section">
				<h3 className="settings-section-title">Contact Information</h3>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Phone</label>
						<TextField
							size="small"
							fullWidth
							type="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							className="form-input"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Email</label>
						<TextField
							size="small"
							fullWidth
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="form-input"
						/>
					</div>
				</div>

				<div className="form-group">
					<label className="form-label">Website</label>
					<TextField
						size="small"
						fullWidth
						value={website}
						onChange={(e) => setWebsite(e.target.value)}
						className="form-input"
					/>
				</div>
			</div>

			{/* Check-in / Check-out */}
			<div className="settings-section">
				<h3 className="settings-section-title">Check-in / Check-out</h3>

				<div className="form-row">
					<div className="form-group">
						<label className="form-label">Check-in Time</label>
						<TextField
							size="small"
							fullWidth
							type="time"
							value={checkInTime}
							onChange={(e) => setCheckInTime(e.target.value)}
							className="form-input"
						/>
					</div>

					<div className="form-group">
						<label className="form-label">Check-out Time</label>
						<TextField
							size="small"
							fullWidth
							type="time"
							value={checkOutTime}
							onChange={(e) => setCheckOutTime(e.target.value)}
							className="form-input"
						/>
					</div>
				</div>

				<div className="info-box">
					<p className="info-box-text">These times will be displayed to guests when they make reservations.</p>
				</div>
			</div>

			{/* Amenities */}
			<div className="settings-section">
				<h3 className="settings-section-title">Amenities & Services</h3>

				<div className="amenities-grid">
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.wifi} onChange={() => handleAmenityChange('wifi')} />}
						label="Free WiFi"
					/>
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.parking} onChange={() => handleAmenityChange('parking')} />}
						label="Parking"
					/>
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.pool} onChange={() => handleAmenityChange('pool')} />}
						label="Swimming Pool"
					/>
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.gym} onChange={() => handleAmenityChange('gym')} />}
						label="Fitness Center"
					/>
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.restaurant} onChange={() => handleAmenityChange('restaurant')} />}
						label="Restaurant"
					/>
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.bar} onChange={() => handleAmenityChange('bar')} />}
						label="Bar"
					/>
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.spa} onChange={() => handleAmenityChange('spa')} />}
						label="Spa"
					/>
					<FormControlLabel
						className="form-checkbox"
						control={<Checkbox checked={amenities.petFriendly} onChange={() => handleAmenityChange('petFriendly')} />}
						label="Pet Friendly"
					/>
				</div>
			</div>

			{/* Images */}
			<div className="settings-section">
				<h3 className="settings-section-title">Property Images</h3>

				<div className="image-upload" onClick={handleImageUploadClick}>
					<div className="image-upload-icon">📷</div>
					<p className="image-upload-text">Click to upload property images</p>
					<p className="image-upload-text">or drag and drop</p>

					{/* 숨겨진 파일 input */}
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						multiple
						className="image-upload-input"
						onChange={handleImageFilesChange}
					/>
				</div>

				<div className="info-box">
					<p className="info-box-text">Upload high-quality images of your property. Recommended size: 1920x1080px</p>
				</div>
			</div>

			{/* Actions */}
			<div className="btn-group">
				<Button className="btn btn-success" onClick={handleSave}>
					💾 Save Changes
				</Button>
				<Button className="btn btn-secondary">Cancel</Button>
			</div>
		</div>
	);
}

export default PropertySettingsPage;
