import { getWordPressProps, WordPressTemplate } from "@faustwp/core";
import { SeedNode } from "@faustwp/core/dist/cjs/queries/seedQuery";
import { ReactNode } from "react";

export default function Page(props: JSX.IntrinsicAttributes & { __SEED_NODE__: SeedNode; __TEMPLATE_QUERY_DATA__: any; } & { children?: ReactNode; }) {
	return <WordPressTemplate {...props} />;
}

export function getStaticProps(ctx: any) {
	return getWordPressProps({ ctx });
}
