import { gql } from '@apollo/client'
import MembersLayout from '@archipress/components/Layouts/Members'
import {
	useAppContext,
	AppContextProps,
} from '@archipress/utilities/AppContext'
import style from '@styles/pages/members/directory.module.scss'

export default function Component(props: any) {
	const { state } = useAppContext() as AppContextProps
	const loading = !state?.generalSettings

	if (!state?.loggedIn && !loading)
		top.location.replace('https://www.unionleague.org/members.php')

	const page = props?.data?.page

	const content = page?.content

	// const sidebarImage = page?.membersLayout?.sidebarImage?.mediaItemUrl

	return !loading && state?.loggedIn ? (
		<MembersLayout hasSideBar={false} seo={{ title: page?.title }}>
			<div
				dangerouslySetInnerHTML={{ __html: content }}
				className={style.page}
			/>
		</MembersLayout>
	) : null
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx?: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = gql`
	query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			id
			title
			content
			membersLayout {
				sidebarImage {
					mediaItemUrl
				}
			}
		}
	}
`
