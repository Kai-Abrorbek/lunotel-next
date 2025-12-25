import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { updateStorage, updateUserInfo } from '../auth';

export function useAuthSync() {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === 'loading') return;

		const jwtToken = (session?.user as any)?.accessToken;

		if (jwtToken) {
			updateStorage({ jwtToken });
			updateUserInfo(jwtToken);
		}
	}, [session, status]);
}
