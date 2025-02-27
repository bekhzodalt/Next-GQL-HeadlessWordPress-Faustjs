import { gql } from '@apollo/client'

export const MembershipPageDataFragment = gql`
	query GetPageData {
		membershipPage: page(id: "membership", idType: URI) {
			title
			content
			membershipAnchorMenus {
				anchors {
					label
					url
				}
			}
			membershipBenefits {
				benefitsTitle
			}
			gridImageWithRotateEffect {
				gridItems {
					gridLabel
					gridImage {
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					gridDesc
					gridLink
				}
			}
			membershipPropose {
				proposeTitle
				modalContent {
					label
					subject
					emailAddresses {
						name
						email
						type
					}
					file {
						mediaItemUrl
					}
				}
				proposeImage {
					mediaItemUrl
				}
			}

			membershipHaveAQuestion {
				haveAQuestionContainer {
					text
				}
			}
		}

		membershipProcess: page(id: "membership-process", idType: URI) {
			title
			content
		}

		membershipWelcomePage: page(id: "welcome-new-members", idType: URI) {
			content
			membershipWelcome {
				element {
					elementTitle
					elementContent
					elementButton {
						buttonLabel
						buttonLink
						buttonFile {
							mediaItemUrl
						}
					}
					elementImage {
						mediaItemUrl
					}
				}
			}
		}

		membershipMemberNews: page(id: "member-news", idType: URI) {
			title
			memberNews {
				elements {
					elementTitle
					elementContent
					elementFile {
						mediaItemUrl
					}
					image {
						mediaItemUrl
					}
				}
			}
		}

		blueCardPage: page(id: "submit-a-blue-card", idType: URI) {
			title
			content
			submitABlueCardPage {
				subject
				emailAddresses {
					name
					email
					type
				}
			}
		}
	}
`
