export default function FormatDate({ date }: { date: string }) {
	let formattedDate = new Date(date)

	if (isNaN(formattedDate.valueOf())) {
		return null
	}

	return (
		<>
			{formattedDate.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour12: false,
			})}
		</>
	)
}
