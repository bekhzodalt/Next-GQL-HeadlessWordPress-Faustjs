import { gql } from '@apollo/client'

const NewsPostQuery = gql`
	query NewsPostsQuery {
		posts(where: { categoryName: "news" }) {
			nodes {
				id: databaseId
				title
				date
				slug
				content
				categories {
					nodes {
						slug
					}
				}
				featuredImage {
					node {
						mediaItemUrl
					}
				}
				postOrder {
					priority
				}
			}
		}
	}
`
export default NewsPostQuery
