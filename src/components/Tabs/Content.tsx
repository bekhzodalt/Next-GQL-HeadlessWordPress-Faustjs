import NavigationLink from '@archipress/components/Links/Navigation'
import style from '@styles/components/Tabs/Content.module.scss'

export default function ContentTabs({
	slug,
	childPages,
}: {
	slug?: string
	childPages?: {
		title: string
		content: string
		uri: string
		slug: string
		formattedTitle: {
			title: string
		}
		menuOrder: number
	}[]
}) {
	const children = [...childPages]

	children.sort(
		(a: { menuOrder: number }, b: { menuOrder: number }) =>
			a.menuOrder - b.menuOrder
	)

	return (
		<>
			<section className={style.tabsWrapper}>
				<div className={style.tabs}>
					{children.map((child, index: number) => {
						return (
							<NavigationLink
								key={child.slug}
								href={child.uri}
								className={`${style.tab} ${
									slug === child.slug || (!slug && index == 0)
										? style.selected
										: ''
								}`}
							>
								<span
									dangerouslySetInnerHTML={{
										__html: child.formattedTitle?.title
											? child.formattedTitle?.title
											: child.title,
									}}
								></span>
							</NavigationLink>
						)
					})}
				</div>

				{children.map((child, index: number) => {
					return (
						<div
							key={child.slug}
							className={`${style.content} ${
								slug === child.slug || (!slug && index == 0)
									? style.selected
									: ''
							}`}
							dangerouslySetInnerHTML={{ __html: child.content }}
						></div>
					)
				})}
			</section>
		</>
	)
}
