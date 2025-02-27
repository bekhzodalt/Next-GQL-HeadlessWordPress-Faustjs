import {
	DiningMenu,
	PublicLayout,
	ReservationDropDown,
} from '@archipress/components'
import { ReactNode, useEffect, useState } from 'react'
import style from '@styles/components/Layouts/Dining.module.scss'

import {
	ApolloQueryResult,
	gql,
	OperationVariables,
	useLazyQuery,
} from '@apollo/client'
import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import VenueContent from '@archipress/components/Venue/Content'
import ReservationModal from '@archipress/components/Reservation/Modal'
import ReservationDetailsModal from '@archipress/components/Reservation/DetailsModal'
import ReservationCancelModal from '@archipress/components/Reservation/CancelModal'
import { MenuItemPartial } from '@archipress/utilities/MenuContext'
import { DiningVenue } from '@archipress/utilities/venueInterfaces'
import LoadingScreen from '@archipress/components/Effects/LoadingScreen'
import {
	toStandardTime,
	useLayoutScrollTo,
} from '@archipress/utilities/functions'
import NavigationLink from '@archipress/components/Links/Navigation'
import Image from 'next/future/image'
import { useRouter } from 'next/router'
import day from '@archipress/utilities/date'

export function Layout({
	children,
	venueName,
	page = 'dining',
	data,
	refetch,
}: {
	children?: ReactNode
	venueName?: string
	page?: 'dining' | 'venues'
	data?: any
	refetch?: (
		variables?: Partial<OperationVariables>
	) => Promise<ApolloQueryResult<any>>
}) {
	const { state } = useReservationContext() as ReservationContextProps

	const reservations =
		state.reservations || data?.viewer?.sevenroomsReservations || []

	const venues = data?.sevenroomsVenues || []

	const venuePages = data?.venuePages?.children?.nodes || []

	const diningVenues = venuePages?.map((v: any) => ({
		name: v.title,
		party_size: v.venue.venueMaxPartySize,
		details: v.venue.venueDetailsMenu?.map((details: any) => ({ ...details })),
		logo: v.venue.venueLogo?.mediaItemUrl,
		uri: v.uri,
		slug: v.venue?.venueSlug,
		status: v.venue?.venueStatus,
		type: v.venue?.venueType,
		featuredImage: v.featuredImage?.node?.mediaItemUrl,
	}))

	const diningVenueRaw = venuePages.find(
		(v: any) => v.uri?.toLowerCase() === `/dining/venues/${venueName}/`
	)

	const diningVenue: DiningVenue = {
		name: diningVenueRaw?.title,
		party_size: diningVenueRaw?.venue?.venueMaxPartySize,
		details: diningVenueRaw?.venue.venueDetailsMenu?.map((details: any) => ({
			...details,
		})),
		slug: diningVenueRaw?.venue?.venueSlug,
		status: diningVenueRaw?.venue?.venueStatus,
		type: diningVenueRaw?.venue?.venueType,
		content: diningVenueRaw?.content,
		venueSlides: diningVenueRaw?.venue?.featuredVenueSlides?.map(
			(slide: any) => ({
				src: slide?.mediaItemUrl,
				type: slide?.mimeType?.includes('image') ? 'img' : 'video',
				alt: `${diningVenueRaw?.title} Slides`,
			})
		),
		logo: diningVenueRaw?.venue.venueLogo?.mediaItemUrl,
		featuredImage: diningVenueRaw?.featuredImage?.node?.mediaItemUrl,
	}

	const venueMenuItems =
		data?.venueMenu?.menuItems?.nodes?.filter((node: MenuItemPartial) =>
			diningVenues.find(
				(v: any) =>
					v.status.toLowerCase() !== 'private' || node.cssClasses[0] === 'main'
			)
		) || []

	const content =
		data?.diningPage?.content || data?.reservationPage?.nodes?.[0]?.content

	const specialEventLink = data?.diningPage?.dining?.specialEventLink

	const diningFeaturedImage =
		data?.diningPage?.featuredImage?.node?.mediaItemUrl

	const actUpdateSettings = data?.diningPage?.actInfoUpdateSettings

	const calendarData = {
		types: data?.diningPage?.addToCalendar?.calendarTypes,
		message: data?.diningPage?.addToCalendar?.calendarMessage,
		title: data?.diningPage?.addToCalendar?.calendarTitle,
	}

	const reservationSteps =
		data?.diningPage?.reservationProcess?.reservationSteps?.steps?.map(
			(step: any) => ({
				show: step.showStep,
				name: step.stepName,
			})
		)

	const scroller = useLayoutScrollTo()

	const [openState, setOpened] = useState<{
		opened: boolean
		opens: number
	}>({
		opened: false,
		opens: 0,
	})

	function handleMenuOpen(open: boolean) {
		let opens = openState.opens
		if (open) opens++
		else opens--

		if (opens > 0)
			setOpened({
				opened: true,
				opens,
			})
		else
			setOpened({
				opened: false,
				opens,
			})
	}

	const router = useRouter()

	const hash = router.asPath?.split('#')?.[1]

	let scrolling = false

	function scroll() {
		if (scrolling || page === 'dining') return

		scrolling = true

		scroller('#content', 250)
	}

	const sevenroomsVenue = venues?.find(
		(v: any) =>
			v.venue_url_key?.toLowerCase() === diningVenue?.slug?.toLowerCase()
	)

	const canMake =
		sevenroomsVenue && diningVenue.status?.toLowerCase() === 'open'

	return (
		<>
			<div className={style.layout} onLoad={scroll}>
				{/* {anchors ? <AnchorsHeader anchors={anchors} asLinks={true} /> : null} */}

				<div className={style.page}>
					<section className={style.diningContentMenu}>
						<div className={style.top}>
							<div className={style.left}>
								<div className={style.featuredImage}>
									{diningFeaturedImage ? (
										<Image
											src={diningFeaturedImage}
											alt="Dining Page Featured Chef"
											width={150}
											height={300}
										/>
									) : null}
								</div>

								<span dangerouslySetInnerHTML={{ __html: content }} />
							</div>

							<div className={style.right}>
								<div className={style.labels}>
									<span>Your Reservations</span>

									<NavigationLink href={specialEventLink ?? ''}>
										Special Event Dining
									</NavigationLink>
								</div>

								<div className={style.reservations}>
									<ReservationDropDown
										label="Upcoming Reservations"
										type="upcoming"
										venues={venues}
										diningVenues={diningVenues}
										reservations={reservations}
									/>

									<ReservationDropDown
										label="Canceled Reservations"
										type="canceled"
										venues={venues}
										diningVenues={diningVenues}
										reservations={reservations}
									/>

									<ReservationDropDown
										label="Past Reservations"
										type="past"
										venues={venues}
										diningVenues={diningVenues}
										reservations={reservations}
									/>

									<ReservationModal
										open={
											(state.updatedReservation?.date ||
												state.updatedReservation?.arrival_time) &&
											canMake
												? true
												: false
										}
										actUpdateSettings={actUpdateSettings}
										reservationSteps={reservationSteps}
										calendarData={calendarData}
										refetch={refetch}
									/>
									<ReservationDetailsModal />
									<ReservationCancelModal refetch={refetch} />
								</div>
							</div>
						</div>

						<DiningMenu
							hash={hash}
							venues={venueMenuItems}
							className={style.bottom}
							toggleOpen={(open: boolean) => handleMenuOpen(open)}
						/>
					</section>

					<div
						id="content"
						className={`${style.view} ${openState.opened ? style.opened : ''}`}
					>
						{children || (
							<VenueContent
								venues={venues}
								diningVenue={diningVenue}
								actUpdateSettings={actUpdateSettings}
								reservationSteps={reservationSteps}
								calendarData={calendarData}
								refetch={refetch}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default function DiningLayout({
	children,
	page,
	venueName,
	seo,
}: {
	children?: ReactNode
	page?: 'dining' | 'venues'
	venueName?: string
	seo?: {
		title: string
		description?: string
	}
}) {
	const { state } = useReservationContext() as ReservationContextProps

	const [query, { data, loading, refetch }] = useLazyQuery(DiningLayout.query)

	const { updateState } = useReservationContext() as ReservationContextProps

	const client = data?.viewer?.sevenroomsClient

	const venues = data?.sevenroomsVenues || []

	const venuePages = data?.venuePages?.children?.nodes || []

	const diningVenueRaw = venuePages.find(
		(v: any) => v.uri?.toLowerCase() === `/dining/venues/${venueName}/`
	)

	const diningVenue: DiningVenue = {
		name: diningVenueRaw?.title,
		party_size: diningVenueRaw?.venue?.venueMaxPartySize,
		details: diningVenueRaw?.venue.venueDetailsMenu?.map((details: any) => ({
			...details,
		})),
		slug: diningVenueRaw?.venue?.venueSlug,
		status: diningVenueRaw?.venue?.venueStatus,
		type: diningVenueRaw?.venue?.venueType,
		content: diningVenueRaw?.content,
		venueSlides: diningVenueRaw?.venue?.featuredVenueSlides?.map(
			(slide: any) => ({
				src: slide?.mediaItemUrl,
				type: slide?.mimeType?.includes('image') ? 'img' : 'video',
				alt: `${diningVenueRaw?.title} Slides`,
			})
		),
		logo: diningVenueRaw?.venue.venueLogo?.mediaItemUrl,
		featuredImage: diningVenueRaw?.featuredImage?.node?.mediaItemUrl,
	}

	const reservations =
		state.reservations || data?.viewer?.sevenroomsReservations || []

	const client_tags = data?.viewer?.sevenroomsClient?.client_tags?.filter(
		(t: any) => t.group.toLowerCase().includes('dietary restrictions')
	)

	const tags = client_tags

	const router = useRouter()

	useEffect(() => {
		if (!data) return

		const date = Array.isArray(router?.query.date)
			? router?.query.date[0]
			: router?.query.date

		let time = Array.isArray(router?.query.time)
			? router?.query.time[0]
			: router?.query.time

		time = time && toStandardTime(time)

		const sevenroomsVenue = venues?.find(
			(v: any) =>
				v.venue_url_key?.toLowerCase() === diningVenue?.slug?.toLowerCase()
		)

		updateState((cur: ReservationContextState) => ({
			...cur,
			reservations: reservations,
			tags: tags
				? {
						client_tags: tags,
						initial_tags: tags,
				  }
				: cur.tags,
			client: client || cur.client,
			diningVenue,
			venue: sevenroomsVenue,
			updatedReservation: {
				...state.updatedReservation,
				max_guests: state.updatedReservation?.max_guests ?? 1,
				date:
					date && day(date).isValid()
						? day(date).format('YYYY-MM-DD')
						: state.updatedReservation?.date,
				arrival_time: time ? time : state.updatedReservation?.arrival_time,
			},
		}))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, router])

	useEffect(() => {
		query()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const venueTitle = venuePages.find(
		(v: any) => v.uri?.toLowerCase() === `/dining/venues/${venueName}/`
	)?.title

	return (
		<>
			<LoadingScreen loading={loading} />

			<PublicLayout seo={venueTitle ? { title: venueTitle } : seo}>
				<Layout
					venueName={page === 'dining' ? 'cafe-meredith' : venueName}
					data={data}
					page={page}
					refetch={refetch}
				>
					{children}
				</Layout>
			</PublicLayout>
		</>
	)
}

DiningLayout.variables = ({ databaseId }: { databaseId: string }) => {
	return {
		databaseId,
		asPreview: false,
	}
}

DiningLayout.query = gql`
	query GetDiningData {
		diningPage: page(id: "dining", idType: URI) {
			id
			title
			content
			dining {
				specialEventLink
				backgroundImage {
					mediaItemUrl
				}
			}
			actInfoUpdateSettings {
				confirmationMessage
				subject
				templateName
				toEmailAddress
				toName
			}
			reservationProcess {
				reservationSteps {
					steps {
						showStep
						stepName
					}
				}
			}
			addToCalendar {
				calendarMessage
				calendarTypes
				calendarTitle
			}
			featuredImage {
				node {
					mediaItemUrl
				}
			}
		}
		reservationPage: pages(where: { name: "reservations" }) {
			nodes {
				id
				content
				featuredImage {
					node {
						dataUrl
						mediaItemUrl
					}
				}
			}
		}

		sevenroomsVenues {
			address
			id
			name
			venue_group_name
			venue_group_id
			venue_url_key
		}

		venuePages: pageBy(uri: "/dining/venues/") {
			children(first: 20) {
				nodes {
					... on Page {
						id
						title
						content
						uri
						venue {
							venueSlug
							venueStatus
							venueType
							venueMaxPartySize
							venueDetailsMenu {
								label
								url
								content
							}
							venueLogo {
								mediaItemUrl
							}
							featuredVenueSlides {
								mimeType
								mediaItemUrl
							}
						}

						featuredImage {
							node {
								dataUrl
								mediaItemUrl
							}
						}
					}
				}
			}
		}

		venueMenu: menu(id: "venues", idType: LOCATION) {
			id
			menuItems(first: 30) {
				nodes {
					cssClasses
					path
					label
					parentId
					id
				}
			}
		}

		viewer {
			id
			sevenroomsReservations(days_ahead: 90, days_behind: 30) {
				access_persistent_id
				client_id
				client_reference_code
				client_requests
				date
				max_guests
				arrival_time
				id
				reference_code
				status
				venue_id
				venue_seating_area_name
				shift_persistent_id
				email
			}
			sevenroomsClient {
				id
				phone_number
				email
				client_tags {
					group
					tag
				}
			}
		}
	}
`
