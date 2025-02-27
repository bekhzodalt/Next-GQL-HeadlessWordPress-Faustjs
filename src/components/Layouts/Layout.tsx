import {
	useAppContext,
	AppContextProps,
} from '@archipress/utilities/AppContext'
import Box from '@mui/material/Box'
import style from '@styles/components/Layout.module.scss'
import React from 'react'

// We pass these classNames to the Box grid components. Content inside these components and be modified at the component level
export interface LayoutClassNames {
	layout?: any
	header?: any
	banner?: any
	content?: any
	footer?: any
}

interface Props {
	header?: JSX.Element
	banner?: JSX.Element
	content: JSX.Element
	footer?: JSX.Element
	classNames?: LayoutClassNames
	styles?: React.CSSProperties
}

export default function Layout({
	header,
	banner,
	content,
	footer,
	classNames,
	styles,
}: Props): JSX.Element {
	const { state } = useAppContext() as AppContextProps
	return (
		<>
			<Box
				className={`layout ${classNames.layout} ${style.layout}`}
				style={styles}
			>
				<Box gridRow="span 1" className={classNames.header}>
					{header}
				</Box>

				<Box gridRow="span 1" className={classNames.banner}>
					{banner}
				</Box>

				<Box gridRow="span 1" className={classNames.content}>
					{content}
				</Box>

				<Box gridRow="span 1" className={classNames.footer}>
					{footer}
				</Box>
			</Box>
			{state?.loggedIn ? (
				<form
					id="foretees-sso"
					action="https://www1.foretees.com/v5/servlet/Login"
					method="post"
					style={{
						display: 'none',
					}}
					target="_blank"
				>
					<input type="hidden" name="clubname" value="torresdale" readOnly />
					<input
						type="hidden"
						name="user_name"
						value={state?.viewer?.unionLeagueProfileMeta?.member_number ?? ''}
						readOnly
					/>
					<input type="text" name="activity" value="0" readOnly />
					<input type="hidden" name="caller" value="GENID79623" readOnly />
				</form>
			) : null}
		</>
	)
}
