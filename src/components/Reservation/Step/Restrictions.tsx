import VenueTitle from '@archipress/components/Venue/Title'
import {
	ReservationContextProps,
	ReservationContextState,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import { Tag } from '@archipress/utilities/reservationInterfaces'
import { Button, Slide } from '@mui/material'
import { useState } from 'react'
import style from '@styles/components/Reservation/Step/Restrictions.module.scss'
import { ReservationTags } from '@archipress/constants/tags'

export default function ReservationStepRestrictions() {
	const { state, actions, updateState } =
		useReservationContext() as ReservationContextProps

	const TAGS = ReservationTags
	const [selected, setSelected] = useState<Tag[]>(state.tags?.client_tags)

	const setTags = {
		get: selected,
		set: (v: Tag) => {
			const removed = selected?.filter(t => t.tag !== v.tag)
			const curr = selected ?? []
			const added = [...curr, v]
			if (selected?.some(t => t.tag === v.tag)) setSelected(removed)
			else setSelected(added)
		},
	}

	function isSelected(tag: Tag) {
		return selected?.some(t => t.tag === tag.tag)
	}

	function UpdateTags() {
		updateState((items: ReservationContextState) => ({
			...items,
			tags: {
				...items.tags,
				client_tags: selected,
			},
		}))
		actions.goForward()
	}

	return (
		<Slide direction="left" in={true}>
			<div className={`step ${style.step}`}>
				<div className="left">
					<VenueTitle element="h1" />

					<p>Please review or update your dietary restrictions:</p>
					<Button className="back-button ghost" onClick={actions.goBack}>
						<span>Back</span>
					</Button>
				</div>

				<div className="divider" />

				<div className="right">
					<div className="tags">
						{TAGS.map(tag => (
							<Button
								key={tag.tag}
								className={`tag ghost ${isSelected(tag) ? 'selected-tag' : ''}`}
								onClick={() => setTags.set(tag)}
							>
								{tag.tag}
							</Button>
						))}
					</div>
					<hr />
					<Button className="next-button" onClick={UpdateTags}>
						Next
					</Button>
				</div>
			</div>
		</Slide>
	)
}
