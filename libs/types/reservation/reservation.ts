import { ReservationStatus } from '../../enums/reservation';
import { TotalCounter } from '../member/member';
import { Property } from '../property/property';
import { RoomType } from '../roomtype/roomtype';

export interface ReservationPriceBreakdownItem {
	date: string;
	unitPrice: number;
	qty: number;
	subtotal: number;
}

export interface type {
	guestName: string;
	guestPhone: string;
	// guestEmail: string;
}

export interface Reservation {
	_id: string;
	memberId?: string;
	propertyId?: string;
	roomTypeId?: string;
	stayPlanId?: string;
	reservationStatus?: ReservationStatus;
	reservationQty?: number;
	priceBreakdown?: ReservationPriceBreakdownItem[];
	reservationTotalPrice?: number;
	reservationCheckIn?: string;
	reservationCheckOut?: string;
	memberInfo?: type;
	reservationDate?: string;
	reservationCheckInAt?: string;
	reservationCheckOutAt?: string;
	createdAt?: Date;
	updatedAt?: Date;

	/** FROM AGGREGATE **/
	propertyData?: Property[];
	roomData?: RoomType[];
}

export interface Reservations {
	list: Reservation[];
	metaCounter: TotalCounter[];
}
