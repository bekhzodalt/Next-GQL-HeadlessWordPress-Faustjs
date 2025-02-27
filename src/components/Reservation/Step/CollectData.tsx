import VenueTitle from '@archipress/components/Venue/Title'
import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'

import { Button, Slide, Typography } from '@mui/material'
import { FormEvent, useState } from 'react'
import style from '@styles/components/Reservation/Step/CollectData.module.scss'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'

export default function ReservationCollectData() {
	const { updateState } = useReservationContext() as ReservationContextProps
	const { state } = useAppContext() as AppContextProps

	const [email, setEmail] = useState(state.viewer?.email || '')
	const [phone, setPhone] = useState('')

	function nextStep(e: FormEvent) {
		e.preventDefault()

		updateState((items: ReservationContextState) => ({
			...items,
			collected7RData: {
				email,
				phone,
			},
			step: items.step + 1,
		}))
	}

	return (
		<Slide direction="left" in={true}>
			<div className={`step ${style.step}`}>
				<div className="left">
					<VenueTitle element="h1" />

					<p>
						We need more information to create your reservation. <br /> Please
						provide a valid email and phone number to continue:
					</p>
				</div>

				<div className="divider" />

				<div className="right">
					<form onSubmit={e => nextStep(e)}>
						<Typography variant="subtitle1">
							<input
								placeholder="email address"
								type="email"
								value={email}
								onChange={e => setEmail(e.target.value)}
								required
							/>
						</Typography>

						<Typography variant="subtitle1">
							<input
								type="text"
								value={phone}
								onChange={e => setPhone(e.target.value)}
								placeholder="+ country code (xxx) xxx-xxxx"
								required
							/>
						</Typography>

						<Typography
							component={Button}
							variant="subtitle1"
							className="next-button"
							type="submit"
						>
							Next
						</Typography>
					</form>
				</div>
			</div>
		</Slide>
	)
}
