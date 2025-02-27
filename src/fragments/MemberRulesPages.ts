import { gql } from '@apollo/client'

export const MemberRulesPagesDataFragment = gql`
	query GetPageData {
		policiesPage: page(id: "policies", idType: URI) {
			title
			content
		}

		bylawsPage: page(id: "bylaws", idType: URI) {
			title
			content
		}
	}
`
