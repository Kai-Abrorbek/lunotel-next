import { useState } from 'react';
import { Box, Button, Typography, Divider, Stack } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';

type TabKey = 'region' | 'city' | 'spot';

const REGION_LIST = [
	{ name: '경기', value: 'GYEONGGI' },
	{ name: '충남', value: 'CHUNGCHEONGNAM' },
	{ name: '강원', value: 'GANGWON' },
	{ name: '제주도', value: 'JEJU' },
	{ name: '경남', value: 'GYEONGNAM' },
	{ name: '경북', value: 'GYEONGBUK' },
	{ name: '서울', value: 'SEOUL' },
	{ name: '부산', value: 'BUSAN' },
	{ name: '전남', value: 'JEONNAM' },
	{ name: '인천', value: 'INCHEON' },
	{ name: '전북', value: 'JEONBUK' },
	{ name: '충북', value: 'CHUNGBUK' },
	{ name: '대구', value: 'DAEGU' },
	{ name: '울산', value: 'ULSAN' },
	{ name: '세종', value: 'SEJONG' },
	{ name: '대전', value: 'DAEJEON' },
	{ name: '광주', value: 'GWANGJU' },
];

const CITY_LIST = [
	{ name: '수원', value: 'SUWON' },
	{ name: '성남', value: 'SEONGNAM' },
	{ name: '용인', value: 'YONGIN' },
	{ name: '제주시', value: 'JEJU_CITY' },
	{ name: '서귀포', value: 'SEOGWIPO' },
	{ name: '부산', value: 'BUSAN' },
	{ name: '대구', value: 'DAEGU' },
	{ name: '인천', value: 'INCHEON' },
	{ name: '광주', value: 'GWANGJU' },
	{ name: '대전', value: 'DAEJEON' },
	{ name: '울산', value: 'ULSAN' },
	{ name: '청주', value: 'CHEONGJU' },
];

const SPOT_LIST = [
	{ name: '남산타워', value: 'NAMSAN_TOWER' },
	{ name: '해운대', value: 'HAEUNDAE' },
	{ name: '경복궁', value: 'GYEONGBOKGUNG' },
	{ name: '한라산', value: 'HALLASAN' },
	{ name: '광안리', value: 'GWANGALLI' },
	{ name: '속초 해수욕장', value: 'SOKCHO_BEACH' },
	{ name: '동해 추암', value: 'CHUAM_DONGHAE' },
	{ name: '전주 한옥마을', value: 'JEONJU_HANOAK_VILLAGE' },
	{ name: '여의도 한강공원', value: 'YEOUIDO_HANGANG_PARK' },
];

export default function DomesticDestination() {
	const [activeTab, setActiveTab] = useState<TabKey>('region');
	const router = useRouter();
	/**LIFESICLE**/

	/**LIFESICLE**/

	/**HANDLER**/
	const handleSelectLocation = async (location: string) => {
		const data = localStorage.getItem('searchFilter');
		if (data) {
			const searchFilter = JSON.parse(data);
			searchFilter.search.location = location;
			localStorage.setItem('searchFilter', JSON.stringify(searchFilter));
			await router.push(
				`/property?input=${JSON.stringify(searchFilter)}`,
				`/property?input=${JSON.stringify(searchFilter)}`,
			);
		}
	};
	/**HANDLER**/
	const getList = () => {
		if (activeTab === 'region') return REGION_LIST;
		if (activeTab === 'city') return CITY_LIST;
		return SPOT_LIST;
	};

	const list = getList();
	return (
		<Stack className="container">
			<Box className="domestic-container ">
				<Typography className="domestic-title">국내 여행지</Typography>

				<Box className="domestic-tabs">
					<Button
						className={`domestic-tab ${activeTab === 'region' ? 'active' : ''}`}
						onClick={() => setActiveTab('region')}
					>
						지역
					</Button>

					<Button
						className={`domestic-tab ${activeTab === 'city' ? 'active' : ''}`}
						onClick={() => setActiveTab('city')}
					>
						도시
					</Button>

					<Button
						className={`domestic-tab ${activeTab === 'spot' ? 'active' : ''}`}
						onClick={() => setActiveTab('spot')}
					>
						명소
					</Button>
				</Box>

				{list.length !== 0 ? (
					<Box className="domestic-list">
						{list.map((item) => (
							<Box key={item.name} onClick={() => handleSelectLocation(item.value)} className="domestic-item">
								{item.name}
							</Box>
						))}
					</Box>
				) : (
					<div className="no-data">
						<img src="/img/no-data3.webp" alt="" />
					</div>
				)}
				<Divider className="domestic-divider" />
			</Box>
		</Stack>
	);
}
