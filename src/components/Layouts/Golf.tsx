import { ReactNode } from 'react'
import { PublicLayout } from '@archipress/components'
import style from '@styles/pages/golf.module.scss'
import Carousel, {
	CarouselSlide,
} from '@archipress/components/Carousels/Carousel'
import HoleCarousel, {
	HoleCarouselSlide,
} from '@archipress/components/Carousels/HoleCarousel'
import { faPhoneFlip, faEnvelope } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import {
	useAppContext,
	AppContextProps,
} from '@archipress/utilities/AppContext'

import ForeteesButton from '@archipress/components/Buttons/ForeteesButton'

export default function GolfLayout({
	page,
	children,
}: {
	page: any
	children?: ReactNode
}) {
	const { state } = useAppContext() as AppContextProps

	const authed = state?.loggedIn

	const {
		golfPageCarousel,
		golfMap,
		subGolfBook,
		subGolfHoles,
		subGolfStaff,
		title,
		content,
		featuredImage,
	} = page

	const media = golfPageCarousel.media ?? []
	const slides: CarouselSlide[] = media.map(
		(item: any) =>
			item && {
				src: item.uploadImage?.mediaItemUrl,
				type: item.mediaType as any,
			}
	)

	// const book = subGolfBook

	const featuredHoles = subGolfHoles
	const holeItems = featuredHoles.holeItems ?? []
	const holeCarouselSlides: HoleCarouselSlide[] = holeItems.map(
		(item: any) =>
			item && {
				title: item.holeItemTitle,
				desc: item.holeItemDesc,
				src: item.holeItemImage?.mediaItemUrl,
				dataUrl: item.holeItemImage?.dataUrl,
			}
	)

	const staff = subGolfStaff
	const staffItems = staff.staffItems

	const map = golfMap

	const logoImage = featuredImage?.node?.mediaItemUrl

	return (
		<>
			<PublicLayout
				seo={{
					title,
				}}
				logo={logoImage}
			>
				<>
					<div className={`${style.page} ${style.golfTorresdalePage}`}>
						<Carousel slides={slides} type="golfCarousel" />

						{subGolfBook ? (
							<section className={style.subGolfBook}>
								<div className={style.intro}>
									<h2>{title}</h2>

									<div
										className={style.desc}
										dangerouslySetInnerHTML={{
											__html: authed
												? `${content} ${subGolfBook.bookDesc}`
												: content,
										}}
									/>

									{authed ? (
										<ForeteesButton className={style.foreteesBtn}>
											Tee Times
										</ForeteesButton>
									) : null}
								</div>

								<div className={style.image}>
									{authed ? (
										<a
											href={subGolfBook.bookLink}
											target="_blank"
											rel="noreferrer"
											style={{
												position: 'relative',
											}}
										>
											<Image
												priority={subGolfBook.bookImage?.dataURL ? false : true}
												placeholder={
													subGolfBook.bookImage?.dataURL ? 'blur' : 'empty'
												}
												blurDataURL={
													subGolfBook.bookImage?.dataURL
														? subGolfBook.bookImage?.dataURL
														: ''
												}
												src={subGolfBook.bookImage?.mediaItemUrl}
												alt={subGolfBook.bookImage?.altText ?? 'Image'}
												layout="fill"
											/>
										</a>
									) : (
										<a
											href="#"
											style={{
												position: 'relative',
												pointerEvents: 'none',
												cursor: 'unset',
											}}
										>
											<Image
												priority={
													subGolfBook.bookImageBeforeLogin?.dataURL
														? false
														: true
												}
												placeholder={
													subGolfBook.bookImageBeforeLogin?.dataURL
														? 'blur'
														: 'empty'
												}
												blurDataURL={
													subGolfBook.bookImageBeforeLogin?.dataURL
														? subGolfBook.bookImageBeforeLogin?.dataURL
														: ''
												}
												src={subGolfBook.bookImageBeforeLogin?.mediaItemUrl}
												alt={subGolfBook.bookImage?.altText ?? 'Image'}
												layout="fill"
											/>
										</a>
									)}
								</div>
							</section>
						) : null}

						{featuredHoles ? (
							<section className={style.featuredHoles}>
								<h2>{featuredHoles.holesTitle}</h2>

								<HoleCarousel slides={holeCarouselSlides} />
							</section>
						) : null}

						{staff ? (
							<section className={style.subGolfStaff}>
								<div className={style.intro}>
									<h2>{staff.staffTitle}</h2>
								</div>

								<div className={style.items}>
									{staffItems.map((item: any, i: number) => {
										return (
											<div className={style.itemContainer} key={i}>
												<div className={style.item}>
													<Image
														src={item.staffItemImage?.mediaItemUrl}
														alt={item.staffItemImage?.altText ?? 'Image'}
														layout="fill"
														priority={true}
													/>

													<div className={style.info}>
														<h3>
															{item.staffItemName}
															<br />
															{item.staffItemRole}
														</h3>

														{authed ? (
															<div className={style.details}>
																<a
																	href={`mailto:${item.staffItemEmail}`}
																	className={style.email}
																>
																	<span>
																		<FontAwesomeIcon icon={faEnvelope} />
																		{item.staffItemEmail}
																	</span>
																</a>

																<a href={`tel:${item.staffItemPhone}`}>
																	<FontAwesomeIcon icon={faPhoneFlip} />
																	{item.staffItemPhone}
																</a>
															</div>
														) : null}
													</div>

													<div className={style.breaker}></div>
												</div>
											</div>
										)
									})}
								</div>
							</section>
						) : null}

						{map ? (
							<section className={style.map}>
								<h2>{map.mapTitle}</h2>

								<div className={style.mapContainer}>
									<iframe src={map.mapUrl}></iframe>
								</div>
							</section>
						) : null}
					</div>
				</>
			</PublicLayout>
		</>
	)
}
