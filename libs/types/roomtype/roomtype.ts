import { RoomAmenity, RoomStatus } from '../../enums/propertyRoomtype.enum';
import { TotalCounter } from '../member/member';
import { Reservation } from '../reservation/reservation';
import { StayPlan } from '../stayplan/stayplan';

export interface SPRules {
	durationHours?: string;
	windowStart: string;
	windowEnd: string;
	lastCheckInBy: string;
}

export interface RoomType {
	_id: string;
	propertyId: string;
	roomName: string;
	roomMaxPersonal: number;
	roomStandPersonal: number;
	basePriceDayUse: number;
	basePriceOvernight: number;
	roomDiscountPrice?: number;
	roomImages: string[];
	roomAmenities?: RoomAmenity[];
	roomStatus: RoomStatus;
	createdAt: Date;
	updatedAt: Date;
	/* from aggregatio */
	stayPlans?: StayPlan[];
	reservationData?: Reservation[];
}

export interface RoomTypes {
	list: RoomType[];
	metaCounter: TotalCounter[];
}
