import style from '@styles/components/Dining/Menu.module.scss'
import NavigationLink from '@archipress/components/Links/Navigation'
import { MenuItemPartial } from '@archipress/utilities/MenuContext'
import { nestArray } from '@archipress/utilities/functions'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import CaretEffect from '@archipress/components/Effects/Caret'
import AdditionalEffect from '@archipress/components/Effects/Additional'
import { isString, kebabCase } from 'lodash'
import ChevronEffect from '@archipress/components/Effects/Chevron'

export default function DiningMenu({
	hash,
	venues,
	className,
	toggleOpen,
}: {
	hash?: string
	venues?: MenuItemPartial[]
	className?: string
	toggleOpen?: (opened: boolean) => void
}) {
	const nested = nestArray(venues ?? [])

	const [opened, setOpened] = useState(isString(hash))

	return (
		<div className={`${style.menu} ${className}`}>
			<Button onClick={() => setOpened(!opened)}>
				Choose a Location &nbsp;
				<CaretEffect opened={opened} onClick={() => setOpened(!opened)} />
			</Button>

			<div className={`${style.venueMenu} ${opened ? style.opened : ''}`}>
				{nested?.map((venue, i) => (
					<MenuColumn
						hash={hash}
						venue={venue}
						key={i}
						toggleOpen={toggleOpen}
					/>
				))}
			</div>
		</div>
	)
}

interface Venue {
	parentId?: string
	id?: string
	path: string
	label: string
	target?: string
	childItems?: {
		nodes: Venue[]
	}
	cssClasses?: string[]
}

function MenuColumn({
	hash,
	venue,
	toggleOpen,
}: {
	hash?: string
	venue: Venue
	toggleOpen?: (opened: boolean) => void
}) {
	const [opened, setOpened] = useState(
		hash === kebabCase(venue.label.toLowerCase())
	)

	useEffect(() => {
		if (hash === kebabCase(venue.label.toLowerCase())) toggleOpen(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div
			className={`${style.column} ${opened ? style.open : ''}`}
			id={kebabCase(venue.label.toLowerCase())}
		>
			{venue.path !== '#' ? (
				<NavigationLink
					className={style[venue?.cssClasses[0]]}
					href={venue.path}
					onClick={() => {
						toggleOpen(!opened)
						setOpened(!opened)
					}}
				>
					<>
						{venue.label}

						{venue.childItems?.nodes?.length ? (
							<AdditionalEffect
								className={style.effect}
								opened={opened}
								onClick={() => {
									toggleOpen(!opened)
									setOpened(!opened)
								}}
							/>
						) : null}
					</>
				</NavigationLink>
			) : (
				<Button
					className={style[venue?.cssClasses[0]]}
					onClick={() => {
						toggleOpen(!opened)
						setOpened(!opened)
					}}
				>
					<>
						{venue.label}

						{venue.childItems?.nodes?.length ? (
							<AdditionalEffect
								className={style.effect}
								opened={opened}
								onClick={() => {
									toggleOpen(!opened)
									setOpened(!opened)
								}}
							/>
						) : null}
					</>
				</Button>
			)}

			<div className={`${style.children} ${opened ? style.open : ''}`}>
				{venue.childItems?.nodes?.map(child => {
					return (
						<NavigationLink
							key={child.id}
							href={child.path}
							className={style[child?.cssClasses[0]]}
						>
							{child.label}
						</NavigationLink>
					)
				})}
			</div>
		</div>
	)
}
