import { FormatDate } from '@archipress/components'

export default function PostInfo({
	date,
	author,
	className,
}: {
	date?: string
	author?: string
	className?: string
}) {
	if (!date && !author) {
		return null
	}

	return (
		<div className={className}>
			{date && (
				<time dateTime={date}>
					<FormatDate date={date} />
				</time>
			)}
			{date && author && <>&nbsp;</>}
			{author && <span>by {author}</span>}
		</div>
	)
}
