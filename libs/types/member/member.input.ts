// member.interfaces.ts

import { MemberStatus, MemberType } from '../../enums/member.enum';
import { Direction } from '../../enums/common.enum';
import { introspectionFromSchema } from 'graphql';

/** SIGNUP */
export interface SignupInput {
	memberNick: string;
	memberPhone: string;
	memberPassword: string;
	memberEmail: string;
	memberFullName?: string;
	memberType?: MemberType;
	memberImage?: string;
	memberStatus?: MemberStatus;
}

export interface SocialPayload {
	provider: 'google' | 'kakao' | 'naver';
	providerId: string;
	email?: string;
	name?: string;
	nickname?: string;
	phone?: string;
	birthyear?: string;
	birthday?: string;
	image?: string;
}

/** LOGIN */
export interface LoginInput {
	memberNick: string;
	memberPassword: string;
}

/** AGENT 검색용 */
export interface AIsearch {
	text?: string;
}

export interface AgentsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: AIsearch;
}

/** ADMIN 회원 검색용 */
export interface MIsearch {
	memberType?: MemberType;
	memberStatus?: MemberStatus;
	text?: string;
}

export interface MembersInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search?: MIsearch;
}
