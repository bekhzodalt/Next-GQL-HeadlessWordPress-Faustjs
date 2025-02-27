import classNames from 'classnames/bind'
import * as SELECTORS from '../constants/selectors'
import styles from '@styles/components/Main.module.scss'
import React from 'react'

let cx = classNames.bind(styles)

export default function Main({
	children,
	className,
	...props
}: {
	children?: React.ReactNode
	className?: string
	[prop: symbol]: any
}) {
	return (
		<main
			id={SELECTORS.MAIN_CONTENT_ID}
			tabIndex={-1}
			className={cx(['component', className])}
			{...props}
		>
			{children}
		</main>
	)
}
