import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import style from '@styles/components/Modals/ReqInfoForm.module.scss'
import { useRef, useState } from 'react'
import { sendTemplateEmail } from '@archipress/utilities/mailchimp'
import { useAppContext, AppContextProps } from '@archipress/utilities/AppContext'
import type { MessageRecipient, MessagesSendTemplateRequest } from '@mailchimp/mailchimp_transactional'


interface requestForm {
	firstName: { value: string };
	lastName: { value: string };
	email: { value: string };
	title: { value: string };
	address1: { value: string };
	address2: { value: string };
	city: { value: string };
	state: { value: string };
	zip: { value: string };
	phone: { value: string };
	fax: { value: string };
	preferred: { value: string };
	referred: { value: string };
	whoReferred: { value: string };
	group: { value: string };
	eventType: { value: string };
	eventDate: { value: string };
	maxGuests: { value: string };
	comment: { value: string };
	confirmation: { value: string };
}

export default function ReqInfoFormModal({
	open,
	location,
	callback,
	subject,
	eAddresses
}: {
	open?: boolean
	location: string
	callback: () => void
	subject: string
	eAddresses: {
		name: string,
		email: string,
		type?: string,
	}[]
}) {
	const { state } = useAppContext() as AppContextProps
	const formData = useRef({} as requestForm)
	const updateFormData = (e: React.ChangeEvent<HTMLInputElement>) => {
		formData.current[e.currentTarget.name as keyof requestForm].value = e.currentTarget.value
	}
	const [invalidFields, setInvalidFields] = useState([])
	const [formState, setFormState] = useState('waiting')

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		const target = e.target as typeof e.target & requestForm
		const inputs = {
			firstName: target.firstName.value,
			lastName: target.lastName.value,
			email: target.email.value,
			title: target.title.value,
			address1: target.address1.value,
			address2: target.address2.value,
			city: target.city.value,
			state: target.state.value,
			zip: target.zip.value,
			phone: target.phone.value,
			fax: target.fax.value,
			preferred: target.preferred.value,
			referred: target.referred.value,
			whoReferred: target.whoReferred.value,
			group: target.group.value,
			eventType: target.eventType.value,
			eventDate: target.eventDate.value,
			maxGuests: target.maxGuests.value,
			comment: target.comment.value,
			confirmation: target.confirmation.value,
		}

		let invalidFields = [] as String[]

		Object.entries(inputs).filter(([key]) =>
			['firstName', 'lastName', 'phone', 'email', 'maxGuests', 'confirmation'].includes(key)
		).forEach(([key, value]) => {
			if (!value || (key === 'confirmation' && value != 'agree')) {
				invalidFields.push(key)
			} else {
				const index = invalidFields.indexOf(key)
				if (index !== -1) {
					invalidFields.slice(index)
				}
			}
			setInvalidFields(() => invalidFields)
		})

		if (invalidFields.length === 0) {
			setFormState('mailing')
			const to = eAddresses.map(({ name, email, type }) => (
				{
					email,
					name,
					type: type ?? 'to'
				} as MessageRecipient
			))

			const envelope: MessagesSendTemplateRequest = {
				template_name: 'UL - Event Inquiries',
				message: {
					from_name: `${inputs.firstName} ${inputs.lastName}`,
					subject: subject,
					to: to,
					headers: {
						'reply-to': inputs.email
					},
					preserve_recipients: true,
				},
				template_content: [
					{ name: 'eventlocation', content: location },
					{ name: 'firstname', content: inputs.firstName },
					{ name: 'lastname', content: inputs.lastName },
					{ name: 'title', content: inputs.title },
					{ name: 'address1', content: inputs.address1 },
					{ name: 'address2', content: inputs.address2 },
					{ name: 'city', content: inputs.city },
					{ name: 'state', content: inputs.state },
					{ name: 'zip', content: inputs.zip },
					{ name: 'phone', content: inputs.phone },
					{ name: 'fax', content: inputs.fax },
					{ name: 'email', content: inputs.email },
					{ name: 'preferred', content: inputs.preferred },
					{ name: 'referred', content: inputs.referred },
					{ name: 'whoreferred', content: inputs.whoReferred },
					{ name: 'group', content: inputs.group },
					{ name: 'eventtype', content: inputs.eventType },
					{ name: 'eventdate', content: inputs.eventDate },
					{ name: 'maxguests', content: inputs.maxGuests },
					{ name: 'comment', content: inputs.comment },
					{ name: 'confirmation', content: inputs.confirmation },
				]
			}

			sendTemplateEmail(envelope).then(res => {
				if (res === 'sent') {
					setFormState('mailed')
				} else {
					setFormState('error')
				}
			})
		}
	}

	return (
		<Modal open={open} className={style.modal} hideBackdrop={true}>
			<>
				<FontAwesomeIcon
					icon={faTimes}
					className="close"
					onClick={() => callback()}
				/>
				<div className={style.inner}>
					<h2>Request Information</h2>
					<p>Thank you for your interest. Please fill out the form below with as much information as possible about your event and someone will contact you.</p>
					<form onSubmit={handleSubmit} onChange={e => updateFormData}>
						<ul>
							<li>
								<label htmlFor="firstName"><span className={style.required}>* </span>First Name</label>
								<input type="text" name="firstName" id="firstName" className={invalidFields.includes('firstName') ? style.invalid : ''} value={formData.current.firstName?.value} defaultValue={state.viewer?.firstName} required />
							</li>
							<li>
								<label htmlFor="lastName"><span className={style.required}>* </span>Last Name</label>
								<input type="text" name="lastName" id="lastName" className={invalidFields.includes('lastName') ? style.invalid : ''} value={formData.current.lastName?.value} defaultValue={state.viewer?.lastName} required />
							</li>
							<li><label htmlFor="title">Are you a</label>
								<select name="title" id="title" defaultValue="Member">
									<option value="Member">Member</option>
									<option value="Non-Member">Non-Member</option>
								</select>
							</li>
							<li><label htmlFor="address1">Address 1</label>
								<input type="text" name="address1" id="address1" /></li>
							<li><label htmlFor="address2">Address 2</label>
								<input type="text" name="address2" id="address2" /></li>
							<li><label htmlFor="city">City or Town</label>
								<input type="text" name="city" id="city" /></li>
							<li><label htmlFor="state">State</label>
								<select name="state" id="state" defaultValue="AL">
									<option value="AL">AL</option>
									<option value="AK">AK</option>
									<option value="AZ">AZ</option>
									<option value="AR">AR</option>
									<option value="CA">CA</option>
									<option value="CO">CO</option>
									<option value="CT">CT</option>
									<option value="DE">DE</option>
									<option value="DC">DC</option>
									<option value="FL">FL</option>
									<option value="GA">GA</option>
									<option value="HI">HI</option>
									<option value="ID">ID</option>
									<option value="IL">IL</option>
									<option value="IN">IN</option>
									<option value="IA">IA</option>
									<option value="KS">KS</option>
									<option value="KY">KY</option>
									<option value="LA">LA</option>
									<option value="ME">ME</option>
									<option value="MD">MD</option>
									<option value="MA">MA</option>
									<option value="MI">MI</option>
									<option value="MN">MN</option>
									<option value="MS">MS</option>
									<option value="MO">MO</option>
									<option value="MT">MT</option>
									<option value="NE">NE</option>
									<option value="NV">NV</option>
									<option value="NH">NH</option>
									<option value="NJ">NJ</option>
									<option value="NM">NM</option>
									<option value="NY">NY</option>
									<option value="NC">NC</option>
									<option value="ND">ND</option>
									<option value="OH">OH</option>
									<option value="OK">OK</option>
									<option value="OR">OR</option>
									<option value="PA">PA</option>
									<option value="RI">RI</option>
									<option value="SC">SC</option>
									<option value="SD">SD</option>
									<option value="TN">TN</option>
									<option value="TX">TX</option>
									<option value="UT">UT</option>
									<option value="VT">VT</option>
									<option value="VA">VA</option>
									<option value="WA">WA</option>
									<option value="WV">WV</option>
									<option value="WI">WI</option>
									<option value="WY">WY</option>
								</select>
							</li>
							<li><label htmlFor="zip">Zip Code</label><input type="text" name="zip" id="zip" /></li>
							<li><label htmlFor="phone"><span className={style.required}>* </span>Phone</label>
								<input type="tel" name="phone" id="phone" className={invalidFields.includes('phone') ? style.invalid : ''} value={formData.current.phone?.value} required /></li>
							<li><label htmlFor="fax">Fax</label><input type="tel" name="fax" id="fax" value={formData.current.fax?.value} /></li>
							<li><label htmlFor="email"><span className={style.required}>* </span>Email</label>
								<input type="email" name="email" id="email" className={invalidFields.includes('email') ? style.invalid : ''} value={formData.current.email?.value} defaultValue={state.viewer?.email} required /></li>
							<li><label htmlFor="preferred">Preferred Method of Contact</label>
								<select name="preferred" id="preferred" defaultValue="Email">
									<option value="Email">Email</option>
									<option value="Phone">Phone</option>
									<option value="Fax">Fax</option>
								</select></li>
							<li><label>Were you referred here?</label>
								<input type="radio" name="referred" value="Yes"
									defaultChecked={formData.current.referred?.value === "Yes"} /> Yes
								<input type="radio" name="referred" value="No"
									defaultChecked={formData.current.referred?.value === "No"} /> No</li>
							<li><label htmlFor="whoReferred">By whom?</label><input type="text" name="whoReferred" id="whoReferred" /></li>
							<li><label htmlFor="group">Group, business, organization or affiliation</label>
								<input type="text" name="group" id="group" />
								<span><em>&nbsp;(if applicable)</em></span></li>
							<li><label htmlFor="eventType">Type of Event</label>
								<select name="eventType" id="eventType" defaultValue="Birthday">
									<option value="Birthday">Birthday</option>
									<option value="Corporate Event">Corporate Event</option>
									<option value="Meeting">Meeting</option>
									<option value="Reception">Reception</option>
									<option value="Wedding">Wedding</option>
									<option value="Other">Other</option>
								</select></li>
							<li><label htmlFor="eventDate">Event Date</label>
								<input type="text" name="eventDate" id="eventDate" /></li>
							<li>
								<label htmlFor="maxGuests"><span className={style.required}>* </span>Number Attending</label>
								<input type="text" name="maxGuests" id="maxGuests" className={invalidFields.includes('maxGuests') ? style.invalid : ''} required />
							</li>
							<li><label htmlFor="comment">Comments</label>
								<textarea name="comment" id="comment"></textarea></li>
							<li>
								<label htmlFor="confirmation"><span className={style.required}>* </span>Confirmation</label>
								<input name="confirmation" id="confirmation" type="text" pattern="agree"
									className={invalidFields.includes('confirmation') ? style.invalid : ''} required />
							</li>
							<li className={style.captchdesc}>By typing &quot;agree&quot; into the above box you are confirming that you wish to send the above information to the Union League.</li>

							<li><span className={style.required}>*</span> denotes required fields</li>
							{
								formState === 'mailed'
									? <li className={style.formMessages}>Message Sent - Thank You</li>
									: formState === 'error'
										? <li className={`${style.formMessages} ${style.required}`}>Error - Sorry an error ocurred during submission. Please try again later.</li>
										: <li>
											<input type="submit" name="Submit" value="Submit" id="submit" className={style.submitBtn} disabled={formState === 'mailing'} />
										</li>
							}
						</ul>
					</form>
				</div>
			</>
		</Modal>
	)
}
