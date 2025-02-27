import React from 'react'
import className from 'classnames/bind'
import Heading from './Heading'
import styles from '@styles/components/Hero.module.scss'

let cx = className.bind(styles)

export default function Hero({
	title,
	level = 'h2',
	children,
	className,
}: {
	title?: string
	level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	children?: JSX.Element
	className?: string
}) {
	return (
		<div className={cx(['component', className])}>
			<Heading level={level}>
				<span className={cx('title')}>{title}</span>
			</Heading>
			{children}
		</div>
	)
}
