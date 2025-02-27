import React from 'react'
import { PublicLayout } from '@archipress/components'
import style from '@styles/pages/404.module.scss'

export default function Page(): JSX.Element {
	return (
		<PublicLayout
			seo={{
				title: 'Page Not Found',
			}}
		>
			<section className={style.page}>
				<h3>Page Not Found</h3>
			</section>
		</PublicLayout>
	)
}
