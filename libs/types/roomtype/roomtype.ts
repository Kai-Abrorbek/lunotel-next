import { RoomStatus } from '../../enums/propertyRoomtype.enum';
import { TotalCounter } from '../member/member';
import { StayPlan } from '../stayplan/stayplan';

export interface RoomType {
	_id: string;
	propertyId: string;
	roomName: string;
	roomMaxPersonal: number;
	roomStandPersonal: number;
	basePriceDayUse: number;
	basePriceOvernight: number;
	roomDiscountPrice?: number;
	roombedInfo: string;
	roomImages: string[];
	roomStatus: RoomStatus;
	createdAt: Date;
	updatedAt: Date;
	/* from aggregatio */
	stayPlans?: StayPlan[];
}

export interface RoomTypes {
	list: RoomType[];
	metaCounter: TotalCounter[];
}
