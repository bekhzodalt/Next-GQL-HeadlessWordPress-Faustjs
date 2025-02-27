import { gql, useLazyQuery } from '@apollo/client'
import MemberCard from '@archipress/components/Card/Member'
import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import style from '@styles/components/Search/Panel.module.scss'
import SpinnerRipple from '@archipress/components/Effects/SpinnerRipple'

export interface UserI {
	alternatephone: any
	alternateextension: any
	alternatecountrycode: any
	birthday: any
	customfields_activites__club_memberships: any
	customfields_activities__affinity_clubs: any
	customfields_activities__civic_affiliations: any
	customfields_activities__club_tables: any
	customfields_activities__corporate_affiliations: any
	customfields_dietary_restrictions: any
	customfields_dietary_restrictions__spouse: any
	customfields_directory__other_add2: any
	customfields_directory__other_add1: any
	customfields_directory__other_address_3: any
	customfields_directory__other_city: any
	customfields_directory__other_state: any
	customfields_directory__other_zip: any
	customfields_directory__private_birthday: any
	customfields_directory__private_alternate_phone: any
	customfields_directory__private_civic_affiliations: any
	customfields_directory__private_corporate_affiliations: any
	customfields_directory__private_education: any
	customfields_directory__private_email: any
	customfields_directory__private_home_address: any
	customfields_directory__private_military_: any
	customfields_directory__private_other_address: any
	customfields_directory__private_other_memberships: any
	customfields_directory__private_phone_number: any
	customfields_education__college: any
	customfields_education__college_date: any
	customfields_education__grad_school: any
	customfields_education__grad_school_date: any
	customfields_education__high_school: any
	customfields_education__high_school_date: any
	customfields_education__military: any
	customfields_personal__dietary_restrictions: any
	customfields_personal__military_years_served: any
	customfields_personal__marital_status: any
	customfields_personal__military_service_status: any
	customfields_main_page__admin_extension: string
	customfields_main_page__admin_phone: string
	customfields_main_page__admins_email_email: string
	customfields_main_page__admins_name: string
	customfields_personal__child_1: string
	customfields_personal__child_1_birthday: string
	customfields_personal__child_2: string
	customfields_personal__child_2_birthday: string
	customfields_personal__child_3: string
	customfields_personal__child_3_birthday: string
	customfields_personal__child_4: string
	customfields_personal__child_4_birthday: string
	customfields_directory__facebook: any
	customfields_directory__twitter: any
	customfields_directory__linkedin: any
	customfields_spouse: any
	display_name: any
	faxcountrycode: any
	faxextension: any
	faxphone: any
	first_name: any
	gender: any
	home_address_1: any
	home_address_2: any
	home_city: any
	home_address_3: any
	home_country: any
	home_phone: any
	home_phone_country_code: number
	home_phone_extension: number
	home_postal_code: number
	home_state: any
	join_date: any
	last_name: any
	member_status: any
	member_type: any
	member_number: string
	middle_name: any
	mobile_phone: any
	mobile_phone_country_code: any
	mobile_phone_extension: any
	prefix_name: any
	private_email_address: any
	profile_image: any
	role: any
	roles: any
	salutation: any
	suffix_name: any
	user_email: any
	user_login: any
	wedding_anniversary: any
	work_address_1: any
	work_address_2: any
	work_address_3: any
	work_city: any
	work_company_name: any
	work_country: any
	work_job_title: any
	work_postal_code: any
	work_state: any
	work_website: any
	customfields_activities__interest_candidate_form: string
}

export default function SearchPanel({
	search,
	toggleOpen,
}: {
	search: {
		id?: string
		firstName?: string
		lastName?: string
	}
	toggleOpen?: ({
		open,
		user,
		users,
	}: {
		open: boolean
		user: any
		users: any
	}) => void
}) {
	const [query, { error, loading, data }] = useLazyQuery(SearchPanel.query)

	const LIMIT = 25

	const [state, setState] = useState({
		items: [],
		fetched: false,
		page: 1,
		initialId: search.id,
		total: 0,
	})

	function endOfUsers() {
		const pages = getPages()
		return state.page >= pages?.[pages?.length - 1] + 1
	}

	function getPages() {
		const pages = Math.ceil(state.total / LIMIT)
		let pagination = []

		for (let i = 0; i < pages; i++) {
			pagination.push(i)
		}

		return pagination
	}

	function fetch(dir: 'next' | 'prev', page?: number) {
		if (loading) return

		setState({
			...state,
			page: page ? page : dir === 'next' ? state.page + 1 : state.page - 1,
		})
	}

	useEffect(() => {
		if (loading || error || (state.fetched && !state.total)) return

		const items = data?.users?.meta
		const total = data?.users?.total

		let filter = search.id
		let searchType = 'FIRSTNAME'

		if (search.id) {
			searchType = 'LASTNAME_STARTS_WITH'
			filter = search.id
		} else if (search.lastName && !search.firstName) {
			searchType = 'LASTNAME_STARTS_WITH'
			filter = search.lastName
		} else if (search.firstName && !search.lastName) {
			searchType = 'FIRSTNAME_STARTS_WITH'
			filter = search.firstName
		} else if (search.firstName && search.lastName) {
			searchType = 'FULLNAME'
			filter = `${search.firstName}|${search.lastName}`
		}

		query({
			variables: {
				number: LIMIT,
				paged:
					state.initialId !== search.id && state.page !== 1 ? 1 : state.page,
				search: filter,
				searchType,
			},
		}).then(() => {
			setState({
				...state,
				items,
				fetched: true,
				total,
				initialId: search.id,
				page:
					state.initialId !== search.id && state.page !== 1 ? 1 : state.page,
			})
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, search, state.page])

	return (
		<>
			<div className={style.panel}>
				<h3 className={style.title}>
					Directory:{' '}
					{search.id
						? `Sort by last name (${search.id})`
						: search.firstName && !search.lastName
						? `Search by first name "${search.firstName}"`
						: search.lastName && !search.firstName
						? `Search by last name "${search.lastName}"`
						: search.firstName && search.lastName
						? `Search by first and last "${
								search.firstName + ' ' + search.lastName
						  }"`
						: ''}
				</h3>

				{loading ? (
					<SpinnerRipple className={style.loader} />
				) : (
					<>
						<div className={style.feed}>
							{state.items?.map((item: any, i: number) => {
								return (
									<MemberCard
										meta={item}
										key={i}
										toggleOpen={({ open, user }) =>
											toggleOpen({ open, user, users: state.items })
										}
									/>
								)
							})}
						</div>

						{state.items?.length > 0 ? (
							<div className={style.buttons}>
								{state.page > 1 ? (
									<Button
										onClick={() => fetch('prev')}
										disabled={state.page === 0}
									>
										« Previous
									</Button>
								) : null}

								<div className={style.numbers}>
									{getPages().map(page => {
										return (
											<Button
												key={page}
												onClick={() => fetch('next', page + 1)}
												disabled={page + 1 === state.page}
											>
												{page + 1}
											</Button>
										)
									})}
								</div>

								<Button
									onClick={() => fetch('next')}
									disabled={loading || endOfUsers()}
								>
									Next »
								</Button>
							</div>
						) : (
							<div className={style.noItems}>
								<br />
								No users found
							</div>
						)}
					</>
				)}
			</div>
		</>
	)
}

SearchPanel.query = gql`
	query GetMemberProfiles(
		$number: Int = 20
		$paged: Int = 1
		$searchType: ULMemberMetaSearchFieldTypeEnum = LASTNAME_STARTS_WITH
		$search: String
	) {
		users: unionLeagueMemberDirectory(
			number: $number
			paged: $paged
			searchType: $searchType
			search: $search
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
				customfields_main_page__admin_extension
				customfields_main_page__admin_phone
				customfields_main_page__admins_email_email
				customfields_main_page__admins_name
				customfields_personal__child_1
				customfields_personal__child_1_birthday
				customfields_personal__child_2
				customfields_personal__child_2_birthday
				customfields_personal__child_3
				customfields_personal__child_3_birthday
				customfields_personal__child_4
				customfields_personal__child_4_birthday
				customfields_directory__facebook
				customfields_directory__twitter
				customfields_directory__linkedin
				customfields_spouse
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
				role
				salutation
				suffix_name
				user_email
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
