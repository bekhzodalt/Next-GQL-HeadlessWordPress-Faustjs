import '../faust.config'
import React from 'react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { FaustProvider } from '@faustwp/core'
import '../styles/global.scss'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { ThemeProvider, CssBaseline } from '@mui/material'

import createEmotionCache from '../utilities/createEmotionCache'
import { getMainTheme } from '../themes/mainThemeOptions'
import { AppContextProvider } from '@archipress/utilities/AppContext'
import Head from 'next/head'
import ScrollProvider from '@archipress/utilities/ScrollContent'

interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()
const mainTheme = getMainTheme()

const MyApp: React.FunctionComponent<MyAppProps> = props => {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
	const router = useRouter()

	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
				/>
			</Head>
			<CacheProvider value={emotionCache}>
				<ThemeProvider theme={mainTheme}>
					<CssBaseline />
					<React.StrictMode>
						<FaustProvider pageProps={pageProps}>
							<AppContextProvider>
								<ScrollProvider>
									<Component {...pageProps} key={router.asPath} />
								</ScrollProvider>
							</AppContextProvider>
						</FaustProvider>
					</React.StrictMode>
				</ThemeProvider>
			</CacheProvider>
		</>
	)
}

export default MyApp
