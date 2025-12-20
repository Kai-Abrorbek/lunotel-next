import { ReservationStatus } from '../../enums/reservation';
import { ReservationPriceBreakdownInput } from './reservation.input';
import { StayPlanType } from '../../enums/stayplan.enum';

export interface ReservationUpdateInput {
	_id: string;
	propertyId: string;
	roomTypeId: string;
	stayPlanId: string;
	reservationStatus?: ReservationStatus;
	reservationQty?: number;
	priceBreakdown?: ReservationPriceBreakdownInput[];
	reservationTotalPrice?: number;
	reservationPlanType?: StayPlanType;
	reservationCheckIn?: string;
	reservationCheckOut?: string;
	reservationDate?: string;
	reservationCheckInAt?: string;
	reservationCheckOutAt?: string;
}
