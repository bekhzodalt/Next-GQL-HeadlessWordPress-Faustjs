import { faPlus } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react'
import style from '@styles/components/DropDown/Content.module.scss'
import Heading from '@archipress/components/Heading'

/**
 * Basic drop down with a label and a drop indicator. The information in the drop down will be text content from wp
 * @param {boolean} open open stat of component
 */
export default function DropDownContent({
	label,
	content,
	level = 'h5',
	component = 'heading',
}: {
	label: string
	content: string | any
	level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
	component?: 'heading' | 'span'
}) {
	const [opened, setOpened] = useState(false)

	function toggleOpen() {
		setOpened(!opened)
	}

	return (
		<div className={style.dropDownContent}>
			<div className="label" onClick={toggleOpen}>
				{component === 'heading' ? (
					<Heading level={level}>{label}</Heading>
				) : (
					<span>{label}</span>
				)}
				<FontAwesomeIcon icon={faPlus} />
			</div>

			{typeof content === 'string' ? (
				<div
					className={`drop-down ${opened ? 'opened' : ''}`}
					dangerouslySetInnerHTML={{ __html: content }}
				/>
			) : (
				<div className={`drop-down ${opened ? 'opened' : ''}`}>{content}</div>
			)}
		</div>
	)
}
