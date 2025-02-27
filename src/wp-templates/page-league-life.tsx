import { gql, useLazyQuery } from '@apollo/client'
import { PublicLayout } from '@archipress/components'
import style from '@styles/pages/league-life.module.scss'
import { useEffect } from 'react'
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
import NavigationLink from '@archipress/components/Links/Navigation'

export function Page({ data }: { data: any }) {
	const { state, actions } = useMenuContext() as MenuContextProps

	const [getAnchors, { loading, data: anchorData, error }] =
		useLazyQuery(LLquery)

	const anchors = state.anchors

	async function GetAnchors() {
		try {
			const { data: res } = await getAnchors({
				variables: {
					llPrimarySlug: MENUS.LL_PRIMARY_ANCHOR_SLUG,
					llSecondarySlug: MENUS.LL_SECONDARY_ANCHOR_SLUG,
					menuIdType: MENUS.MENU_QUERY_SLUG,
				},
			})

			const topAnchors: MenuItemPartial[] =
				res?.llPrimaryAnchorMenu?.menuItems?.nodes ?? []

			const bottomAnchors: MenuItemPartial[] =
				res?.llSecondaryAnchorMenu?.menuItems?.nodes ?? []

			return {
				all: [...topAnchors, ...bottomAnchors],
				top: topAnchors,
				bottom: bottomAnchors,
			}
		} catch (error) {
			console.error('Failed to get league life anchors')
		}
	}

	const cards = data?.page?.leagueLifeCards.cards ?? []
	const scrollToTopCheckbox =
		data?.page?.scrollToTopCheckbox.scrollToTop ?? false

	useEffect(() => {
		if (loading || error) return

		GetAnchors().then(res => {
			actions?.setAnchors(res?.top, res?.bottom)
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [anchorData])

	return (
		<>
			<div className={style.topSection} id="topSection"></div>

			<AnchorsHeader anchors={anchors} />

			<section className={style.cards}>
				{cards.map((card: any, i: number) => {
					const contentImageUrl = card.content.image.mediaItemUrl
					const contentImageDataUrl = card.content.image.dataUrl
					const contentImageAlt = card.content.image.altText
					const contentText = card.content.text
					const contentButtons = card.content.buttons
					const cardImageUrl = card.cardImage.mediaItemUrl
					const cardImageAlt = card.cardImage.altText
					const id = card.id

					return (
						<div className={style.cardsItem} key={i} id={id}>
							<div className={style.left}>
								<div className={style.view}>
									{contentImageUrl ? (
										<Image
											priority={contentImageDataUrl ? false : true}
											placeholder={contentImageDataUrl ? 'blur' : 'empty'}
											blurDataURL={
												contentImageDataUrl ? contentImageDataUrl : ''
											}
											src={contentImageUrl}
											alt={contentImageAlt ?? 'Image'}
											width={200}
											height={200}
										/>
									) : null}

									{contentText ? (
										<div
											className={style.text}
											dangerouslySetInnerHTML={{ __html: contentText }}
										/>
									) : null}
								</div>

								{contentButtons ? (
									<div className={style.buttons}>
										{contentButtons.map(
											(
												button: {
													buttonLink: string
													buttonLabel: string
												},
												i: number
											) => {
												/*
															This is gonna look redundant and stupid but its because of how UL has a combination of
															in app nav, iframe nav, and frame breaking ... -sigh-
														*/
												if (button?.buttonLink) {
													let target, rel
													if (button.buttonLink.startsWith('http')) {
														target = button.buttonLink.startsWith(
															'https://www.unionleague.org'
														)
															? '_top'
															: '_blank'
														rel = 'noreferrer'
													} else if (button.buttonLink.startsWith('mailto')) {
														target = '_parent'
														rel = 'noreferrer noopener'
													}
													if (target) {
														return (
															<a
																key={i}
																href={button.buttonLink}
																target={target}
																rel={rel}
															>
																{button.buttonLabel}
															</a>
														)
													} else {
														return (
															<NavigationLink
																href={button.buttonLink}
																className={style.button}
																key={i}
																target={target}
																rel={rel}
															>
																{button.buttonLabel}
															</NavigationLink>
														)
													}
												}
												return null
											}
										)}
									</div>
								) : null}
							</div>

							<div className={style.right}>
								{cardImageUrl ? (
									<Image
										src={cardImageUrl}
										alt={cardImageAlt ?? 'Image'}
										fill={true}
										sizes="600px"
										priority={true}
									/>
								) : null}
							</div>
						</div>
					)
				})}
			</section>

			{scrollToTopCheckbox ? <ScrollToTopButton /> : null}
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

export const LLquery = gql`
	${MenuFragment}
	query GetLeagueLifeMenus(
		$llPrimarySlug: ID!
		$llSecondarySlug: ID!
		$menuIdType: MenuNodeIdTypeEnum
	) {
		llPrimaryAnchorMenu: menu(id: $llPrimarySlug, idType: $menuIdType) {
			menuItems {
				nodes {
					...MenuFragment
				}
			}
		}
		llSecondaryAnchorMenu: menu(id: $llSecondarySlug, idType: $menuIdType) {
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
			leagueLifeCards {
				cards {
					content {
						text
						image {
							dataUrl(size: "thumbnail")
							mediaItemUrl
						}
						buttons {
							buttonLabel
							buttonLink
						}
					}
					cardImage {
						mediaItemUrl
					}
					id
				}
			}

			scrollToTopCheckbox {
				scrollToTop
			}
		}
	}
`
