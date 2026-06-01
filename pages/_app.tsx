import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useApollo } from '../apollo/client';
import { ApolloProvider } from '@apollo/client';
import { light } from '../scss/MaterialTheme';
import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import { useAuthSync } from '../libs/hooks/useAuthSync';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';

import '../scss/app.scss';
import '../scss/desktop/main.scss';
import '../scss/mobile/main.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function AuthSyncGate() {
	useAuthSync();
	return null;
}
const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);
	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SessionProvider session={session}>
					<AuthSyncGate />
					<Head>
						<link rel="stylesheet" href="https://unicons.iconscout.com/release/v4.0.8/css/line.css" />
					</Head>
					<Component {...pageProps} />
				</SessionProvider>
			</ThemeProvider>
		</ApolloProvider>
	);
};

export default appWithTranslation(App);
