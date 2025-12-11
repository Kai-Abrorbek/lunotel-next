import { RoomStatus } from '../../enums/propertyRoomtype.enum';

export interface STPRules {
	durationHours?: number;
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
	roombedInfo?: string;
	roomAmenities?: string[];
	roomImages?: string[];
	roomStatus?: RoomStatus;
	stayPlanRules: STPRules;
}
