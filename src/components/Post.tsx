import Link from 'next/link'
import FeaturedImage from '@archipress/components/FeaturedImage'
import PostInfo from '@archipress/components/PostInfo'
import styles from '@styles/components/Post.module.scss'

export default function Post({
	title,
	content,
	date,
	author,
	uri,
	featuredImage,
}: {
	title?: string
	content?: string
	date?: string
	author?: string
	uri?: string
	featuredImage?: any
}) {
	return (
		<article className={styles.component}>
			{featuredImage && (
				<Link href={uri}>
					<a>
						<FeaturedImage
							image={featuredImage}
							layout="responsive"
							className={styles.featuredImage}
						/>
					</a>
				</Link>
			)}

			<Link href={uri}>
				<a>
					<h2>{title}</h2>
				</a>
			</Link>
			<PostInfo date={date} author={author} className={styles.postInfo} />
			<div
				className={styles.content}
				dangerouslySetInnerHTML={{ __html: content }}
			/>
		</article>
	)
}
