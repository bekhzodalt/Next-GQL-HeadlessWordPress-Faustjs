import { PublicLayout } from '@archipress/components'
import style from '@styles/pages/member-rules.module.scss'
import { MemberRulesPagesDataFragment } from '@archipress/fragments/MemberRulesPages'
import { useState } from 'react'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'

export default function Component(props: any) {
	const { state } = useAppContext() as AppContextProps
	const loading = !state?.generalSettings

	if (!state?.loggedIn && !loading)
		top.location.replace('https://www.unionleague.org/members.php')

	const [tab, setTab] = useState('Bylaws')

	const policiesPage = props?.data?.policiesPage
	const title = policiesPage.title
	const bylawsPage = props?.data?.bylawsPage

	return !loading && state?.loggedIn ? (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<>
					<div className={`${style.page}`}>
						<div className={`${style.tabs}`}>
							<div
								className={`${style.tab} ${
									tab == 'MemberRules' ? style.active : ''
								}`}
								onClick={() => setTab('MemberRules')}
							>
								Member Rules and Board Policies
							</div>
							<div
								className={`${style.tab} ${
									tab == 'Bylaws' ? style.active : ''
								}`}
								onClick={() => setTab('Bylaws')}
							>
								Bylaws
							</div>
						</div>
						{tab == 'MemberRules' ? (
							<div className={`${style.memberRules}`}>
								<span
									className={style.content}
									dangerouslySetInnerHTML={{
										__html: policiesPage.content,
									}}
								/>
							</div>
						) : (
							<div className={`${style.bylaws}`}>
								<span
									className={style.content}
									dangerouslySetInnerHTML={{
										__html: bylawsPage.content,
									}}
								/>
							</div>
						)}
					</div>
				</>
			</PublicLayout>
		</>
	) : null
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = MemberRulesPagesDataFragment
