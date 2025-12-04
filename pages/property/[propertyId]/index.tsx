import { useEffect, useState } from 'react';
import OtherLayout from '../../../libs/components/layout/OtherLayout';
import { PropertiesInquiry } from '../../../libs/types/property/property.input';
import { useRouter } from 'next/router';
import { Box, Button, Chip, IconButton, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import RoomStickyBar from '../../../libs/components/room/RoomStickyBar';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RoomIcon from '@mui/icons-material/MeetingRoom';
import WifiIcon from '@mui/icons-material/Wifi';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PlaceIcon from '@mui/icons-material/Place';
import NearMeIcon from '@mui/icons-material/NearMe';
import StarIcon from '@mui/icons-material/Star';
import PropertyLocationMap from '../../../libs/components/room/PropertyLocationMap';
import ReviewItem from '../../../libs/components/room/ReviewItem';
import ImageGalleryModal, { ImageCategory } from '../../../libs/components/room/ImageGalleryModal';
import ReviewImageModal from '../../../libs/components/room/ReviewImageModal';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import CheckIcon from '@mui/icons-material/Check';
import 'swiper/css';
import 'swiper/css/navigation';
import Link from 'next/link';

export type GalleryImage = {
	id: number;
	src: string;
	alt: string;
	category?: ImageCategory;
};

const GALLERY_IMAGES: GalleryImage[] = [
	{
		id: 1,
		src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
		alt: '모던한 호텔 객실 전경',
	},
	{
		id: 2,
		src: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
		alt: '침대와 소파가 있는 객실',
	},
	{
		id: 3,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '어두운 톤의 호텔 침실',
	},
	{
		id: 4,
		src: 'https://images.unsplash.com/photo-1560448075-bb485b067938?auto=format&fit=crop&w=800&q=80',
		alt: '라운지와 책상이 있는 객실',
	},
	{
		id: 5,
		src: 'https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=800&q=80',
		alt: '욕실과 욕조가 있는 호텔',
	},
];

const reviewImages = [
	{
		id: 0,
		src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
		alt: '욕조가 있는 욕실',
	},
	{
		id: 1,
		src: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
		alt: '침대와 책상이 있는 객실',
	},
	{
		id: 2,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
	{
		id: 3,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
	{
		id: 4,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
	{
		id: 5,
		src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
		alt: '조명 켜진 호텔 침대',
	},
];

const IMAGES: GalleryImage[] = [
	{
		id: 1,
		src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
		alt: 'PC 객실',
		category: 'ROOM',
	},
	{
		id: 2,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 3,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 4,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 5,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
	{
		id: 6,
		src: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1600&q=80',
		alt: '침대 객실',
		category: 'ROOM',
	},
];

interface Stay {
	id: number;
	categoryLabel: string;
	name: string;
	location: string;
	subLocation: string;
	rating: number;
	reviewCount: number;
	price: number;
	originalPrice?: number;
	badgeText?: string;
	imageUrl: string;
}

const STAYS: Stay[] = [
	{
		id: 1,
		categoryLabel: '블랙 · 특급 · 호텔',
		name: '★당일특가★ 세인트존스 호텔',
		location: '강릉시',
		subLocation: '강릉 강문해변 앞',
		rating: 9.2,
		reviewCount: 10235,
		price: 99750,
		imageUrl: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 2,
		categoryLabel: '모텔',
		name: '길동 MARI-마리',
		location: '길동역',
		subLocation: '도보 3분',
		rating: 9.3,
		reviewCount: 4934,
		price: 44000,
		originalPrice: 50000,
		imageUrl: 'https://images.pexels.com/photos/265004/pexels-photo-265004.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 3,
		categoryLabel: '가족호텔 · 호텔',
		name: '★당일특가★ 체스터톤스 호텔',
		location: '속초시',
		subLocation: '속초터미널 차량 11분',
		rating: 9.1,
		reviewCount: 3368,
		price: 65490,
		originalPrice: 350000,
		imageUrl: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 5,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 6,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 7,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 8,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 9,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},
	{
		id: 10,
		categoryLabel: '모텔',
		name: '구월 호텔반월',
		location: '인천',
		subLocation: '인천터미널역 도보 14분',
		rating: 9.4,
		reviewCount: 13877,
		price: 40000,
		originalPrice: 45000,
		imageUrl: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
	},

	// 필요하면 더 추가
];

const sampleReviews = [
	{
		id: 'REV-101',
		guest: 'James Kim',
		rating: 5,
		date: '2024-12-01',
		room: 'R203',
		roomType: 'Deluxe Double Room',
		verified: true,
		comment: '최고의 숙박이었어요! 직원들 친절하고 방도 완전 깨끗했습니다.',
		response: '좋은 리뷰 감사합니다! 더 편안한 숙박 되도록 항상 노력하겠습니다.',
	},
	{
		id: 'REV-102',
		guest: 'Sophie Lee',
		rating: 3,
		date: '2024-12-03',
		room: 'R104',
		roomType: 'Standard Twin',
		verified: false,
		comment: '전체적으로 무난했지만 방음이 좀 아쉬웠어요.',
	},
	{
		id: 'REV-103',
		guest: 'Daniel Park',
		rating: 4,
		date: '2024-11-29',
		room: 'R402',
		roomType: 'Oceanview Suite',
		verified: true,
		comment: '뷰가 정말 최고예요. 조식도 괜찮았습니다.',
	},
	{
		id: 'REV-104',
		guest: 'Emily Choi',
		rating: 2,
		date: '2024-12-02',
		room: 'R305',
		roomType: 'Standard Twin',
		verified: true,
		comment: '침대가 너무 딱딱했고 난방이 약했어요.',
	},
	{
		id: 'REV-105',
		guest: 'Michael Stone',
		rating: 5,
		date: '2024-11-27',
		room: 'R501',
		roomType: 'Premium King',
		verified: true,
		comment: '기념일로 갔는데 케이크 서비스까지 주셔서 감동했습니다!',
		response: '소중한 날 함께할 수 있어 영광입니다.',
	},
	{
		id: 'REV-106',
		guest: 'Anna Kim',
		rating: 1,
		date: '2024-12-04',
		room: 'R101',
		roomType: 'Standard Double',
		verified: false,
		comment: '청결 상태가 많이 아쉬웠습니다. 다시 방문하기는 어려울 것 같아요.',
	},
	{
		id: 'REV-107',
		guest: 'Ryan Lee',
		rating: 4,
		date: '2024-12-04',
		room: 'R303',
		roomType: 'Deluxe Double Room',
		verified: true,
		comment: '적당한 가격에 만족스러운 시설이었습니다.',
	},
	{
		id: 'REV-108',
		guest: 'Olivia Park',
		rating: 3,
		date: '2024-11-30',
		room: 'R212',
		roomType: 'Oceanview Suite',
		verified: true,
		comment: '뷰는 좋았지만 체크인이 너무 오래 걸렸어요.',
	},
	{
		id: 'REV-109',
		guest: 'Henry Yoon',
		rating: 5,
		date: '2024-12-05',
		room: 'R601',
		roomType: 'Premium Suite',
		verified: true,
		comment: '시설, 직원 친절도, 위치 모두 완벽했습니다.',
	},
	{
		id: 'REV-110',
		guest: 'Jessica Han',
		rating: 2,
		date: '2024-11-25',
		room: 'R105',
		roomType: 'Standard Double',
		verified: false,
		comment: '욕실이 너무 오래돼서 불편했습니다.',
	},
];

interface PropertyDetailPageProps {
	initialInput: PropertiesInquiry;
}
type TabKey = 'overview' | 'rooms' | 'amenities' | 'location' | 'reviews';

const PropertyDetailPage = (props: PropertyDetailPageProps) => {
	const { initialInput } = props;
	const [open, setOpen] = useState(false);
	const [openReviewImage, setOpenReviewImage] = useState(false);
	const [initialIndex, setInitialIndex] = useState<number>(0);
	const [reviewImgIndex, setReviewImgIndex] = useState<number>(0);
	const [activeTab, setActiveTab] = useState<TabKey>('rooms');
	const router = useRouter();
	const [favoriteIds, setFavoriteIds] = useState<boolean>(false);
	const [favoriteRooms, setFavoriteRooms] = useState<number[]>([]);
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);

	const [sortOption, setSortOption] = useState<'recommended' | 'recent' | 'high' | 'low'>('recommended');
	const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
	const isSortMenuOpen = Boolean(sortAnchorEl);

	const sortLabelMap = {
		recommended: '추천순',
		recent: '최신순',
		high: '평점 높은순',
		low: '평점 낮은순',
	} as const;

	const main = GALLERY_IMAGES[0];
	const thumbs = GALLERY_IMAGES.slice(1, 5); // 오른쪽 4개
	const totalCount = GALLERY_IMAGES.length; // 오른쪽 4개
	/** LIFECYCLES **/

	useEffect(() => {
		if (typeof window === 'undefined') return;
		const data = localStorage.getItem('searchFilter');
		if (data) {
			setSearchFilter(JSON.parse(data));
		}
	}, [router]);

	/** HANDLERS **/
	const handleTabClick = (tab: TabKey) => {
		setActiveTab(tab);
		const target = document.getElementById(`section-${tab}`);
		if (target) {
			const rect = target.getBoundingClientRect();
			const top = window.scrollY + rect.top - 170; // 고정바 높이만큼 보정
			window.scrollTo({ top, behavior: 'smooth' });
		}
	};

	const toggleFavorite = (id: number) => {
		setFavoriteRooms((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
	};

	const sortedReviews = [...sampleReviews].sort((a, b) => {
		switch (sortOption) {
			case 'recent':
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			case 'high':
				return b.rating - a.rating;
			case 'low':
				return a.rating - b.rating;
			case 'recommended':
			default:
				// 추천순: 일단 평점↓, 날짜↓ 정도로
				if (b.rating !== a.rating) return b.rating - a.rating;
				return new Date(b.date).getTime() - new Date(a.date).getTime();
		}
	});

	return (
		<Stack className="container">
			<ImageGalleryModal
				open={open}
				onClose={() => setOpen(false)}
				title="길동 MARI-마리"
				images={IMAGES}
				initialIndex={initialIndex}
			/>
			{/* 상단 헤더 / 갤러리 등 */}
			<RoomStickyBar
				price="22,500원"
				couponLabel="2,500원 쿠폰 적용가"
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
			<main className="property-detail-main container">
				<section id="section-overview">
					<Box className="property-gallery">
						<Box className="property-gallery__main">
							{main && (
								<img
									src={main.src}
									alt={main.alt}
									onClick={() => {
										setOpen(true);
										setInitialIndex(0);
									}}
								/>
							)}
							<Box className="property-gallery__badge">무제한 할인</Box>
						</Box>

						<Box className="property-gallery__side">
							{thumbs.map((img, idx) => (
								<Box key={img.id} className="property-gallery__thumb">
									<img
										src={img.src}
										alt={img.alt}
										onClick={() => {
											setOpen(true);
											setInitialIndex(idx);
										}}
									/>
									{idx === thumbs.length - 1 && totalCount && (
										<Box className="property-gallery__more">
											<Typography component="span">{totalCount}+</Typography>
										</Box>
									)}
								</Box>
							))}
						</Box>
					</Box>
					<Stack className="property-info">
						<Stack className="property-info__type-name">
							<Typography className="property-info__type">모텔</Typography>
							<Typography className="property-info__name">길동 MARI-마리</Typography>
						</Stack>
						<Stack className="property-info__price">
							<IconButton className="property-info__favorite" onClick={() => setFavoriteIds(!favoriteIds)}>
								{favoriteIds ? <FavoriteIcon className={favoriteIds ? 'active' : ''} /> : <FavoriteBorderIcon />}
							</IconButton>

							<Typography className="property-info__coupon-price">3000원 쿠폰 적용가</Typography>
							<Typography className="property-info__basic-price">22,000원</Typography>
						</Stack>
					</Stack>
					<Box className="property-summary">
						{/* 평점 카드 */}
						<Box
							className="property-summary__card property-summary__card--rating"
							onClick={() => handleTabClick('reviews')}
						>
							<Box className="rating-box">
								<Box className="rating-chip">
									<StarIcon fontSize="small" />
									<span>{(9.3).toFixed(1)}</span>
								</Box>
								<span className="rating-chip__count">{1234}명 평가</span>
							</Box>
							<Typography className="rating-snippet" noWrap>
								{'예전에도 들렀던 모텔인데 이번에도 근처 방문할 일이 생겨서 또 숙박했습니다...'}
							</Typography>
						</Box>

						{/* 서비스 및 부대시설 */}
						<Box
							className="property-summary__card property-summary__card--services"
							onClick={() => handleTabClick('amenities')}
						>
							<Box className="card-header">
								<Typography className="card-title">서비스 및 부대시설</Typography>
								<Typography className="card-link">자세히 보기 &gt;</Typography>
							</Box>
							<Box className="service-icons">
								<Chip icon={<LocalOfferIcon />} label="스파/월풀" />
								<Chip icon={<WifiIcon />} label="무선인터넷" />
								<Chip icon={<DirectionsCarIcon />} label="주차장" />
								<Chip icon={<RoomIcon />} label="트윈베드" />
							</Box>
						</Box>

						{/* 위치 정보 */}
						<Box
							className="property-summary__card property-summary__card--location"
							onClick={() => handleTabClick('location')}
						>
							<Box className="card-header">
								<Typography className="card-title">위치 정보</Typography>
								<Typography className="card-link">지도보기 &gt;</Typography>
							</Box>
							<Box className="location-lines">
								<Box className="location-line">
									<PlaceIcon fontSize="small" />
									<Typography>{'서울 강동구 길동 387-7'}</Typography>
								</Box>
								<Box className="location-line">
									<NearMeIcon fontSize="small" />
									<Typography>{'길동역 도보 3분'}</Typography>
								</Box>
							</Box>
						</Box>
					</Box>
				</section>
				<section id="section-rooms">
					{[1, 2, 3, 4, 5, 6].length === 0 && (
						<div className="no-data">
							<h1>검색 결과가 없어요.</h1>
							<p>'asdd'에 대한 철자를 확인하거나 긴 문구는 띄어쓰기를 해보세요.</p>
						</div>
					)}
					{[1, 2, 3, 4, 5, 6].map((room) => {
						return (
							<Box key={room} className="room-card">
								<Box className="room-card__image">
									<img src={main.src} alt={main.alt} onClick={() => setOpen(true)} />
									<Box className="room-card__count">65+</Box>
								</Box>

								<Box className="room-card__content">
									<Box className="room-card__header">
										<Typography className="room-card__title">{'title'}</Typography>
										<Typography className="room-card__link">상세 정보 &gt;</Typography>
									</Box>

									<Box className="room-card__section">
										<Typography className="room-card__section-title">대실</Typography>
										<Typography className="room-card__sub">무한대실 · 9시간 이용</Typography>
										<Box className="room-card__price-row">
											<Box className="room-card__price-left">
												{true && <span className="coupon-label">{'2,500원 쿠폰 적용가'}</span>}
												{true && <span className="original-price">{'30,000원'}</span>}
											</Box>
											<Box className="room-card__price-right">
												<span className="final-price">{'27,500원'}</span>
												<span className="per-night">/1실</span>
												<Link href={`/reservation/checkout?roomId=${room}&staytype=stay`}>
													<Button variant="contained" className="room-card__button room-card__button--day">
														대실 예약
													</Button>
												</Link>
											</Box>
										</Box>
									</Box>

									<Box className="room-card__divider" />

									<Box className="room-card__section">
										<Typography className="room-card__section-title">숙박</Typography>
										<Typography className="room-card__sub">숙박 베이직 룸 · 입실 17:00 · 퇴실 12:00</Typography>
										<Box className="room-card__price-row">
											<Box className="room-card__price-left">
												{true && <span className="coupon-label">{'8,000원+1,000원 쿠폰 적용가'}</span>}
												{true && <span className="original-price">{'80,000원'}</span>}
											</Box>
											<Box className="room-card__price-right">
												<span className="final-price">{'71,000원'}</span>
												<span className="per-night">/1박</span>
												<Link href={`/reservation/checkout?roomId=${room}&staytype=overnight`}>
													<Button variant="contained" className="room-card__button room-card__button--stay">
														숙박 예약
													</Button>
												</Link>
											</Box>
										</Box>
									</Box>
								</Box>
								<Stack className="room-card__info">
									<Typography>객실정보</Typography>
									<Typography>기준2인 · 최대2인</Typography>
								</Stack>
							</Box>
						);
					})}
				</section>
				<section id="section-amenities">
					<Box className="room-amenities__divider" />
					<Stack className="amenities-card">
						<Typography className="amenities-card__title">서비스 및 부대시설</Typography>
						<Box className="amenities-card__icons">
							<Chip icon={<LocalOfferIcon />} label="스파/월풀" />
							<Chip icon={<WifiIcon />} label="무선인터넷" />
							<Chip icon={<DirectionsCarIcon />} label="주차장" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
							<Chip icon={<RoomIcon />} label="트윈베드" />
						</Box>
					</Stack>
					<Box className="room-amenities__divider" />
					<Stack className="amenities-card">
						<Typography className="amenities-card__title">취소 및 환불 규정</Typography>
						<Typography className="">객실별 취소 정책이 상이하니 객실 상세정보에서 확인해주세요.</Typography>
					</Stack>
					<Box className="room-amenities__divider" />
				</section>
				<section id="section-location">
					<Typography className="section-location_title">위치</Typography>
					<PropertyLocationMap address="서울 강동구 길동 387-7" />
				</section>
				<section id="section-reviews">
					<Box className="reviews-page__header">
						<Box className="reviews-page__header-left">
							<span className="reviews-page__header-star">★</span>
							<span className="reviews-page__header-title">
								리얼 리뷰 <span className="reviews-page__header-score">{9.1}</span>
							</span>
							<span className="reviews-page__header-meta">
								{sampleReviews.length.toLocaleString()}명 평가 · {sampleReviews.length.toLocaleString()}개 리뷰
							</span>
						</Box>

						<Box className="reviews-page__header-right">
							<Button
								className="reviews-page__sort-trigger"
								onClick={(e) => setSortAnchorEl(e.currentTarget)}
								disableRipple
							>
								<SwapVertIcon fontSize="small" className="reviews-page__sort-icon" />
								<span className="reviews-page__sort-label">{sortLabelMap[sortOption]}</span>
							</Button>

							<Menu
								anchorEl={sortAnchorEl}
								open={isSortMenuOpen}
								onClose={() => setSortAnchorEl(null)}
								anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
								transformOrigin={{ vertical: 'top', horizontal: 'right' }}
							>
								{(
									[
										{ key: 'recommended', label: '추천순' },
										{ key: 'recent', label: '최신순' },
										{ key: 'high', label: '평점 높은순' },
										{ key: 'low', label: '평점 낮은순' },
									] as const
								).map((item) => (
									<MenuItem
										key={item.key}
										onClick={() => {
											setSortOption(item.key);
											setSortAnchorEl(null);
										}}
										className="reviews-page__sort-menu-item"
									>
										<span
											className={
												sortOption === item.key
													? 'reviews-page__sort-menu-text reviews-page__sort-menu-text--active'
													: 'reviews-page__sort-menu-text'
											}
										>
											{item.label}
										</span>
										{sortOption === item.key && (
											<CheckIcon fontSize="small" className="reviews-page__sort-menu-check" />
										)}
									</MenuItem>
								))}
							</Menu>
						</Box>
					</Box>
					<hr className="reviews-page__header-divider" />
					<ReviewImageModal
						images={reviewImages}
						open={openReviewImage}
						onClose={() => setOpenReviewImage(false)}
						reviewImgIndex={reviewImgIndex}
					/>
					{sortedReviews.length !== 0 ? (
						sortedReviews.map((review) => {
							return (
								<ReviewItem
									key={review.id}
									nickname={review.guest}
									statsText="리뷰 37 · 사진 58 · 장소 34"
									rating={review.rating}
									writtenAgo={review.date}
									roomName={review.roomType}
									text={review.comment}
									replyText={review.response}
									replyAgo={'1개월 전'}
									images={reviewImages}
									setOpenReviewImage={setOpenReviewImage}
									setReviewImgIndex={setReviewImgIndex}
								/>
							);
						})
					) : (
						<div className="no-data">
							<img src="/img/no-data3.webp" alt="" />
						</div>
					)}

					<Stack className="reviews-pagination">
						<Pagination
							count={Math.ceil(5 / 11) || 1}
							page={1}
							shape="circular"
							color="primary"
							// onChange={paginationHandler}
						/>
					</Stack>
				</section>
				<section id="section-similar-rooms">
					<Stack className="container">
						<Box className="hotelspecials-container">
							{/* 헤더 */}
							<Box className="popular-header">
								<Typography className="popular-title">다른 고객이 본 비슷한 숙소</Typography>
							</Box>

							{/* 슬라이더 래퍼 + 화살표 버튼 */}
							{STAYS.length !== 0 ? (
								<Box className="hotelspecials-slider-wrapper">
									<IconButton className="hotelspecials-arrow hotelspecials-prev">
										<ArrowBackIosNewIcon />
									</IconButton>

									<Swiper
										className="popular-swiper"
										modules={[Navigation]}
										navigation={{
											prevEl: '.hotelspecials-prev',
											nextEl: '.hotelspecials-next',
										}}
										spaceBetween={24}
										slidesPerView={4}
										breakpoints={{
											0: { slidesPerView: 1.2, spaceBetween: 16 },
											768: { slidesPerView: 2.5, spaceBetween: 20 },
											1024: { slidesPerView: 3, spaceBetween: 22 },
											1280: { slidesPerView: 4, spaceBetween: 24 },
										}}
									>
										{STAYS.map((stay) => {
											const isFav = favoriteRooms.includes(stay.id);
											return (
												<SwiperSlide key={stay.id}>
													<Box className="popular-card">
														<Box className="popular-image-wrapper">
															<img src={stay.imageUrl} alt={stay.name} className="popular-image" />
															<Box className="popular-image-top">
																{stay.badgeText && (
																	<Chip className="popular-chip" label={stay.badgeText} size="small" />
																)}
																<IconButton className="popular-fav-btn" onClick={() => toggleFavorite(stay.id)}>
																	{isFav ? (
																		<FavoriteIcon className="popular-fav-icon active" />
																	) : (
																		<FavoriteBorderIcon className="popular-fav-icon" />
																	)}
																</IconButton>
															</Box>
														</Box>

														<Box className="popular-info">
															<Typography className="popular-category">{stay.categoryLabel}</Typography>
															<Typography className="popular-name">{stay.name}</Typography>
															<Typography className="popular-location">
																{stay.location} · {stay.subLocation}
															</Typography>

															<Box className="popular-rating-row">
																<Box className="popular-rating-badge">
																	<StarIcon className="popular-rating-star" />
																	<span className="popular-rating-score">{stay.rating.toFixed(1)}</span>
																</Box>
																<span className="popular-rating-count">{stay.reviewCount.toLocaleString()}명 평가</span>
															</Box>

															{stay.originalPrice && (
																<Typography className="popular-coupon-text">쿠폰 적용시</Typography>
															)}

															<Box className="popular-price-row">
																<span className="popular-price-current">{stay.price.toLocaleString()}원</span>
																{stay.originalPrice && (
																	<span className="popular-price-origin">{stay.originalPrice.toLocaleString()}원</span>
																)}
															</Box>
														</Box>
													</Box>
												</SwiperSlide>
											);
										})}
									</Swiper>
									<IconButton className="hotelspecials-arrow hotelspecials-next">
										<ArrowForwardIosIcon />
									</IconButton>
								</Box>
							) : (
								<div className="no-data">
									<img src="/img/no-data3.webp" alt="" />
								</div>
							)}
						</Box>
					</Stack>
				</section>
			</main>
		</Stack>
	);
};

PropertyDetailPage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		search: {
			location: '',
			checkInDate: '',
			checkOutDate: '',
			personal: 2,
		},
	},
};

export default OtherLayout(PropertyDetailPage);
