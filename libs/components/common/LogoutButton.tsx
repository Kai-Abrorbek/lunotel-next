import React, { useState } from 'react';

interface LogoutButtonProps {
	onLogout?: () => void;
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const handleClick = () => {
		if (isAnimating) return;

		setIsAnimating(true);

		if (onLogout) {
			setTimeout(() => {
				onLogout();
			}, 1100);
		}

		setTimeout(() => {
			setIsAnimating(false);
		}, 1200);
	};

	return (
		<button className={`logout-btn ${isAnimating ? 'logout-btn--animating' : ''}`} onClick={handleClick} type="button">
			<span className="logout-btn__label">Log Out</span>
			<div className="logout-btn__icon-wrap">
				<span className="logout-btn__door">🚪</span>
				<span className="logout-btn__person">🚶‍♂️</span>
			</div>
		</button>
	);
};

export default LogoutButton;
