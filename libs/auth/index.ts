import decodeJWT from 'jwt-decode';
import { initializeApollo } from '../../apollo/client';
import { userVar } from '../../apollo/store';
import { CustomJwtPayload } from '../types/customJwtPayload';
import { sweetMixinErrorAlert } from '../sweetAlert';
import { LOGIN, SIGN_UP, SOCIAL_LOGIN_OR_SIGN_UP_NOGQL } from '../../apollo/user/mutation';
import { SignupInput, SocialPayload } from '../types/member/member.input';
import { ME } from '../../apollo/user/query';

export function getJwtToken(): any {
	if (typeof window !== 'undefined') {
		return localStorage.getItem('accessToken') ?? '';
	}
}

export function setJwtToken(token: string) {
	localStorage.setItem('accessToken', token);
}

export const logIn = async (email: string, password: string): Promise<string | undefined> => {
	try {
		const { jwtToken } = await requestJwtToken({ email, password });

		if (jwtToken) {
			updateStorage({ jwtToken });
			console.log('logIn:', jwtToken);
			updateUserInfo(jwtToken);

			return jwtToken;
		}
	} catch (err) {
		console.warn('login err', err);
		// logOut();
		// throw new Error('Login Err');
	}
};

const requestJwtToken = async ({
	email,
	password,
}: {
	email: string;
	password: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: LOGIN,
			variables: { input: { memberEmail: email, memberPassword: password } },
			fetchPolicy: 'network-only',
		});

		console.log('---------- login ----------');
		const { accessToken } = result?.data?.login;

		return { jwtToken: accessToken };
	} catch (err: any) {
		console.log('request token err', err.graphQLErrors);
		switch (err.graphQLErrors[0].message) {
			case 'Definer: login and password do not match':
				await sweetMixinErrorAlert('Please check your password again');
				break;
			case 'Definer: user has been blocked!':
				await sweetMixinErrorAlert('User has been blocked!');
				break;
		}
		throw new Error('token error');
	}
};

export const signUpServer = async (input: SignupInput) => {
	const res = await fetch(process.env.LUNOTEL_API_GRAPHQL_URL!, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: SOCIAL_LOGIN_OR_SIGN_UP_NOGQL, variables: { input } }),
	});

	const json = await res.json();
	// GraphQL error
	if (!res.ok || json.errors?.length) {
		console.log('GQL errorss:', json.errors);
		return json.errors;
	}

	return json.data.socialLoginOrSignup as {
		_id: string;
		accessToken: string;
		memberEmail?: string;
		memberNick?: string;
		memberFullName?: string;
		memberImage?: string;
	};
};

export const normalizeSocialProfile = (provider: SocialPayload['provider'], profile: any): SocialPayload => {
	switch (provider) {
		case 'google': {
			return {
				provider,
				providerId: profile.sub,
				email: profile.email,
				name: profile.name,
				image: profile.picture,
			};
		}

		case 'kakao': {
			const acc = profile.kakao_account ?? {};
			const prof = acc.profile ?? {};
			return {
				provider,
				providerId: profile.id?.toString(),
				email: acc.email,
				name: acc.name,
				nickname: prof.nickname,
				phone: acc.phone_number,
				birthyear: acc.birthyear,
				birthday: acc.birthday,
			};
		}

		case 'naver': {
			const r = profile.response ?? profile;
			return {
				provider,
				providerId: r.id,
				email: r.email,
				name: r.name,
				nickname: r.nickname,
				phone: r.mobile_e164,
				birthyear: r.birthyear,
				birthday: r.birthday,
			};
		}
	}
};

export const signUp = async (
	nick: string,
	email: string,
	password: string,
	phone: string,
	type: string,
): Promise<void> => {
	try {
		const { jwtToken } = await requestSignUpJwtToken({ nick, email, password, phone, type });
		if (jwtToken) {
			updateStorage({ jwtToken });
			console.log('signUP:', jwtToken);
			updateUserInfo(jwtToken);
		}
	} catch (err) {
		console.warn('login err', err);
	}
};

const requestSignUpJwtToken = async ({
	nick,
	email,
	password,
	phone,
	type,
}: {
	nick: string;
	email: string;
	password: string;
	phone: string;
	type: string;
}): Promise<{ jwtToken: string }> => {
	const apolloClient = await initializeApollo();

	try {
		const result = await apolloClient.mutate({
			mutation: SIGN_UP,
			variables: {
				input: { memberNick: nick, memberEmail: email, memberPassword: password, memberPhone: phone, memberType: type },
			},
			fetchPolicy: 'network-only',
		});

		console.log('---------- login ----------');
		const { accessToken } = result?.data?.signup;

		return { jwtToken: accessToken };
	} catch (err: any) {
		console.log('request token err', err.graphQLErrors);
		switch (err.graphQLErrors[0].message) {
			case 'Definer: login and password do not match':
				await sweetMixinErrorAlert('Please check your password again');
				break;
			case 'Definer: user has been blocked!':
				await sweetMixinErrorAlert('User has been blocked!');
				break;
		}
		throw new Error('token error');
	}
};

export const updateStorage = ({ jwtToken }: { jwtToken: any }) => {
	setJwtToken(jwtToken);
	window.localStorage.setItem('login', Date.now().toString());
};

export const fetchMeFromServer = async (jwtToken: any) => {
	const apolloClient = await initializeApollo();
	const result = await apolloClient.query({
		query: ME,
		fetchPolicy: 'network-only',
		context: {
			headers: {
				Authorization: `Bearer ${jwtToken}`,
			},
		},
	});

	return result?.data?.me;
};

export const updateUserInfo = async (jwtToken: any) => {
	if (!jwtToken) return false;
	// const claims = decodeJWT<CustomJwtPayload>(jwtToken);
	const claims = await fetchMeFromServer(jwtToken);
	userVar({
		_id: claims._id ?? '',
		memberType: claims.memberType ?? '',
		memberStatus: claims.memberStatus ?? '',
		memberAuthType: claims.memberAuthType,
		memberPhone: claims.memberPhone ?? '',
		memberNick: claims.memberNick ?? '',
		memberEmail: claims.memberEmail ?? '',
		memberFullName: claims.memberFullName ?? '',
		memberImage:
			claims.memberImage === null || claims.memberImage === undefined
				? '/img/profile/defaultUser.svg'
				: `${claims.memberImage}`,
		memberAddress: claims.memberAddress ?? '',
		memberDesc: claims.memberDesc ?? '',
		memberProperties: claims.memberProperties,
		memberRank: claims.memberRank,
		memberArticles: claims.memberArticles,
		memberPoints: claims.memberPoints,
		memberLikes: claims.memberLikes,
		memberViews: claims.memberViews,
		memberWarnings: claims.memberWarnings,
		memberBlocks: claims.memberBlocks,
	});
};

export const logOut = () => {
	deleteStorage();
	deleteUserInfo();
	window.location.reload();
};

const deleteStorage = () => {
	localStorage.removeItem('accessToken');
	window.localStorage.setItem('logout', Date.now().toString());
};

const deleteUserInfo = () => {
	userVar({
		_id: '',
		memberType: '',
		memberStatus: '',
		memberAuthType: '',
		memberPhone: '',
		memberEmail: '',
		memberNick: '',
		memberFullName: '',
		memberImage: '',
		memberAddress: '',
		memberDesc: '',
		memberProperties: 0,
		memberRank: 0,
		memberArticles: 0,
		memberPoints: 0,
		memberLikes: 0,
		memberViews: 0,
		memberWarnings: 0,
		memberBlocks: 0,
	});
};
