import { faCaretRight, faCaretDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CaretEffect({
	opened = false,
	onClick,
	className,
}: {
	opened?: boolean
	onClick: () => void
	className?: string
}) {
	return (
		<FontAwesomeIcon
			icon={opened ? faCaretDown : faCaretRight}
			onClick={onClick}
			className={className}
		/>
	)
}
