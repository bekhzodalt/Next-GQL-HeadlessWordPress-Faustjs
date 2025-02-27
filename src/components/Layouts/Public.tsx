import Layout, { LayoutClassNames } from '@archipress/components/Layouts/Layout'
import { PublicHeader, PublicFooter, MembersMenu } from '@archipress/components'
import Banner from '@archipress/components/Header/Banner'
import lstyle from '@styles/components/Layouts/Public.module.scss'
import SEO from '@archipress/components/SEO'
import LoadingScreen from '@archipress/components/Effects/LoadingScreen'

import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import MenuContextProvider from '@archipress/utilities/MenuContext'

interface Props {
	children: JSX.Element
	background?: string
	style?: {
		[key: string]: string
	}
	logo?: string
	seo?: {
		title: string
		description?: string
	}
}

export default function Component({
	children,
	background,
	style,
	logo,
	seo,
}: Props): JSX.Element {
	const defaultClasses: LayoutClassNames = {
		layout: lstyle.layout,
		content: style?.content,
		header: style?.header,
		banner: style?.header,
		footer: style?.footer,
	}
	const { state } = useAppContext() as AppContextProps

	const loading = typeof window === undefined || !state?.generalSettings

	const authed = state?.loggedIn

	return (
		<MenuContextProvider>
			<>
				<LoadingScreen loading={loading} />
				{!loading ? (
					<>
						{seo ? (
							<SEO
								title={`${state?.generalSettings?.title} - ${seo?.title || ''}`}
								description={
									seo?.description || state?.generalSettings?.description || ''
								}
							/>
						) : null}
						<Layout
							header={<PublicHeader logo={logo} />}
							banner={
								<>
									<Banner />
									{authed ? (
										<MembersMenu
											menuId="members_menu"
											className="noStyle"
											rows={3}
										/>
									) : null}
								</>
							}
							content={children}
							footer={
								<PublicFooter primary="footer" secondary="footer_secondary" />
							}
							classNames={defaultClasses}
							styles={{
								backgroundImage: background ? background : null,
							}}
						/>
					</>
				) : null}
			</>
		</MenuContextProvider>
	)
}
