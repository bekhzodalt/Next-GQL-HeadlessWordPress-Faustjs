import { gql, useLazyQuery } from '@apollo/client'
import { MenuFragment } from '@archipress/fragments/Menu'
import mainThemeOptions from '@archipress/themes/mainThemeOptions'
import { MenuItemPartial } from '@archipress/utilities/MenuContext'
import style from '@styles/components/Navigation/Members.module.scss'
import Image from 'next/future/image'
import Link from 'next/link'
import { useEffect } from 'react'

export default function MembersMenu({
	items,
	menuId,
	first = 20,
	className,
	rows = 4,
}: {
	items?: MenuItemPartial[]
	menuId?: string
	first?: number
	className?: string
	rows?: number
}) {
	const [query, { data }] = useLazyQuery(MembersMenu.query, {
		variables: {
			menuId,
			first,
		},
	})

	useEffect(() => {
		if (items?.length) return
		query()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const menu = items ?? (data?.menu?.menuItems?.nodes as MenuItemPartial[])

	const logo = mainThemeOptions.brand.secondLogo

	const cols = menu?.length / rows

	function getItems() {
		const els = []

		for (let i = 0; i < cols; i++) {
			els.push(
				<div className={style.col} key={i}>
					{menu?.slice(i * rows, (i + 1) * rows).map(item => (
						<Link href={item.path ?? ''} key={item.id}>
							<a>{item.label}</a>
						</Link>
					))}
				</div>
			)
		}

		return els
	}

	return (
		<nav
			className={`members-navigation ${style.members} ${
				className ? className.split(' ')?.map(cl => style[cl]) : ''
			}`}
		>
			{getItems()}

			<Image
				placeholder="blur"
				blurDataURL={logo}
				src={logo}
				alt="Dining Logo"
				width={140}
				height={140}
			/>
		</nav>
	)
}

MembersMenu.query = gql`
	${MenuFragment}
	query GetSecondaryMenuItems(
		$menuId: ID!
		$menuIdType: MenuNodeIdTypeEnum = LOCATION
		$first: Int
	) {
		menu(id: $menuId, idType: $menuIdType) {
			id
			menuItems(first: $first) {
				nodes {
					...MenuFragment
				}
			}
		}
	}
`
