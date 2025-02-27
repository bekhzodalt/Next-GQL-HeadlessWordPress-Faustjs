import { GolfPageDataFragment } from '@archipress/fragments/GolfPages'
import GolfLayout from '@archipress/components/Layouts/Golf'

export default function Component(props: any) {
	// Loading state for previews
	if (props.loading) {
		return <>Loading...</>
	}

	return <GolfLayout page={props?.data?.page} />
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = GolfPageDataFragment
