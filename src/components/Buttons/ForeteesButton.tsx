import { Button } from '@mui/material'
import { ReactNode } from 'react'

export default function ForeteesButton({
	className,
	label,
	children,
}: {
	className?: string
	label?: string
	children?: ReactNode
}) {
	return (
		<Button form="foretees-sso" type="submit" className={className}>
			{children || label}
		</Button>
	)
}
