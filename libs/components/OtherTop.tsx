import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../types/property/property.input';
import HeroCard from './common/HeroCard';

interface MiniHeaderProps {
	initialInput: PropertiesInquiry;
}

const MiniHeader = (props: MiniHeaderProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [heroCardOpen, setHeroCardOpen] = useState<boolean>(false);
	const refElement: any = useRef();
	const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

	const locationLabel = searchFilter?.search?.location;
	const dateLabel = formatRangeLabel(
		toDate(searchFilter?.search?.checkInDate),
		toDate(searchFilter?.search?.checkOutDate),
	);
	const guestLabel = searchFilter?.search?.personal;
	/** LIFESICLE **/
	useEffect(() => {
		if (typeof window === 'undefined') return;
		const saved = localStorage.getItem('searchFilter');
		if (!saved) return;
		const parsed = JSON.parse(saved);
		setSearchFilter(parsed);
	}, [router]);

	useEffect(() => {
		const clickHandler = (event: MouseEvent) => {
			if (!refElement?.current?.contains(event.target)) {
				setHeroCardOpen(false);
			}
		};
		document.addEventListener('mousedown', clickHandler);
		return () => {
			document.removeEventListener('mousedown', clickHandler);
		};
	}, [refElement]);

	/**HANDLERS**/
	const openHeroCardHandler = () => {
		setHeroCardOpen(true);
	};

	function toDate(value: string | undefined): Date | undefined {
		return value ? new Date(value) : undefined;
	}

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

	return (
		<div className={`other-top-header ${heroCardOpen ? 'active' : ''}`}>
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
						<HeroCard initialInput={searchFilter!} refElement={refElement} />
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
};

function formatDate(date: Date, day: number = 0) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate() + day).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

MiniHeader.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {
			location: '',
			checkInDate: formatDate(new Date(), 0),
			checkOutDate: formatDate(new Date(), 1),
			personal: 2,
		},
	},
};

export default MiniHeader;
