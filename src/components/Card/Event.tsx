import Carousel, {
	CarouselSlide,
} from '@archipress/components/Carousels/Carousel'
import DropDownContent from '@archipress/components/DropDown/Content'
import ImageMap from '@archipress/components/ImageMap'
import PDFModal from '@archipress/components/Modals/PDF'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import style from '@styles/components/Card/Event.module.scss'
import Image from 'next/future/image'
import ReqInfoFormModal from '@archipress/components/Modals/ReqInfoForm'

export default function EventCard({
	event,
	locations,
}: {
	event: any
	locations: any
}) {
	const { state } = useAppContext() as AppContextProps

	const [openModal, setOpenModal] = useState(false)

	// league house locations
	const [slug, setSlug] = useState('')
	const requestInfoLabel = event.modalContent.requestInformation.label
	const requestInfoSubject = event.modalContent.requestInformation.subject
	const requestInfoEmailAddresses = event.modalContent.requestInformation.emailAddresses

	const downloadFile = event.modalContent.downloadHere.file?.mediaItemUrl
	const downloadLabel = event.modalContent.downloadHere.label

	const [location, setLocation] = useState(null)

	const authed = state?.loggedIn

	useEffect(() => {
		setLocation(
			locations?.find((item: { slug: string }) => item && item.slug === slug)
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [slug])

	const [pdfOpened, setPdfOpened] = useState(false)
	const [pdf, setPDF] = useState(null)
	const [reqInfoFormModalOpened, setReqInfoFormModalOpened] = useState(false)

	function openPDFModal(url: string) {
		setPDF(url)
		setPdfOpened(true)
	}

	function openReqInfoFormModal() {
		setReqInfoFormModalOpened(true)
	}

	function isSingleMenu(label: string, files: any[]) {
		if (files.length <= 1 && files[0].label === label) return true
		return false
	}

	function togglePDFOpen() {
		setPdfOpened(!pdfOpened)
	}

	function toggleReqInfoFormModalOpen() {
		setReqInfoFormModalOpened(!reqInfoFormModalOpened)
	}

	function getSlides(slides: { mediaItemUrl: string }[]) {
		const newSlides: CarouselSlide[] = slides.map(item => ({
			src: item.mediaItemUrl,
			type: 'img',
		}))

		return newSlides
	}

	return (
		<>
			{authed ? (
				<>
					{event.content.title?.toLowerCase().includes('league house') ? (
						<div className={style.event}>
							<div className="event-left">
								<Image
									placeholder="blur"
									blurDataURL={event.leftImage?.dataUrl}
									src={event.leftImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className="event-middle">
								<div className="event-middle-inner">
									<h3 className="title">{event.content.title}</h3>

									<h4 className="sub-title">{event.content.subTitle}</h4>

									<Button onClick={() => setOpenModal(!openModal)}>
										{event.content.buttonLabel}
									</Button>
								</div>
							</div>

							<div className="event-right">
								<Image
									placeholder="blur"
									blurDataURL={event.rightImage?.dataUrl}
									src={event.rightImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className={`modal ${openModal ? 'opened' : ''}`}>
								<FontAwesomeIcon
									icon={faTimes}
									className="close"
									onClick={() => setOpenModal(!openModal)}
								/>

								<h3>{event.content.title}</h3>

								<h4>{event.content.subTitle}</h4>

								<div className="info">
									{event.modalContent.slideshow ? (
										<Carousel
											slides={getSlides(event.modalContent.slideshow)}
										/>
									) : null}

									{event.modalContent.content ? (
										<div
											className="text"
											dangerouslySetInnerHTML={{
												__html: event.modalContent.content,
											}}
										/>
									) : null}

									{requestInfoLabel ? (
										<Button
											className="request-info"
											onClick={() => openReqInfoFormModal()}
										>
											{requestInfoLabel}
										</Button>
									) : null}

									<ImageMap
										slug="league-house"
										changeSlug={(slug: string) => setSlug(slug)}
									/>

									{location ? (
										<div className="location">
											<h3>{location.title}</h3>
											<span>Location: {location.location}</span>
											<span>Dimensions: {location.dimensions}</span>
											<div className="left">
												<div
													className="text"
													dangerouslySetInnerHTML={{
														__html: location.textContent,
													}}
												/>
											</div>

											<div className="right">
												<Image
													src={location.image.mediaItemUrl ?? ''}
													alt={`Image of ${location.title}`}
													fill={true}
													sizes="(max-width: 900px) 80vw"
													priority={true}
												/>
											</div>
										</div>
									) : null}

									{downloadLabel && downloadFile ? (
										<>
											<div className="download-pdf">
												<h3>Audio/Visual Capabilites</h3>

												<a
													href={downloadFile}
													target="_blank"
													download
													rel="noreferrer"
												>
													{downloadLabel}
												</a>
											</div>
										</>
									) : null}

									{event.modalContent.menus ? (
										<div className="menus">
											<h3>Menus</h3>
											<div>
												{event.modalContent.menus.map((m: any, i: number) => {
													return m.files ? (
														!isSingleMenu(m.label, m.files) ? (
															<DropDownContent
																label={m.label}
																component="span"
																content={m.files.map((file: any, f: number) => {
																	return (
																		<Button
																			key={f}
																			onClick={() =>
																				openPDFModal(
																					file.menuFile?.mediaItemUrl
																				)
																			}
																		>
																			{file.label}
																		</Button>
																	)
																})}
																key={i}
															/>
														) : (
															<div className="menu-button" key={i}>
																<Button
																	onClick={() =>
																		openPDFModal(
																			m.files[0]?.menuFile?.mediaItemUrl
																		)
																	}
																>
																	<span>{m.label}</span>
																</Button>
															</div>
														)
													) : null
												})}
											</div>
										</div>
									) : null}
								</div>
							</div>
						</div>
					) : (
						<div className={style.event}>
							<div className="event-left">
								<Image
									placeholder="blur"
									blurDataURL={event.leftImage?.dataUrl}
									src={event.leftImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className="event-middle">
								<div className="event-middle-inner">
									<h3 className="title">{event.content.title}</h3>

									<h4 className="sub-title">{event.content.subTitle}</h4>

									<Button onClick={() => setOpenModal(!openModal)}>
										{event.content.buttonLabel}
									</Button>
								</div>
							</div>

							<div className="event-right">
								<Image
									placeholder="blur"
									blurDataURL={event.rightImage?.dataUrl}
									src={event.rightImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className={`modal ${openModal ? 'opened' : ''}`}>
								<FontAwesomeIcon
									icon={faTimes}
									className="close"
									onClick={() => setOpenModal(!openModal)}
								/>

								<h3>{event.content.title}</h3>

								<h4>{event.content.subTitle}</h4>

								<div className="info">
									{event.modalContent.slideshow ? (
										<Carousel
											slides={getSlides(event.modalContent.slideshow)}
										/>
									) : null}

									{event.modalContent.content ? (
										<div
											className="text"
											dangerouslySetInnerHTML={{
												__html: event.modalContent.content,
											}}
										/>
									) : null}

									{event.modalContent.menus ? (
										<div className="menus">
											<h3>Menus</h3>
											<div>
												{event.modalContent.menus.map((m: any, i: number) => {
													return m.files ? (
														!isSingleMenu(m.label, m.files) ? (
															<DropDownContent
																label={m.label}
																component="span"
																content={m.files.map((file: any, f: number) => {
																	return (
																		<Button
																			key={f}
																			onClick={() =>
																				openPDFModal(file.menuFile.mediaItemUrl)
																			}
																		>
																			{file.label}
																		</Button>
																	)
																})}
																key={i}
															/>
														) : (
															<div className="menu-button" key={i}>
																<Button
																	onClick={() =>
																		openPDFModal(
																			m.files[0]?.menuFile.mediaItemUrl
																		)
																	}
																>
																	<span>{m.label}</span>
																</Button>
															</div>
														)
													) : null
												})}
											</div>
										</div>
									) : null}

									{requestInfoLabel ? (
										<Button
											className="request-info"
											onClick={() => openReqInfoFormModal()}
										>
											{requestInfoLabel}
										</Button>
									) : null}
								</div>
							</div>
						</div>
					)}
					<PDFModal pdf={pdf} open={pdfOpened} callback={togglePDFOpen} />
					<ReqInfoFormModal open={reqInfoFormModalOpened} callback={toggleReqInfoFormModalOpen}
						subject={requestInfoSubject} eAddresses={requestInfoEmailAddresses} location={event.content.title} />
				</>
			) : !event.membersOnly ? (
				<>
					{event.content.title?.toLowerCase().includes('league house') ? (
						<div className={style.event}>
							<div className="event-left">
								<Image
									placeholder="blur"
									blurDataURL={event.leftImage?.dataUrl}
									src={event.leftImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className="event-middle">
								<div className="event-middle-inner">
									<h3 className="title">{event.content.title}</h3>

									<h4 className="sub-title">{event.content.subTitle}</h4>

									<Button onClick={() => setOpenModal(!openModal)}>
										{event.content.buttonLabel}
									</Button>
								</div>
							</div>

							<div className="event-right">
								<Image
									placeholder="blur"
									blurDataURL={event.rightImage?.dataUrl}
									src={event.rightImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className={`modal ${openModal ? 'opened' : ''}`}>
								<FontAwesomeIcon
									icon={faTimes}
									className="close"
									onClick={() => setOpenModal(!openModal)}
								/>

								<h3>{event.content.title}</h3>

								<h4>{event.content.subTitle}</h4>

								<div className="info">
									{event.modalContent.slideshow ? (
										<Carousel
											slides={getSlides(event.modalContent.slideshow)}
										/>
									) : null}

									{event.modalContent.content ? (
										<div
											className="text"
											dangerouslySetInnerHTML={{
												__html: event.modalContent.content,
											}}
										/>
									) : null}

									{requestInfoLabel ? (
										<Button
											className="request-info"
											onClick={() => openReqInfoFormModal()}
										>
											{requestInfoLabel}
										</Button>
									) : null}

									<ImageMap
										slug="league-house"
										changeSlug={(slug: string) => setSlug(slug)}
									/>

									{location ? (
										<div className="location">
											<h3>{location.title}</h3>
											<span>Location: {location.location}</span>
											<span>Dimensions: {location.dimensions}</span>
											<div className="left">
												<div
													className="text"
													dangerouslySetInnerHTML={{
														__html: location.textContent,
													}}
												/>
											</div>

											<div className="right">
												<Image
													placeholder="blur"
													blurDataURL={location.image?.dataUrl}
													src={location.image.mediaItemUrl}
													alt={`Image of ${location.title}`}
													fill={true}
													sizes="25vw"
												/>
											</div>
										</div>
									) : null}

									{downloadLabel && downloadFile ? (
										<>
											<div className="download-pdf">
												<h3>Audio/Visual Capabilites</h3>

												<a
													href={downloadFile}
													target="_blank"
													download
													rel="noreferrer"
												>
													{downloadLabel}
												</a>
											</div>
										</>
									) : null}

									{event.modalContent.menus ? (
										<div className="menus">
											<h3>Menus</h3>
											<div>
												{event.modalContent.menus.map((m: any, i: number) => {
													return m.files ? (
														!isSingleMenu(m.label, m.files) ? (
															<DropDownContent
																label={m.label}
																component="span"
																content={m.files.map((file: any, f: number) => {
																	return (
																		<Button
																			key={f}
																			onClick={() =>
																				openPDFModal(file.menuFile.mediaItemUrl)
																			}
																		>
																			{file.label}
																		</Button>
																	)
																})}
																key={i}
															/>
														) : (
															<div className="menu-button" key={i}>
																<Button
																	onClick={() =>
																		openPDFModal(
																			m.files[0]?.menuFile.mediaItemUrl
																		)
																	}
																>
																	<span>{m.label}</span>
																</Button>
															</div>
														)
													) : null
												})}
											</div>
										</div>
									) : null}
								</div>
							</div>
						</div>
					) : (
						<div className={style.event}>
							<div className="event-left">
								<Image
									placeholder="blur"
									blurDataURL={event.leftImage?.dataUrl}
									src={event.leftImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className="event-middle">
								<div className="event-middle-inner">
									<h3 className="title">{event.content.title}</h3>

									<h4 className="sub-title">{event.content.subTitle}</h4>

									<Button onClick={() => setOpenModal(!openModal)}>
										{event.content.buttonLabel}
									</Button>
								</div>
							</div>

							<div className="event-right">
								<Image
									placeholder="blur"
									blurDataURL={event.rightImage?.dataUrl}
									src={event.rightImage?.mediaItemUrl}
									alt={`Image of life at ${event.content.title}`}
									fill={true}
									sizes="25vw"
								/>
							</div>

							<div className={`modal ${openModal ? 'opened' : ''}`}>
								<FontAwesomeIcon
									icon={faTimes}
									className="close"
									onClick={() => setOpenModal(!openModal)}
								/>

								<h3>{event.content.title}</h3>

								<h4>{event.content.subTitle}</h4>

								<div className="info">
									{event.modalContent.slideshow ? (
										<Carousel
											slides={getSlides(event.modalContent.slideshow)}
										/>
									) : null}

									{event.modalContent.content ? (
										<div
											className="text"
											dangerouslySetInnerHTML={{
												__html: event.modalContent.content,
											}}
										/>
									) : null}

									{event.modalContent.menus ? (
										<div className="menus">
											<h3>Menus</h3>
											<div>
												{event.modalContent.menus.map((m: any, i: number) => {
													return m.files ? (
														!isSingleMenu(m.label, m.files) ? (
															<DropDownContent
																label={m.label}
																component="span"
																content={m.files.map((file: any, f: number) => {
																	return (
																		<Button
																			key={f}
																			onClick={() =>
																				openPDFModal(file.menuFile.mediaItemUrl)
																			}
																		>
																			{file.label}
																		</Button>
																	)
																})}
																key={i}
															/>
														) : (
															<div className="menu-button" key={i}>
																<Button
																	onClick={() =>
																		openPDFModal(
																			m.files[0]?.menuFile.mediaItemUrl
																		)
																	}
																>
																	<span>{m.label}</span>
																</Button>
															</div>
														)
													) : null
												})}
											</div>
										</div>
									) : null}

									{requestInfoLabel ? (
										<Button
											className="request-info"
											onClick={() => openReqInfoFormModal()}
										>
											{requestInfoLabel}
										</Button>
									) : null}
								</div>
							</div>
						</div>
					)}
					<PDFModal pdf={pdf} open={pdfOpened} callback={togglePDFOpen} />
					<ReqInfoFormModal open={reqInfoFormModalOpened} callback={toggleReqInfoFormModalOpen}
						subject={requestInfoSubject} eAddresses={requestInfoEmailAddresses} location={event.content.title} />
				</>
			) : null}
		</>
	)
}
