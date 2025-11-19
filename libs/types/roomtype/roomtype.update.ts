import { RoomStatus } from '../../enums/propertyRoomtype.enum';

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
}
