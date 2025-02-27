import { createContext, ReactNode, useContext, useState } from 'react'

export const MenuContext = createContext({})

export const useMenuContext = () => useContext(MenuContext)

export interface MenuItemPartial {
	parentId?: string
	id?: string
	path: string
	label: string
	target?: string
	childItems?: any
	cssClasses?: string[]
}

export interface MenuContextState {
	primary: MenuItemPartial[]
	secondary: MenuItemPartial[]
	anchors: {
		top: MenuItemPartial[]
		bottom: MenuItemPartial[]
	}
	loaded?: boolean
	showAnchors?: boolean
}

export interface MenuContextProps {
	state: MenuContextState
	updateState: ({ ...args }) => void
	actions: {
		setMenuItems: (
			primary?: MenuItemPartial[],
			secondary?: MenuItemPartial[]
		) => void
		setAnchors: (top: MenuItemPartial[], button: MenuItemPartial[]) => void
	}
}

export default function MenuContextProvider({
	children,
}: {
	children: ReactNode
}) {
	const [state, updateState] = useState<MenuContextState>({
		primary: [],
		secondary: [],
		anchors: {
			top: [],
			bottom: [],
		},
		loaded: false,
		showAnchors: false,
	})

	/**
	 * Set the primary and or secondary items in our menu
	 * @param primary
	 * @param secondary
	 * @returns
	 */
	function setMenuItems(
		primary?: MenuItemPartial[],
		secondary?: MenuItemPartial[]
	) {
		updateState((items: MenuContextState) => ({
			...items,
			primary: primary || items.primary,
			secondary: secondary || items.secondary,
			loaded: true,
		}))
	}

	/**
	 * Set the anchor tags of the main menu
	 * @param {MenuItemPartial[]} anchors
	 */
	function setAnchors(top: MenuItemPartial[], bottom: MenuItemPartial[]) {
		updateState((items: MenuContextState) => ({
			...items,
			anchors: {
				top,
				bottom,
			},
		}))
	}

	const actions = {
		setMenuItems,
		setAnchors,
	}

	return (
		<MenuContext.Provider
			value={{
				state,
				updateState,
				actions,
			}}
		>
			{children}
		</MenuContext.Provider>
	)
}
