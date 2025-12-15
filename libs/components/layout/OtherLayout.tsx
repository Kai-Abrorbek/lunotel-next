import React, { useEffect } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Footer from '../Footer';
import { Stack } from '@mui/material';
import { userVar } from '../../../apollo/store';
import { useReactiveVar } from '@apollo/client';
import { getJwtToken, updateUserInfo } from '../../auth';
import OtherTop from '../OtherTop';
import { useRouter } from 'next/router';
import OtherHeader from '../OtherHeader';

const withLayoutOther = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const user = useReactiveVar(userVar);
		const router = useRouter();
		const pathname = router.pathname.replace('/', '').trim();

		/** LIFECYCLES **/
		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
		}, []);

		/** HANDLERS **/

		if (device == 'mobile') {
			return (
				<>
					<Head>
						<title>Lunotel</title>
						<meta name={'title'} content={`Lunotel`} />
					</Head>
					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<OtherHeader />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Lunotel</title>
						<meta name={'title'} content={`Lunotel`} />
					</Head>
					<Stack id="pc-wrap">
						<Stack id={'other-top'}>
							<OtherHeader />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						{pathname === 'login' ||
						pathname === 'reservation/check' ||
						pathname === 'mypage/property-management/deshboard' ? (
							<div></div>
						) : (
							<Stack id={'footer'}>
								<Footer />
							</Stack>
						)}
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutOther;
