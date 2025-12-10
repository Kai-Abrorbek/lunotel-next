import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, IconButton, Stack, Drawer, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../types/property/property.input';
import HeroCard from './common/HeroCard';
import MemberQuickMenu from './common/MemberQuickMenu';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
function formatRangeLabel(checkIn: Date | undefined, checkOut: Date | undefined) {
	if (!checkIn || !checkOut) return '날짜를 선택하세요';

	const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);

	const fm = (d: Date) => (d.getMonth() + 1).toString().padStart(2, '0');
	const fd = (d: Date) => d.getDate().toString().padStart(2, '0');
	const fw = (d: Date) => WEEK_DAYS[d.getDay()];

	return `${fm(checkIn)}.${fd(checkIn)} ${fw(checkIn)} - ${fm(checkOut)}.${fd(checkOut)} ${fw(checkOut)} (${nights}박)`;
}

function toDate(value: string | undefined): Date | undefined {
	return value ? new Date(value) : undefined;
}

interface MiniHeaderProps {
	initialInput: PropertiesInquiry;
}

const MiniHeader = (props: MiniHeaderProps) => {
	const { initialInput } = props;
	const router = useRouter();
	const user = true;
	const [openMenu, setOpenMenu] = useState<boolean>(false);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [heroCardOpen, setHeroCardOpen] = useState<boolean>(false);
	const refElement: any = useRef();
	const locationLabel = searchFilter?.search?.location;
	const dateLabel = formatRangeLabel(
		toDate(searchFilter?.search?.checkInDate),
		toDate(searchFilter?.search?.checkOutDate),
	);
	const guestLabel = searchFilter?.search?.personal;
	const property = router?.query?.input ? JSON.parse(router?.query?.input as string) : '';
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
							<img className="mini-header-logo" src="/img/logo.png" alt="" />
						</Link>
					</Box>
					{heroCardOpen ? (
						<HeroCard
							initialInput={searchFilter!}
							refElement={refElement}
							setHeroCardOpen={setHeroCardOpen}
							propertyName={property.propertyName}
						/>
					) : (
						<Box className="mini-header-center">
							<Box className="mini-search-bar" onClick={openHeroCardHandler}>
								<SearchIcon className="mini-search-icon" />
								<span className="mini-search-text mini-search-location">
									{property.propertyName ? property.propertyName : locationLabel}
								</span>
								<span className="mini-search-divider">|</span>
								<span className="mini-search-text mini-search-date">{dateLabel}</span>
								<span className="mini-search-divider">|</span>
								<span className="mini-search-text mini-search-guest">{guestLabel}</span>
							</Box>
						</Box>
					)}
				</Box>
				{!user ? (
					<Stack className="mini-right-header">
						<Box className="mini-header-right">
							<Link href={'/login'}>
								<Button className="mini-login-btn" variant="outlined">
									로그인/회원가입
								</Button>
							</Link>
							<IconButton onClick={() => setOpenMenu(!openMenu)}>
								<Badge
									badgeContent={3} // 알림 개수
									color="error" // 빨간색 뱃지
									overlap="circular"
									sx={{
										'& .MuiBadge-badge': {
											fontSize: '13px', // 글씨 크기
											height: '18px', // 뱃지 높이
											minWidth: '18px', // 뱃지 최소 너비
											padding: '0 4px', // 내부 여백
										},
									}}
								>
									<MenuIcon sx={{ fontSize: 30 }} />
								</Badge>
							</IconButton>
							<MemberQuickMenu open={openMenu} setOpen={setOpenMenu} />
						</Box>
					</Stack>
				) : (
					<Stack className="mini-right-header">
						<Box className="mini-header-right">
							<Link href={'/mypage/user'}>
								<Button className="mini-login-btn" variant="outlined">
									USER
								</Button>
							</Link>
							<IconButton onClick={() => setOpenMenu(!openMenu)}>
								<Badge
									badgeContent={3} // 알림 개수
									color="error" // 빨간색 뱃지
									overlap="circular"
									sx={{
										'& .MuiBadge-badge': {
											fontSize: '13px', // 글씨 크기
											height: '18px', // 뱃지 높이
											minWidth: '18px', // 뱃지 최소 너비
											padding: '0 4px', // 내부 여백
										},
									}}
								>
									<MenuIcon sx={{ fontSize: 30 }} />
								</Badge>
							</IconButton>
							<MemberQuickMenu open={openMenu} setOpen={setOpenMenu} />
						</Box>
					</Stack>
				)}
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
		sort: 'createdAt',
		search: {
			location: '',
			checkInDate: formatDate(new Date(), 0),
			checkOutDate: formatDate(new Date(), 1),
			personal: 2,
			propertyType: 'ALL',
		},
	},
};

export default MiniHeader;
