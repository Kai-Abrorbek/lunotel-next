// pages/api/auth/[...nextauth].ts
import { setEngine } from 'crypto';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import { normalizeSocialProfile, signUp, signUpServer } from '../../../libs/auth';
import { use } from 'react';
import { palette } from '@mui/system';
import { MemberType } from '../../../libs/enums/member.enum';

// Naver는 커스텀 OAuth Provider로 직접 정의
const NaverProvider: any = {
	id: 'naver',
	name: 'Naver',
	type: 'oauth',
	clientId: process.env.NAVER_CLIENT_ID!,
	clientSecret: process.env.NAVER_CLIENT_SECRET!,
	authorization: 'https://nid.naver.com/oauth2.0/authorize?response_type=code',
	token: 'https://nid.naver.com/oauth2.0/token',
	userinfo: 'https://openapi.naver.com/v1/nid/me',
	profile(profile: any) {
		const resp = profile.response || profile;
		return {
			id: resp.id,
			name: resp.name || resp.nickname || 'Naver User',
			email: resp.email,
			image: resp.profile_image,
		};
	},
};
export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),

		KakaoProvider({
			clientId: process.env.KAKAO_CLIENT_ID!,
			clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
		}),

		NaverProvider,
	],

	callbacks: {
		async signIn({ account, profile }) {
			if (!account || !profile) return false;

			const payload = normalizeSocialProfile(account.provider as any, profile);
			const phone = payload.phone?.replace(/[+\-\s]/g, '') ?? '';

			const result = await signUpServer({
				memberNick: payload.nickname ?? payload.name ?? 'User',
				memberEmail: payload.email!,
				memberPassword: payload.providerId, // 네가 쓰던 방식 유지
				memberPhone: phone,
				memberType: MemberType.USER,
				memberFullName: payload.name,
				memberImage: payload.image,
			});

			if (!result?.accessToken) {
				(account as any).__authError = {
					code: 'SOCIAL_LOGIN_FAILED',
					message: result[0]?.message ?? '소셜 로그인 실패',
				};
				return false; // ✅ 통과시킴
			}
			// jwt callback으로 넘기기 (임시로 account에 담기)
			(account as any).__appAccessToken = result.accessToken;
			(account as any).__appUserId = result._id;

			return true;
		},

		async jwt({ token, account, profile }) {
			// 1) OAuth 첫 로그인 순간: provider 프로필 저장
			if (account && profile) {
				const provider = account.provider as 'google' | 'kakao' | 'naver';
				token.provider = provider;

				if (provider === 'google') {
					const p = profile as any;
					token.userId = p.sub?.toString();
					token.email = p.email;
					token.name = p.name;
					token.picture = p.picture;
				}

				if (provider === 'kakao') {
					const p = profile as any;
					const kakaoAccount = p.kakao_account ?? {};
					const kakaoProfile = kakaoAccount.profile ?? {};

					token.userId = p.id?.toString();
					token.email = kakaoAccount.email;
					token.name = kakaoAccount.name;
					token.nickname = kakaoProfile.nickname;
					token.phone_number = kakaoAccount.phone_number;
					token.birthyear = kakaoAccount.birthyear;
					token.birthday = kakaoAccount.birthday;
				}

				if (provider === 'naver') {
					const resp = (profile as any).response || profile;

					token.userId = resp.id?.toString();
					token.email = resp.email;
					token.name = resp.name;
					token.nickname = resp.nickname;
					token.mobile = resp.mobile_e164;
					token.birthyear = resp.birthyear;
					token.birthday = resp.birthday;
				}
			}

			// 2) 백엔드(GraphQL) 동기화 성공: 우리 서버 accessToken 저장
			if (account && (account as any).__appAccessToken) {
				token.accessToken = (account as any).__appAccessToken;
				token.userId = (account as any).__appUserId ?? token.userId; // 기존 userId 유지/보강
			}

			if (account && (account as any).__authError) {
				token.authError = (account as any).__authError;
			}

			return token;
		},

		async session({ session, token }) {
			if (!session.user) return session;

			(session.user as any).id = (token as any).userId;
			(session.user as any).provider = (token as any).provider;

			session.user.email = ((token as any).email as string) ?? session.user.email;
			session.user.name = ((token as any).name as string) ?? session.user.name;
			session.user.image = ((token as any).picture as string) ?? session.user.image;

			if (token.authError) {
				(session as any).authError = token.authError;
			}
			// ✅ 우리 서버 토큰도 세션에 내려줌
			(session.user as any).accessToken = (token as any).accessToken;

			// (원하면 nickname 등도 내려줄 수 있음)
			(session.user as any).nickname = (token as any).nickname;
			return session;
		},
	},
};

export default NextAuth(authOptions);
