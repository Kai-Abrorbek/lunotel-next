import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../types/property/property.input';
import HeroCard from './property/HeroCard';

export default function MiniHeader() {
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>();
	const [heroCardOpen, setHeroCardOpen] = useState<boolean>(false);
	const locationRef: any = useRef();

	const router = useRouter();
	const raw = router.query.input;

	useEffect(() => {
		if (typeof raw === 'string') {
			const parsed = JSON.parse(raw);
			setSearchFilter(parsed);
		}

		// const clickHandler = (event: MouseEvent) => {
		// 	if (!locationRef?.current?.contains(event.target)) {
		// 		setHeroCardOpen(false);
		// 	}
		// };

		// document.addEventListener('mousedown', clickHandler);

		// return () => {
		// 	document.removeEventListener('mousedown', clickHandler);
		// };
	}, [raw]);

	/**HANDLERS**/
	const openHeroCardHandler = () => {
		setHeroCardOpen(true);
	};

	const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
	const locationLabel = searchFilter?.search?.location;
	function toDate(value: string | undefined): Date | undefined {
		return value ? new Date(value) : undefined;
	}
	const dateLabel = formatRangeLabel(
		toDate(searchFilter?.search?.checkInDate),
		toDate(searchFilter?.search?.checkOutDate),
	);
	const guestLabel = searchFilter?.search?.personal;
	function formatRangeLabel(checkIn: Date | undefined, checkOut: Date | undefined) {
		if (!checkIn || !checkOut) return '날짜를 선택하세요';

		const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

		const fm = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
		const fd = (d: Date) => d.getDate().toString().padStart(2, '0');
		const fw = (d: Date) => WEEK_DAYS[d.getDay()];

		return `${fm(checkIn)}.${fd(checkIn)} ${fw(checkIn)} - ${fm(checkOut)}.${fd(checkOut)} ${fw(
			checkOut,
		)} (${nights}박)`;
	}
	/**HANDLERS**/

	return (
		<div style={{ borderBottom: '1px solid #b7aaaa3d', width: '100%', height: `${heroCardOpen ? '133px' : '77px'}` }}>
			<Stack
				className="container"
				style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}
			>
				<Box className="mini-left-header">
					{/* 로고 */}
					<Box className="mini-header-left">
						<Link href={'/'}>
							<Typography className="mini-header-logo">루니텔.</Typography>
						</Link>
					</Box>
					{heroCardOpen ? (
						<HeroCard initialInput={searchFilter!} />
					) : (
						<Box className="mini-header-center">
							<Box className="mini-search-bar" onClick={openHeroCardHandler}>
								<SearchIcon className="mini-search-icon" />
								<span className="mini-search-text mini-search-location">{locationLabel}</span>
								<span className="mini-search-divider">|</span>
								<span className="mini-search-text mini-search-date">{dateLabel}</span>
								<span className="mini-search-divider">|</span>
								<span className="mini-search-text mini-search-guest">{guestLabel}</span>
							</Box>
						</Box>
					)}
				</Box>
				<Stack className="mini-right-header">
					<Box className="mini-header-right">
						<Button className="mini-login-btn" variant="outlined">
							로그인/회원가입
						</Button>
						<IconButton className="mini-menu-btn">
							<MenuIcon />
						</IconButton>
					</Box>
				</Stack>
			</Stack>
		</div>
	);
}
