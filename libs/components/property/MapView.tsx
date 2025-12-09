import React, { useEffect, useRef } from 'react';

declare global {
	interface Window {
		kakao: any;
	}
}

const MARKERS = [
	{
		id: 1,
		lat: 37.555,
		lng: 126.936,
		price: '79,900원',
		name: '신촌 시스터즈',
		type: '모텔',
		rating: 9.1,
		reviews: 148,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '17:00',
	},
	{
		id: 2,
		lat: 37.556,
		lng: 126.94,
		price: '89,000원',
		name: '홍대 라운지 호텔',
		type: '호텔',
		rating: 8.7,
		reviews: 569,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '15:00',
	},
	{
		id: 3,
		lat: 37.558,
		lng: 126.943,
		price: '102,000원',
		name: '이대 메트로 스테이',
		type: '호텔',
		rating: 8.4,
		reviews: 312,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '15:00',
	},
	{
		id: 4,
		lat: 37.552,
		lng: 126.928,
		price: '69,000원',
		name: '홍대 퍼스트 모텔',
		type: '모텔',
		rating: 8.9,
		reviews: 210,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '18:00',
	},
	{
		id: 5,
		lat: 37.567,
		lng: 126.982,
		price: '155,000원',
		name: '종로 프리미엄 호텔',
		type: '호텔',
		rating: 9.0,
		reviews: 987,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '14:00',
	},
	{
		id: 6,
		lat: 37.563,
		lng: 126.97,
		price: '112,000원',
		name: '시청 스테이 모던',
		type: '호텔',
		rating: 8.5,
		reviews: 420,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '15:00',
	},
	{
		id: 7,
		lat: 37.545,
		lng: 127.015,
		price: '95,000원',
		name: '서울숲 리버뷰 모텔',
		type: '모텔',
		rating: 8.8,
		reviews: 186,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '17:00',
	},
	{
		id: 8,
		lat: 37.534,
		lng: 127.001,
		price: '178,000원',
		name: '압구정 디자이너 호텔',
		type: '호텔',
		rating: 9.3,
		reviews: 652,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '14:00',
	},
	{
		id: 9,
		lat: 37.525,
		lng: 126.955,
		price: '129,000원',
		name: '여의도 비즈니스 호텔',
		type: '호텔',
		rating: 8.2,
		reviews: 331,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '15:00',
	},
	{
		id: 10,
		lat: 37.516,
		lng: 127.02,
		price: '86,000원',
		name: '논현 스위트 모텔',
		type: '모텔',
		rating: 8.6,
		reviews: 204,
		thumb: 'https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800',
		checkin: '18:00',
	},
];

interface KakaoMapViewProps {
	targetPropertyEl: number | null;
}

const KakaoMapView = ({ targetPropertyEl }: KakaoMapViewProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!window.kakao?.maps) return;

		window.kakao.maps.load(() => {
			const center = new window.kakao.maps.LatLng(37.555, 126.936);

			const map = new window.kakao.maps.Map(containerRef.current, {
				center,
				level: 6,
			});

			MARKERS.forEach((hotel, idx) => {
				/* 1. 가격 마커 생성 */
				const priceContent = document.createElement('div');
				priceContent.className = `kakao-price-marker ${targetPropertyEl === idx ? 'hover' : ''}`;
				priceContent.innerText = hotel.price;
				priceContent.dataset.index = idx.toString();

				const priceOverlay = new window.kakao.maps.CustomOverlay({
					position: new window.kakao.maps.LatLng(hotel.lat, hotel.lng),
					content: priceContent,
					yAnchor: 1,
				});

				priceContent.addEventListener('mouseenter', () => {
					priceContent.style.background = 'black';
					priceContent.style.color = 'white';
					priceContent.style.transform = 'scale(1.1)';
				});

				priceContent.addEventListener('mouseleave', () => {
					priceContent.style.background = 'white';
					priceContent.style.color = 'black';
					priceContent.style.transform = 'scale(1)';
				});

				priceOverlay.setMap(map);

				/* 2. hover 카드 생성 (처음엔 숨김) */
				const card = document.createElement('div');
				card.className = 'hotel-preview-card';
				card.innerHTML = `
          <div class="card-img-wrap">
            <img src="${hotel.thumb}" />
          </div>
          <div class="card-info">
            <div class="type">${hotel.type}</div>
            <div class="name">${hotel.name}</div>
            <div class="rating">⭐ ${hotel.rating} | ${hotel.reviews}명</div>
            <div class="checkin">숙박 ${hotel.checkin} 체크인</div>
            <div class="price">${hotel.price}/1박</div>
          </div>
        `;

				const cardOverlay = new window.kakao.maps.CustomOverlay({
					position: new window.kakao.maps.LatLng(hotel.lat, hotel.lng),
					content: card,
					yAnchor: 1.4,
					zIndex: 999,
				});

				/* hover 이벤트 */
				priceContent.addEventListener('mouseenter', () => {
					cardOverlay.setMap(map);
				});

				priceContent.addEventListener('mouseleave', () => {
					cardOverlay.setMap(null);
				});
			});
		});
	}, [targetPropertyEl]);

	return <div ref={containerRef} className="kakao-map-root" />;
};

export default KakaoMapView;
