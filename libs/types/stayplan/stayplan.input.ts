import { StayPlanStatus, StayPlanType } from '../../enums/stayplan.enum';

export interface StayPlanInput {
	roomTypeId: string;
	stayPlanType: StayPlanType;
	stayPlanName: string;
	stayPlanBasePrice?: number;
	stayPlanRules: Record<string, unknown>;
	stayPlanstatus?: StayPlanStatus;
}
