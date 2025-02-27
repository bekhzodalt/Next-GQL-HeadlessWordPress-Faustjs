import style from '@styles/components/Footer/Public.module.scss'
import useOnMounted from '@archipress/hooks/useMounted'
import { gql, useLazyQuery } from '@apollo/client'
import { MenuFragment } from '@archipress/fragments/Menu'
import { useEffect, useState } from 'react'
import NavigationLink from '@archipress/components/Links/Navigation'

import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'

export interface FeedbackPageData {
	subject: string
	emailAddresses: {
		name: string
		email: string
		type: string
	}[]
	authenticationRequired: boolean
}

export default function PublicFooter({
	primary,
	secondary,
	limit = 20,
}: {
	primary?: string
	secondary?: string
	limit?: number
}) {
	const { state } = useAppContext() as AppContextProps
	const authed = state?.loggedIn

	const year = new Date().getFullYear()
	const mounted = useOnMounted()
	const [getFooterMenu, { loading, data, error }] =
		useLazyQuery(FooterMenuQuery)

	const [menuItems, setMenuItems] = useState({
		primary: [],
		secondary: [],
	})

	const [feedback, setFeedback] = useState<FeedbackPageData>({
		subject: '',
		emailAddresses: [],
		authenticationRequired: true,
	})

	async function GetFooterMenu() {
		try {
			const { data } = await getFooterMenu({
				variables: {
					primary,
					secondary,
					first: limit,
				},
			})

			const p = data?.primary?.menuItems?.nodes || []
			const s = data?.secondary?.menuItems?.nodes || []
			const feedback: FeedbackPageData = data?.feedbackPage?.feedback

			return {
				menuItems: {
					primary: p,
					secondary: s,
				},
				feedback: feedback,
			}
		} catch (error) {
			console.error('Failed to get footer menu:', error)
		}
	}

	useEffect(() => {
		if (loading || error) return
		GetFooterMenu().then(res => {
			setMenuItems(res.menuItems)
			setFeedback(res.feedback)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const canShowFeedback =
		feedback?.authenticationRequired && !authed
			? false
			: feedback?.authenticationRequired && authed
			? true
			: !feedback?.authenticationRequired
			? true
			: true

	if (!mounted) return null

	return (
		<footer className={style.footer}>
			<ul className="links highlighted">
				{menuItems.primary &&
					menuItems.primary
						?.filter(item => item && item.label?.toLowerCase() !== 'secondary')
						.map((link, i) => {
							if (link.label == 'Feedback') {
								return canShowFeedback ? (
									<li key={i}>
										<NavigationLink href={link.path ?? ''}>
											{link.label}
										</NavigationLink>
									</li>
								) : null
							} else if (link.cssClasses?.includes('authed')) {
								return authed ? (
									<li key={i}>
										<NavigationLink href={link.path ?? ''}>
											{link.label}
										</NavigationLink>
									</li>
								) : null
							} else {
								return (
									<li key={i}>
										<NavigationLink href={link.path ?? ''}>
											{link.label}
										</NavigationLink>
									</li>
								)
							}
						})}
			</ul>

			<ul className="links">
				{menuItems.secondary &&
					menuItems.secondary?.map((link: any, i: number) => {
						return (
							<li key={i}>
								<NavigationLink href={link.path ?? ''}>
									{link.label}
								</NavigationLink>
							</li>
						)
					})}
			</ul>

			<div className="info">
				<span>©{year} The Union League of Philadelphia.</span>
				<span>
					140 South Broad Street, Philadelphia, PA 19102 •
					<a href="tel:2155636500">215-563-6500</a>
				</span>
			</div>
		</footer>
	)
}

export const FooterMenuQuery = gql`
	${MenuFragment}
	query GetFooterMenu(
		$primary: ID!
		$secondary: ID!
		$menuIdType: MenuNodeIdTypeEnum = LOCATION
		$first: Int
	) {
		primary: menu(id: $primary, idType: $menuIdType) {
			menuItems(first: $first) {
				nodes {
					...MenuFragment
				}
			}
		}
		secondary: menu(id: $secondary, idType: $menuIdType) {
			menuItems(first: $first) {
				nodes {
					...MenuFragment
				}
			}
		}
		feedbackPage: page(id: "feedback", idType: URI) {
			feedback {
				authenticationRequired
			}
		}
	}
`
