import { useEffect, useRef } from 'react';

declare global {
	interface Window {
		kakao: any;
	}
}

const PropertyLocationMap = ({ address }: { address: string }) => {
	const mapRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!window.kakao || !window.kakao.maps) return;
		if (!mapRef.current) return;

		window.kakao.maps.load(() => {
			const { maps } = window.kakao;

			// ✅ 여기서는 Map, LatLng 전부 정의되어 있음
			const map = new maps.Map(mapRef.current, {
				center: new maps.LatLng(37.5665, 126.978),
				level: 3,
				scrollwheel: false,
			});

			const zoomControl = new maps.ZoomControl();
			map.addControl(zoomControl, maps.ControlPosition.RIGHT);

			const geocoder = new maps.services.Geocoder();

			geocoder.addressSearch(address, (result: any, status: any) => {
				if (status !== maps.services.Status.OK) return;

				const coords = new maps.LatLng(result[0].y, result[0].x);

				map.setCenter(coords);

				new maps.Marker({
					map,
					position: coords,
				});
			});
		});
	}, [address]);

	return <div ref={mapRef} style={{ width: '100%', height: '500px', borderRadius: '10px', margin: '16px 40px' }} />;
};

export default PropertyLocationMap;
