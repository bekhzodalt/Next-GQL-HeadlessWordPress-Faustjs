import { PublicLayout } from '@archipress/components'
import { gql } from '@apollo/client'
import style from '@styles/pages/transportation-and-parking.module.scss'
import Image from 'next/future/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot } from '@fortawesome/pro-light-svg-icons'
import CarServiceModal from '@archipress/components/Modals/CarService'
import { useState } from 'react'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { TransportationAndParkingPageDataFragment } from '@archipress/fragments/TransportationAndParkingPages'
import NavigationLink from '@archipress/components/Links/Navigation'

export interface PageData {
	bannerImage: {
		mediaItemUrl: string
	}
	locationsSection: {
		title: string
		locations: {
			name: string
			address: string
			mapUrl: string
			externalMapUrl: string
		}[]
	}
	parkingRates: {
		title: string
		rates: {
			title: string
			content: string
		}[]
	}
	rideServiceRates: {
		title: string
		content: string
	}
	carShareRates: {
		title: string
		content: string
	}
	requestForm: {
		buttonLabel: string
		subject: string
		emailAddresses: {
			name: string
			email: string
			type: string
		}[]
		modalDescription: string
	}
}

export default function Component(props: any) {
	const { state } = useAppContext() as AppContextProps
	const authed = state?.loggedIn

	const [carServiceModalOpened, setCarServiceModalOpened] = useState(false)

	// Loading state for previews
	if (props.loading) {
		return <>Loading...</>
	}

	const page = props?.data?.page
	const title = page?.title
	const pageData: PageData = page?.transportationAndParkingPage?.pageContainer

	function openCarServiceModal() {
		setCarServiceModalOpened(true)
	}

	function toggleCarServiceModalOpen() {
		setCarServiceModalOpened(!carServiceModalOpened)
	}

	return (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<>
					<div className={style.page}>
						<div className={style.banner}>
							<Image
								src={pageData?.bannerImage?.mediaItemUrl ?? ''}
								fill={true}
								alt="Banner Image"
							/>
						</div>

						<div className={`${style.locationsSection} ${style.section}`}>
							<h2>{pageData.locationsSection.title}</h2>

							<div className={style.locations}>
								{pageData.locationsSection.locations.map((location, i) => {
									return (
										<div className={style.location} key={i}>
											<div className={style.left}>
												<FontAwesomeIcon
													icon={faLocationDot}
													className={style.locationIcon}
												/>
												<NavigationLink href={location.externalMapUrl || ''}>
													<p>{location.name}</p>
													<p>{location.address}</p>
												</NavigationLink>
											</div>
											<div className={style.right}>
												<iframe src={location.mapUrl}></iframe>
											</div>
										</div>
									)
								})}
							</div>
						</div>

						<div className={`${style.parkingRates} ${style.section}`}>
							<h2>{pageData.parkingRates.title}</h2>

							<div className={style.rates}>
								{pageData.parkingRates.rates.map((rate, i) => {
									return (
										<div className={style.rate} key={i}>
											<h4>{rate.title}</h4>
											<div
												className={style.content}
												dangerouslySetInnerHTML={{ __html: rate.content }}
											/>
										</div>
									)
								})}
							</div>
						</div>

						<div className={`${style.rideServiceRates} ${style.section}`}>
							<h2>{pageData.rideServiceRates.title}</h2>

							<div
								className={style.content}
								dangerouslySetInnerHTML={{
									__html: pageData.rideServiceRates.content,
								}}
							/>
						</div>

						<div className={`${style.carShareRates} ${style.section}`}>
							<h2>{pageData.carShareRates.title}</h2>

							<div
								className={style.content}
								dangerouslySetInnerHTML={{
									__html: pageData.carShareRates.content,
								}}
							/>
						</div>

						{authed ? (
							<div className={`${style.requestButton} ${style.section}`}>
								<h4 onClick={openCarServiceModal}>
									{pageData.requestForm.buttonLabel}
								</h4>
							</div>
						) : null}

						<CarServiceModal
							open={carServiceModalOpened}
							callback={toggleCarServiceModalOpen}
							subject={pageData.requestForm.subject}
							eAddresses={pageData.requestForm.emailAddresses}
							modalDescription={pageData.requestForm.modalDescription}
							className={style.modal}
						/>
					</div>
				</>
			</PublicLayout>
		</>
	)
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = TransportationAndParkingPageDataFragment
