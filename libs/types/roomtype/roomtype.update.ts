import { RoomAmenity, RoomStatus } from '../../enums/propertyRoomtype.enum';

export interface STPRules {
	durationHours?: string;
	windowStart?: string;
	windowEnd?: string;
	lastCheckInBy?: string;
}

export interface RoomTypeUpdate {
	_id: string;
	propertyId: string;
	roomName?: string;
	roomMaxPersonal?: number;
	roomStandPersonal?: number;
	basePriceDayUse?: number;
	basePriceOvernight?: number;
	roomDiscountPrice?: number;
	roomAmenities?: string[];
	roomImages?: string[];
	roomStatus?: RoomStatus;
	stayPlanRules?: STPRules;
}
