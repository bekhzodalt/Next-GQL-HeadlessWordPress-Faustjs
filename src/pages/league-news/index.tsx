import { PublicLayout } from '@archipress/components'
import { useQuery } from '@apollo/client'
import style from '@styles/pages/league-news.module.scss'
import BasicCarousel, {
	CarouselSlide,
} from '@archipress/components/Carousels/BasicCarousel'
import { useEffect, useRef, useState } from 'react'
import { FormatDate } from '@archipress/components'
import folderOpen from '../../../public/images/folder-open-light.svg'
import Image from 'next/image'
import { Modal } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faAngleLeft } from '@fortawesome/pro-solid-svg-icons'
import { useRouter } from 'next/router'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import LoadingScreen from '@archipress/components/Effects/LoadingScreen'
import NewsPostQuery from '@archipress/fragments/LeagueNews'
import Link from 'next/link'
import { useScrollContext } from '@archipress/utilities/ScrollContent'

export default function Page() {
	const [selectedId, setSelectedId] = useState(0)
	const [archivedModalOpened, setArchivedModalOpened] = useState(false)
	const [archivedArticleModalOpened, setArchivedArticleModalOpened] =
		useState(false)
	const [archivedArticleContent, setArchivedArticleContent] = useState()
	const { state } = useAppContext() as AppContextProps
	const { data } = useQuery(NewsPostQuery)

	const router = useRouter()
	const loading = !state?.generalSettings
	if (!state?.loggedIn && !loading) {
		top.location.replace(
			`https://www.unionleague.org/members.php?redirect_uri=${router.asPath}`
		)
	}

	const [slides, setSlides] = useState<{
		normal: CarouselSlide[]
		archived: CarouselSlide[]
	} | null>(null)

	const carousel = useRef<HTMLDivElement>(null)

	const post_id = router.query.post_id as string

	useEffect(() => {
		if (!data) return

		const normal: CarouselSlide[] = data?.posts?.nodes
			.filter((item: any) => {
				if (!item.categories.nodes?.some((n: any) => n.slug === 'archived')) {
					return true
				}
			})
			.map((item: any) => ({
				slug: item.slug,
				id: item.id,
				title: item.title,
				date: item.date,
				src: item.featuredImage?.node?.mediaItemUrl,
				content: item.content,
				order: item.postOrder.priority,
			}))

		normal?.sort(function (a: CarouselSlide, b: CarouselSlide) {
			var dateA = new Date(a.date).getTime()
			var dateB = new Date(b.date).getTime()

			if (a.order === b.order) {
				return dateB - dateA
			} else {
				return a.order - b.order
			}
		})

		const archived: CarouselSlide[] = data?.posts?.nodes
			.filter((item: any) => {
				if (item.categories.nodes?.some((n: any) => n.slug === 'archived')) {
					return true
				}
			})
			.map((item: any) => ({
				slug: item.slug,
				id: item.id,
				title: item.title,
				date: item.date,
				src: item.featuredImage?.node?.mediaItemUrl,
				content: item.content,
				order: item.postOrder.priority,
			}))

		archived.sort(function (a: CarouselSlide, b: CarouselSlide) {
			var dateA = new Date(a.date).getTime()
			var dateB = new Date(b.date).getTime()

			if (a.order === b.order) {
				return dateB - dateA
			} else {
				return a.order - b.order
			}
		})

		setSlides({
			normal,
			archived,
		})

		if (post_id) {
			const postId = parseInt(post_id)

			const selected = normal?.findIndex(s => s.id === postId)

			if (
				leagueNewsSelected.current.selected != (selected === -1 ? 0 : selected)
			) {
				setSelectedId(leagueNewsSelected.current.selected)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	function onClickArchivedArticle(content: any) {
		setArchivedArticleModalOpened(true)
		setArchivedArticleContent(content)
	}

	const { scrollRef, leagueNewsSelected } = useScrollContext()

	// handle layout scrolling
	useEffect(() => {
		if (typeof window !== 'undefined') {
			const layout = document.querySelector('.layout') as HTMLElement

			if (layout) {
				layout.style.scrollBehavior = 'auto'
				layout.scrollTo(0, scrollRef.current.scrollPos)

				const handleScrollPost = () => {
					scrollRef.current.scrollPos = layout.scrollTop
				}

				layout.addEventListener('scroll', handleScrollPost)

				return () => {
					layout.removeEventListener('scroll', handleScrollPost)
				}
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	})

	return state?.loggedIn && !loading ? (
		<>
			<PublicLayout>
				<>
					<div className={style.page}>
						<div className={style.newsSlider}>
							<div className={style.left}>
								<div className={style.title}>
									<h2>League News</h2>
									<h4>League Life Starts Here</h4>
								</div>

								<div className={style.newsTitles}>
									{slides ? (
										<>
											{slides?.normal?.map((slide, i) => {
												return (post_id && post_id !== `${slide.id}`) ||
													!post_id ? (
													<Link
														href={{
															pathname: '/league-news',
															query: { post_id: slide.id },
														}}
														scroll={false}
														shallow={true}
														key={i}
													>
														<a className={style.newsTitle}>
															<strong>{slide.title}</strong>
															<span>
																<FormatDate date={slide.date} />
															</span>
														</a>
													</Link>
												) : (
													<a
														className={style.newsTitle}
														key={i}
														onClick={() => setSelectedId(i)}
													>
														<strong>{slide.title}</strong>
														<span>
															<FormatDate date={slide.date} />
														</span>
													</a>
												)
											})}
										</>
									) : null}
								</div>

								<div
									className={style.archived}
									onClick={() => setArchivedModalOpened(true)}
								>
									<Image
										src={folderOpen}
										alt="Arrow"
										width={22}
										height={24}
										priority={true}
									/>
									Archived Articles
								</div>
							</div>

							{slides?.normal ? (
								<div className={style.right}>
									<BasicCarousel
										ref={carousel}
										slides={slides.normal}
										selectedId={selectedId === -1 ? 0 : selectedId}
										setSelectedId={(id: number) => {
											setSelectedId(id)
										}}
									/>
								</div>
							) : null}
						</div>

						<div className={style.newsContent}>
							<div
								className={style.inner}
								dangerouslySetInnerHTML={{
									__html:
										slides?.normal?.[selectedId === -1 ? 0 : selectedId]
											?.content,
								}}
							/>
						</div>

						<Modal
							open={archivedModalOpened}
							className={style.archivedModal}
							hideBackdrop={true}
						>
							<>
								<FontAwesomeIcon
									icon={faTimes}
									className={style.close}
									onClick={() => setArchivedModalOpened(!archivedModalOpened)}
								/>

								<div className={style.inner}>
									<div className={style.title}>Archived League News</div>

									<div className={style.items}>
										{slides?.archived ? (
											<>
												{slides?.archived?.map((item, i) => {
													return (
														<div
															className={style.item}
															key={i}
															onClick={() =>
																onClickArchivedArticle(item.content)
															}
														>
															<div className={style.left}>
																{item.src ? (
																	<Image
																		src={item.src}
																		alt={item.alt ?? 'Image'}
																		width={100}
																		height={100}
																	/>
																) : null}
															</div>
															<div className={style.right}>
																<strong>{item.title}</strong>
																<span>
																	<FormatDate date={item.date} />
																</span>
															</div>
														</div>
													)
												})}
											</>
										) : null}
									</div>
								</div>

								<div
									className={style.exitArea}
									onClick={() => setArchivedModalOpened(false)}
								/>
							</>
						</Modal>

						<Modal
							open={archivedArticleModalOpened}
							className={style.archivedArticleModal}
							hideBackdrop={true}
						>
							<>
								<FontAwesomeIcon
									icon={faAngleLeft}
									className={style.back}
									onClick={() =>
										setArchivedArticleModalOpened(!archivedArticleModalOpened)
									}
								/>

								<div className={style.inner}>
									<FontAwesomeIcon
										icon={faTimes}
										className={style.close}
										onClick={() =>
											setArchivedArticleModalOpened(!archivedArticleModalOpened)
										}
									/>
									<div
										className={style.content}
										dangerouslySetInnerHTML={{
											__html: archivedArticleContent,
										}}
									/>
								</div>

								<div
									className={style.exitArea}
									onClick={() => setArchivedArticleModalOpened(false)}
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
