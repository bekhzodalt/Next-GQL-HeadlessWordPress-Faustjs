import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import style from '@styles/components/Carousels/Carousel.module.scss'
import Image from 'next/future/image'

export interface CarouselSlide {
	src: string
	type: 'img' | 'video'
	alt?: string
	service?: string
}

export interface CarouselProps {
	slides: CarouselSlide[]
	delay?: number
	type?: 'golfCarousel' | 'carousel'
	videoType?: 'iframe' | 'video'
	className?: string
}

export default function Carousel({
	slides,
	delay = 5000,
	type = 'carousel',
	videoType = 'iframe',
	className,
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
	}

	return (
		<div
			className={`carousel ${style[type]} ${
				slides.length <= 0 ? style.noContent : ''
			} ${className}`}
		>
			{slides ? (
				<>
					{slides.map((slide, i) => {
						return slide.type === 'img' ? (
							<Image
								key={i}
								src={slide.src}
								alt={slide.alt ?? 'Carousel Slide'}
								className={i === selection ? style.active : style.notActive}
								fill={true}
								sizes="(max-width: 1600px) 100vw"
								priority={true}
							/>
						) : videoType === 'iframe' ? (
							<iframe
								allowFullScreen={true}
								className={i === selection ? style.active : ''}
								src={slide.src}
								allow="autoplay"
								key={i}
							/>
						) : (
							<video
								className={i === selection ? style.active : ''}
								autoPlay={true}
								controls={false}
								loop={true}
								muted={true}
								key={i}
								playsInline={true}
							>
								<source src={slide.src} type="video/mp4" />
							</video>
						)
					})}

					{slides.length > 0 ? (
						<div className="selectors">
							{slides.map((slide, i) => {
								return (
									<span
										key={i}
										style={{
											backgroundColor: i === selection ? 'white' : 'unset',
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
