import React, { useEffect, useRef } from 'react';
import { Property } from '../../types/property/property';
import { LOCATION_LIST } from '../../enums/property.enum';

declare global {
	interface Window {
		kakao: any;
	}
}

interface KakaoMapViewProps {
	targetPropertyId: string | null;
	properties: Property[] | [];
}
const KakaoMapView = ({ targetPropertyId, properties }: KakaoMapViewProps) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	useEffect(() => {
		if (!window.kakao?.maps) return;
		if (!location) return;
		const locationLat = LOCATION_LIST.filter((loc) => loc.key === properties[0]?.propertyLocation)[0]?.lat;
		const locationLng = LOCATION_LIST.filter((loc) => loc.key === properties[0]?.propertyLocation)[0]?.lng;

		window.kakao.maps.load(() => {
			const center = new window.kakao.maps.LatLng(locationLat, locationLng);

			const map = new window.kakao.maps.Map(containerRef.current, {
				center,
				level: 6,
			});

			properties.forEach((property: Property, idx) => {
				const checkin = property.rooms?.[0]?.stayPlans?.[1]?.stayPlanRules?.checkInFrom;
				/* 1. 가격 마커 생성 */
				const priceContent = document.createElement('div');
				priceContent.className = `kakao-price-marker ${targetPropertyId === property._id ? 'hover' : ''}`;
				priceContent.innerText = String(property.propertyPrice);
				priceContent.dataset.index = property._id.toString();

				const priceOverlay = new window.kakao.maps.CustomOverlay({
					position: new window.kakao.maps.LatLng(property.propertyLat, property.propertyLng),
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
            <img src="${process.env.REACT_APP_API_URL}/${property.propertyImages[0]}" />
          </div>
          <div class="card-info">
            <div class="type">${property.propertyType}</div>
            <div class="name" >${property.propertyName}</div>
            <div class="rating">⭐ ${property.propertyRank.toFixed(1)} | ${property.propertyComments}명</div>
            <div class="checkin">숙박 ${checkin} 체크인</div>
            <div class="price">${property.propertyPrice.toLocaleString()}/1박</div>
          </div>
        `;

				const cardOverlay = new window.kakao.maps.CustomOverlay({
					position: new window.kakao.maps.LatLng(property.propertyLat, property.propertyLng),
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
	}, [targetPropertyId]);

	return <div ref={containerRef} className="kakao-map-root" />;
};

export default KakaoMapView;
