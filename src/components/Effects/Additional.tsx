import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faPlus } from '@fortawesome/sharp-solid-svg-icons'

export default function AdditionalEffect({
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
			icon={opened ? (faMinus as IconProp) : (faPlus as IconProp)}
			className={className}
			onClick={onClick}
		/>
	)
}
