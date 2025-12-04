import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { useApollo } from '../apollo/client';
import { ApolloProvider } from '@apollo/client';
import { light } from '../scss/MaterialTheme';
import React, { useState } from 'react';
import { SessionProvider } from 'next-auth/react';

import '../scss/app.scss';
import '../scss/desktop/main.scss';
import '../scss/mobile/main.scss';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	// @ts-ignore
	const [theme, setTheme] = useState(createTheme(light));
	const client = useApollo(pageProps.initialApolloState);
	return (
		<ApolloProvider client={client}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<SessionProvider session={session}>
					<Component {...pageProps} />
				</SessionProvider>
			</ThemeProvider>
		</ApolloProvider>
	);
}
