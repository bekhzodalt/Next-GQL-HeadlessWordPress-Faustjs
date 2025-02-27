import { useEffect, useState } from 'react'
import style from '@styles/components/golf-history.module.scss'
import ZoomCard from '@archipress/components/Card/Zoom'
import Image from 'next/future/image'

export interface VerticalSlide {
	src: string
	dataURL?: string
	title: string
	desc: string
	alt?: string
}

export default function GolfHistory({ history, historyCards }: any) {
	const [vSlide_1, setVSlide_1] = useState<VerticalSlide>({
		src: '',
		dataURL: '',
		title: '',
		desc: '',
		alt: '',
	})
	const [vSlide_2, setVSlide_2] = useState<VerticalSlide>({
		src: '',
		dataURL: '',
		title: '',
		desc: '',
		alt: '',
	})
	const [isVSlide_1, setIsVSlide_1] = useState(true)
	const [isVSlide_2, setIsVSlide_2] = useState(false)
	const [currentVSlideIndex, setCurrentVSlideIndex] = useState(0)

	const historyGridItems = history.historyGridItems ?? []

	useEffect(() => {
		setVSlide_1(vSlide_1 => ({
			...vSlide_1,
			src: historyCards[0].historyCardImage?.mediaItemUrl ?? '',
			dataURL: historyCards[0].historyCardImage?.dataUrl,
			title: historyCards[0].historyCardTitle,
			desc: historyCards[0].historyCardDesc,
			alt: `Image for ${historyCards[0].historyCardTitle}`,
		}))

		setVSlide_2(vSlide_2 => ({
			...vSlide_2,
			src: historyCards[1].historyCardImage?.mediaItemUrl ?? '',
			dataURL: historyCards[1].historyCardImage?.dataUrl,
			title: historyCards[1].historyCardTitle,
			desc: historyCards[1].historyCardDesc,
			alt: `Image for ${historyCards[1].historyCardTitle}`,
		}))
	}, [historyCards])

	function runSlide(selected: number) {
		if (currentVSlideIndex != selected && historyCards.length > selected) {
			let tempVSlide = {
				src: historyCards[selected].historyCardImage?.mediaItemUrl ?? '',
				dataURL: historyCards[selected].historyCardImage?.dataUrl,
				title: historyCards[selected].historyCardTitle,
				desc: historyCards[selected].historyCardDesc,
				alt: `Image for ${historyCards[selected].historyCardTitle}`,
			}

			if (isVSlide_1) {
				setVSlide_2(vSlide_2 => ({
					...vSlide_2,
					...tempVSlide,
				}))

				setIsVSlide_1(false)
				setIsVSlide_2(true)
			} else {
				setVSlide_1(vSlide_1 => ({
					...vSlide_1,
					...tempVSlide,
				}))

				setIsVSlide_1(true)
				setIsVSlide_2(false)
			}

			setCurrentVSlideIndex(selected)
		}
	}

	return (
		<>
			{history ? (
				<section className={style.history}>
					<h4>{history.historyTitle}</h4>

					<div
						className={style.desc}
						dangerouslySetInnerHTML={{ __html: history.historyDesc }}
					/>

					<div className={style.sliderContainer}>
						<div className={style.gridItems}>
							{historyGridItems.map((item: any, i: number) => {
								return (
									<div
										className={style.item}
										key={i}
										onClick={() => runSlide(i)}
									>
										<a>
											<ZoomCard
												label={item.historyGridLabel}
												image={item.historyGridImage?.mediaItemUrl ?? ''}
												dataURL={item.historyGridItem?.dataUrl}
												alt={`Image for ${item.historyGridLabel}`}
												className="zoomWithLabelCard"
											/>
										</a>
									</div>
								)
							})}
						</div>

						<div className={style.slider}>
							<div
								className={`${style.slide} ${isVSlide_1 ? style.slideIn : style.slideOut
									}`}
							>
								<div className={style.img}>
									{vSlide_1.src ? (
										<Image
											priority={vSlide_1.dataURL ? false : true}
											placeholder={vSlide_1.dataURL ? 'blur' : 'empty'}
											blurDataURL={vSlide_1.dataURL ? vSlide_1.dataURL : ''}
											src={vSlide_1.src}
											alt={vSlide_1.alt}
											width={700}
											height={700}
										/>
									) : null}
								</div>

								<h2>{vSlide_1.title}</h2>

								<div
									className={style.slideDesc}
									dangerouslySetInnerHTML={{ __html: vSlide_1.desc }}
								/>
							</div>

							<div
								className={`${style.slide} ${isVSlide_2 ? style.slideIn : style.slideOut
									}`}
							>
								<div className={style.img}>
									{vSlide_2.src ? (
										<Image
											priority={vSlide_2.dataURL ? false : true}
											placeholder={vSlide_2.dataURL ? 'blur' : 'empty'}
											blurDataURL={vSlide_2.dataURL ? vSlide_2.dataURL : ''}
											src={vSlide_2.src}
											alt={vSlide_2.alt}
											width={700}
											height={700}
										/>
									) : null}
								</div>

								<h2>{vSlide_2.title}</h2>

								<div
									className={style.slideDesc}
									dangerouslySetInnerHTML={{ __html: vSlide_2.desc }}
								/>
							</div>
						</div>
					</div>
				</section>
			) : null}
		</>
	)
}
