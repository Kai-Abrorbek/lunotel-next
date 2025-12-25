import React, { useState } from 'react';

interface LogoutButtonProps {
	onLogout?: () => void; // 진짜 로그아웃 로직 넣고 싶으면 옵션
}

const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const handleClick = () => {
		if (isAnimating) return;

		setIsAnimating(true);

		// 애니메이션 중간이나 끝에 실제 로그아웃 실행
		if (onLogout) {
			setTimeout(() => {
				onLogout();
			}, 1100); // 사람 떨어지기 직전에 호출 (원하면 숫자 조정)
		}

		setTimeout(() => {
			setIsAnimating(false);
		}, 1200); // keyframes 총 길이랑 맞춤
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
