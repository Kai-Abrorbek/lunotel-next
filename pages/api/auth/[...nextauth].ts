// pages/api/auth/[...nextauth].ts
import { setEngine } from 'crypto';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';

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
		async jwt({ token, account, profile }) {
			if (account && profile) {
				const provider = account.provider; // 'google' | 'kakao' | 'naver'
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
					token.mobile = resp.mobile_e164;
					token.name = resp.name;
					token.nickname = resp.nickname;
					token.birthday = resp.birthday;
					token.birthyear = resp.birthyear;
				}
			}
			return token;
		},

		async session({ session, token }) {
			console.log('session:', session.user);
			if (session.user) {
				(session.user as any).id = token.userId;
				(session.user as any).provider = token.provider;
				session.user.email = (token.email as string) ?? session.user.email;
				session.user.name = (token.name as string) ?? session.user.name;
				session.user.image = (token.picture as string) ?? session.user.image;
			}
			return session;
		},
	},
};

export default NextAuth(authOptions);
