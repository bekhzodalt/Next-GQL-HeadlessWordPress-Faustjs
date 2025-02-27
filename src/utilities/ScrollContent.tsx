import {
	MutableRefObject,
	ReactNode,
	createContext,
	useContext,
	useRef,
} from 'react'

export const scrollContext = createContext({})

export const useScrollContext = () => useContext(scrollContext) as ScrollProps

export interface ScrollProps {
	scrollRef: MutableRefObject<{
		scrollPos: number
	}>
	leagueNewsSelected: MutableRefObject<{
		selected: number
	}>
}

export default function ScrollProvider({ children }: { children: ReactNode }) {
	const scrollRef = useRef({
		scrollPos: 0,
	})

	const leagueNewsSelected = useRef({
		selected: 0,
	})

	return (
		<scrollContext.Provider
			value={{
				scrollRef,
				leagueNewsSelected,
			}}
		>
			{children}
		</scrollContext.Provider>
	)
}
