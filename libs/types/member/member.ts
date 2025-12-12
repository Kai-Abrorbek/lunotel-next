// member.interfaces.ts

import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { Reservation } from '../reservation/reservation';

/** MEMBER BASE */
export interface Member {
	_id: string;
	memberType: MemberType;
	memberStatus: MemberStatus;
	memberAuthType: MemberAuthType;
	memberPhone: string;
	memberNick: string;
	memberEmail: string;
	memberPassword?: string;
	memberFullName?: string;
	memberImage: string;
	memberAddress?: string;
	memberDesc?: string;
	memberProperties: number;
	memberReservations?: number;
	memberComments: number;
	memberPoints: number;
	memberWarnings: number;
	memberBlocks: number;
	deletedAt?: Date;
	createdAt?: Date;
	updatedAt?: Date;

	accessToken?: string;

	/** from aggregate */
	reservationList?: Reservation[];
}

/** 메타 카운터 */
export interface TotalCounter {
	total?: number;
}

/** Members 리스트 + 메타 */
export interface Members {
	list?: Member[];
	metaCounter?: TotalCounter[];
}
