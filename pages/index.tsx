import React from 'react';
import LunotelSearchBar from '../libs/components/LunotelSearchBar';
import { useQuery } from '@apollo/client';
import { GET_PROPERTIES } from '../apollo/user/query';

const HomePage: React.FC = () => {
	return (
		<main
			style={{
				minHeight: '100vh',
				padding: '64px 16px 40px',
				background: 'linear-gradient(180deg, #c9e7ff 0%, #ffe0c7 55%, #fff4ea 100%)',
			}}
		>
			<div style={{ maxWidth: 1040, margin: '0 auto' }}>
				<h1
					style={{
						fontSize: '28px',
						fontWeight: 800,
						marginBottom: 8,
						color: '#283749',
					}}
				>
					Lunotel에서 귀여운 밤 여행 찾기 🌙
				</h1>
				<p
					style={{
						fontSize: 14,
						color: '#5f7185',
						marginBottom: 24,
					}}
				>
					날짜와 인원을 입력하고, 네 분위기에 맞는 호텔을 골라봐.
				</p>

				<LunotelSearchBar />
			</div>
		</main>
	);
};

export default HomePage;
