import { PublicLayout } from '@archipress/components'
import { gql } from '@apollo/client'
import style from '@styles/pages/golf.module.scss'
import Carousel, {
	CarouselSlide,
} from '@archipress/components/Carousels/Carousel'
import GolfHistory from '@archipress/components/GolfHistory'
import {
	faPhoneFlip,
	faDiamondTurnRight,
} from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import InstagramFeed from '@archipress/components/Instagram/Feed'
import ForeteesButton from '@archipress/components/Buttons/ForeteesButton'
import NavigationLink from '@archipress/components/Links/Navigation'

export default function Component(props: any) {
	const { state } = useAppContext() as AppContextProps
	const loggedIn = state?.loggedIn
	const {
		golfPageCarousel,
		golfHistory,
		golfAmenities,
		golfRecognition,
		golfMap,
		golfBook,
		title,
	} = props?.data?.page
	const slides: CarouselSlide[] = golfPageCarousel?.media.map(
		(item: any) =>
			item && {
				src: item.uploadImage?.mediaItemUrl,
				type: item.mediaType as any,
			}
	)

	return (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<>
					<div className={`${style.page} ${style.golfPage}`}>
						<Carousel slides={slides} type="golfCarousel" />

						<GolfHistory
							history={golfHistory}
							historyCards={golfHistory?.historyCards ?? []}
						/>

						{golfAmenities && golfAmenities.amenities ? (
							<section className={style.amenities}>
								<div className={style.intro}>
									<h4>{golfAmenities.amenitiesTitle}</h4>

									<div
										className={style.desc}
										dangerouslySetInnerHTML={{
											__html: golfAmenities.amenitiesDesc,
										}}
									/>
								</div>

								<div className={style.items}>
									{golfAmenities.amenities.map((item: any, i: number) => {
										return (
											<div className={style.itemContainer} key={i}>
												<div className={style.item}>
													<NavigationLink
														href={item.amenityLink ?? '/'}
														className={style.itemImg}
													>
														<Image
															priority={
																item.amenityImage?.dataUrl ? false : true
															}
															placeholder={
																item.amenityImage?.dataUrl ? 'blur' : 'empty'
															}
															blurDataURL={
																item.amenityImage?.dataUrl
																	? item.amenityImage?.dataUrl
																	: ''
															}
															src={item.amenityImage?.mediaItemUrl}
															alt={item.amenityImage?.altText ?? 'Image'}
															layout="fill"
														/>
													</NavigationLink>

													<div className={style.info}>
														<NavigationLink href={item.amenityLink ?? '/'}>
															<h3>{item.amenityTitle}</h3>
														</NavigationLink>

														<div className={style.details}>
															<a
																href={item.amenityDetails.detailLink ?? '/'}
																className={style.address}
															>
																<span>{item.amenityDetails.detail1}</span>
																<span>
																	{item.amenityDetails.detail2}
																	<FontAwesomeIcon icon={faDiamondTurnRight} />
																</span>
															</a>

															<a
																href={`tel:${item.amenityDetails.phoneNumber}`}
															>
																{item.amenityDetails.shopTitle}{' '}
																{item.amenityDetails.phoneNumber}
																<FontAwesomeIcon icon={faPhoneFlip} />
															</a>
														</div>
													</div>
												</div>

												<div className={style.breaker}></div>
											</div>
										)
									})}
								</div>
							</section>
						) : null}

						{loggedIn && golfBook && golfBook.bookLink ? (
							<section className={style.book}>
								<div className={style.intro}>
									<h2>{golfBook.bookTitle}</h2>
									<div
										className={style.desc}
										dangerouslySetInnerHTML={{ __html: golfBook.bookDesc }}
									/>

									<ForeteesButton className={style.foreteesBtn}>
										Tee Times
									</ForeteesButton>
								</div>

								<div className={style.image}>
									<a href={golfBook.bookLink} target="_blank" rel="noreferrer">
										<Image
											priority={golfBook.bookImage?.dataUrl ? false : true}
											placeholder={
												golfBook.bookImage?.dataUrl ? 'blur' : 'empty'
											}
											blurDataURL={
												golfBook.bookImage?.dataUrl
													? golfBook.bookImage?.dataUrl
													: ''
											}
											src={golfBook.bookImage?.mediaItemUrl}
											alt={golfBook.bookImage?.altText ?? 'Image'}
											layout="fill"
										/>
									</a>
								</div>
							</section>
						) : null}

						<InstagramFeed
							pageURI="golf"
							tokenName="Golf"
							limit={6}
							className="golfFeed"
						/>

						{golfRecognition && golfRecognition.recognitionItems ? (
							<section
								className={style.recognition}
								style={{
									background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${golfRecognition.recognitionBgImage?.mediaItemUrl})`,
								}}
							>
								<h2>{golfRecognition.recognitionTitle}</h2>

								<div className={style.items}>
									{golfRecognition.recognitionItems.map(
										(item: any, i: number) => {
											return (
												<div className={style.item} key={i}>
													<a
														href={item.recognitionItemLink ?? '/'}
														target="_blank"
														rel="noreferrer"
													>
														<strong>{item.recognitionItemTitle}</strong>
														<i>{item.recognitionItemDate}</i>
													</a>
												</div>
											)
										}
									)}
								</div>
							</section>
						) : null}

						{golfMap ? (
							<section className={style.map}>
								<h2>{golfMap.mapTitle}</h2>

								<div className={style.mapContainer}>
									<iframe src={golfMap.mapUrl}></iframe>
								</div>
							</section>
						) : null}
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

Component.query = gql`
	query GetPageData($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			title
			content
			golfPageCarousel {
				media {
					mediaType
					uploadImage {
						mediaItemUrl
					}
				}
			}

			golfHistory {
				historyCards {
					fieldGroupName
					historyCardDesc
					historyCardImage {
						dataUrl(size: "thumbnail")
						altText
						mediaItemUrl
					}
					historyCardTitle
				}
				historyDesc
				historyGridItems {
					historyGridImage {
						dataUrl(size: "thumbnail")
						altText
						mediaItemUrl
					}
					historyGridLabel
				}
				historyTitle
			}

			golfAmenities {
				amenities {
					amenityDetails {
						detail1
						detail2
						detailLink
						phoneNumber
						shopTitle
					}
					amenityImage {
						altText
						dataUrl(size: "thumbnail")
						mediaItemUrl
					}
					amenityLink
					amenityTitle
				}
				amenitiesDesc
				amenitiesTitle
			}

			golfBook {
				bookButtonText
				bookDesc
				bookImage {
					altText
					dataUrl(size: "thumbnail")
					mediaItemUrl
				}
				bookLink
				bookTitle
			}

			golfMap {
				mapTitle
				mapUrl
			}

			golfRecognition {
				recognitionBgImage {
					altText
					dataUrl(size: "thumbnail")
					mediaItemUrl
				}
				recognitionItems {
					recognitionItemDate
					recognitionItemLink
					recognitionItemTitle
				}
				recognitionTitle
			}
		}
	}
`
