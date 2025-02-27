import style from '@styles/components/MenuButton.module.scss'

export default function MenuButton({
	className,
	toggleOpen,
	open = false,
	type = 'main',
}: {
	className?: string
	toggleOpen: () => void
	open?: boolean
	type?: 'membership' | 'main'
}): JSX.Element {
	return (
		<>
			<div className={style.menuButtonContainer} onClick={() => toggleOpen()}>
				<button
					className={`menu-button ${
						open ? style.opened : style.menuButton
					} ${className}`}
				>
					<div className="menu-icon top" />
					<div className="menu-icon middle" />
					<div className="menu-icon bottom" />
				</button>

				{type === 'membership' ? null : <h4>MENU</h4>}
			</div>
		</>
	)
}
