import VenueTitle from '@archipress/components/Venue/Title'
import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { Button, Slide } from '@mui/material'
import { useState } from 'react'
import style from '@styles/components/Reservation/Step/Notes.module.scss'

export default function ReservationStepNotes() {
	const { state, actions, updateState } =
		useReservationContext() as ReservationContextProps

	const [text, updateText] = useState(state.updatedReservation?.client_requests)

	const handleChange = {
		get: () => text,
		set: (v: string) => updateText(v),
	}

	function updateNote() {
		updateState((items: ReservationContextState) => ({
			...items,
			updatedReservation: {
				...items.updatedReservation,
				client_requests: text,
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
						If you have any special requests, or your guests have dietary
						restrictions, please let us know here:
					</p>

					<p></p>

					<Button className="back-button" onClick={() => actions.goBack()}>
						<span>Back</span>
					</Button>
				</div>

				<div className="divider" />

				<div className="right">
					<textarea
						className="no-label no-padding"
						value={handleChange.get()}
						onChange={e => handleChange.set(e.target.value)}
					/>

					<Button className="ghost" onClick={() => updateNote()}>
						Next
					</Button>
				</div>
			</div>
		</Slide>
	)
}
