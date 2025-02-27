import style from '@styles/components/Card/Zoom.module.scss'
import Image from 'next/future/image'
import { ComponentType, ElementType } from 'react'

export interface ZoomCardProps {
	label?: string
	image?: string
	dataURL?: string
	alt?: string
	className?: 'zoomCard' | 'zoomWithLabelCard'
	element?: ComponentType | keyof JSX.IntrinsicElements
}

export default function ZoomCard({
	label,
	image,
	dataURL,
	alt,
	className = 'zoomCard',
	element = 'h2',
}: ZoomCardProps) {
	const Wrapper = element
	return (
		<div
			className={`${style[className]} ${
				image && className === 'zoomCard' ? style.zoom : ''
			}`}
		>
			<div className={style.overlay}>
				{label ? <Wrapper className={style.label}>{label}</Wrapper> : null}{' '}
			</div>
			{/* {label ? <h2>{label}</h2> : null}{' '} */}
			{image ? (
				<Image
					priority={dataURL ? false : true}
					placeholder={dataURL ? 'blur' : 'empty'}
					blurDataURL={dataURL ? dataURL : ''}
					src={image}
					alt={alt ?? 'Image'}
					fill={true}
					sizes="
					(min-width: 801px) 33vw,
					(max-width: 800px) 50vw,
					(max-width: 768px) 100vw,
					"
				/>
			) : null}
			{!label && !image ? <div className={style.ghost} /> : null}
		</div>
	)
}
