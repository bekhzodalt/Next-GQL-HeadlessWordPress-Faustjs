import { gql } from '@apollo/client'

export const LibraryPageDataFragment = gql`
	query GetPageData {
		page(id: "library", idType: URI) {
			title
			content
			libraryPage {
				pageContainer {
					carousel {
						media {
							mediaItemUrl
						}
						type
					}
					overview
					subMenu {
						label
						linkType
						modalImage {
							mediaItemUrl
						}
						url
					}
					policies {
						title
						content
					}
				}
			}
		}
	}
`
