import { ComponentType, ReactNode, useState } from 'react'
import style from '@styles/components/Card/Flip.module.scss'
import Image from 'next/future/image'

export interface FlipCardProps {
	label?: string
	image?: string
	dataURL?: string
	alt?: string
	desc?: string
	canFlip?: boolean
	link?: string
	element?: ComponentType | keyof JSX.IntrinsicElements
}

export default function FlipCard({
	label,
	image,
	dataURL,
	alt,
	desc,
	canFlip = true,
	element = 'h2',
}: FlipCardProps) {
	const [isFront, setIsFront] = useState(true)
	const onClick = () => (canFlip ? setIsFront(!isFront) : null)
	const Wrapper = element
	return (
		<div
			className={`${style.flipCard} ${isFront ? '' : style.flip}`}
			onClick={onClick}
		>
			<div className={`${style.flipCardInner}`}>
				<div className={`${style.front} ${image ? style.zoom : ''}`}>
					{label ? <Wrapper className={style.label}>{label}</Wrapper> : null}{' '}
					{image ? (
						<Image
							priority={dataURL ? false : true}
							placeholder={dataURL ? 'blur' : 'empty'}
							blurDataURL={dataURL ? dataURL : ''}
							src={image}
							alt={alt ?? 'Image'}
							fill={true}
							sizes="600px"
						/>
					) : null}
					{!label && !image ? <div className={style.ghost} /> : null}
				</div>

				<div className={style.back}>
					{label ? (
						<span
							className={style.desc}
							dangerouslySetInnerHTML={{
								__html: desc,
							}}
						/>
					) : null}
				</div>
			</div>
		</div>
	)
}
