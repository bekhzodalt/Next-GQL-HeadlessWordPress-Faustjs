import { gql } from '@apollo/client'

export const MenuFragment = gql`
	fragment MenuFragment on MenuItem {
		id
		label
		path
		parentId
		cssClasses
		childItems(first: 50) {
			nodes {
				id
				label
				path
				parentId
				cssClasses
				childItems(first: 50) {
					nodes {
						id
						label
						path
						parentId
						cssClasses
					}
				}
			}
		}
	}
`
