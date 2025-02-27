import { gql } from '@apollo/client'
import { PublicLayout } from '@archipress/components'
import { departmentMap } from '@archipress/constants/departments'
import { useState } from 'react'
import style from '@styles/pages/staff.module.scss'
import { slugify, useLayoutScrollTo } from '@archipress/utilities/functions'
import StaffCard from '@archipress/components/Card/Staff'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp } from '@fortawesome/pro-light-svg-icons'
import {
	StaffContextProps,
	StaffContextProvider,
	useStaffContext,
} from '@archipress/utilities/StaffContext'

function Page(data: any) {
	const { state } = useStaffContext() as StaffContextProps
	const staff = state.sorted
	const title = data?.data?.page?.title

	const scrollTo = useLayoutScrollTo()

	const [selected, setSelected] = useState('Departments')

	const handleChange = (selection: string) => {
		setSelected(selection)
		scrollTo(`#${slugify(selection)}`)
	}

	return (
		<PublicLayout
			seo={{
				title,
			}}
			style={{
				content: style.content,
			}}
		>
			<>
				<div className={style.inputArea}>
					<select
						value={selected}
						onChange={e => handleChange(e.target.value)}
						className={style.select}
					>
						<option value="Departments" aria-hidden={true} hidden={true}>
							Departments
						</option>

						{departmentMap
							.filter(item => item && staff && item in staff)
							.map((department, i) => {
								return (
									<option key={i} value={department}>
										{department}
									</option>
								)
							})}
					</select>
				</div>

				<div className="departments">
					{departmentMap.map(department => {
						if (!staff || (staff && department in staff === false)) return

						return (
							<div key={department} className={style.department}>
								<h2 id={slugify(department)}>{department}</h2>

								{staff[department]?.map((user, i) => (
									<StaffCard key={i} user={user} />
								))}

								<a href="#staff-page-top">
									<FontAwesomeIcon icon={faArrowUp} />
									back to top
								</a>
							</div>
						)
					})}
				</div>
			</>
		</PublicLayout>
	)
}

export default function Component(props: any) {
	const { data } = props
	return (
		<StaffContextProvider>
			<Page data={data} />
		</StaffContextProvider>
	)
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = gql`
	query GetStaffPage($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
		}
	}
`
