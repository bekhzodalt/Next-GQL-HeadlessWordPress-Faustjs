import {
	useEffect,
	useState,
	useRef,
	MutableRefObject,
	forwardRef,
} from 'react'
import style from '@styles/components/Carousels/BasicCarousel.module.scss'
import Image from 'next/image'
import { FormatDate, CarouselArrow } from '@archipress/components'
import { useRouter } from 'next/router'
import { useScrollContext } from '@archipress/utilities/ScrollContent'

export interface CarouselSlide {
	id?: number
	title: string
	date: string
	src: string
	content: string
	alt?: string
	order?: number
}

export interface CarouselProps {
	ref: MutableRefObject<HTMLDivElement>
	slides: CarouselSlide[]
	selectedId: number
	setSelectedId: (id: number) => void
}

const BasicCarousel = forwardRef<HTMLDivElement, CarouselProps>(
	({ slides, selectedId, setSelectedId }: CarouselProps, ref) => {
		// Component logic
		// You can use the ref object within your component

		const itemWidth = useRef(250)
		const [currentPosition, setCurrentPosition] = useState(selectedId * -250)
		const carousel = useRef(null)

		const router = useRouter()

		const post_id = useRef(null)

		function slideTo(id: number) {
			setCurrentPosition(-itemWidth.current * (id === -1 ? 0 : id))

			setSelectedId(id)
		}

		useEffect(() => {
			setCurrentPosition(-(itemWidth.current * selectedId))

			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [selectedId])

		useEffect(() => {
			post_id.current = router.query.post_id as string

			if (post_id) {
				const postId = parseInt(post_id.current)

				const selected = slides?.findIndex(s => s.id === postId)

				leagueNewsSelected.current.selected = selected

				slideTo(selected)
			}
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [router])

		const { leagueNewsSelected } = useScrollContext()

		function scrollToPrev() {
			const id = selectedId == 0 ? slides.length - 1 : selectedId - 1

			slideTo(id)

			leagueNewsSelected.current.selected =
				selectedId === 0 ? slides?.length - 1 : selectedId - 1
		}

		function scrollToNext() {
			const id = selectedId == slides.length - 1 ? 0 : selectedId + 1

			slideTo(id)

			leagueNewsSelected.current.selected =
				selectedId + 1 === slides?.length ? 0 : selectedId + 1
		}

		return (
			<div className={`${style.carousel}`} ref={carousel}>
				<div className={`${style.background}`}></div>

				<div
					ref={ref}
					className={`${style.carouselItems} carouselItems`}
					style={{ transform: `translateX(${currentPosition}px)` }}
				>
					{slides ? (
						<>
							{slides.map((slide, i) => {
								return (
									<div
										className={`${style.itemContainer} ${
											i == selectedId ? style.active : style.close
										}`}
										key={i}
										onClick={() => {
											if (leagueNewsSelected.current.selected != i) {
												if (post_id.current !== `${slide.id}`) {
													router.push({
														pathname: '/league-news',
														query: { post_id: slide.id },
													})
												} else {
													leagueNewsSelected.current.selected = i
													slideTo(i)
												}
											} else {
												leagueNewsSelected.current.selected = i
												slideTo(i)
											}
										}}
									>
										<div className={style.inner}>
											<div className={style.title}>
												<h2>{slide.title}</h2>
												<h4>
													<FormatDate date={slide.date} />
												</h4>
											</div>

											<div
												className={style.image}
												style={{
													position: 'relative',
												}}
											>
												{slide.src ? (
													<Image
														src={slide.src}
														alt={slide.alt ?? 'Carousel Slide'}
														layout="fill"
													/>
												) : null}
											</div>
										</div>
									</div>
								)
							})}
						</>
					) : null}
				</div>

				{slides?.length > 0 ? (
					<div className={`${style.actionBtns}`}>
						<div className={`${style.prevBtn}`}>
							<CarouselArrow type="left" onClick={() => scrollToPrev()} />
						</div>
						<div className={`${style.nextBtn}`}>
							<CarouselArrow type="right" onClick={() => scrollToNext()} />
						</div>
					</div>
				) : null}
			</div>
		)
	}
)

BasicCarousel.displayName = 'BasicCarousel'

export default BasicCarousel
