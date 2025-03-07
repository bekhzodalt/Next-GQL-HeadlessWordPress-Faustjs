import className from 'classnames/bind'
import styles from '@styles/components/ContentWrapper.module.scss'

let cx = className.bind(styles)

export default function ContentWrapper({
	content,
	children,
}: {
	content?: string
	children?: JSX.Element
}) {
	return (
		<article className={cx('component')}>
			<div dangerouslySetInnerHTML={{ __html: content ?? '' }} />
			{children}
		</article>
	)
}
