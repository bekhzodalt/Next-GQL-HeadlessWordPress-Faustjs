import { gql, useLazyQuery } from '@apollo/client'
import {
	PublicLayout,
	ContentCard,
	DropDownContent,
	EventCard,
} from '@archipress/components'
import style from '@styles/pages/bog.module.scss'
import { slugify } from '@archipress/utilities/functions'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { useEffect } from 'react'
import { ContentCardProps } from '@archipress/components/Card/Content'
import * as MENUS from '@archipress/constants/menus'
import { MenuFragment } from '@archipress/fragments/Menu'
import ScrollToTopButton from '@archipress/components/Buttons/ScrollToTopButton'
import Image from 'next/future/image'
import {
	MenuContextProps,
	MenuItemPartial,
	useMenuContext,
} from '@archipress/utilities/MenuContext'
import AnchorsHeader from '@archipress/components/Header/Anchors'

export function Page({ data }: { data: any }) {
	const { state } = useAppContext() as AppContextProps
	const { state: menuState, actions } = useMenuContext() as MenuContextProps

	const [getAnchors, { loading, data: anchorData, error }] =
		useLazyQuery(BOGAnchorQuery)

	async function GetAnchors() {
		try {
			const { data: res } = await getAnchors({
				variables: {
					bogPrimarySlug: MENUS.BOG_PRIMARY_ANCHOR_SLUG,
					bogSecondarySlug: MENUS.BOG_SECONDARY_ANCHOR_SLUG,
					menuIdType: MENUS.MENU_QUERY_SLUG,
				},
			})

			const topAnchors: MenuItemPartial[] =
				res?.bogPrimaryAnchorMenu?.menuItems?.nodes ?? []

			const bottomAnchors: MenuItemPartial[] =
				res?.bogSecondaryAnchorMenu?.menuItems?.nodes ?? []

			return {
				all: [...topAnchors, ...bottomAnchors],
				top: topAnchors,
				bottom: bottomAnchors,
			}
		} catch (error) {
			console.error('Failed to get league life anchors')
		}
	}

	useEffect(() => {
		if (loading || error) return
		GetAnchors().then(res => {
			actions.setAnchors(res?.top, res?.bottom)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [anchorData])

	const anchors = menuState.anchors

	// League House Locations
	const leagueHouseLocations = data?.page?.bogLeagueHouseLocations?.locations

	// Page Content
	const content = data?.page?.content

	//Location Cards
	const cards = data?.page?.locationCards.cards ?? []

	// host an event section
	const leagueHouse = data?.page?.bogLeagueHouse?.leagueHouseEvent
	const torresdale =
		data?.page?.bogTheUnionLeagueGolfClubatTorresdale
			?.theUnionLeagueGolfClubAtTorresdaleEvent
	const guardhouse =
		data?.page?.bogTheUnionLeagueGuardHouse?.theUnionLeagueGuardHouseEvent

	const libertyhill =
		data?.page?.bogUnionLeagueLibertyHill?.unionLeagueLibertyHillEvent

	const national =
		data?.page?.bogUnionLeagueNationalGolfClub?.unionLeagueNationalGolfClubEvent

	const events = [leagueHouse, torresdale, guardhouse, national, libertyhill]

	// dress code feature image
	const dressCodeFeatured =
		data?.page?.bogDressCode.dressCodeFeatureImage?.mediaItemUrl

	const dressCodeFeaturedDataURL =
		data?.page?.bogDressCode.dressCodeFeatureImage?.dataUrl

	// dress code location content
	const locations = data?.page?.bogDressCode.sections?.locations

	// dress code club policies
	const clubPolicies = data?.page?.bogDressCode.sections?.clubPolicies

	const authed = state?.loggedIn

	return (
		<>
			<div className={style.topSection} id="topSection"></div>

			<section className={style.page}>
				<AnchorsHeader
					anchors={{
						top: anchors.top,
						bottom: [],
					}}
				/>

				{cards ? (
					<div className="cards" id="accommodations">
						{cards.map((card: ContentCardProps, i: number) => (
							<ContentCard card={card} key={i} />
						))}
					</div>
				) : null}

				{content ? (
					<div
						className="bog-content"
						id="host-an-event"
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				) : null}

				{events ? (
					<>
						{events.map((event, i) => {
							return (
								<EventCard
									locations={leagueHouseLocations}
									event={event}
									key={i}
								/>
							)
						})}
					</>
				) : null}

				<div
					className="dress-code scrollMarginTop"
					id="club-policies-and-dress-code"
				>
					<h2>Dress Code</h2>

					<AnchorsHeader
						anchors={{
							top: anchors.bottom,
							bottom: [],
						}}
					/>

					{dressCodeFeatured ? (
						<Image
							priority={dressCodeFeaturedDataURL ? false : true}
							placeholder={dressCodeFeaturedDataURL ? 'blur' : 'empty'}
							blurDataURL={
								dressCodeFeaturedDataURL ? dressCodeFeaturedDataURL : ''
							}
							src={dressCodeFeatured}
							alt="Men enjoying life at Union League in proper attire"
							fill={true}
							sizes="1600px"
						/>
					) : null}

					{locations ? (
						<div className="locations">
							{locations.map(
								(
									location: {
										locationTitle: string
										locationContent: string
									},
									i: number
								) => {
									return (
										<div
											className="location scrollMarginTop"
											key={i}
											id={slugify(location.locationTitle)}
										>
											<h2 className="title">{location.locationTitle}</h2>
											<span
												className="content"
												dangerouslySetInnerHTML={{
													__html: location.locationContent,
												}}
											></span>
										</div>
									)
								}
							)}
						</div>
					) : null}

					<h2 className="scrollMarginTop" id="club-policies">
						Club Policies
					</h2>

					{clubPolicies ? (
						<div className="club-policies">
							{clubPolicies.map(
								(
									policy: {
										label: string
										content: string
										membersOnly: boolean
									},
									i: number
								) => {
									if (authed) {
										return (
											<DropDownContent
												label={policy.label}
												content={policy.content}
												key={i}
											/>
										)
									} else {
										if (!policy.membersOnly) {
											return (
												<DropDownContent
													label={policy.label}
													content={policy.content}
													key={i}
												/>
											)
										}
									}
								}
							)}
						</div>
					) : null}
				</div>
			</section>

			<ScrollToTopButton />
		</>
	)
}

export default function Component(props: any) {
	const { data } = props

	const title = data?.page?.title

	return (
		<PublicLayout
			seo={{
				title,
			}}
		>
			<Page data={data} />
		</PublicLayout>
	)
}

export const BOGAnchorQuery = gql`
	${MenuFragment}
	query GetBogAnchors(
		$bogPrimarySlug: ID!
		$bogSecondarySlug: ID!
		$menuIdType: MenuNodeIdTypeEnum
	) {
		bogPrimaryAnchorMenu: menu(id: $bogPrimarySlug, idType: $menuIdType) {
			menuItems {
				nodes {
					...MenuFragment
				}
			}
		}
		bogSecondaryAnchorMenu: menu(id: $bogSecondarySlug, idType: $menuIdType) {
			menuItems {
				nodes {
					...MenuFragment
				}
			}
		}
	}
`

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = gql`
	query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
			locationCards {
				cards {
					slideshow {
						mediaItemUrl
					}
					content {
						contentText
						buttons {
							buttonsLabel
							buttonsLink
							buttonsPdf {
								mediaItemUrl
							}
						}
						contentServices {
							contentServicesContent
							contentServicesLabel
						}
					}
				}
			}
			bogDressCode {
				dressCodeFeatureImage {
					dataUrl(size: "thumbnail")
					mediaItemUrl
				}
				sections {
					clubPolicies {
						content
						label
						membersOnly
					}
					locations {
						locationTitle
						locationContent
					}
				}
			}
			bogLeagueHouse {
				leagueHouseEvent {
					content {
						buttonLabel
						subTitle
						title
					}
					leftImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					modalContent {
						content
						downloadHere {
							label
							file {
								mediaItemUrl
							}
						}
						menus {
							label
							files {
								label
								menuFile {
									mediaItemUrl
								}
							}
						}
						requestInformation {
							label
							subject
							emailAddresses {
								name
								email
								type
							}
						}
						slideshow {
							mediaItemUrl
						}
					}
					rightImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
				}
			}
			bogLeagueHouseLocations {
				locations {
					dimensions
					floor
					location
					slug
					textContent
					title
					image {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
				}
			}
			bogTheUnionLeagueGolfClubatTorresdale {
				theUnionLeagueGolfClubAtTorresdaleEvent {
					content {
						buttonLabel
						subTitle
						title
					}
					leftImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					modalContent {
						content
						downloadHere {
							file {
								mediaItemUrl
							}
							label
						}
						menus {
							label
							files {
								label
								menuFile {
									mediaItemUrl
								}
							}
						}
						requestInformation {
							label
							subject
							emailAddresses {
								name
								email
								type
							}
						}
						slideshow {
							mediaItemUrl
						}
					}
					rightImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
				}
			}
			bogTheUnionLeagueGuardHouse {
				theUnionLeagueGuardHouseEvent {
					content {
						buttonLabel
						subTitle
						title
					}
					leftImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					modalContent {
						downloadHere {
							label
							file {
								mediaItemUrl
							}
						}
						content
						menus {
							label
							files {
								label
								menuFile {
									mediaItemUrl
								}
							}
						}
						requestInformation {
							label
							subject
							emailAddresses {
								name
								email
								type
							}
						}
						slideshow {
							mediaItemUrl
						}
					}
					rightImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					membersOnly
				}
			}
			bogUnionLeagueLibertyHill {
				unionLeagueLibertyHillEvent {
					content {
						buttonLabel
						subTitle
						title
					}
					leftImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					modalContent {
						downloadHere {
							label
							file {
								mediaItemUrl
							}
						}
						content
						menus {
							label
							files {
								label
								menuFile {
									mediaItemUrl
								}
							}
						}
						requestInformation {
							label
							subject
							emailAddresses {
								name
								email
								type
							}
						}
						slideshow {
							mediaItemUrl
						}
					}
					rightImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
				}
			}
			bogUnionLeagueNationalGolfClub {
				unionLeagueNationalGolfClubEvent {
					content {
						buttonLabel
						subTitle
						title
					}
					leftImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					modalContent {
						downloadHere {
							label
							file {
								mediaItemUrl
							}
						}
						content
						menus {
							label
							files {
								label
								menuFile {
									mediaItemUrl
								}
							}
						}
						requestInformation {
							label
							subject
							emailAddresses {
								name
								email
								type
							}
						}
						slideshow {
							mediaItemUrl
						}
					}
					rightImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
				}
			}
		}
	}
`
