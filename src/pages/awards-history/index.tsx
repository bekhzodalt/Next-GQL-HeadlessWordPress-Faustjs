import { gql, useQuery } from '@apollo/client'
import MembersLayout from '@archipress/components/Layouts/Members'
import ContentTabs from '@archipress/components/Tabs/Content'
import style from '@styles/pages/awards-history/index.module.scss'

export default function Page(props: any) {
	const { data } = useQuery(AwardsHistoryQuery)
	const page = data?.page
	const children = page?.children?.nodes ?? []

	return (
		<MembersLayout
			hasBgColor={false}
			canSearch={false}
			hasSideBar={false}
			seo={{ title: page?.title }}
		>
			<section className={style.page}>
				<h1>{page?.title}</h1>
				<ContentTabs childPages={children} />
			</section>
		</MembersLayout>
	)
}

export const AwardsHistoryQuery = gql`
	query GetAwardsHistoryPageData {
		page(id: "awards-history", idType: URI) {
			title
			children {
				nodes {
					... on Page {
						title
						content
						slug
						uri
						formattedTitle {
							title
						}
						menuOrder
					}
				}
			}
		}
	}
`
