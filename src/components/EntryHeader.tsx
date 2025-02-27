import className from 'classnames/bind'
import {
	Heading,
	PostInfo,
	Container,
	FeaturedImage,
} from '@archipress/components'
import styles from '@styles/components/EntryHeader.module.scss'

let cx = className.bind(styles)

export default function EntryHeader({
	title,
	image,
	date,
	author,
	className,
}: {
	title?: string
	image?: ImageData
	date?: string
	author?: string
	className?: string
}) {
	const hasText = title || date || author

	return (
		<div className={cx(['component', className])}>
			{image && (
				<FeaturedImage image={image} className={cx('image')} priority />
			)}

			{hasText && (
				<div className={cx('text', { 'has-image': image })}>
					<Container>
						{!!title && (
							<Heading
								className={cx('title')}
								level="h1"
							>
								{title}
							</Heading>
						)}
						<PostInfo className={cx('byline')} author={author} date={date} />
					</Container>
				</div>
			)}
		</div>
	)
}
