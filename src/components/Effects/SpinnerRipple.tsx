import style from '@styles/components/SpinnerRipple.module.scss'
import { ClassAttributes, CSSProperties } from 'react'

export default function SpinnerRipple({ className }: { className?: string }) {
	return (
		<div className={`${className} ${style.spinner}`}>
			<div></div>
			<div></div>
		</div>
	)
}
