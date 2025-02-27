import { gql } from '@apollo/client'

export const GolfPageDataFragment = gql`
	query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
			featuredImage {
				node {
					mediaItemUrl
				}
			}
			golfPageCarousel {
				media {
					mediaType
					uploadImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
				}
			}

			subGolfBook {
				bookDesc
				bookImageBeforeLogin {
					altText
					dataUrl(size: "thumbnail")
					mediaItemUrl
				}
				bookImage {
					altText
					dataUrl(size: "thumbnail")
					mediaItemUrl
				}
				bookLink
				bookButtonText
			}

			subGolfHoles {
				holesTitle
				holeItems {
					holeItemTitle
					holeItemDesc
					holeItemImage {
						dataUrl(size: "thumbnail")
						altText
						mediaItemUrl
					}
				}
			}

			subGolfStaff {
				staffTitle
				staffItems {
					staffItemImage {
						altText
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					staffItemName
					staffItemRole
					staffItemEmail
					staffItemPhone
				}
			}

			golfMap {
				mapTitle
				mapUrl
			}
		}
	}
`
