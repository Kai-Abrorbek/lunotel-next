import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import styles from './LunotelSearchBar.module.scss';

const LunotelSearchBar: React.FC = () => {
	const [location, setLocation] = useState('');
	const [checkIn, setCheckIn] = useState('');
	const [checkOut, setCheckOut] = useState('');
	const [guests, setGuests] = useState(2);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// TODO: 여기에서 router.push 로 검색 페이지로 이동
		console.log({ location, checkIn, checkOut, guests });
	};

	return (
		<Box component="form" onSubmit={handleSubmit} className={styles.searchBox}>
			<div className={styles.fieldGroup}>
				<span className={styles.label}>어디로 떠날까요?</span>
				<TextField
					size="small"
					placeholder="도시, 호텔 이름"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					fullWidth
				/>
			</div>

			<div className={styles.fieldGroup}>
				<span className={styles.label}>체크인</span>
				<TextField
					type="date"
					size="small"
					value={checkIn}
					onChange={(e) => setCheckIn(e.target.value)}
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
			</div>

			<div className={styles.fieldGroup}>
				<span className={styles.label}>체크아웃</span>
				<TextField
					type="date"
					size="small"
					value={checkOut}
					onChange={(e) => setCheckOut(e.target.value)}
					fullWidth
					InputLabelProps={{ shrink: true }}
				/>
			</div>

			<div className={styles.fieldGroupSmall}>
				<span className={styles.label}>인원</span>
				<TextField
					type="number"
					size="small"
					inputProps={{ min: 1 }}
					value={guests}
					onChange={(e) => setGuests(Number(e.target.value))}
					fullWidth
				/>
			</div>

			<Button type="submit" variant="contained" className={styles.searchButton}>
				검색하기
			</Button>
		</Box>
	);
};

export default LunotelSearchBar;
