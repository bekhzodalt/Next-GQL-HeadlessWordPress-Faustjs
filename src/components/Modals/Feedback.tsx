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
	email: { value: string }
	phone: { value: string }
	comments: { value: string }
}

export default function FeedbackModal({
	open,
	callback,
	subject,
	eAddresses,
	className,
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
			email: target.email.value,
			phone: target.phone.value,
			comments: target.comments.value,
		}

		setFormState('mailing')
		const to = eAddresses.map(
			({ name, email, type }) =>
				({
					email,
					name,
					type: type ?? 'to',
				} as MessageRecipient)
		)

		const envelope: MessagesSendTemplateRequest = {
			template_name: 'UL - Feedback',
			message: {
				from_name: inputs.memberName,
				subject: subject,
				to: to,
				headers: {
					'reply-to': inputs.email,
				},
				preserve_recipients: true,
			},
			template_content: [
				{ name: 'memberName', content: inputs.memberName },
				{ name: 'memberNumber', content: inputs.memberNumber },
				{ name: 'email', content: inputs.email },
				{ name: 'phone', content: inputs.phone },
				{ name: 'comments', content: inputs.comments },
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
					<h2>MEMBER FEEDBACK</h2>

					<form onSubmit={handleSubmit} onChange={e => updateFormData}>
						<ul>
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
								<label htmlFor="phone">Phone</label>
								<input
									type="text"
									name="phone"
									id="phone"
									value={formData.current.phone?.value}
								/>
							</li>

							<li>
								<label htmlFor="email">
									<span className={style.required}>* </span>Email
								</label>
								<input
									type="text"
									name="email"
									id="email"
									value={formData.current.email?.value}
									required
								/>
							</li>

							<li>
								<label htmlFor="comments">
									<span className={style.required}>* </span>Comments
								</label>
								<textarea name="comments" id="comments" required>
									{formData.current.comments?.value}
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
