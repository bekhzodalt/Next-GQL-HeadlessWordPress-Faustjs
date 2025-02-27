import { PublicLayout } from '@archipress/components'
import style from '@styles/pages/league-leadership.module.scss'
import { LeagueLeadershipDataFragment } from '@archipress/fragments/LeagueLeadership'
import { useState } from 'react'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import LoadingScreen from '@archipress/components/Effects/LoadingScreen'
import { useQuery } from '@apollo/client'
import Image from 'next/image'
import { Modal } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-solid-svg-icons'

export interface Leadership {
	title: string
	src: string
	content: string
	alt?: string
	subcategory?: string[]
	order?: number
}

export default function Component(props: any) {
	const { state } = useAppContext() as AppContextProps
	const loading = !state?.generalSettings
	const [personInfoModalOpened, setPersonInfoModalOpened] = useState(false)
	const [personInfo, setPersonInfo] = useState<Leadership>({
		title: '',
		src: '',
		content: '',
		alt: '',
		subcategory: [],
		order: 0,
	})

	if (!state?.loggedIn && !loading)
		top.location.replace('https://www.unionleague.org/members.php')

	const title = 'League Leadership'
	const [tab, setTab] = useState('BOD')

	const { data } = useQuery(LeagueLeadershipDataFragment)
	const president: Leadership = data?.president?.nodes[0] ? {
		title: data?.president?.nodes[0]?.title,
		src: data?.president?.nodes[0]?.featuredImage?.node?.mediaItemUrl,
		content: data?.president?.nodes[0]?.content,
		alt: data?.president?.nodes[0]?.alt,
	} : null

	const vicePresidents: Leadership[] = data?.vicePresidents?.nodes.map(
		(item: any) => ({
			title: item.title,
			src: item.featuredImage?.node?.mediaItemUrl,
			content: item.content,
			alt: item.alt,
			subcategory: item.categories
				.filter((category: any) => {
					if (category.parent > 0) {
						return true
					}
				})
				.map((category: any) => category.name),
			order: item.menuOrder,
		})
	)

	vicePresidents?.sort(function (a: Leadership, b: Leadership) {
		return a.order - b.order
	})

	const directors: Leadership[] = data?.directors?.nodes.map((item: any) => ({
		title: item.title,
		src: item.featuredImage?.node?.mediaItemUrl,
		content: item.content,
		alt: item.alt,
		subcategory: item.categories
			.filter((category: any) => {
				if (category.parent > 0) {
					return true
				}
			})
			.map((category: any) => category.name),
		order: item.menuOrder,
	}))

	directors?.sort(function (a: Leadership, b: Leadership) {
		return a.order - b.order
	})

	const committees: Leadership[] = data?.committees?.nodes.map((item: any) => ({
		title: item.title,
		src: item.featuredImage?.node?.mediaItemUrl,
		content: item.content,
		alt: item.alt,
		order: item.menuOrder,
	}))

	committees?.sort(function (a: Leadership, b: Leadership) {
		return a.order - b.order
	})

	const committeesPage = data?.committeesPage

	const pastPresidents: Leadership[] = data?.pastPresidents?.nodes.map(
		(item: any) => ({
			title: item.title,
			src: item.featuredImage?.node?.mediaItemUrl,
			content: item.content,
			alt: item.alt,
			subcategory: item.categories
				.filter((category: any) => {
					if (category.parent > 0) {
						return true
					}
				})
				.map((category: any) => category.name),
			order: item.menuOrder,
		})
	)

	pastPresidents?.sort(function (a: Leadership, b: Leadership) {
		return a.order - b.order
	})

	const pastPresidentsPage = data?.pastPresidentsPage

	function openPersonInfoModal(personInfo: Leadership) {
		setPersonInfoModalOpened(true)
		setPersonInfo(personInfo)
	}

	return !loading && state?.loggedIn ? (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<>
					<div className={`${style.page}`}>
						<div className={`${style.tabs}`}>
							<div
								className={`${style.tab} ${tab == 'BOD' ? style.active : ''}`}
								onClick={() => setTab('BOD')}
							>
								Board Of Directors
							</div>
							<div
								className={`${style.tab} ${tab == 'Committees' ? style.active : ''
									}`}
								onClick={() => setTab('Committees')}
							>
								Committees
							</div>
							<div
								className={`${style.tab} ${tab == 'PastPresidents' ? style.active : ''
									}`}
								onClick={() => setTab('PastPresidents')}
							>
								Past Presidents
							</div>
						</div>

						{tab == 'BOD' ? (
							<div className={`${style.bodContainer}`}>
								{president ? <div className={`${style.presidentSection} ${style.section}`}>
									<h4>President</h4>
									<div className={`${style.content}`}>
										<div
											className={`${style.left}`}
											onClick={() => openPersonInfoModal(president)}
										>
											<div className={`${style.photo}`}>
												{president.src ? (
													<Image
														src={president.src}
														alt={president.alt ?? 'Image'}
														priority={true}
														layout="fill"
													/>
												) : null}
											</div>
											<div className={`${style.text}`}>
												<h4>{president.title}</h4>
												<i>President</i>
											</div>
										</div>
										<div className={`${style.right}`}>
											<span
												dangerouslySetInnerHTML={{
													__html: president.content,
												}}
											/>
											{president.content ? (
												<label onClick={() => openPersonInfoModal(president)}>
													Read more.
												</label>
											) : null}
										</div>
									</div>
								</div> : null}

								<div
									className={`${style.vicePresidentsSection} ${style.section}`}
								>
									<h4>Vice Presidents</h4>
									<div className={`${style.content}`}>
										{vicePresidents?.map((item, i) => {
											return (
												<div
													className={`${style.item}`}
													key={i}
													onClick={() => openPersonInfoModal(item)}
												>
													<div className={`${style.photo}`}>
														{item.src ? (
															<Image
																src={item.src}
																alt={item.alt ?? 'Image'}
																priority={true}
																layout="fill"
															/>
														) : null}
													</div>
													<div className={`${style.text}`}>
														<h4>{item.title}</h4>
														<i>
															Vice President
															{item.subcategory.length > 0
																? ', ' + item.subcategory[0]
																: null}
														</i>
													</div>
												</div>
											)
										})}
									</div>
								</div>

								<div className={`${style.directorsSection} ${style.section}`}>
									<h4>Directors</h4>
									<div className={`${style.content}`}>
										{directors?.map((item, i) => {
											return (
												<div
													className={`${style.item}`}
													key={i}
													onClick={() => openPersonInfoModal(item)}
												>
													<div className={`${style.photo}`}>
														{item.src ? (
															<Image
																src={item.src}
																alt={item.alt ?? 'Image'}
																priority={true}
																layout="fill"
															/>
														) : null}
													</div>
													<div className={`${style.text}`}>
														<h4>{item.title}</h4>
														<i>
															{item.subcategory.length > 0
																? item.subcategory[0]
																: null}
														</i>
													</div>
												</div>
											)
										})}
									</div>
								</div>
							</div>
						) : null}

						{tab == 'Committees' ? (
							<div className={`${style.committeesContainer}`}>
								<div className={`${style.title}`}>
									<span
										dangerouslySetInnerHTML={{
											__html: committeesPage.content,
										}}
									/>
								</div>

								<div className={`${style.content}`}>
									{committees?.map((item, i) => {
										return (
											<div className={`${style.item}`} key={i}>
												<div className={`${style.left}`}>
													<div className={`${style.photo}`}>
														{item.src ? (
															<Image
																src={item.src}
																alt={item.alt ?? 'Image'}
																priority={true}
																layout="fill"
															/>
														) : null}
													</div>
												</div>
												<div className={`${style.right}`}>
													<h4>{item.title}</h4>
													<span
														dangerouslySetInnerHTML={{
															__html: item.content,
														}}
													/>
												</div>
											</div>
										)
									})}
								</div>
							</div>
						) : null}

						{tab == 'PastPresidents' ? (
							<div className={`${style.pastPresidentsContainer}`}>
								<div className={`${style.topSection} ${style.section}`}>
									<div className={`${style.content}`}>
										{pastPresidents?.map((item, i) => {
											return (
												<div
													className={`${style.item}`}
													key={i}
													onClick={() => openPersonInfoModal(item)}
												>
													<div className={`${style.photo}`}>
														{item.src ? (
															<Image
																src={item.src}
																alt={item.alt ?? 'Image'}
																priority={true}
																layout="fill"
															/>
														) : null}
													</div>
													<div className={`${style.text}`}>
														<h4>{item.title}</h4>
														<i>
															{item.subcategory.length > 0
																? item.subcategory[0]
																: null}
														</i>
													</div>
												</div>
											)
										})}
									</div>
								</div>

								<div className={`${style.bottomSection} ${style.section}`}>
									<span
										className={`${style.content}`}
										dangerouslySetInnerHTML={{
											__html: pastPresidentsPage.content,
										}}
									/>
								</div>
							</div>
						) : null}

						<Modal
							open={personInfoModalOpened}
							className={style.personInfoModal}
							hideBackdrop={true}
						>
							<>
								<div className={style.inner}>
									<FontAwesomeIcon
										icon={faTimes}
										className={style.close}
										onClick={() =>
											setPersonInfoModalOpened(!personInfoModalOpened)
										}
									/>
									<div className={`${style.content}`}>
										<div className={`${style.left}`}>
											<div className={`${style.photo}`}>
												{personInfo.src ? (
													<Image
														src={personInfo.src}
														alt={personInfo.alt ?? 'Image'}
														priority={true}
														layout="fill"
													/>
												) : null}
											</div>
											<div className={`${style.text}`}>
												<h4>{personInfo.title}</h4>
												<i>President</i>
											</div>
										</div>
										<div className={`${style.right}`}>
											<span
												dangerouslySetInnerHTML={{
													__html: personInfo.content,
												}}
											/>
										</div>
									</div>
								</div>

								<div
									className={style.exitArea}
									onClick={() => setPersonInfoModalOpened(false)}
								/>
							</>
						</Modal>
					</div>
				</>
			</PublicLayout>
		</>
	) : (
		<LoadingScreen />
	)
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = LeagueLeadershipDataFragment
