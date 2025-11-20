// KakaoMapView.tsx
import React, { useEffect, useRef } from 'react';

declare global {
	interface Window {
		kakao: any;
	}
}

const MARKERS = [
	{ lat: 37.5115, lng: 127.098, price: '223,000원' },
	{ lat: 37.513, lng: 127.102, price: '151,666원' },
	{ lat: 37.5665, lng: 126.978, price: '123,000원' },
	{ lat: 37.56, lng: 126.99, price: '98,000원' },
	{ lat: 37.521, lng: 127.056, price: '174,000원' },
	{ lat: 37.545, lng: 127.101, price: '132,500원' },
	{ lat: 37.538, lng: 126.999, price: '89,000원' },
	{ lat: 37.551, lng: 127.01, price: '110,000원' },
	{ lat: 37.517, lng: 127.043, price: '155,000원' },
	{ lat: 37.57, lng: 127.002, price: '102,000원' },
];

const KakaoMapView: React.FC = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!window.kakao || !window.kakao.maps) {
			console.error('kakao sdk not loaded');
			return;
		}

		window.kakao.maps.load(() => {
			if (!containerRef.current) return;

			const center = new window.kakao.maps.LatLng(37.5115, 127.098);
			const map = new window.kakao.maps.Map(containerRef.current, {
				center,
				level: 5,
			});

			MARKERS.forEach((m) => {
				const pos = new window.kakao.maps.LatLng(m.lat, m.lng);
				const overlay = new window.kakao.maps.CustomOverlay({
					position: pos,
					content: `<div class="kakao-price-marker">${m.price}</div>`,
					yAnchor: 1,
				});
				overlay.setMap(map);
			});
		});
	}, []);

	return <div ref={containerRef} className="kakao-map-root" />;
};

export default KakaoMapView;
