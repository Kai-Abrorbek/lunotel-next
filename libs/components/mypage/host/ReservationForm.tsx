import React, { useState } from 'react';

interface ReservationForm {
	guestName: string;
	email: string;
	phone: string;
	roomType: string;
	checkIn: string;
	checkOut: string;
	guests: number;
	specialRequests: string;
	paymentMethod: string;
}
interface AddReservationModalProps {
	isOpen: boolean;
	setIsOpen: (v: boolean) => void;
}

export default function AddReservationModal(props: AddReservationModalProps) {
	const { isOpen, setIsOpen } = props;
	const [step, setStep] = useState(1);
	const [formData, setFormData] = useState<ReservationForm>({
		guestName: '',
		email: '',
		phone: '',
		roomType: '',
		checkIn: '',
		checkOut: '',
		guests: 1,
		specialRequests: '',
		paymentMethod: '',
	});

	const handleChange = (field: keyof ReservationForm, value: string | number) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleSubmit = () => {
		console.log('Reservation submitted:', formData);
		setIsOpen(false);
		setStep(1);
		alert('Reservation created successfully!');
	};

	const nextStep = () => {
		if (step < 3) setStep(step + 1);
	};

	const prevStep = () => {
		if (step > 1) setStep(step - 1);
	};

	const calculateNights = () => {
		if (formData.checkIn && formData.checkOut) {
			const start = new Date(formData.checkIn);
			const end = new Date(formData.checkOut);
			const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
			return nights > 0 ? nights : 0;
		}
		return 0;
	};

	const calculateTotal = () => {
		const nights = calculateNights();
		const prices: { [key: string]: number } = {
			'deluxe-double': 180,
			'oceanview-suite': 320,
			'standard-twin': 150,
			'premium-king': 280,
		};
		return nights * (prices[formData.roomType] || 0);
	};

	return (
		<div className="">
			<button className="trigger-btn" onClick={() => setIsOpen(true)}>
				➕ 예약
			</button>

			{isOpen && (
				<div className="modal-overlay" onClick={() => setIsOpen(false)}>
					<div className="modal" onClick={(e) => e.stopPropagation()}>
						<div className="modal-header">
							<button className="close-btn" onClick={() => setIsOpen(false)}>
								✕
							</button>
							<h2 className="modal-title">New Reservation</h2>
							<p className="modal-subtitle">Step {step} of 3</p>
							<div className="progress-bar">
								<div className={`progress-step ${step >= 1 ? 'active' : ''}`}></div>
								<div className={`progress-step ${step >= 2 ? 'active' : ''}`}></div>
								<div className={`progress-step ${step >= 3 ? 'active' : ''}`}></div>
							</div>
						</div>

						<div className="modal-body">
							{step === 1 && (
								<div className="form-section">
									<h3 className="section-title">👤 Guest Information</h3>
									<div className="form-group">
										<label className="form-label">Full Name</label>
										<input
											type="text"
											className="form-input"
											placeholder="John Doe"
											value={formData.guestName}
											onChange={(e) => handleChange('guestName', e.target.value)}
										/>
									</div>
									<div className="form-row">
										<div className="form-group">
											<label className="form-label">Email</label>
											<input
												type="email"
												className="form-input"
												placeholder="john@example.com"
												value={formData.email}
												onChange={(e) => handleChange('email', e.target.value)}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">Phone</label>
											<input
												type="tel"
												className="form-input"
												placeholder="+1 234-567-8900"
												value={formData.phone}
												onChange={(e) => handleChange('phone', e.target.value)}
											/>
										</div>
									</div>
									<div className="form-group">
										<label className="form-label">Number of Guests</label>
										<input
											type="number"
											className="form-input"
											min="1"
											max="10"
											value={formData.guests}
											onChange={(e) => handleChange('guests', parseInt(e.target.value))}
										/>
									</div>
								</div>
							)}

							{step === 2 && (
								<div className="form-section">
									<h3 className="section-title">🏨 Room & Dates</h3>
									<div className="form-group">
										<label className="form-label">Select Room Type</label>
										<div
											className={`room-option ${formData.roomType === 'deluxe-double' ? 'selected' : ''}`}
											onClick={() => handleChange('roomType', 'deluxe-double')}
										>
											<div className="room-option-header">
												<span className="room-name">Deluxe Double Room</span>
												<span className="room-price">$180/night</span>
											</div>
											<p className="room-description">Spacious room with king bed, city view</p>
										</div>
										<div
											className={`room-option ${formData.roomType === 'oceanview-suite' ? 'selected' : ''}`}
											onClick={() => handleChange('roomType', 'oceanview-suite')}
										>
											<div className="room-option-header">
												<span className="room-name">Oceanview Suite</span>
												<span className="room-price">$320/night</span>
											</div>
											<p className="room-description">Luxury suite with ocean view and balcony</p>
										</div>
										<div
											className={`room-option ${formData.roomType === 'standard-twin' ? 'selected' : ''}`}
											onClick={() => handleChange('roomType', 'standard-twin')}
										>
											<div className="room-option-header">
												<span className="room-name">Standard Twin</span>
												<span className="room-price">$150/night</span>
											</div>
											<p className="room-description">Comfortable room with two twin beds</p>
										</div>
										<div
											className={`room-option ${formData.roomType === 'premium-king' ? 'selected' : ''}`}
											onClick={() => handleChange('roomType', 'premium-king')}
										>
											<div className="room-option-header">
												<span className="room-name">Premium King</span>
												<span className="room-price">$280/night</span>
											</div>
											<p className="room-description">Premium room with jacuzzi and city view</p>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group">
											<label className="form-label">Check-in</label>
											<input
												type="date"
												className="form-input"
												value={formData.checkIn}
												onChange={(e) => handleChange('checkIn', e.target.value)}
											/>
										</div>
										<div className="form-group">
											<label className="form-label">Check-out</label>
											<input
												type="date"
												className="form-input"
												value={formData.checkOut}
												onChange={(e) => handleChange('checkOut', e.target.value)}
											/>
										</div>
									</div>
								</div>
							)}

							{step === 3 && (
								<div className="form-section">
									<h3 className="section-title">💳 Payment & Summary</h3>
									<div className="summary-card">
										<div className="summary-row">
											<span>Guest:</span>
											<span>{formData.guestName || '-'}</span>
										</div>
										<div className="summary-row">
											<span>Room:</span>
											<span>{formData.roomType ? formData.roomType.replace('-', ' ').toUpperCase() : '-'}</span>
										</div>
										<div className="summary-row">
											<span>Nights:</span>
											<span>{calculateNights()} nights</span>
										</div>
										<div className="summary-row">
											<span>Total Amount:</span>
											<span>${calculateTotal()}</span>
										</div>
									</div>
									<div className="form-group">
										<label className="form-label">Payment Method</label>
										<select
											className="form-select"
											value={formData.paymentMethod}
											onChange={(e) => handleChange('paymentMethod', e.target.value)}
										>
											<option value="">Select payment method</option>
											<option value="credit-card">Credit Card</option>
											<option value="cash">Cash</option>
											<option value="bank-transfer">Bank Transfer</option>
										</select>
									</div>
									<div className="form-group">
										<label className="form-label">Special Requests (Optional)</label>
										<textarea
											className="form-textarea"
											placeholder="Any special requests or notes..."
											value={formData.specialRequests}
											onChange={(e) => handleChange('specialRequests', e.target.value)}
										/>
									</div>
									<div className="info-box">
										<p className="info-box-text">
											📋 Please review all information before confirming. A confirmation email will be sent to{' '}
											{formData.email || 'the guest'}.
										</p>
									</div>
								</div>
							)}
						</div>

						<div className="modal-footer">
							{step > 1 && (
								<button className="btn btn-secondary" onClick={prevStep}>
									← Back
								</button>
							)}
							{step < 3 ? (
								<button className="btn btn-primary" onClick={nextStep}>
									Next →
								</button>
							) : (
								<button className="btn btn-primary" onClick={handleSubmit}>
									✓ Confirm Reservation
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
