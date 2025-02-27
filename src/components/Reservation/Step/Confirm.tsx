import ReservationDateTime from '@archipress/components/Reservation/DateTime'
import ReservationPartySize from '@archipress/components/Reservation/PartySize'
import SpinnerRipple from '@archipress/components/Effects/SpinnerRipple'
import VenueTitle from '@archipress/components/Venue/Title'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import date from '@archipress/utilities/date'
import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { Button, Slide } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import style from '@styles/components/Reservation/Step/Confirm.module.scss'
import { sendTemplateEmail } from '@archipress/utilities/mailchimp'
import { OperationVariables, ApolloQueryResult } from '@apollo/client'
import { MessagesSendTemplateRequest } from '@mailchimp/mailchimp_transactional'

export default function ReservationStepConfirm({
	actUpdateSettings,
	refetch,
}: {
	actUpdateSettings?: any
	refetch?: (
		variables?: Partial<OperationVariables>
	) => Promise<ApolloQueryResult<any>>
}) {
	const { state, actions, updateState } =
		useReservationContext() as ReservationContextProps
	const { state: appState } = useAppContext() as AppContextProps

	const [creating, setCreating] = useState(false)

	const [details, setDetails] = useState<{
		date: string
		time: string
		party_size: number
		notes: string
		restrictions: string
	}>()

	const note = useRef(state.updatedReservation?.client_requests)

	useEffect(() => {
		let mounted = true
		const d = date(state.updatedReservation?.date)
		const time = date(state.updatedReservation?.arrival_time)

		if (mounted) {
			setDetails({
				date: d.format('dddd, MMMM D, YYYY'),
				time: time.format('h:mm A'),
				party_size: state.updatedReservation?.max_guests,
				notes: state.updatedReservation?.client_requests,
				restrictions: state.tags?.client_tags?.map(t => t.tag).join(', '),
			})
		}

		return () => {
			mounted = false
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const user = appState.viewer

	const reservation = state.existingReservation

	async function next() {
		setCreating(true)
		let sortedReservations = state.reservations
		try {
			if (state.existingReservation) {
				const { data } = await actions.CancelReservation({
					reservation_id: state.existingReservation?.id,
				})

				// filter out the reservation we just cancelled
				const filtered = state.reservations?.filter(
					res => res.id !== reservation?.id
				)

				sortedReservations = [
					...filtered,
					{
						...data,
						client_requests: state.existingReservation?.client_requests,
						max_guests: parseInt(data?.max_guests),
					},
				]
			}

			if (actions.reservationsError)
				throw new Error(
					'Could not modify reservation because cancellation failed'
				)

			if (actions.cancelReservationLoading) return

			const email =
				state.collected7RData?.email?.length > 0
					? state.collected7RData?.email
					: appState.viewer?.email || state.client?.email
			const phone =
				state.collected7RData?.phone?.length > 0
					? state.collected7RData?.phone
					: state.client?.phone_number ||
					  user.unionLeagueProfileMeta?.mobile_phone ||
					  user.unionLeagueProfileMeta?.home_phone ||
					  user.unionLeagueProfileMeta?.work_phone

			const { data, msg, status } = state.updatedReservation?.apid
				? (await actions.CreateReservation(
						{
							access_persistent_id: state.updatedReservation?.apid,
							venue_id: state.venue.id,
							date: date(state.updatedReservation?.date)
								.tz()
								.format('YYYY/MM/DD'),
							party_size: `${state.updatedReservation?.max_guests}`,
							time: state.updatedReservation?.arrival_time,
							notes: state.updatedReservation?.client_requests,
							email,
							first_name: appState.viewer?.firstName,
							last_name: appState.viewer?.lastName,
							phone,
						},
						state.tags
				  )) || {}
				: (await actions.CreateReservationRequest(
						{
							venue_id: state.venue.id,
							date: date(state.updatedReservation?.date)
								.tz()
								.format('YYYY/MM/DD'),
							party_size: `${state.updatedReservation?.max_guests}`,
							time: state.updatedReservation?.arrival_time,
							notes: state.updatedReservation?.client_requests,
							email,
							first_name: appState.viewer?.firstName,
							last_name: appState.viewer?.lastName,
							phone,
						},
						state.tags,
						state.client?.id
				  )) || {}

			if (status === 200) {
				if (
					state.collected7RData?.email?.length > 0 &&
					state.collected7RData?.phone?.length > 0 &&
					(!state.client || state.client === null)
				) {
					const envelope: MessagesSendTemplateRequest = {
						template_name: actUpdateSettings?.templateName,
						message: {
							subject: actUpdateSettings?.subject,
							to: [
								{
									name: actUpdateSettings?.toName,
									email: actUpdateSettings?.toEmailAddress,
									type: 'to',
								},
							],
							headers: {
								'reply-to': state.collected7RData?.email,
							},
						},
						template_content: [
							{ name: 'firstname', content: user.firstName },
							{ name: 'lastname', content: user.lastName },
							{ name: 'name', content: `${user.firstName} ${user.lastName}` },
							{
								name: 'membernumber',
								content: user.unionLeagueProfileMeta?.member_number,
							},
							{ name: 'email', content: email },
							{ name: 'phone', content: phone },
							{
								name: 'submission',
								content: `Act Update Request for user ${user.firstName} ${user.lastName}`,
							},
						],
					}

					sendTemplateEmail(envelope).then(res => {
						if (res === 'sent') console.log('ACT update request sent!!')
					})
				}

				const combined = state.updatedReservation.apid
					? [
							...sortedReservations,
							{
								...data,
								client_requests: note.current,
								shift_persistent_id:
									state.updatedReservation.shift_persistent_id,
							},
					  ]
					: sortedReservations

				updateState((items: ReservationContextState) => ({
					...items,
					reservations: combined,
					client: items.client || {
						email: state.collected7RData?.email,
						phone_number: state.collected7RData?.phone,
						id: data?.client_id,
					},
					completed: true,
				}))
			} else {
				updateState((items: ReservationContextState) => ({
					...items,
					error: {
						message: msg,
					},
				}))
			}
		} catch (error) {
			console.error(
				'Failed to confirm reservation in Reservation/Step/Confirm component:',
				error
			)
			updateState((items: ReservationContextState) => ({
				...items,
				error: {
					message: `Failed to confirm reservation ${
						state.updatedReservation?.apid ? '' : 'request'
					}`,
				},
				reservations: sortedReservations,
			}))
		} finally {
			if (refetch) refetch()
			setCreating(false)
		}
	}

	return (
		<Slide direction="left" in={true}>
			<div className={`step ${style.step} specific`}>
				{!creating ? (
					<>
						<VenueTitle element="h1" />
						{state.existingReservation?.status === 'UNAPPROVED' ||
						!state.updatedReservation?.apid ? (
							<>
								<h2>Wait List Request Details</h2>
								<p>
									Please note, this is not a confirmed reservation. When you
									click confirm, your request will be submitted and we will
									contact you to confirm.
								</p>
								<h2>Requesting</h2>
							</>
						) : null}

						{details ? (
							<div className="details">
								<ReservationDateTime format="dddd, MMMM D, YYYY" />
								<ReservationDateTime format="h:mm a" />
								<ReservationPartySize />

								{details.restrictions?.length ? (
									<>
										<div className="restrictions">
											<h2>Your Dietary Restrictions</h2>
											<div className="host">
												<span>{details.restrictions}</span>
											</div>
										</div>
									</>
								) : null}

								{details.notes?.length ? (
									<>
										<h2>Special Requests</h2>
										<span>{details.notes}</span>
									</>
								) : null}
							</div>
						) : null}

						<Button className="back-button" onClick={() => actions.goBack()}>
							Back
						</Button>
						<Button className="next-button" onClick={next}>
							Confirm
						</Button>
					</>
				) : (
					<>
						<div className="creating">
							<SpinnerRipple />
							<span>Processing, Please Wait...</span>
						</div>
					</>
				)}
			</div>
		</Slide>
	)
}
