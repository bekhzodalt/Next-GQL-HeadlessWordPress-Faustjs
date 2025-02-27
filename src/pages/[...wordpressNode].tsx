import { getWordPressProps, WordPressTemplate } from '@faustwp/core'
import { SeedNode } from '@faustwp/core/dist/cjs/queries/seedQuery'
import { ReactNode } from 'react'

export default function Page(
	props: JSX.IntrinsicAttributes & {
		__SEED_NODE__: SeedNode
		__TEMPLATE_QUERY_DATA__: any
	} & { children?: ReactNode }
) {
	return <WordPressTemplate {...props} />
}

export async function getStaticProps(ctx: any) {
	return getWordPressProps({ ctx, revalidate: 600 })
}

export async function getStaticPaths() {
	return {
		paths: [] as any,
		fallback: 'blocking',
	}
}
