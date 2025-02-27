import React, { ReactNode } from 'react'

export default function Heading({
	level = 'h1',
	children,
	className,
}: {
	level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	children: ReactNode
	className?: string
}) {
	function Tag({ ...props }) {
		return React.createElement(level, props, children)
	}

	return <Tag className={className}>{children}</Tag>
}
