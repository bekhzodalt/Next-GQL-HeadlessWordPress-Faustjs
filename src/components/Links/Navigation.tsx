import Link from 'next/link'
import { ReactNode } from 'react'
import style from '@styles/components/Links/Navigation.module.scss'

export default function NavigationLink({
	href,
	children,
	target = '_blank',
	rel,
	className,
	onClick,
}: {
	href: string
	children?: ReactNode
	target?: '_blank' | '_parent' | '_top' | '_self' | string
	rel?: string
	className?: string
	onClick?: (e?: any) => void
}) {
	const isExternal = !href.startsWith('/')

	const link = href.startsWith('http') ? href : `//${href}`

	const breakAt =
		href.includes('http://www.unionleague.org') ||
		href.includes('https://www.unionleague.org')

	return isExternal ? (
		<>
			{breakAt ? (
				<a
					href={link}
					target="_top"
					className={`${className} ${style.link}`}
					onClick={onClick}
				>
					{children}
				</a>
			) : (
				<a
					href={link}
					target="_blank"
					rel="noreferrer"
					className={`${className} ${style.link}`}
					onClick={onClick}
				>
					{children}
				</a>
			)}
		</>
	) : (
		<Link href={href} target={target} rel={rel}>
			<a onClick={onClick} className={`${className} ${style.link}`}>
				{children}
			</a>
		</Link>
	)
}
