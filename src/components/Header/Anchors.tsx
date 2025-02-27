import NavigationLink from '@archipress/components/Links/Navigation'
import { useScrollTo } from '@archipress/utilities/functions'
import { MenuItemPartial } from '@archipress/utilities/MenuContext'
import style from '@styles/components/Header/Anchors.module.scss'

export default function AnchorsHeader({
	anchors,
	asLinks = false,
}: {
	anchors: {
		top: MenuItemPartial[]
		bottom: MenuItemPartial[]
	}
	asLinks?: boolean
}) {
	const scroller = useScrollTo()
	return (
		<section className={style.anchors}>
			{anchors.top ? (
				<div className={`${style.topAnchors} ${style.anchorsInner}`}>
					{anchors.top?.map((anchor, i) => {
						const url = anchor.path ?? ''
						if (!url) return
						return asLinks ? (
							<NavigationLink className={style.anchor} key={i} href={url}>
								{anchor.label}
							</NavigationLink>
						) : (
							<a
								className={style.anchor}
								key={i}
								onClick={() => scroller(anchor.path)}
							>
								{anchor.label}
							</a>
						)
					})}
				</div>
			) : null}

			{anchors.bottom ? (
				<div className={`${style.bottomAnchors} ${style.anchorsInner}`}>
					{anchors.bottom?.map((anchor, i) => {
						const url = anchor.path ?? ''
						if (!url) return
						return asLinks ? (
							<NavigationLink className={style.anchor} key={i} href={url}>
								{anchor.label}
							</NavigationLink>
						) : (
							<a
								className={style.anchor}
								key={i}
								onClick={() => scroller(anchor.path)}
							>
								{anchor.label}
							</a>
						)
					})}
				</div>
			) : null}
		</section>
	)
}
