import { ReservationStatus } from '../../enums/reservation';
import { StayPlanType } from '../../enums/stayplan.enum';

/** MEMBER INFO */
export interface MemberInfoInput {
	guestName?: string;
	guestPhone?: string;
	// guestEmail: string;
}

/** NO-AUTH MEMBER INFO */
export interface NoAuthMemberInfoInput {
	reservationNumber: string;
	guestPhone: string;
	// guestEmail: string;
}

/** PRICE BREAKDOWN */
export interface ReservationPriceBreakdownInput {
	date: string;
	time: string;
	unitPrice: number;
	qty: number;
	subtotal: number;
}

/** CREATE RESERVATION */
export interface ReservationInput {
	propertyId?: string;
	roomTypeId?: string;
	stayPlanId?: string;
	reservationCheckIn?: string;
	reservationCheckOut?: string;
	reservationCheckInAt?: string;
	reservationCheckOutAt?: string;
	memberInfo?: MemberInfoInput;
	reservationQty?: number;
	stayPlan?: string;
	propertyName?: string;
}

/** PAGINATION */
export interface ReservationsInquiry {
	page: number;
	limit: number;
}
