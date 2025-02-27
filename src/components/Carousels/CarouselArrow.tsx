import { faAngleLeft, faAngleRight } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function CarouselArrow({
	type = 'left',
	onClick,
	className,
}: {
	type?: 'left' | 'right'
	onClick?: () => void
	className?: string
}) {
	return type === 'left' ? (
		<FontAwesomeIcon
			icon={faAngleLeft}
			className={className}
			onClick={onClick}
		/>
	) : (
		<FontAwesomeIcon
			icon={faAngleRight}
			className={className}
			onClick={onClick}
		/>
	)
}
