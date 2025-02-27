import {
	faCaretCircleLeft,
	faCaretCircleDown,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CaretCircleEffect({
	opened = false,
	onClick,
}: {
	opened?: boolean
	onClick?: () => void
}) {
	return (
		<FontAwesomeIcon
			icon={opened ? faCaretCircleDown : faCaretCircleLeft}
			onClick={onClick}
		/>
	)
}
