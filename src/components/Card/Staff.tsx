import { faUser } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import style from '@styles/components/Card/Staff.module.scss'
import type { ActUserMeta } from '@archipress/utilities/StaffContext'
import Image from 'next/future/image'

export default function StaffCard({ user }: { user: ActUserMeta }) {
	const copiedUser = { ...user }
	const [state, setState] = useState({
		work_phone: {
			tel: '',
			label: '',
		},
	})

	function parseStaffWorkPhone(phone: string) {
		if (phone && phone.includes('ext')) {
			const phoneSplit = phone.split('ext')
			if (
				phoneSplit &&
				typeof phoneSplit !== 'string' &&
				phoneSplit.length > 1
			) {
				const tel = `tel:${phoneSplit[0]}p${phoneSplit[1]}`
				const label = phoneSplit.join(' ext. ')
				return { tel, label }
			}
		}
		return { tel: `tel:${phone}`, label: phone }
	}

	useEffect(() => {
		const work_phone = parseStaffWorkPhone(user.work_phone || '')
		setState({ ...state, work_phone })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user])

	return (
		<>
			<div className={style.card}>
				<div className={style.userAvatar}>
					{copiedUser.profile_image ? (
						<Image
							src={user.profile_image}
							width={500}
							height={500}
							alt={user.display_name}
						/>
					) : (
						<FontAwesomeIcon icon={faUser} />
					)}
				</div>

				<div className={style.details}>
					<span className={style.position}>{copiedUser.work_job_title}</span>

					<span className={style.name}>{copiedUser.display_name}</span>

					{state.work_phone ? (
						<a href={state.work_phone.tel} className={style.label}>
							{state.work_phone.label}
						</a>
					) : null}

					{copiedUser.user_email ? (
						<span>
							<a href={`mailto:${copiedUser.user_email}`}>
								{copiedUser.user_email}
							</a>
						</span>
					) : null}
				</div>
			</div>
		</>
	)
}
