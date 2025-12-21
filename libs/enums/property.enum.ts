export enum PropertyType {
	ALL = 'ALL',
	MOTEL = 'MOTEL',
	HOTEL = 'HOTEL',
	PENSION = 'PENSION',
	POLL_VILLA = 'POLL_VILLA',
	CAMPING = 'CAMPING',
	GLAMPING = 'GLAMPING',
}

export enum PropertyTypeKorean {
	ALL = '천제',
	MOTEL = '모텔',
	HOTEL = '호텔',
	PENSION = '펜션',
	POLL_VILLA = '풀빌라',
	CAMPING = '캠핑',
	글램핑 = '글램핑',
}

export enum PropertyStatus {
	DRAFT = 'DRAFT',
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	BLOCKED = 'BLOCKED',
	DELETE = 'DELETE',
}

export enum PropertyStatusKorean {
	DRAFT = '대기중',
	ACTIVE = '운영중',
	INACTIVE = '중지',
	BLOCKED = '차단',
	DELETE = '삭제',
}

export enum PropertyLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GYEONGJU = 'GYEONGJU',
	GWANGJU = 'GWANGJU',
	CHONJU = 'CHONJU',
	DAEJON = 'DAEJON',
	JEJU = 'JEJU',
	GANGNEUNG = 'GANGNEUNG',
	SOKCHO = 'SOKCHO',
	YEOSU = 'YEOSU',
	HEUNDE = 'HEUNDE',
	GAPYEONG = 'GAPYEONG',
}

export enum PropertyLocationKorean {
	SEOUL = '서울',
	BUSAN = '부산',
	INCHEON = '인천',
	DAEGU = '대구',
	GYEONGJU = '광주',
	GWANGJU = '경주',
	CHONJU = '청주',
	DAEJON = '대전',
	JEJU = '제주',
	GANGNEUNG = '강릉',
	SOKCHO = '속초',
	YEOSU = '여수',
	HEUNDE = '해운대',
	GAPYEONG = '가평',
}

export enum PropertyAmenity {
	WIFI = 'WIFI',
	AIR_CONDITIONER = 'AIR_CONDITIONER',
	TV = 'TV',
	MINIBAR = 'MINIBAR',
	REFRIGERATOR = 'REFRIGERATOR',
	COFFEE_MACHINE = 'COFFEE_MACHINE',
	HAIR_DRYER = 'HAIR_DRYER',
	BATHTUB = 'BATHTUB',
	SHOWER_BOOTH = 'SHOWER_BOOTH',
	MICROWAVE = 'MICROWAVE',
	WASHING_MACHINE = 'WASHING_MACHINE',
	IRON = 'IRON',
	SAFE = 'SAFE',
	BALCONY = 'BALCONY',
	BED = 'BED',
	SOFA = 'SOFA',
	DESK = 'DESK',
	WARDROBE = 'WARDROBE',
	SLIPPERS = 'SLIPPERS',
	TOWELS = 'TOWELS',
	SHAMPOO = 'SHAMPOO',
	BODY_WASH = 'BODY_WASH',
	TOOTHBRUSH = 'TOOTHBRUSH',
	TELEPHONE = 'TELEPHONE',
	CLOCK = 'CLOCK',
	BLINDS = 'BLINDS',
	AIR_PURIFIER = 'AIR_PURIFIER',
	HUMIDIFIER = 'HUMIDIFIER',
	HEATING = 'HEATING',
	NON_SMOKING = 'NON_SMOKING',
}

export enum PropertyAmenityKorean {
	WIFI = '무료 Wi-Fi',
	AIR_CONDITIONER = '에어컨',
	TV = 'TV',
	MINIBAR = '미니바',
	REFRIGERATOR = '냉장고',
	COFFEE_MACHINE = '커피머신',
	HAIR_DRYER = '헤어드라이어',
	BATHTUB = '욕조',
	SHOWER_BOOTH = '샤워부스',
	MICROWAVE = '전자레인지',
	WASHING_MACHINE = '세탁기',
	IRON = '다리미',
	SAFE = '금고',
	BALCONY = '발코니',
	BED = '침대',
	SOFA = '소파',
	DESK = '책상',
	WARDROBE = '옷장',
	SLIPPERS = '슬리퍼',
	TOWELS = '수건',
	SHAMPOO = '샴푸',
	BODY_WASH = '바디워시',
	TOOTHBRUSH = '칫솔',
	TELEPHONE = '전화기',
	CLOCK = '시계',
	BLINDS = '블라인드',
	AIR_PURIFIER = '공기청정기',
	HUMIDIFIER = '가습기',
	HEATING = '난방',
	NON_SMOKING = '객실금연',
}

export enum PropertyOtherAmenity {
	BREAKFAST_PROVIDED = 'BREAKFAST_PROVIDED',
	FREE_PARKING = 'FREE_PARKING',
	PETS_ALLOWED = 'PETS_ALLOWED',
	SAUNA_JJIMJILBANG = 'SAUNA_JJIMJILBANG',
	IN_ROOM_COOKING = 'IN_ROOM_COOKING',
	PICK_UP_SERVICE = 'PICK_UP_SERVICE',
	SMOKING_ALLOWED = 'SMOKING_ALLOWED',
	LUGGAGE_STORAGE = 'LUGGAGE_STORAGE',
}

export enum PropertyOtherAmenityKorean {
	BREAKFAST_PROVIDED = '조식 제공',
	FREE_PARKING = '무료 주차',
	PETS_ALLOWED = '반려동물 동반 가능',
	SAUNA_JJIMJILBANG = '사우나·찜질방',
	IN_ROOM_COOKING = '객실 내 취사 가능',
	PICK_UP_SERVICE = '픽업 서비스',
	SMOKING_ALLOWED = '흡연 가능',
	LUGGAGE_STORAGE = '짐 보관 가능',
}

export const amenitiesList = [
	{ key: 'WIFI', name: '무료 Wi-Fi', en: 'Free Wi-Fi', icon: '📶' },
	{ key: 'AIR_CONDITIONER', name: '에어컨', en: 'Air Conditioner', icon: '❄️' },
	{ key: 'TV', name: 'TV', en: 'Television', icon: '📺' },
	{ key: 'MINIBAR', name: '미니바', en: 'Minibar', icon: '🍷' },
	{ key: 'REFRIGERATOR', name: '냉장고', en: 'Refrigerator', icon: '🧊' },
	{ key: 'COFFEE_MACHINE', name: '커피머신', en: 'Coffee Machine', icon: '☕' },
	{ key: 'HAIR_DRYER', name: '헤어드라이어', en: 'Hair Dryer', icon: '💨' },
	{ key: 'BATHTUB', name: '욕조', en: 'Bathtub', icon: '🛁' },
	{ key: 'SHOWER_BOOTH', name: '샤워부스', en: 'Shower Booth', icon: '🚿' },
	{ key: 'MICROWAVE', name: '전자레인지', en: 'Microwave', icon: '🔥' },
	{ key: 'WASHING_MACHINE', name: '세탁기', en: 'Washing Machine', icon: '🧺' },
	{ key: 'IRON', name: '다리미', en: 'Iron', icon: '👔' },
	{ key: 'SAFE', name: '금고', en: 'Safe', icon: '🔐' },
	{ key: 'BALCONY', name: '발코니', en: 'Balcony', icon: '🌅' },
	{ key: 'BED', name: '침대', en: 'Bed', icon: '🛏️' },
	{ key: 'SOFA', name: '소파', en: 'Sofa', icon: '🛋️' },
	{ key: 'DESK', name: '책상', en: 'Desk', icon: '🪑' },
	{ key: 'WARDROBE', name: '옷장', en: 'Wardrobe', icon: '👗' },
	{ key: 'SLIPPERS', name: '슬리퍼', en: 'Slippers', icon: '🩴' },
	{ key: 'TOWELS', name: '수건', en: 'Towels', icon: '🧻' },
	{ key: 'SHAMPOO', name: '샴푸', en: 'Shampoo', icon: '🧴' },
	{ key: 'BODY_WASH', name: '바디워시', en: 'Body Wash', icon: '🧼' },
	{ key: 'TOOTHBRUSH', name: '칫솔', en: 'Toothbrush', icon: '🪥' },
	{ key: 'TELEPHONE', name: '전화기', en: 'Telephone', icon: '☎️' },
	{ key: 'CLOCK', name: '시계', en: 'Clock', icon: '⏰' },
	{ key: 'BLINDS', name: '블라인드', en: 'Blinds', icon: '🪟' },
	{ key: 'AIR_PURIFIER', name: '공기청정기', en: 'Air Purifier', icon: '🌬️' },
	{ key: 'HUMIDIFIER', name: '가습기', en: 'Humidifier', icon: '💧' },
	{ key: 'HEATING', name: '난방', en: 'Heating', icon: '🔥' },
	{ key: 'NON_SMOKING', name: '객실금연', en: 'Non-Smoking Room', icon: '🚭' },
];

export const otherAmenitiesList = [
	{ key: 'BREAKFAST_PROVIDED', name: '조식 제공', en: 'Breakfast Provided', icon: '🥐' },
	{ key: 'FREE_PARKING', name: '무료 주차', en: 'Free Parking', icon: '🅿️' },
	{ key: 'PETS_ALLOWED', name: '반려동물 동반 가능', en: 'Pets Allowed', icon: '🐶' },
	{ key: 'SAUNA_JJIMJILBANG', name: '사우나 / 찜질방', en: 'Sauna / Jjimjilbang', icon: '♨️' },
	{ key: 'IN_ROOM_COOKING', name: '객실 내 취사 가능', en: 'In-room Cooking', icon: '🍳' },
	{ key: 'PICK_UP_SERVICE', name: '픽업 서비스', en: 'Pick-up Service', icon: '🚐' },
	{ key: 'SMOKING_ALLOWED', name: '흡연 가능', en: 'Smoking Allowed', icon: '🚬' },
	{ key: 'LUGGAGE_STORAGE', name: '짐 보관', en: 'Luggage Storage', icon: '🧳' },
];

export const SORT_OPTIONS = [
	{ value: 'createdAt', label: '추천순', sort: 'createdAt', direc: 'DESC' },
	{ value: 'propertyComments', label: '리뷰많은순', sort: 'propertyComments', direc: 'DESC' },
	{ value: 'propertyPrice_DESC', label: '높은가격순', sort: 'propertyPrice', direc: 'DESC' },
	{ value: 'propertyPrice_ASC', label: '낮은가격순', sort: 'propertyPrice', direc: 'ASC' },
	{ value: 'propertyRank_DESC', label: '평점높은순', sort: 'propertyRank', direc: 'DESC' },
	{ value: 'propertyRank_ASC', label: '평점낮은순', sort: 'propertyRank', direc: 'ASC' },
	{ value: 'propertyReservations', label: '거리순', sort: 'propertyReservations', direc: 'DESC' },
];

export const LOCATION_LIST = [
	{ key: 'SEOUL', label: '서울', lat: 37.5665, lng: 126.978 },
	{ key: 'BUSAN', label: '부산', lat: 35.1796, lng: 129.0756 },
	{ key: 'INCHEON', label: '인천', lat: 37.4563, lng: 126.7052 },
	{ key: 'DAEGU', label: '대구', lat: 35.8714, lng: 128.6014 },
	{ key: 'GWANGJU', label: '광주', lat: 35.1595, lng: 126.8526 },
	{ key: 'GYEONGJU', label: '경주', lat: 35.8562, lng: 129.2247 },
	{ key: 'CHONJU', label: '청주', lat: 36.6424, lng: 127.489 },
	{ key: 'DAEJON', label: '대전', lat: 36.3504, lng: 127.3845 },
	{ key: 'JEJU', label: '제주', lat: 33.4996, lng: 126.5312 },
	{ key: 'GANGNEUNG', label: '강릉', lat: 37.7519, lng: 128.8761 },
	{ key: 'SOKCHO', label: '속초', lat: 38.207, lng: 128.5918 },
	{ key: 'YEOSU', label: '여수', lat: 34.7604, lng: 127.6622 },
	{ key: 'HEUNDE', label: '해운대', lat: 35.1631, lng: 129.1635 },
	{ key: 'GAPYEONG', label: '가평', lat: 37.8315, lng: 127.5109 },
];

interface StatusOption {
	value: PropertyStatus;
	label: string;
	color: string;
}

export const statusOptions: StatusOption[] = [
	{ value: PropertyStatus.ACTIVE, label: '운영중', color: '#10b981' },
	{ value: PropertyStatus.DRAFT, label: '대기중', color: '#f59e0b' },
	{ value: PropertyStatus.INACTIVE, label: '판매완료', color: '#e6e22fff' },
	{ value: PropertyStatus.BLOCKED, label: '중지', color: '#ef4444' },
];

export const typeOptions = [
	{ value: 'HOTEL', label: '호텔', icon: '🏨' },
	{ value: 'MOTEL', label: '모텔', icon: '🏩' },
	{ value: 'PENSION', label: '펜션', icon: '🏡' },
	{ value: 'POLL_VILLA', label: '풀빌라', icon: '🏘️' },
	{ value: 'RESORT', label: '리조트', icon: '🏖️' },
	{ value: 'CAMPING', label: '캠핑', icon: '🏕️' },
	{ value: 'GLAMPING', label: '캠핑', icon: '🏕️' },
];
export const locationOptions = [
	{ value: 'SEOUL', label: '서울' },
	{ value: 'BUSAN', label: '부산' },
	{ value: 'INCHEON', label: '인천' },
	{ value: 'DAEGU', label: '대구' },
	{ value: 'DAEJEON', label: '대전' },
	{ value: 'GWANGJU', label: '광주' },
	{ value: 'ULSAN', label: '울산' },
	{ value: 'SEJONG', label: '세종' },
	{ value: 'GYEONGGI', label: '경기' },
	{ value: 'GANGWON', label: '강원' },
	{ value: 'CHUNGBUK', label: '충북' },
	{ value: 'CHUNGNAM', label: '충남' },
	{ value: 'JEONBUK', label: '전북' },
	{ value: 'JEONNAM', label: '전남' },
	{ value: 'GYEONGBUK', label: '경북' },
	{ value: 'GYEONGNAM', label: '경남' },
	{ value: 'JEJU', label: '제주' },
];
