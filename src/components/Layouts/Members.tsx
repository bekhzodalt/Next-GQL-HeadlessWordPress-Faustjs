import { ChangeEvent, FormEvent, ReactNode, useRef, useState } from 'react'
import SearchLetters from '@archipress/components/Search/Letters'
import Image from 'next/future/image'
import style from '@styles/components/Layouts/Members.module.scss'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { MenuItemPartial } from '@archipress/utilities/MenuContext'
import NavigationLink from '@archipress/components/Links/Navigation'
import SearchPanel, { UserI } from '@archipress/components/Search/Panel'
import { Avatar, Button, Modal } from '@mui/material'
import { faCheck, faTimes, faUser } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PublicLayout } from '@archipress/components'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { changePassword } from '@archipress/utilities/functions'
import { EditState } from '@archipress/wp-templates/page-members-profile'
import AvatarEditor from 'react-avatar-editor'
import SpinnerRipple from '@archipress/components/Effects/SpinnerRipple'

export default function MembersLayout({
	children,
	sidebarImage,
	canSearch = true,
	hasSideBar = true,
	hasBgColor = true,
	seo,
}: {
	children: ReactNode
	sidebarImage?: string
	canSearch?: boolean
	hasSideBar?: boolean
	hasBgColor?: boolean
	seo?: {
		title: string
		description?: string
	}
}) {
	const { state: appState } = useAppContext() as AppContextProps

	const meta = appState.viewer?.unionLeagueProfileMeta

	const { data } = useQuery(MembersLayout.query)

	const menu = data?.menu?.menuItems?.nodes || []

	const [search, updateSearch] = useState({
		id: '',
		firstName: '',
		lastName: '',
	})

	function searching() {
		return Object.values(search).some(item => item !== '')
	}

	const mappedRoleNames = {
		Member: 'Member',
		'Spousal Member': 'Spouse',
		'Honorary Spousal Member': 'Honorary Spouse',
		'Honorary Member': 'Honorary Member',
	}

	function getRoleName(role: string) {
		return mappedRoleNames?.[role as keyof typeof mappedRoleNames]
	}

	const [state, setState] = useState<{
		open: boolean
		user: UserI
		users: UserI[]
		spouse: UserI
	}>({
		open: false,
		user: null,
		users: [],
		spouse: null,
	})

	const [getSpouse, { loading }] = useLazyQuery(SpouseQuery)

	function initalizeString(string: string) {
		if (string.length <= 2) return string.replace(/(.{1})/g, '$1.')
		return string
	}

	return (
		<>
			<PublicLayout style={style} seo={seo}>
				<>
					{canSearch ? (
						<section className={style.memberHeader}>
							<div className={style.profile}>
								<h3
									className={style.name}
								>{`${meta.first_name} ${meta.last_name}`}</h3>

								<Avatar
									src={meta.profile_image}
									variant="square"
									style={{
										width: '150px',
										height: '150px',
									}}
								/>

								<NavigationLink href="/members/profile">
									<span>Update profile information</span>
								</NavigationLink>
							</div>

							<hr className={style.divider} />

							<div className={style.searchArea}>
								<h2>{seo?.title}</h2>
								<SearchLetters
									search={search}
									updateSearch={({ ...args }: any) => updateSearch(args)}
								/>
							</div>
						</section>
					) : null}

					<div
						className={`${style.children} ${
							hasBgColor ? style.hasBGColor : ''
						}`}
					>
						{searching() ? (
							<SearchPanel
								search={search}
								toggleOpen={({
									open,
									user,
									users,
								}: {
									open: boolean
									user: UserI
									users: UserI[]
								}) => {
									if (user.customfields_spouse === null) {
										return setState({
											...state,
											open,
											user,
											users,
											spouse: null,
										})
									}
									const member_number = user?.member_number?.endsWith('A')
										? user?.member_number?.slice(
												0,
												user?.member_number?.length - 1
										  )
										: user?.member_number + 'A'

									const spouse = users?.find(
										u =>
											u.member_number.toUpperCase() ===
											member_number.toUpperCase()
									)

									if (!spouse) {
										setState({
											...state,
											user,
											users,
											open,
										})

										getSpouse({
											variables: {
												member_number,
											},
										}).then(({ data, error }) => {
											if (error) return

											setState({
												...state,
												open,
												user,
												users,
												spouse: data?.spouse?.meta?.[0]
													? {
															...data?.spouse?.meta?.[0],
															role:
																state.user?.role === 'Member'
																	? 'Spousal Member'
																	: state.user?.role === 'Honorary Member'
																	? 'Honorary Spousal Member'
																	: state.user?.role === 'Spousal Member'
																	? 'Member'
																	: state.user?.role ===
																	  'Honorary Spousal Member'
																	? 'Honorary Member'
																	: 'Member',
													  }
													: null,
											})
										})
									} else {
										setState({
											...state,
											open,
											user,
											users,
											spouse,
										})
									}
								}}
							/>
						) : (
							children
						)}
					</div>

					{hasSideBar ? (
						<>
							<div className={style.sidebar}>
								<div className={style.image}>
									<Image
										src={sidebarImage}
										width={400}
										height={400}
										alt="Sidebar Image on the members page"
									/>
								</div>

								<span className={style.info}>More Info</span>

								<ul className={style?.['members-menu']}>
									{menu.map((item: MenuItemPartial, i: number) => (
										<li key={i}>
											<NavigationLink href={item.path}>
												{item.label}
											</NavigationLink>
										</li>
									))}
								</ul>
							</div>
						</>
					) : null}

					<Modal open={state.open} hideBackdrop={true} className={style.modal}>
						<div className={style.inner}>
							<FontAwesomeIcon
								icon={faTimes}
								className={style.close}
								onClick={() =>
									setState({
										...state,
										open: false,
									})
								}
							/>

							<div className={style.left}>
								<div className={style.avatar}>
									{state.user?.profile_image !== null ? (
										<Image
											src={state.user?.profile_image}
											height={100}
											width={100}
											alt="Avatar Image"
										/>
									) : (
										<FontAwesomeIcon icon={faUser} />
									)}
								</div>

								<span className={style.memberType}>
									{getRoleName(state.user?.role)}
								</span>

								{state.spouse || state.user?.customfields_spouse ? (
									<span className={style.spouse}>
										<strong>Spouse</strong>

										<br />

										{!loading ? (
											<Button
												onClick={() => {
													const spouse = state.user
													const user = state.spouse

													setState({
														...state,
														user,
														spouse,
													})
												}}
												disabled={state.spouse === null}
											>
												{state.spouse?.display_name ||
													state.user?.customfields_spouse}
											</Button>
										) : (
											<>loading spouse account...</>
										)}
									</span>
								) : null}

								{state.user?.customfields_personal__child_1 ||
								state.user?.customfields_personal__child_2 ||
								state.user?.customfields_personal__child_3 ||
								state.user?.customfields_personal__child_4 ? (
									<span>
										<strong>Children</strong>

										<br />

										{state.user?.customfields_personal__child_1 ? (
											<>
												<span>
													{state.user?.customfields_personal__child_1}
												</span>
												<br />
											</>
										) : null}

										{state.user?.customfields_personal__child_2 ? (
											<>
												<span>
													{state.user?.customfields_personal__child_2}
												</span>
												<br />
											</>
										) : null}

										{state.user?.customfields_personal__child_3 ? (
											<>
												<span>
													{state.user?.customfields_personal__child_3}
												</span>
												<br />
											</>
										) : null}

										{state.user?.customfields_personal__child_4 ? (
											<>
												<span>
													{state.user?.customfields_personal__child_4}
												</span>
												<br />
											</>
										) : null}
									</span>
								) : null}

								{state.user?.customfields_directory__private_birthday ===
								'False' ? (
									<span className={style.stat}>
										<strong>Birthday</strong>
										<br />
										<span>{state.user?.birthday}</span>
									</span>
								) : null}

								<span className={style.stat}>
									<strong>League Member Since</strong>
									<br />
									<span>{state.user?.join_date}</span>
								</span>
							</div>

							<div className={style.right}>
								<a className={style.fullname}>
									<span>
										{state.user?.last_name}
										{state.user?.suffix_name
											? ` ${initalizeString(state.user?.suffix_name)}`
											: null}
										,
										{state.user?.prefix_name
											? ` ${state.user?.prefix_name} `
											: null}{' '}
										{state.user?.first_name}{' '}
										{state.user?.middle_name
											? ` ${state.user?.middle_name}`
											: null}
									</span>
								</a>
								{state.user?.work_address_1 ||
								state.user?.work_address_2 ||
								state.user?.work_address_3 ? (
									<div className={style.addressContainer}>
										<span className={style.addressType}>Business</span>

										{state.user?.work_company_name ? (
											<span className={style.businessName}>
												{state.user?.work_company_name}
											</span>
										) : null}

										<div className={style.address}>
											{state.user?.work_address_1 ? (
												<span className={style.address1}>
													{state.user?.work_address_1}
												</span>
											) : null}

											{state.user?.work_address_2 ? (
												<span className={style.address2}>
													{state.user?.work_address_2}
												</span>
											) : null}

											{state.user?.work_address_3 ? (
												<span className={style.address3}>
													{state.user?.work_address_3}
												</span>
											) : null}

											<span className={style.city}>
												{state.user?.work_city ? state.user?.work_city : null}
												{state.user?.work_state
													? `, ${state.user?.work_state}`
													: null}
												{state.user?.work_postal_code
													? ` ${state.user?.work_postal_code}`
													: null}
											</span>
										</div>

										{state.user?.work_website ? (
											<NavigationLink
												href={state.user?.work_website || ''}
												className={style.visitWebsite}
												target="_blank"
												rel="noreferrer"
											>
												View Website
											</NavigationLink>
										) : null}
									</div>
								) : null}

								<div className={style.workInfo}>
									{state.user?.faxphone ? (
										<span className={style.businessPhone}>
											Fax:{' '}
											<a href={`tel:${state.user?.faxphone}`}>
												{state.user?.faxphone}
											</a>
										</span>
									) : null}

									{state.user?.customfields_main_page__admins_name ? (
										<span>
											Administrator Name:{' '}
											{state.user?.customfields_main_page__admins_name}
										</span>
									) : null}

									{state.user?.customfields_main_page__admins_email_email &&
									!state.user?.customfields_main_page__admins_email_email?.includes(
										'@archimail'
									) ? (
										<span>
											Administrator Email:{' '}
											<a
												href={`mailto:${state.user?.customfields_main_page__admins_email_email}`}
											>
												{state.user?.customfields_main_page__admins_email_email}
											</a>
										</span>
									) : null}

									{state.user?.customfields_main_page__admin_phone ? (
										<span>
											Administrator Phone:{' '}
											<a
												href={`tel:${
													state.user?.customfields_main_page__admin_phone
												}${
													state.user?.customfields_main_page__admin_extension
														? `,${state.user?.customfields_main_page__admin_extension}`
														: ''
												}`}
											>
												{state.user?.customfields_main_page__admin_phone}{' '}
												{state.user?.customfields_main_page__admin_extension
													? `Ext: ${state.user?.customfields_main_page__admin_extension}`
													: ''}
											</a>
										</span>
									) : null}
								</div>

								{state.user?.customfields_directory__private_home_address ===
									'False' &&
								(state.user?.home_address_1 ||
									state.user?.home_address_2 ||
									state.user?.home_address_3) ? (
									<div className={style.addressContainer}>
										<span className={style.addressType}>Home</span>

										<div className={style.address}>
											{state.user?.home_address_1 ? (
												<span className={style.address1}>
													{state.user?.home_address_1}
												</span>
											) : null}

											{state.user?.home_address_2 ? (
												<span className={style.address2}>
													{state.user?.home_address_2}
												</span>
											) : null}

											{state.user?.home_address_3 ? (
												<span className={style.address3}>
													{state.user?.home_address_3}
												</span>
											) : null}

											<span className={style.city}>
												{state.user?.home_city ? state.user?.home_city : null}
												{state.user?.home_state
													? `, ${state.user?.home_state}`
													: null}
												{state.user?.home_postal_code
													? ` ${state.user?.home_postal_code}`
													: null}
											</span>
										</div>
									</div>
								) : null}

								<div className={style.homeInfo}>
									{state.user?.customfields_directory__private_email ===
										'False' &&
									!state.user?.user_email?.includes('@archimail') ? (
										<span>
											Email:&nbsp;
											<a href={`mailto:${state.user?.user_email}`}>
												{state.user?.user_email}
											</a>
										</span>
									) : null}
								</div>

								{state.user?.home_phone || state.user?.alternatephone ? (
									<div className={style.homePhoneInfo}>
										{state.user?.home_phone &&
										state.user?.customfields_directory__private_phone_number ===
											'False' ? (
											<span>
												Phone:{' '}
												<a
													href={`tel:${state.user?.home_phone}${
														state.user?.home_phone_extension
															? `,${state.user?.home_phone_extension}`
															: ''
													}`}
												>
													{state.user?.home_phone}{' '}
													{state.user?.home_phone_extension
														? `Ext: ${state.user?.home_phone_extension}`
														: ''}
												</a>
											</span>
										) : null}

										{state.user?.alternatephone &&
										state.user
											?.customfields_directory__private_alternate_phone ===
											'False' ? (
											<span>
												Alternate Phone:{' '}
												<a
													href={`tel:${state.user?.alternatephone}${
														state.user?.alternateextension
															? `,${state.user?.alternateextension}`
															: ''
													}`}
												>
													{state.user?.alternatephone}{' '}
													{state.user?.alternateextension
														? `Ext: ${state.user?.alternateextension}`
														: ''}
												</a>
											</span>
										) : null}
									</div>
								) : null}

								{state.user?.customfields_directory__private_education ===
								'False' ? (
									<>
										{state.user?.customfields_education__high_school ? (
											<div className={style.highSchool}>
												<strong>High School Attended</strong>
												<span>
													{state.user?.customfields_education__high_school}
												</span>

												{state.user
													?.customfields_education__high_school_date ? (
													<span>
														{
															state.user
																?.customfields_education__high_school_date
														}
													</span>
												) : null}
											</div>
										) : null}

										{state.user?.customfields_education__college ? (
											<div className={style.college}>
												<strong>Colleges/Universities Attended</strong>
												<span>
													{state.user?.customfields_education__college}
												</span>

												{state.user?.customfields_education__college_date ? (
													<span>
														{state.user?.customfields_education__college_date}
													</span>
												) : null}
											</div>
										) : null}

										{state.user?.customfields_education__grad_school ? (
											<div className={style.gradSchool}>
												<strong>Grad Schools Attended</strong>
												<span>
													{state.user?.customfields_education__grad_school}
												</span>

												{state.user
													?.customfields_education__grad_school_date ? (
													<span>
														{
															state.user
																?.customfields_education__grad_school_date
														}
													</span>
												) : null}
											</div>
										) : null}
									</>
								) : null}

								{state.user?.customfields_activities__club_tables ? (
									<div className={style.clubTables}>
										<strong>Club Tables</strong>

										<span>
											{state.user?.customfields_activities__club_tables}
										</span>
									</div>
								) : null}

								{state.user?.customfields_activities__affinity_clubs ? (
									<div className={style.affinityClubs}>
										<strong>Affinity Clubs</strong>

										<span>
											{state.user?.customfields_activities__affinity_clubs}
										</span>
									</div>
								) : null}

								{state.user?.customfields_activities__civic_affiliations &&
								state.user
									?.customfields_directory__private_civic_affiliations ===
									'False' ? (
									<div className={style.civicAffilifations}>
										<strong>Civic Affiliations</strong>

										<span>
											{state.user?.customfields_activities__civic_affiliations}
										</span>
									</div>
								) : null}

								{state.user?.customfields_activites__club_memberships ? (
									<div className={style.otherClubMemberships}>
										<strong>Other Club Memberships</strong>

										<span>
											{state.user?.customfields_activites__club_memberships}
										</span>
									</div>
								) : null}
							</div>
						</div>
					</Modal>
				</>
			</PublicLayout>
		</>
	)
}

MembersLayout.query = gql`
	query GetMembersData {
		menu(id: "members", idType: LOCATION) {
			id
			menuItems(first: 2) {
				nodes {
					path
					label
				}
			}
		}
	}
`

const SpouseQuery = gql`
	query GetSpouse($member_number: String!) {
		spouse: unionLeagueMemberDirectory(
			number: 1
			paged: 1
			searchType: MEMBER_NUMBER
			search: $member_number
		) {
			meta: metaFields {
				alternatephone
				alternateextension
				alternatecountrycode
				birthday
				customfields_activites__club_memberships
				customfields_activities__affinity_clubs
				customfields_activities__civic_affiliations
				customfields_activities__club_tables
				customfields_activities__corporate_affiliations
				customfields_dietary_restrictions
				customfields_directory__other_add2
				customfields_directory__other_add1
				customfields_directory__other_address_3
				customfields_directory__other_city
				customfields_directory__other_state
				customfields_directory__other_zip
				customfields_directory__private_birthday
				customfields_directory__private_alternate_phone
				customfields_directory__private_civic_affiliations
				customfields_directory__private_corporate_affiliations
				customfields_directory__private_education
				customfields_directory__private_email
				customfields_directory__private_home_address
				customfields_directory__private_military_
				customfields_directory__private_other_address
				customfields_directory__private_other_memberships
				customfields_directory__private_phone_number
				customfields_education__college
				customfields_education__college_date
				customfields_education__grad_school
				customfields_education__grad_school_date
				customfields_education__high_school
				customfields_education__high_school_date
				customfields_education__military
				customfields_main_page__admin_phone
				customfields_main_page__admins_email_email
				customfields_main_page__admins_name
				customfields_personal__dietary_restrictions
				customfields_personal__military_years_served
				child1Name: customfields_personal__child_1
				child1Birthday: customfields_personal__child_1_birthday
				child2Name: customfields_personal__child_2
				child2Birthday: customfields_personal__child_2_birthday
				child3Name: customfields_personal__child_3
				child3Birthday: customfields_personal__child_3_birthday
				child4Name: customfields_personal__child_4
				child4Birthday: customfields_personal__child_4_birthday
				facebook: customfields_directory__facebook
				twitter: customfields_directory__twitter
				linkedin: customfields_directory__linkedin
				spouse: customfields_spouse
				display_name
				faxcountrycode
				faxextension
				faxphone
				first_name
				gender
				home_address_1
				home_address_2
				home_city
				home_address_3
				home_country
				home_phone
				home_phone_country_code
				home_phone_extension
				home_postal_code
				home_state
				join_date
				last_name
				member_status
				member_type
				member_number
				middle_name
				mobile_phone
				mobile_phone_country_code
				mobile_phone_extension
				prefix_name
				private_email_address
				profile_image
				salutation
				suffix_name
				wedding_anniversary
				work_address_1
				work_address_2
				work_address_3
				work_city
				work_company_name
				work_country
				work_job_title
				work_postal_code
				work_state
				work_website
			}
			total: recordCount
		}
	}
`
