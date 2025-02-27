import Image from 'next/future/image'
import style from '@styles/components/Instagram/Post.module.scss'

export interface IGMedia {
	id?: number
	caption?: string
	permalink?: string
	thumbnail_url?: string
	media_url?: string
}
export default function InstagramPost({
	media,
	overlay = false,
}: {
	media: IGMedia
	overlay?: boolean
}) {
	return (
		<a
			href={media?.permalink}
			className={style.post}
			target="_blank"
			rel="noreferrer"
		>
			{overlay ? (
				<div className={style.overlay}>
					<span>{media?.caption}</span>
				</div>
			) : null}

			{media?.thumbnail_url || media?.media_url ? (
				<Image
					src={media.thumbnail_url ?? media.media_url}
					width={400}
					height={400}
					alt="Instagram Post"
				/>
			) : null}
		</a>
	)
}
