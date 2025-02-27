import { gql } from '@apollo/client'

export const TransportationAndParkingPageDataFragment = gql`
	query GetPageData {
		page(id: "transportation-and-parking", idType: URI) {
			title
			content
			transportationAndParkingPage {
				pageContainer {
					bannerImage {
						mediaItemUrl
					}
					locationsSection {
						title
						locations {
							name
							address
							mapUrl
							externalMapUrl
						}
					}
					parkingRates {
						title
						rates {
							title
							content
						}
					}
					rideServiceRates {
						title
						content
					}
					carShareRates {
						title
						content
					}
					requestForm {
						buttonLabel
						subject
						emailAddresses {
							name
							email
							type
						}
						modalDescription
					}
				}
			}
		}
	}
`
