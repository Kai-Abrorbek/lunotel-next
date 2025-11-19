import { MemberStatus, MemberType } from '../../enums/member.enum';

export interface MemberUpdate {
	_id: string;

	memberNick?: string;
	memberPhone?: string;
	memberEmail?: string;
	memberPassword?: string;

	memberType?: MemberType;
	memberStatus?: MemberStatus;

	memberFullName?: string;
	memberImage?: string;
	memberAddress?: string;
	memberDesc?: string;
}
