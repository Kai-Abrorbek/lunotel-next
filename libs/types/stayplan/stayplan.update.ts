import { StayPlanStatus, StayPlanType } from '../../enums/stayplan.enum';

export interface StayPlanUpdateInput {
	_id: string;
	stayPlanType?: StayPlanType;
	stayPlanName?: string;
	stayPlanBasePrice?: number;
	stayPlanRules?: Record<string, unknown>;
	stayPlanstatus?: StayPlanStatus;
}
