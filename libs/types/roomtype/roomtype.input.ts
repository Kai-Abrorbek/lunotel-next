import { Direction } from '../../enums/common.enum';
import { RoomStatus } from '../../enums/propertyRoomtype.enum';

/** CREATE ROOM TYPE */
export interface SPRules {
	durationHours?: number;
	windowStart: string;
	windowEnd: string;
	lastCheckInBy: string;
}

export interface RoomTypeInput {
	propertyId: string;
	roomName: string;
	roomMaxPersonal: number;
	roomStandPersonal: number;
	basePriceOvernight: number;
	basePriceDayUse: number;
	roomDiscountPrice?: number;
	roombedInfo?: string;
	roomImages?: string[];
	stayPlanRules: SPRules;
}

/** ROOM SEARCH FILTER */
export interface RIsearch {
	propertyId?: string;
	roomName?: string;
	roomStatus?: RoomStatus;
	roomMaxPersonal?: number;
}

/** ROOM LIST QUERY */
export interface RoomsIquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: RIsearch;
}

export interface RoomReservationsInquiry {
	propertyId: string;
	roomTypeId: string;
	stayPlanId: string;
}
