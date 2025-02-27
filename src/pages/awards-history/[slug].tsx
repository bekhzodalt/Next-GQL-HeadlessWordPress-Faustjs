import { useQuery } from '@apollo/client'
import MembersLayout from '@archipress/components/Layouts/Members'
import ContentTabs from '@archipress/components/Tabs/Content'
import { AwardsHistoryQuery } from '@archipress/pages/awards-history'
import apolloClient from '@archipress/utilities/ApolloClient'
import style from '@styles/pages/awards-history/children.module.scss'
import { useRouter } from 'next/router'

export default function AwardHistoryTab(props: any) {
	const { data } = useQuery(AwardsHistoryQuery)
	const page = data?.page
	const children = page?.children?.nodes ?? []
	const router = useRouter()
	let { slug } = router.query

	// if slug is an array, but not a string, then we need to get the last query param
	if (typeof slug !== 'string' && Array.isArray(slug)) {
		slug = slug[slug.length - 1]
	}

	const selectedPage = children.find(
		(child: { slug: string }) => child.slug === slug
	)

	return (
		<MembersLayout
			hasBgColor={false}
			canSearch={false}
			hasSideBar={false}
			seo={{ title: selectedPage?.title ?? page?.title }}
		>
			<section className={style.page}>
				<h1>{page?.title}</h1>
				<ContentTabs childPages={children} slug={slug} />
			</section>
		</MembersLayout>
	)
}

export async function getStaticProps() {
	return { props: {}, revalidate: 600 }
}

export async function getStaticPaths() {
	const props = await apolloClient.query({
		query: AwardsHistoryQuery,
		fetchPolicy: 'network-only',
	})

	let paths = [] as any

	paths = props?.data?.page?.children?.nodes?.map(
		(child: { uri: string }) => child.uri
	)

	return {
		paths,
		fallback: 'blocking',
	}
}
