import { useEffect, useState } from 'react'
import style from '@styles/components/HoleCarousel.module.scss'
import Image from 'next/image'

export interface HoleCarouselSlide {
	title: string
	desc: string
	src: string
	dataURL?: string
	alt?: string
}

export interface CarouselProps {
	slides: HoleCarouselSlide[]
	delay?: number
}

export default function HoleCarousel({
	slides,
	delay = 1000000,
}: CarouselProps) {
	const [selection, setSelection] = useState(0)

	useEffect(() => {
		const timer = setInterval(() => {
			if (slides && selection < slides.length - 1) {
				setSelection(curr => curr + 1)
			} else setSelection(curr => 0)
		}, delay)

		return () => clearInterval(timer)
	}, [delay, slides, selection])

	function setSlide(selected: number) {
		setSelection(selected)
		console.log('selection', selection)
	}

	return (
		<div className={style.featuredHole}>
			{slides ? (
				<>
					{slides.map((slide, i) => {
						return (
							<div
								className={`${style.holeContainer} ${
									i == selection ? style.current : style.close
								}`}
								key={i}
							>
								<div className={style.holeLeft}>
									<h2>{slide.title}</h2>
									<div className={style.view}>
										<div>
											<div
												className={style.desc}
												dangerouslySetInnerHTML={{ __html: slide.desc }}
											/>
										</div>
									</div>
								</div>

								<div
									className={style.holeRight}
									style={{
										position: 'relative',
									}}
								>
									<Image
										priority={slide.dataURL ? false : true}
										placeholder={slide.dataURL ? 'blur' : 'empty'}
										blurDataURL={slide.dataURL ? slide.dataURL : ''}
										src={slide.src}
										alt={slide.alt ?? 'Carousel Slide'}
										layout="fill"
									/>
								</div>
							</div>
						)
					})}

					{slides.length > 0 ? (
						<div className={style.selectors}>
							{slides.map((slide, i) => {
								return (
									<span
										key={i}
										style={{
											backgroundColor: i === selection ? '#242c66' : 'unset',
										}}
										onClick={() => setSlide(i)}
									/>
								)
							})}
						</div>
					) : null}
				</>
			) : null}
		</div>
	)
}
