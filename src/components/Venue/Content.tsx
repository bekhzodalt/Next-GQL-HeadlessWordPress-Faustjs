import { ApolloQueryResult, OperationVariables } from '@apollo/client'
import Carousel from '@archipress/components/Carousels/Carousel'
import NavigationLink from '@archipress/components/Links/Navigation'
import ReservationModal from '@archipress/components/Reservation/Modal'
import {
	ReservationContextProps,
	useReservationContext,
} from '@archipress/utilities/ReservationContext'
import {
	DiningVenue,
	SevenroomsVenue,
} from '@archipress/utilities/venueInterfaces'
import { Button } from '@mui/material'
import style from '@styles/components/Venue/Content.module.scss'
import { kebabCase } from 'lodash'
import Image from 'next/future/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function VenueContent({
	venues,
	diningVenue,
	actUpdateSettings,
	reservationSteps,
	calendarData,
	refetch,
}: {
	venues?: SevenroomsVenue[]
	diningVenue?: DiningVenue
	actUpdateSettings?: any
	reservationSteps?: { show: boolean; name: string }[]
	calendarData?: {
		types: string[]
		message: string
		title: string
	}
	refetch?: (
		variables?: Partial<OperationVariables>
	) => Promise<ApolloQueryResult<any>>
}) {
	const { state, actions } = useReservationContext() as ReservationContextProps

	const sevenroomsVenue = venues?.find(
		(v: any) =>
			v.venue_url_key?.toLowerCase() === diningVenue?.slug?.toLowerCase()
	)

	const canMake =
		sevenroomsVenue && diningVenue.status?.toLowerCase() === 'open'

	const [detailsState, updateDetailsState] = useState<{
		content: string | null
		selected: string | null
	}>({
		content: null,
		selected: null,
	})

	useEffect(() => {
		const content =
			diningVenue.details?.find(detail =>
				detail.label?.toLowerCase()?.includes('hours')
			)?.content ??
			diningVenue.details?.find(detail =>
				detail.label?.toLowerCase()?.includes('about')
			)?.content

		const selected = diningVenue.details?.find(detail =>
			detail.label?.toLowerCase()?.includes('hours')
		)
			? 'hours-of-operation'
			: 'about'

		updateDetailsState({
			...detailsState,
			content,
			selected,
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [diningVenue])

	return (
		<section className={style.content}>
			<div className={style.details}>
				<div className={style.detail}>
					{diningVenue.logo ? (
						<Image
							src={diningVenue.logo ?? ''}
							alt={`${diningVenue.name} Logo`}
							width={300}
							height={300}
							className={style.logo}
						/>
					) : null}

					<div className={style.menu}>
						{diningVenue.details?.map((item, i) => {
							if (item.url) {
								return (
									<NavigationLink
										key={i}
										href={item.url}
										className={`${
											detailsState.selected ===
											kebabCase(item.label?.toLowerCase())
												? style.selected
												: ''
										}`}
									>
										{item.label}
									</NavigationLink>
								)
							}
							return (
								<Button
									key={i}
									onClick={() =>
										updateDetailsState({
											...detailsState,
											content: item.content,
											selected: kebabCase(item.label?.toLowerCase()),
										})
									}
									className={`${
										detailsState.selected ===
										kebabCase(item.label?.toLowerCase())
											? style.selected
											: ''
									}`}
								>
									{item.label}
								</Button>
							)
						})}
					</div>

					<div
						className={style.text}
						dangerouslySetInnerHTML={{ __html: detailsState.content }}
					/>
				</div>

				{canMake ? (
					<Button
						onClick={() =>
							actions.toggleReservationModalOpen(
								true,
								state.existingReservation,
								diningVenue,
								sevenroomsVenue
							)
						}
						className={style.reservationButton}
					>
						Make a Reservation
					</Button>
				) : null}
			</div>

			<div className={style.featured}>
				{diningVenue.venueSlides ? (
					<Carousel slides={diningVenue.venueSlides} videoType="video" />
				) : diningVenue.featuredImage ? (
					<Image
						src={diningVenue.featuredImage}
						alt={`${diningVenue.name} Featured Image`}
						width={1000}
						height={800}
						priority={true}
					/>
				) : null}
			</div>

			<ReservationModal
				actUpdateSettings={actUpdateSettings}
				reservationSteps={reservationSteps}
				calendarData={calendarData}
				refetch={refetch}
				venues={venues}
			/>
		</section>
	)
}
