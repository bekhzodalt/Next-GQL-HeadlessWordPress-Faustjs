import { PublicLayout } from '@archipress/components'
import { gql } from '@apollo/client'
import style from '@styles/pages/membership.module.scss'
import { FlipCard } from '@archipress/components'
import { FlipCardProps } from '@archipress/components/Card/Flip'
import ScrollToTopButton from '@archipress/components/Buttons/ScrollToTopButton'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { useState } from 'react'
import ProposeMemberModal from '@archipress/components/Modals/ProposeMember'
import BlueCardModal from '@archipress/components/Modals/BlueCard'
import { MenuItemPartial } from '@archipress/utilities/MenuContext'
import { MenuFragment } from '@archipress/fragments/Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import Image from 'next/future/image'
import { Modal } from '@mui/material'
import NavigationLink from '@archipress/components/Links/Navigation'
import { MembershipPageDataFragment } from '@archipress/fragments/MembershipPages'

export interface BlueCardPageData {
	subject: string
	emailAddresses: {
		name: string
		email: string
		type: string
	}[]
}

export function Page({ data }: { data: any }) {
	const { state } = useAppContext() as AppContextProps
	const authed = state?.loggedIn

	const [proposeMemberModalOpened, setProposeMemberModalOpened] =
		useState(false)
	const [blueCardModalOpened, setBlueCardModalOpened] = useState(true)
	const [memberNewsModalOpened, setMemberNewsModalOpened] = useState(false)
	const [welcomeModalOpened, setWelcomeModalOpened] = useState(false)
	const [processModalOpened, setProcessModalOpened] = useState(false)

	const {
		membershipBenefits,
		gridImageWithRotateEffect,
		membershipPropose,
		membershipAnchorMenus,
		membershipHaveAQuestion,
		content,
	} = data?.membershipPage

	const anchors: MenuItemPartial[] = membershipAnchorMenus.anchors?.map(
		(item: any) => ({
			label: item.label,
			path: item.url,
		})
	)

	const gridItems = gridImageWithRotateEffect.gridItems ?? []

	const cards = gridItems.map((item: any) => ({
		label: item.gridLabel,
		image: item.gridImage?.mediaItemUrl ?? '',
		dataURL: item.gridImage?.dataUrl,
		alt: `Image for ${item.gridLabel}`,
		desc: item.gridDesc,
		link: item.gridLink,
	}))

	// Propose A New Member
	const proposeModalSubject = membershipPropose.modalContent.subject
	const proposeModalEmailAddresses =
		membershipPropose.modalContent.emailAddresses
	const proposeModalFileUrl = membershipPropose.modalContent.file?.mediaItemUrl

	// Member News
	const memberNews = data?.membershipMemberNews?.memberNews?.elements

	// Have A Question
	const haveAQuestion = membershipHaveAQuestion.haveAQuestionContainer

	const membershipProcess = data?.membershipProcess

	const membershipWelcomePage = data?.membershipWelcomePage

	// Blue Card Page
	const blueCardPage: BlueCardPageData = data?.blueCardPage?.submitABlueCardPage
	const blueCardContent = data?.blueCardPage?.content
	const blueCardModalSubject = blueCardPage.subject
	const blueCardModalEmailAddresses = blueCardPage.emailAddresses

	function openBlueCardModal() {
		setBlueCardModalOpened(true)
	}

	function toggleBlueCardModalOpen() {
		setBlueCardModalOpened(!blueCardModalOpened)
	}

	// Sort members alphabetically
	let isProposeTitle = false
	membershipWelcomePage?.membershipWelcome?.element?.map((element: any) => {
		if (element.elementTitle == membershipPropose.proposeTitle) {
			isProposeTitle = true
		}
	})

	if (!isProposeTitle)
		membershipWelcomePage?.membershipWelcome?.element?.push({
			elementTitle: membershipPropose.proposeTitle,
		})

	membershipWelcomePage?.membershipWelcome?.element?.sort(function (
		a: any,
		b: any
	) {
		if (a.elementTitle < b.elementTitle) {
			return -1
		}
		if (a.elementTitle > b.elementTitle) {
			return 1
		}
		return 0
	})

	return (
		<div className={style.page}>
			<div className={style.membershipOverview} id="membershipOverview">
				<span
					className={style.content}
					dangerouslySetInnerHTML={{
						__html: content,
					}}
				/>
			</div>

			{membershipBenefits ? (
				<h2 className={style.title} id="membershipBenefits">
					{membershipBenefits.benefitsTitle}
				</h2>
			) : null}

			<section className={style.cards}>
				{cards.map((card: Partial<FlipCardProps>, i: number) => {
					return authed && card.link ? (
						<NavigationLink href={card.link} key={i}>
							<FlipCard
								key={i}
								label={card.label}
								image={card.image}
								dataURL={card.dataURL}
								alt={card.alt}
								canFlip={false}
							/>
						</NavigationLink>
					) : (
						<FlipCard
							key={i}
							label={card.label}
							image={card.image}
							dataURL={card.dataURL}
							alt={card.alt}
							desc={card.desc}
						/>
					)
				})}
			</section>

			{authed ? (
				<>
					{anchors ? (
						<section id="membershipProcess" className={style.anchors}>
							<div className={style.inner}>
								{anchors.map((anchor: MenuItemPartial, i: number) => {
									if (anchor.path == 'Process') {
										return (
											<a
												className={style.anchor}
												key={i}
												onClick={() => setProcessModalOpened(true)}
											>
												{anchor.label}
											</a>
										)
									} else if (anchor.path == 'Welcome') {
										return (
											<a
												className={style.anchor}
												key={i}
												onClick={() => setWelcomeModalOpened(true)}
											>
												{anchor.label}
											</a>
										)
									} else if (anchor.path == 'News') {
										return (
											<a
												className={style.anchor}
												key={i}
												onClick={() => setMemberNewsModalOpened(true)}
											>
												{anchor.label}
											</a>
										)
									} else if (anchor.path == 'Blue Card') {
										return (
											<a
												className={style.anchor}
												key={i}
												onClick={openBlueCardModal}
											>
												{anchor.label}
											</a>
										)
									}
								})}
							</div>
						</section>
					) : null}

					<Modal
						open={processModalOpened}
						className={style.modal}
						hideBackdrop={true}
					>
						<>
							<FontAwesomeIcon
								icon={faTimes}
								className={style.close}
								onClick={() => setProcessModalOpened(!processModalOpened)}
							/>

							<section
								className={style.membershipProcess}
								dangerouslySetInnerHTML={{ __html: membershipProcess?.content }}
							/>

							<div
								className={style.exitArea}
								onClick={() => setProcessModalOpened(false)}
							/>
						</>
					</Modal>

					<Modal
						open={welcomeModalOpened}
						className={style.modal}
						hideBackdrop={true}
					>
						<>
							<FontAwesomeIcon
								className={style.close}
								icon={faTimes}
								onClick={() => setWelcomeModalOpened(false)}
							/>

							<section
								className={style.membershipWelcome}
								id="welcome-new-members"
							>
								<div className={style.content}>
									<div
										className={style.text}
										dangerouslySetInnerHTML={{
											__html: membershipWelcomePage?.content,
										}}
									/>

									{membershipWelcomePage?.membershipWelcome?.element?.map(
										(element: any, i: number) => {
											if (
												element.elementTitle == membershipPropose.proposeTitle
											) {
												return (
													<div key={i} className={style.element}>
														<div
															className={style.image}
															onClick={() => setProposeMemberModalOpened(true)}
														>
															{membershipPropose.proposeImage?.mediaItemUrl ? (
																<Image
																	src={
																		membershipPropose.proposeImage?.mediaItemUrl
																	}
																	alt={
																		membershipPropose.proposeImage?.altText ??
																		'Image'
																	}
																	width={500}
																	height={500}
																/>
															) : null}
														</div>

														<a
															className={style.btn}
															onClick={() => setProposeMemberModalOpened(true)}
														>
															{membershipPropose.proposeTitle}
														</a>
													</div>
												)
											} else {
												return (
													<div key={i} className={style.element}>
														<div className={style.image}>
															{element.elementImage?.mediaItemUrl ? (
																element.elementButton.buttonFile ? (
																	<>
																		<NavigationLink
																			href={
																				element.elementButton.buttonFile
																					?.mediaItemUrl || ''
																			}
																			className={style.btn}
																		>
																			<Image
																				src={element.elementImage?.mediaItemUrl}
																				alt={
																					element.elementImage?.altText ??
																					'Image'
																				}
																				width={500}
																				height={500}
																			/>
																		</NavigationLink>
																	</>
																) : element.elementButton?.buttonLink ? (
																	<NavigationLink
																		href={
																			element.elementButton.buttonLink || ''
																		}
																		className={style.btn}
																	>
																		<Image
																			src={element.elementImage?.mediaItemUrl}
																			alt={
																				element.elementImage?.altText ?? 'Image'
																			}
																			width={500}
																			height={500}
																		/>
																	</NavigationLink>
																) : null
															) : null}
														</div>
														{element.elementButton.buttonFile ? (
															<NavigationLink
																href={
																	element.elementButton.buttonFile
																		?.mediaItemUrl || ''
																}
																className={style.btn}
															>
																{element.elementTitle}
															</NavigationLink>
														) : (
															<NavigationLink
																href={element.elementButton.buttonLink || ''}
																className={style.btn}
															>
																{element.elementTitle}
															</NavigationLink>
														)}
													</div>
												)
											}
										}
									)}

									<ProposeMemberModal
										open={proposeMemberModalOpened}
										callback={() => setProposeMemberModalOpened(false)}
										subject={proposeModalSubject}
										eAddresses={proposeModalEmailAddresses}
										fileUrl={proposeModalFileUrl}
									/>
								</div>
							</section>

							<div
								className={style.exitArea}
								onClick={() => setWelcomeModalOpened(false)}
							/>
						</>
					</Modal>

					<Modal
						open={memberNewsModalOpened}
						className={style.modal}
						hideBackdrop={true}
					>
						<>
							<FontAwesomeIcon
								icon={faTimes}
								className={style.close}
								onClick={() => setMemberNewsModalOpened(false)}
							/>

							<section className={style.memberNews} id="member-news">
								{data?.membershipMemberNews?.title ? (
									<h2>{data?.membershipMemberNews?.title}</h2>
								) : null}

								<div className={style.items}>
									{memberNews?.map((item: any, i: number) => {
										return (
											<div className={style.item} key={i}>
												<div className={style.image}>
													{item.image?.mediaItemUrl ? (
														<Image
															src={item.image?.mediaItemUrl}
															alt={item.image?.altText ?? 'Image'}
															width={500}
															height={500}
														/>
													) : null}
												</div>

												<div className={style.itemInner}>
													<strong>{item.elementTitle}</strong>

													<a
														href={item.elementFile?.mediaItemUrl}
														target="_blank"
														rel="noreferrer"
													>
														<div
															dangerouslySetInnerHTML={{
																__html: item.elementContent,
															}}
														></div>
													</a>
												</div>
											</div>
										)
									})}
								</div>
							</section>

							<div
								className={style.exitArea}
								onClick={() => setMemberNewsModalOpened(false)}
							/>
						</>
					</Modal>

					<BlueCardModal
						open={blueCardModalOpened}
						callback={toggleBlueCardModalOpen}
						subject={blueCardModalSubject}
						eAddresses={blueCardModalEmailAddresses}
						className={style.modal}
						content={blueCardContent}
					/>
				</>
			) : membershipProcess ? (
				<section
					className={style.public}
					dangerouslySetInnerHTML={{ __html: membershipProcess?.content }}
				/>
			) : null}

			{authed ? (
				<section
					className={`${style.haveAQuestion}`}
					dangerouslySetInnerHTML={{
						__html: haveAQuestion.text,
					}}
				/>
			) : null}

			<ScrollToTopButton />
		</div>
	)
}

export default function Component(props: any) {
	const { data } = props

	const title = data?.page?.title

	return (
		<PublicLayout
			seo={{
				title,
			}}
		>
			<Page data={data} />
		</PublicLayout>
	)
}

export const MembershipAnchorQuery = gql`
	${MenuFragment}
	query GetMembershipAnchors(
		$membershipSlug: ID!
		$menuIdType: MenuNodeIdTypeEnum
	) {
		membershipAnchorMenu: menu(id: $membershipSlug, idType: $menuIdType) {
			menuItems {
				nodes {
					...MenuFragment
				}
			}
		}
	}
`

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = MembershipPageDataFragment
