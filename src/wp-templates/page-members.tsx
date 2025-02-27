import { gql } from '@apollo/client'
import Banner from '@archipress/components/Banner'
import MembersLayout from '@archipress/components/Layouts/Members'
import NavigationLink from '@archipress/components/Links/Navigation'
import date from '@archipress/utilities/date'
import { faCaretLeft, faCaretRight } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from '@styles/pages/members/index.module.scss'
import { useState } from 'react'
import Image from 'next/image'
import FadeCard from '@archipress/components/Card/Fade'
import {
	useAppContext,
	AppContextProps,
} from '@archipress/utilities/AppContext'

function Page({ data }: { data: any }) {
	const page = data?.page

	const content = page?.membersPage?.pageContent

	interface Banner {
		bannerLinkLeft: string
		bannerLinkRight: string
		single: boolean
		teeTimes: boolean
		bannerImageLeft: {
			mediaItemUrl: string
		}
		bannerImageRight: {
			mediaItemUrl: string
		}
	}

	interface ReservationContent {
		links: {
			link: {
				label: string
				url: string
				image: {
					mediaItemUrl: string
				}
			}
		}[]
	}

	interface GridSection {
		links: {
			label: string
			url: string
		}[]
		cards: {
			label: string
			url: string
			image: {
				mediaItemUrl: string
			}
		}[]
		banner: Banner
	}

	const banners1: Banner[] =
		content?.banners1?.map((item: any) => item?.banner) ?? []

	const banners2: Banner[] =
		content?.banners2?.map((item: any) => item?.banner) ?? []

	const reservationContent: ReservationContent = content?.reservationContent
	const links = reservationContent?.links
	const gridSection: GridSection = {
		...content?.gridSection,
		banner: content?.gridSection?.banner,
	}

	const [currentDate, updateDate] = useState({
		days: date().daysInMonth(),
		month: date().format('MMMM'),
		day: date().date(),
		date: date(),
	})

	function setDate(args: any) {
		console.log(args)
		updateDate(args)
	}

	function getDaysOfMonth() {
		const days: number[] = []

		for (let i = 1; i <= currentDate.days; i++) {
			days.push(i)
		}

		return days
	}

	return (
		<MembersLayout
			hasBgColor={false}
			hasSideBar={false}
			canSearch={false}
			seo={{ title: page?.title }}
		>
			<div className={style.page}>
				{banners1.map((banner, i) => {
					if (banner.single) {
						return (
							<Banner
								key={i}
								img={banner.bannerImageLeft?.mediaItemUrl}
								link={banner.bannerLinkLeft}
								teeTimes={banner.teeTimes}
							/>
						)
					} else {
						return (
							<Banner
								key={i}
								link={banner.bannerLinkLeft}
								img={banner.bannerImageLeft?.mediaItemUrl}
								dual={true}
								link2={banner.bannerLinkRight}
								img2={banner.bannerImageRight?.mediaItemUrl}
							/>
						)
					}
				})}

				<section className={style.reservationContent}>
					<div className={style.calendar}>
						<div className={style.action}>
							<span>{currentDate.month}</span>

							<div className={style.arrows}>
								<FontAwesomeIcon
									icon={faCaretLeft}
									onClick={() => {
										setDate({
											days: date(currentDate.date)
												.subtract(1, 'day')
												.daysInMonth(),
											day: date(currentDate.date).subtract(1, 'day').date(),
											date: date(currentDate.date).subtract(1, 'day'),
											month: date(currentDate.date)
												.subtract(1, 'day')
												.format('MMMM'),
										})
									}}
								/>

								<FontAwesomeIcon
									icon={faCaretRight}
									onClick={() => {
										setDate({
											days: date(currentDate.date).add(1, 'day').daysInMonth(),
											day: date(currentDate.date).add(1, 'day').date(),
											date: date(currentDate.date).add(1, 'day'),
											month: date(currentDate.date)
												.add(1, 'day')
												.format('MMMM'),
										})
									}}
								/>
							</div>
						</div>

						<div className={style.days}>
							<div className={style.weekdays}>
								<span>sun</span>
								<span>mon</span>
								<span>tue</span>
								<span>wed</span>
								<span>thu</span>
								<span>fri</span>
								<span>sat</span>
							</div>

							{getDaysOfMonth().map(day => (
								<span
									className={`${style.day} ${
										currentDate.day === day ? style.selected : ''
									}`}
									key={day}
									onClick={() => {
										setDate({
											...currentDate,
											day,
											date: date(currentDate.date).set('date', day),
										})
									}}
								>
									{day}
								</span>
							))}
						</div>
					</div>

					<div className={style.reservations}>
						<span className={style.label}>Reservations</span>

						<NavigationLink href="/dining">
							Click here to view your dining reservations.
						</NavigationLink>

						<div className={style.feed}>
							<span>You have no upcoming reservations.</span>
						</div>

						<div className={style.cta}>
							<span>make reservations</span>

							<NavigationLink href="/dining">Dining</NavigationLink>
							<NavigationLink href="/events">Events</NavigationLink>
						</div>
					</div>

					<div className={style.links}>
						{links.map(({ link }) => {
							return (
								<NavigationLink href={link.url ?? ''} key={link.url}>
									<>
										<h4 className={style.label}>{link.label}</h4>

										<Image
											src={link.image.mediaItemUrl}
											alt="Link background image"
											width={150}
											height={50}
											className={style.img}
										/>
									</>
								</NavigationLink>
							)
						})}
					</div>
				</section>

				{banners2.map((banner, i) => {
					if (banner.single) {
						return (
							<Banner
								key={i}
								img={banner.bannerImageLeft?.mediaItemUrl}
								link={banner.bannerLinkLeft}
								teeTimes={banner.teeTimes}
							/>
						)
					} else {
						return (
							<Banner
								key={i}
								link={banner.bannerLinkLeft}
								img={banner.bannerImageLeft?.mediaItemUrl}
								dual={true}
								link2={banner.bannerLinkRight}
								img2={banner.bannerImageRight?.mediaItemUrl}
							/>
						)
					}
				})}

				<section className={style.gridSection}>
					<div className={style.cards}>
						{gridSection.cards.map(card => {
							return (
								<FadeCard
									key={card.url}
									url={card.url}
									img={card.image?.mediaItemUrl}
									label={card.label}
								/>
							)
						})}
					</div>

					<div className={style.links}>
						{gridSection.links?.map((link, i) => {
							return (
								<NavigationLink href={link.url ?? ''} key={i}>
									<h4>{link.label}</h4>
								</NavigationLink>
							)
						})}
					</div>

					{gridSection.banner.single ? (
						<Banner
							img={gridSection.banner.bannerImageLeft?.mediaItemUrl}
							link={gridSection.banner.bannerLinkLeft}
							teeTimes={gridSection.banner.teeTimes}
						/>
					) : (
						<Banner
							img={gridSection.banner.bannerImageLeft?.mediaItemUrl}
							link={gridSection.banner.bannerLinkLeft}
							dual={true}
							img2={gridSection.banner.bannerImageRight?.mediaItemUrl}
							link2={gridSection.banner.bannerLinkRight}
						/>
					)}
				</section>
			</div>
		</MembersLayout>
	)
}

export default function Component(props: any) {
	const { state } = useAppContext() as AppContextProps
	const loading = !state?.generalSettings

	if (props?.loading) return <>...loading</>

	if (!state?.loggedIn && !loading)
		top.location.replace('https://www.unionleague.org/members.php')

	return !loading && state?.loggedIn ? <Page data={props?.data} /> : null
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		adPreview: ctx?.asPreview,
	}
}

Component.query = gql`
	query GetMembersProfilePage($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			id
			title
			content
			featuredImage {
				node {
					mediaItemUrl
				}
			}
			membersPage {
				pageContent {
					banners1 {
						banner {
							bannerLinkLeft
							bannerLinkRight
							single
							teeTimes
							bannerImageLeft {
								mediaItemUrl
							}
							bannerImageRight {
								mediaItemUrl
							}
						}
					}
					reservationContent {
						links {
							link {
								label
								url
								image {
									mediaItemUrl
								}
							}
						}
					}
					banners2 {
						banner {
							bannerImageLeft {
								mediaItemUrl
							}
							bannerImageRight {
								mediaItemUrl
							}
							bannerLinkLeft
							bannerLinkRight
							single
							teeTimes
						}
					}
					gridSection {
						banner {
							bannerImageLeft {
								mediaItemUrl
							}
							bannerImageRight {
								mediaItemUrl
							}
							bannerLinkLeft
							bannerLinkRight
							single
							teeTimes
						}
						cards {
							label
							url
							image {
								mediaItemUrl
							}
						}
						links {
							url
							label
						}
					}
				}
			}
		}
	}
`
