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
import date from '@archipress/utilities/date'

interface requestForm {
	memberName: { value: string }
	memberNumber: { value: string }
	email: { value: string }
	phoneNumber: { value: string }
	preferredContactMethod: { value: string }
	requestedDate: { value: string }
	location: { value: string }
	destination: { value: string }
	partySize: { value: string }
	returnRide: { value: string }
	returnTime: { value: string }
	returnLocation: { value: string }
	flightNumber: { value: string }
	time: { value: string }
	specialOccasion: { value: string }
	repeatCustomer: { value: string }
	comments: { value: string }
}

export default function CarServiceModal({
	open,
	callback,
	subject,
	eAddresses,
	modalDescription,
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
	modalDescription?: string
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
			phoneNumber: target.phoneNumber.value,
			preferredContactMethod: target.preferredContactMethod.value,
			requestedDate: target.requestedDate.value,
			location: target.location.value,
			destination: target.destination.value,
			partySize: target.partySize.value,
			returnRide: target.returnRide.value,
			returnTime: target.returnTime?.value,
			returnLocation: target.returnLocation?.value,
			flightNumber: target.flightNumber.value,
			specialOccasion: target.specialOccasion.value,
			repeatCustomer: target.repeatCustomer.value,
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
			template_name: 'UL - Transportation',
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
				{ name: 'phoneNumber', content: inputs.phoneNumber },
				{
					name: 'preferredContactMethod',
					content: inputs.preferredContactMethod,
				},
				{
					name: 'requestedDate',
					content: date(inputs.requestedDate).format('MMMM, D YYYY h:mm a'),
				},
				{ name: 'location', content: inputs.location },
				{ name: 'destination', content: inputs.destination },
				{ name: 'partySize', content: inputs.partySize },
				{ name: 'returnRide', content: inputs.returnRide },
				{
					name: 'returnTime',
					content: inputs.returnTime
						? date(inputs.returnTime, 'HH:mm').format('h:mm a')
						: '',
				},
				{ name: 'returnLocation', content: inputs.returnLocation },
				{ name: 'flightNumber', content: inputs.flightNumber },
				{ name: 'specialOccasion', content: inputs.specialOccasion },
				{ name: 'repeatCustomer', content: inputs.repeatCustomer },
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
					<form onSubmit={handleSubmit} onChange={e => updateFormData}>
						<ul>
							<li>
								<strong>Request Form</strong>
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
								<label htmlFor="phoneNumber">
									<span className={style.required}>* </span>Phone Number
								</label>
								<input
									type="text"
									name="phoneNumber"
									id="phoneNumber"
									value={formData.current.phoneNumber?.value}
								/>
							</li>

							<li>
								<label htmlFor="preferredContactMethod">
									<span className={style.required}>* </span>
									Preferred Method of Contact
								</label>
								<select
									defaultValue="Email"
									name="preferredContactMethod"
									id="preferredContactMethod"
								>
									<option value="Email">Email</option>
									<option value="Phone">Phone</option>
								</select>
							</li>

							<li>
								<label htmlFor="requestedDate">
									<span className={style.required}>* </span>Requested Date and
									Time
								</label>
								<input
									type="datetime-local"
									name="requestedDate"
									id="requestedDate"
									value={formData.current.requestedDate?.value}
									required
								/>
							</li>

							<li>
								<label htmlFor="location">
									<span className={style.required}>* </span>Pick Up Location
								</label>
								<textarea name="location" id="location" required>
									{formData.current.location?.value}
								</textarea>
							</li>

							<li>
								<label htmlFor="destination">
									<span className={style.required}>* </span>Destination
								</label>
								<textarea name="destination" id="destination" required>
									{formData.current.destination?.value}
								</textarea>
							</li>

							<li>
								<label htmlFor="partySize">
									<span className={style.required}>* </span>Number of passengers
								</label>

								<input
									type="number"
									name="partySize"
									id="partySize"
									min={1}
									value={formData.current.partySize?.value}
								/>
							</li>

							<li>
								<label htmlFor="returnRide">
									<span className={style.required}>*</span> Do you need a return
									ride?
								</label>

								<select
									name="returnRide"
									id="returnRide"
									onChange={e => {
										const pickup = document.querySelector('#pickup')

										if (e.target.value === 'no') {
											pickup.innerHTML = ''
										} else {
											pickup.innerHTML = `
											<li>
												<label htmlFor="pickupTime">
													<span style="color: red">* </span> Requested return
													pick up time
												</label>

												<input type="time" id="returnTime" name="returnTime" required/>
											</li>

											<li>
												<label htmlFor="pickupTime">
													<span style="color: red">* </span> Requested return
													drop-off location
												</label>

												<input type="text" id="returnLocation" name="returnLocation" required/>
											</li>
											`
										}
									}}
								>
									<option value="yes">Yes</option>
									<option value="no" selected>
										No
									</option>
								</select>
							</li>

							<ul id="pickup"></ul>
							{/* 
							<li>
								<label htmlFor="time">Arrival Time</label>
								<input
									type="text"
									name="time"
									id="time"
									value={formData.current.time?.value}
								/>
							</li> */}

							<li>
								<label htmlFor="flightNumber">Flight Number</label>
								<input
									type="text"
									name="flightNumber"
									id="flightNumber"
									value={formData.current.flightNumber?.value}
								/>
							</li>

							<li>
								<label htmlFor="specialOccasion">
									Is this a special occasion
								</label>
								<textarea name="specialOccasion" id="specialOccasion">
									{formData.current.specialOccasion?.value}
								</textarea>
							</li>

							<li>
								<label htmlFor="repeatCustomer">
									Have you used the car service before
								</label>
								<select
									defaultValue="Yes"
									name="repeatCustomer"
									id="repeatCustomer"
								>
									<option value="Yes">Yes</option>
									<option value="No">No</option>
								</select>
							</li>

							<li>
								<label htmlFor="comments">Comments</label>
								<textarea name="comments" id="comments">
									{formData.current.comments?.value}
								</textarea>
							</li>

							<br />

							<div
								className={style.note}
								dangerouslySetInnerHTML={{
									__html: modalDescription,
								}}
							/>

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
