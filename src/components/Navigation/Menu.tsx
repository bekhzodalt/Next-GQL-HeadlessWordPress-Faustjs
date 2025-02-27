import style from '@styles/components/Navigation/Menu.module.scss'
import { useEffect, useState } from 'react'
import useOnMounted from '@archipress/hooks/useMounted'
import { ChevronEffect, MenuButton } from '@archipress/components'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { useScrollTo } from '@archipress/utilities/functions'
import { useRouter } from 'next/router'
import { gql, useLazyQuery } from '@apollo/client'
import { MenuFragment } from '@archipress/fragments/Menu'
import {
	MenuContextProps,
	useMenuContext,
} from '@archipress/utilities/MenuContext'
import { Fade, Modal } from '@mui/material'
import ForeteesButton from '@archipress/components/Buttons/ForeteesButton'
import NavigationLink from '@archipress/components/Links/Navigation'

export interface MenuItemPartial {
	parentId?: string
	id?: string
	path: string
	label: string
	target?: string
	childItems?: any
}

export default function MainMenu({
	type = 'membership',
	open = false,
	toggleOpen,
	primaryID,
	primaryAuthedID,
	secondaryID,
	limit = 100,
}: {
	type?: 'main' | 'membership'
	open: boolean
	toggleOpen?: () => void
	primaryID: string
	primaryAuthedID: string
	secondaryID?: string
	menuIdType?: 'SLUG' | 'LOCATION' | 'NAME' | 'ID' | 'DATABASE_ID'
	limit?: number
	advanced?: boolean
}) {
	const { state: appState, actions: appActions } =
		useAppContext() as AppContextProps

	const authed = appState.loggedIn

	const [getMenu, { data, loading, error }] = useLazyQuery(
		MainMenu.query({ authed }),
		{
			variables: {
				primary: primaryID,
				primaryAuthed: primaryAuthedID,
				secondary: secondaryID,
				first: limit,
			},
		}
	)

	const { state, actions } = useMenuContext() as MenuContextProps

	useEffect(() => {
		if (error || loading) return

		getMenu().then(({ data }) => {
			const primary: MenuItemPartial[] = data?.primary?.menuItems?.nodes || []

			const secondary: MenuItemPartial[] =
				data?.secondary?.menuItems?.nodes || []

			actions.setMenuItems(primary, secondary)
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data])

	const mounted = useOnMounted()

	const anchors = [...state.anchors.top, ...state.anchors.bottom]

	const getLinks = () => {
		return {
			primary: state.primary?.filter(
				node => typeof node.parentId === 'undefined' || node.parentId === null
			),
			secondary: state.secondary?.filter(
				node => typeof node.parentId === 'undefined' || node.parentId === null
			),
		}
	}

	const links = getLinks()

	if (!mounted || !links || appActions.loading) return null

	return (
		<Fade in={open}>
			<Modal
				open={true}
				hideBackdrop={true}
				className={`${style.menu} ${style[type]}`}
			>
				<>
					<MenuButton
						open={open}
						toggleOpen={toggleOpen}
						type="membership"
						className={style.close}
					/>
					<div className={style.menuWrapper}>
						{links?.primary?.length > 0 ? (
							<div className={style.primary}>
								{links?.primary?.map(item => {
									return (
										<SubItem
											key={item.id}
											item={item}
											toggleOpen={toggleOpen}
										/>
									)
								})}
								<div className={style.anchors}>
									{anchors &&
										anchors.map((base, b) => (
											<SubItem item={base} key={b} toggleOpen={toggleOpen} />
										))}
								</div>
							</div>
						) : null}

						{authed ? <div className={style.divider} /> : null}

						{links?.secondary?.length > 0 ? (
							<div className={style.secondary}>
								{links?.secondary?.map(item => {
									return (
										<NavigationLink href={item.path} key={item.id}>
											{item.label}
										</NavigationLink>
									)
								})}
							</div>
						) : null}

						{type === 'membership' ? (
							<NavigationLink
								href="/account/logout"
								className={style.authButton}
							>
								Logout
							</NavigationLink>
						) : null}
					</div>
				</>
			</Modal>
		</Fade>
	)
}

function SubLink({
	item,
	toggleOpen,
}: {
	item: MenuItemPartial
	toggleOpen?: () => void
}) {
	const children = item.childItems?.nodes ?? []

	const [opened, setOpen] = useState(false)

	function toggle() {
		setOpen(!opened)
	}

	const router = useRouter()

	function onClickLastSubLink(e: any) {
		const currentPath = router.asPath

		if (item.path.split('#')[0] == currentPath.split('#')[0]) e.preventDefault()

		toggleOpen()

		let url = item.path.split('#')[1]
		const element = document.getElementById(url)
		if (!element) return
		element.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<>
			<div className={style.link} key={item.id}>
				{children?.length <= 0 ? (
					item.path.toLowerCase().includes('/tee-times') ? (
						<ForeteesButton>
							<span>Tee Times</span>
						</ForeteesButton>
					) : (
						<NavigationLink
							href={item.path ?? ''}
							target={item.target}
							onClick={e => onClickLastSubLink(e)}
						>
							<span>{item.label}</span>
						</NavigationLink>
					)
				) : (
					<span onClick={toggle}>
						<span>{item.label}</span>
						<ChevronEffect type="single" items={children} opened={opened} />
					</span>
				)}

				{children && children.length > 0 ? (
					<div className={`${style.deepMenu} ${opened ? style.opened : ''}`}>
						{children?.map((child: MenuItemPartial, c: number) => {
							return (
								<SubLink item={child as any} key={c} toggleOpen={toggleOpen} />
							)
						})}
					</div>
				) : null}
			</div>
		</>
	)
}

function SubItem({
	item,
	toggleOpen,
}: {
	item: MenuItemPartial
	toggleOpen?: () => void
}) {
	const [opened, setOpen] = useState(false)

	function toggle() {
		setOpen(!opened)
	}

	const children = item.childItems?.nodes ?? []

	const hashed = item.path.startsWith('#')

	const scroller = useScrollTo()

	function toggleAndScroll(a: string) {
		scroller(a)
	}

	return (
		<>
			<div className={style.subItem}>
				{children?.length <= 0 ? (
					hashed ? (
						<span onClick={() => toggleAndScroll(item.path)}>
							<a>{item.label}</a>

							<ChevronEffect type="single" items={children} opened={opened} />
						</span>
					) : (
						<span onClick={() => toggleOpen()}>
							<NavigationLink href={item.path ?? ''} target={item.target}>
								{item.label}
							</NavigationLink>
						</span>
					)
				) : (
					<span onClick={toggle}>
						<a>{item.label}</a>

						<ChevronEffect type="single" items={children} opened={opened} />
					</span>
				)}

				{children && children.length > 0 ? (
					<div className={`${style.subMenu} ${opened ? style.opened : ''}`}>
						{children?.map((child: MenuItemPartial, c: number) => {
							return (
								<SubLink item={child as any} key={c} toggleOpen={toggleOpen} />
							)
						})}
					</div>
				) : null}
			</div>
		</>
	)
}

MainMenu.query = ({ authed }: { authed: boolean }) => gql`
	${MenuFragment}
	query GetMenuItems(
		${authed ? '$primaryAuthed: ID!' : '$primary: ID!'}
		${authed ? '$secondary: ID!' : ''}
		$menuIdType: MenuNodeIdTypeEnum = LOCATION
		$first: Int
	) {
		primary: menu(id: ${
			authed ? '$primaryAuthed' : '$primary'
		}, idType: $menuIdType) {
			id
			menuItems(first: $first) {
				nodes {
					...MenuFragment
				}
			}
		}
		${
			authed
				? `secondary: menu(id: $secondary, idType: $menuIdType) {
			id
			menuItems(first: $first) {
				nodes {
					...MenuFragment
				}
			}
		}`
				: ''
		}
	}
`
