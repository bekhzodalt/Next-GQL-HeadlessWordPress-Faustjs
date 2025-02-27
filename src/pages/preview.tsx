import { WordPressTemplate } from '@faustwp/core'
import { SeedNode } from '@faustwp/core/dist/cjs/queries/seedQuery'
import { ReactNode } from 'react'

export default function Preview(
	props: JSX.IntrinsicAttributes & {
		__SEED_NODE__: SeedNode
		__TEMPLATE_QUERY_DATA__: any
	} & { children?: ReactNode }
) {
	return <WordPressTemplate {...props} />
}
