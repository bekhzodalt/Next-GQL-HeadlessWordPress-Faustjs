import { gql } from '@apollo/client'

export const LeagueLeadershipDataFragment = gql`
	query GetPageData {
		president: leaderships(where: {hasCategory: ["president"]}) {
			nodes {
				title
				content
				featuredImage {
					node {
						mediaItemUrl
					}
				}
			}
		}

		vicePresidents: leaderships(where: {hasCategory: ["vice-president"]}) {
			nodes {
				title
				content
				featuredImage {
					node {
						mediaItemUrl
					}
				}
				categories {
					name
					parent
					slug
				}
				menuOrder
			}
		}

		directors: leaderships(where: {hasCategory: ["director"]} first: 100) {
			nodes {
				title
				content
				featuredImage {
					node {
						mediaItemUrl
					}
				}
				categories {
					name
					parent
					slug
				}
				menuOrder
			}
		}

		committees: leaderships(where: {hasCategory: ["committee"]}) {
			nodes {
				title
				content
				featuredImage {
					node {
						mediaItemUrl
					}
				}
				menuOrder
			}
		}

		committeesPage: page(id: "committees", idType: URI) {
			content
		}

		pastPresidents: leaderships(where: {hasCategory: ["past-president"]} first: 100) {
			nodes {
				title
				content
				featuredImage {
					node {
						mediaItemUrl
					}
				}
				categories {
					name
					parent
					slug
				}
				menuOrder
			}
		}

		pastPresidentsPage: page(id: "past-presidents", idType: URI) {
			content
		}
	}
`
