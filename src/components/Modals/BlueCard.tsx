import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import style from '@styles/components/Modals/Default.module.scss'
import { useRef, useState } from 'react'
import { sendTemplateEmail } from '@archipress/utilities/mailchimp'
import {
	useAppContext,
	AppContextProps,
} from '@archipress/utilities/AppContext'
import type {
	MessageRecipient,
	MessagesSendTemplateRequest,
} from '@mailchimp/mailchimp_transactional'

interface requestForm {
	memberName: { value: string }
	memberNumber: { value: string }
	preferredNumber: { value: string }
	memberEmail: { value: string }
	candidateName: { value: string }
	remarks: { value: string }
}

export default function BlueCardModal({
	open,
	callback,
	subject,
	eAddresses,
	className,
	content,
}: {
	open?: boolean
	callback: () => void
	subject: string
	eAddresses?: {
		name: string
		email: string
		type?: string
	}[]
	className?: string
	content?: string
}) {
	const { state } = useAppContext() as AppContextProps
	const formData = useRef({} as requestForm)
	const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
		formData.current[e.currentTarget.name as keyof requestForm].value =
			e.currentTarget.value
	}
	const [formState, setFormState] = useState('waiting')

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		const target = e.target as typeof e.target & requestForm
		const inputs = {
			memberName: state.viewer?.name,
			memberNumber: state.viewer?.unionLeagueProfileMeta?.member_number,
			preferredNumber: target.preferredNumber.value,
			memberEmail: target.memberEmail.value,
			candidateName: target.candidateName.value,
			remarks: target.remarks.value,
		}

		setFormState('mailing')
		const to = eAddresses?.map(
			({ name, email, type }) =>
				({
					email,
					name,
					type: type ?? 'to',
				} as MessageRecipient)
		)

		const envelope: MessagesSendTemplateRequest = {
			template_name: 'UL - Submit a Blue Card',
			message: {
				from_name: inputs.memberName,
				subject: subject,
				to: to,
				headers: {
					'reply-to': inputs.memberEmail,
				},
				preserve_recipients: true,
			},
			template_content: [
				{ name: 'memberName', content: inputs.memberName },
				{ name: 'memberNumber', content: inputs.memberNumber },
				{
					name: 'preferredNumber',
					content: inputs.preferredNumber
						? `
				<strong>Preferred Contact Number: </strong>
				<span>${inputs.preferredNumber}</span>
				<br>
				`
						: '',
				},
				{ name: 'memberEmail', content: inputs.memberEmail },
				{ name: 'candidateName', content: inputs.candidateName },
				{ name: 'remarks', content: inputs.remarks },
			],
		}

		sendTemplateEmail(envelope).then(res => {
			if (res === 'sent') {
				setFormState('mailed')
			} else {
				setFormState('error')
			}
		})
	}

	return (
		<Modal
			open={open}
			className={`${style.modal} ${className}`}
			hideBackdrop={true}
		>
			<>
				<FontAwesomeIcon
					icon={faTimes}
					className="close"
					onClick={() => callback()}
				/>

				<div className={`content ${style.content}`}>
					{content ? (
						<div
							className="content"
							dangerouslySetInnerHTML={{ __html: content }}
						/>
					) : null}

					<form onSubmit={handleSubmit} onChange={e => updateFormData}>
						<ul>
							<li>
								<strong>Member Information</strong>
							</li>
							<li>
								<label>
									<span className={style.required}>* </span>Member Name
								</label>
								<span>{state.viewer?.name}</span>
							</li>

							<li>
								<label>
									<span className={style.required}>* </span>Member Number
								</label>
								<span>
									{state.viewer?.unionLeagueProfileMeta?.member_number}
								</span>
							</li>

							<li>
								<label htmlFor="preferredNumber">
									Preferred Contact Number:
								</label>
								<input
									type="text"
									name="preferredNumber"
									id="preferredNumber"
									value={formData.current.preferredNumber?.value}
								/>
							</li>

							<li>
								<label htmlFor="memberEmail">
									<span className={style.required}>* </span>Member Email:
								</label>
								<input
									type="text"
									name="memberEmail"
									id="memberEmail"
									value={formData.current.memberEmail?.value}
									required
								/>
							</li>

							<li>
								<strong>Candidate Information</strong>
							</li>

							<li>
								<label htmlFor="candidateName">
									<span className={style.required}>* </span>Candidate Name:
								</label>
								<textarea name="candidateName" id="candidateName" required>
									{formData.current.candidateName?.value}
								</textarea>
							</li>

							<li>
								<label htmlFor="remarks">
									<span className={style.required}>* </span>Remarks:
								</label>
								<textarea name="remarks" id="remarks" required>
									{formData.current.remarks?.value}
								</textarea>
							</li>

							{formState === 'mailed' ? (
								<li className={style.formMessages}>Message Sent - Thank You</li>
							) : formState === 'error' ? (
								<li className={`${style.formMessages} ${style.error}`}>
									Error - Sorry an error ocurred during submission. Please try
									again later.
								</li>
							) : (
								<li>
									<input
										type="submit"
										name="submit"
										id="submit"
										value="Submit"
										className={style.submitBtn}
										disabled={formState === 'mailing'}
									/>
								</li>
							)}
						</ul>
					</form>
				</div>

				<div className={style.exitArea} onClick={() => callback()} />
			</>
		</Modal>
	)
}
