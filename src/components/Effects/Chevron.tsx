import {
	faChevronDoubleDown,
	faChevronDoubleRight,
	faChevronDown,
	faChevronRight,
} from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function ChevronEffect({
	type = 'double',
	items,
	ignoreItems = false,
	opened = false,
	onClick,
	className,
}: {
	type?: 'single' | 'double'
	items?: any[]
	ignoreItems?: boolean
	opened?: boolean
	onClick?: () => void
	className?: string
}) {
	return items?.length > 0 || ignoreItems ? (
		type === 'double' ? (
			<FontAwesomeIcon
				icon={opened ? faChevronDoubleDown : faChevronDoubleRight}
				className={className}
				onClick={onClick}
			/>
		) : (
			<FontAwesomeIcon
				icon={opened ? faChevronDown : faChevronRight}
				className={className}
				onClick={onClick}
			/>
		)
	) : null
}
