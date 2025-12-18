export enum RoomStatus {
	AVAILABLE = 'AVAILABLE',
	UNAVAILABLE = 'UNAVAILABLE',
	OCCUPIED = 'OCCUPIED',
	CLEANING = 'CLEANING',
	MAINTENANCE = 'MAINTENANCE',
}

export const COMMENT_SORT_OPTIONS = [
	{ value: 'createdAt', label: '추천순', sort: 'createdAt', direc: 'DESC' },
	{ value: 'propertyRank_DESC', label: '평점높은순', sort: 'commentRating', direc: 'DESC' },
	{ value: 'propertyRank_ASC', label: '평점낮은순', sort: 'commentRating', direc: 'ASC' },
];
