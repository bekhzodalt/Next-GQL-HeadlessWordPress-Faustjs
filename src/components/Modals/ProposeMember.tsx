import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Modal } from '@mui/material'
import style from '@styles/components/Modals/ProposeMember.module.scss'
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
	prospectName: { value: string }
	gender: { value: string }
	company: { value: string }
	title: { value: string }
	phoneNumber: { value: string }
	address: { value: string }
	email: { value: string }
	others: { value: string }
}

export default function ProposeMemberModal({
	open,
	callback,
	subject,
	eAddresses,
	fileUrl,
}: {
	open?: boolean
	callback: () => void
	subject: string
	eAddresses?: {
		name: string
		email: string
		type?: string
	}[]
	fileUrl?: string
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
			prospectName: target.prospectName.value,
			gender: target.gender.value,
			company: target.company.value,
			title: target.title.value,
			phoneNumber: target.phoneNumber.value,
			address: target.address.value,
			email: target.email.value,
			others: target.others.value,
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
			template_name: 'UL - Prospect Proposal',
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
				{ name: 'prospectName', content: inputs.prospectName },
				{ name: 'gender', content: inputs.gender },
				{ name: 'company', content: inputs.company },
				{ name: 'title', content: inputs.title },
				{ name: 'phoneNumber', content: inputs.phoneNumber },
				{ name: 'address', content: inputs.address },
				{ name: 'email', content: inputs.email },
				{ name: 'others', content: inputs.others },
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
		<Modal open={open} className={style.modal} hideBackdrop={true}>
			<>
				<FontAwesomeIcon
					icon={faTimes}
					className="close"
					onClick={() => callback()}
				/>
				<div className={style.inner}>
					<h2>HOW TO PROPOSE A NEW MEMBER</h2>
					<p>
						<a href={fileUrl} target="_blank" rel="noreferrer">
							Click here
						</a>{' '}
						to view the Proposer Checklist.
					</p>
					<p>Below is a step-by-step guide to proposing a member.</p>
					<p>
						1. <strong>Who wants to join?</strong> - Begin by talking to your
						friends, relatives and colleagues to see who is interested in
						membership. Many might be interested, and are just waiting for you
						to ask. If your Prospect is already familiar with the League, skip
						to step 4.
					</p>
					<p>
						2. <strong>Request a packet</strong> - Contact the Membership
						Department by phone or email (215-587-5575 or{' '}
						<a href="mailto:membership@unionleague.org">
							membership@unionleague.org
						</a>
						) and provide your Prospect&apos;s name, mailing address, phone
						number, and email. Your prospect will receive the packet in a few
						days and you will receive a copy of the cover letter.{' '}
					</p>
					<p>
						<em>
							At your request, the Membership Department will mail a packet of
							information to your prospective member.
						</em>
					</p>

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
								<strong>Prospective Member Information</strong>
							</li>

							<li>
								<label htmlFor="prospectName">
									<span className={style.required}>* </span>Prospect Name
								</label>
								<input
									type="text"
									name="prospectName"
									id="prospectName"
									value={formData.current.prospectName?.value}
									required
								/>
							</li>

							<li>
								<label htmlFor="gender">
									<span className={style.required}>* </span>Gender
								</label>
								<select defaultValue="Male" name="gender" id="gender">
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</li>

							<li>
								<label htmlFor="company">
									<span className={style.required}>* </span>Company
								</label>
								<input
									type="text"
									name="company"
									id="company"
									value={formData.current.company?.value}
									required
								/>
							</li>

							<li>
								<label htmlFor="title">
									<span className={style.required}>* </span>Title
								</label>
								<input
									type="text"
									name="title"
									id="title"
									value={formData.current.title?.value}
									required
								/>
							</li>

							<li>
								<label htmlFor="phoneNumber">
									<span className={style.required}>* </span>Daytime Phone Number
								</label>
								<input
									type="text"
									name="phoneNumber"
									id="phoneNumber"
									value={formData.current.phoneNumber?.value}
									required
								/>
							</li>

							<li>
								<label htmlFor="address">
									<span className={style.required}>* </span>Preferred Mailing
									Address
								</label>
								<textarea name="address" id="address">
									{formData.current.address?.value}
								</textarea>
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
								<label htmlFor="others">
									Other members who may know this prospect
								</label>
								<textarea name="others" id="others">
									{formData.current.others?.value}
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

					<p>
						3. <strong>Prospective Member Reception</strong> - Invite your
						Prospect to one of our monthly receptions. These gatherings are an
						ideal way for your Prospect to learn more about the League and its
						values. The dates of these receptions are listed on the cover letter
						and on the website. You can also contact the Membership Department
						for more information.
					</p>
					<p>
						4. <strong>Finding Sponsors</strong> - Your Prospect needs six
						sponsors total to begin the process. This includes the Proposer and
						Seconder, two other letter writers and two phone contacts. If they
						are unclear about who they know, talk to the Membership Department;
						they can usually help. The Membership Department will contact all of
						the sponsors to request letters of recommendation and will work with
						both of you to schedule an interview.
					</p>
					<p>
						5. <strong>Completing the Proposal.</strong> - Give use your
						Prospect&apos;s email address and will send them our proposal to be
						completed on their computer. Or, they can fill out a Proposal by
						hand and fax it to 215-587-5597. Once you contact the Membership
						Department and give them your Prospective Member&apos;s information,
						a staff member will send your Prospective Member all of the
						information including a pdf of the proposal. Candidates are approved
						by the Admissions Committee and then posted at the beginning of each
						month.
					</p>
					<p>
						6.<strong> The Posting List</strong> - The Proposal needs to list
						all six sponsors to be &quot;ready to post.&quot; Once your Prospect
						submits their Proposal, their name will be added to the monthly
						Posting List. They will then be considered a Candidate.
					</p>
					<p>
						7. <strong>The Interview</strong> - You will accompany your
						Candidate on the date of their interview. Your job will be a 5
						second introduction to the Chairman of the Panel and the Board
						Member in attendance. Then your Candidate enters the room and your
						job is done.
					</p>
					<p>
						8. <strong>New Member</strong> - Once your Candidate is elected to
						membership, he or she is a &quot;New Member.&quot; You and your New
						Member will be invited to a complimentary Induction Dinner to
						celebrate their election to the League.
					</p>
					<p>
						9. <strong>Congratulations!</strong> - Your will receive a
						Proposer&apos;s Rosette after the election of your first New Member.
						You can also receive credit towards the assessment, if you are still
						paying it.
					</p>
				</div>

				<div className={style.exitArea} onClick={() => callback()} />
			</>
		</Modal>
	)
}
