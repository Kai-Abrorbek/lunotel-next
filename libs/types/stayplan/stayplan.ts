import { StayPlanStatus, StayPlanType } from '../../enums/stayplan.enum';
import { Inventory } from '../inventory/inventory';
import { TotalCounter } from '../member/member';

export interface StayPlan {
	_id: string;
	roomTypeId: string;

	stayPlanType: StayPlanType;
	stayPlanName: string;

	stayPlanBasePrice?: number;

	stayPlanRules: Record<string, unknown>;

	stayPlanstatus: StayPlanStatus;

	createdAt?: Date;
	updatedAt?: Date;

	/* from aggregatio */
	inventories?: Inventory[];
}

export interface StayPlans {
	list: StayPlan[];
	metaCounter: TotalCounter[];
}
