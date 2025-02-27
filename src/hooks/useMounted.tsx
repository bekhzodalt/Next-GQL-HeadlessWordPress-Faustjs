import { useEffect, useState } from 'react'

/**
 * Custom hook we can use to ensure code renders only on the client side
 * @example const isMounted = useClientMount() // should return true when executing on client side
 */
function useOnMounted() {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	return mounted
}

export default useOnMounted
