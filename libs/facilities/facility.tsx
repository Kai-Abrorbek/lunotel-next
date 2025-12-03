import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import KitchenIcon from '@mui/icons-material/Kitchen';
import FireplaceIcon from '@mui/icons-material/Fireplace';
import SmokeFreeIcon from '@mui/icons-material/SmokeFree';
import SmokingRoomsIcon from '@mui/icons-material/SmokingRooms';
import PetsIcon from '@mui/icons-material/Pets';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LocalTaxiIcon from '@mui/icons-material/LocalTaxi';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import LocalConvenienceStoreIcon from '@mui/icons-material/LocalConvenienceStore';
import LockIcon from '@mui/icons-material/Lock';
import TvIcon from '@mui/icons-material/Tv';
import SpaIcon from '@mui/icons-material/Spa';
import HotTubIcon from '@mui/icons-material/HotTub';
import BathtubIcon from '@mui/icons-material/Bathtub';
import IronIcon from '@mui/icons-material/Iron';
import ElevatorIcon from '@mui/icons-material/Elevator';
import BalconyIcon from '@mui/icons-material/Balcony';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
// ⬇️ 새로 추가
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import CelebrationIcon from '@mui/icons-material/Celebration';
import PoolIcon from '@mui/icons-material/Pool';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ChildCareIcon from '@mui/icons-material/ChildCare';

export const FACILITY_ITEMS = [
	// 기존 8개
	{ key: 'wifi', label: '무료 Wi-Fi', icon: <WifiIcon /> },
	{ key: 'parking', label: '주차 가능', icon: <LocalParkingIcon /> },
	{ key: 'breakfast', label: '조식 포함', icon: <FreeBreakfastIcon /> },
	{ key: 'fitness', label: '피트니스 센터', icon: <FitnessCenterIcon /> },
	{ key: 'party', label: '파티룸', icon: <CelebrationIcon /> },
	{ key: 'pool', label: '수영장', icon: <PoolIcon /> },
	{ key: 'reception', label: '24시간 리셉션', icon: <SupportAgentIcon /> },
	{ key: 'kids', label: '어린이 시설', icon: <ChildCareIcon /> },

	// 숙소 내부 설비
	{ key: 'aircon', label: '에어컨', icon: <AcUnitIcon /> },
	{ key: 'heater', label: '난방', icon: <FireplaceIcon /> },
	{ key: 'tv', label: 'TV', icon: <TvIcon /> },
	{ key: 'bathtub', label: '욕조', icon: <BathtubIcon /> },
	{ key: 'spa', label: '스파/월풀', icon: <HotTubIcon /> },
	{ key: 'sauna', label: '사우나', icon: <SpaIcon /> },
	{ key: 'kitchen', label: '개별 주방', icon: <KitchenIcon /> },
	{ key: 'laundry', label: '세탁기', icon: <LocalLaundryServiceIcon /> },
	{ key: 'iron', label: '다리미', icon: <IronIcon /> },
	{ key: 'balcony', label: '발코니', icon: <BalconyIcon /> },

	// 편의 기능
	{ key: 'elevator', label: '엘리베이터', icon: <ElevatorIcon /> },
	{ key: 'locker', label: '개별 락커', icon: <LockIcon /> },
	{ key: 'store', label: '편의점', icon: <LocalConvenienceStoreIcon /> },

	// 음식 & 음료
	{ key: 'restaurant', label: '레스토랑', icon: <RestaurantIcon /> },
	{ key: 'bar', label: '바/라운지', icon: <LocalBarIcon /> },
	{ key: 'roomservice', label: '룸서비스', icon: <LocalDiningIcon /> },

	// 교통 관련
	{ key: 'shuttle', label: '셔틀 서비스', icon: <AirportShuttleIcon /> },
	{ key: 'taxi', label: '택시/콜 서비스', icon: <LocalTaxiIcon /> },

	// 정책
	{ key: 'pet', label: '반려동물 동반 가능', icon: <PetsIcon /> },
	{ key: 'smoking', label: '흡연 가능', icon: <SmokingRoomsIcon /> },
	{ key: 'nosmoking', label: '금연 객실', icon: <SmokeFreeIcon /> },

	// 관광 & 위치
	{ key: 'beach', label: '해변 접근성', icon: <BeachAccessIcon /> },
];
