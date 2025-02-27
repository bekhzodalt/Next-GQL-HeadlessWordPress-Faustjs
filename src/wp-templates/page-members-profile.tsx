import { gql, useMutation, useQuery } from '@apollo/client'
import MembersLayout from '@archipress/components/Layouts/Members'
import { UserI } from '@archipress/components/Search/Panel'
import {
	useAppContext,
	AppContextProps,
} from '@archipress/utilities/AppContext'
import date from '@archipress/utilities/date'
import { FormEvent, useEffect, useRef, useState } from 'react'
import style from '@styles/pages/members/profile.module.scss'
import { Avatar, Button, Modal } from '@mui/material'
import { Interests as candidateInterests } from '@archipress/constants/interests'
import Image from 'next/image'
import AvatarEditor from 'react-avatar-editor'
import { changePassword } from '@archipress/utilities/functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/pro-solid-svg-icons'
import { faTimes } from '@fortawesome/pro-light-svg-icons'

export type EditState = {
	image: null | File
	allowZoomOut: boolean
	scale: number
	rotate: number
	border: number
	preview?: {
		img: string
		rect: {
			x: number
			y: number
			width: number
			height: number
		}
		scale: number
		width: number
		height: number
		borderRadius: number
	}
	width: number
	height: number
	color: [number, number, number, number]
}

function Page({ data }: { data: any }) {
	const {
		data: profileData,
		loading: profileLoading,
		error,
	} = useQuery(GetProfile)

	const meta: UserI = profileData?.viewer?.unionLeagueProfileMeta

	const page = data?.page

	const [message, setMessage] = useState<string | null>(null)
	const [passwordChangeStatus, setPasswordChangeStatus] = useState<{
		message: string | null
		code: number | null
	} | null>(null)

	const opener = page?.content
	const userPrompt = page?.editProfileFormMessages?.userPrompt
	const confirmMessage = page?.editProfileFormMessages?.message
	const errorMessage = page?.editProfileFormMessages?.errorMessage
	const pendingMessage = page?.editProfileFormMessages?.pendingMessage
	const confirmationModalMessage =
		page?.editProfileFormMessages?.confirmationModalMessage

	const [createRequest, { loading: requestLoading, error: requestError }] =
		useMutation(Component.createUpdateRequest)

	const form = useRef({} as UserI)

	const interests = useRef<{ label: string; value: boolean }[]>([])

	const [children, setChildren] = useState<
		{ name: string | null; birthday: string | null; hide: boolean }[]
	>([])

	useEffect(() => {
		if (profileLoading || error) return null

		setChildren(
			[
				{
					name: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_1,
					birthday:
						profileData?.viewer?.unionLeagueProfileMeta
							?.customfields_personal__child_1_birthday,
					hide: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_1
						? false
						: true,
				},
				{
					name: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_2,
					birthday:
						profileData?.viewer?.unionLeagueProfileMeta
							?.customfields_personal__child_2_birthday,
					hide: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_2
						? false
						: true,
				},
				{
					name: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_3,
					birthday:
						profileData?.viewer?.unionLeagueProfileMeta
							?.customfields_personal__child_3_birthday,
					hide: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_3
						? false
						: true,
				},
				{
					name: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_4,
					birthday:
						profileData?.viewer?.unionLeagueProfileMeta
							?.customfields_personal__child_4_birthday,
					hide: profileData?.viewer?.unionLeagueProfileMeta
						?.customfields_personal__child_4
						? false
						: true,
				},
			].filter(child => child.hide === false)
		)

		interests.current = [
			...candidateInterests.map(i => {
				if (
					meta?.customfields_activities__interest_candidate_form
						?.split('; ')
						.some((b: any) => b.toLocaleLowerCase() === i)
				) {
					return {
						label: i,
						value: true,
					}
				} else {
					return {
						label: i,
						value: false,
					}
				}
			}),
		]
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profileData])

	const nameFields: Array<keyof UserI> = [
		'prefix_name',
		'first_name',
		'middle_name',
		'last_name',
		'suffix_name',
	]

	const phoneFields: Array<keyof UserI> = [
		'customfields_main_page__admin_phone',
		'home_phone',
		'mobile_phone',
		'alternatephone',
		'faxphone',
	]
	const editor = useRef<AvatarEditor>()

	const editorDefaults = useRef<EditState>({
		image: null,
		allowZoomOut: false,
		preview: undefined,
		width: 150,
		height: 150,
		border: 50,
		color: [255, 255, 255, 0.6],
		scale: 1.2,
		rotate: 0,
	})

	const [editState, setEditState] = useState<EditState>(editorDefaults.current)

	function handleChange(
		e: FormEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
		target:
			| 'editor'
			| 'default'
			| 'interests'
			| 'children'
			| 'names'
			| 'phones' = 'default',
		index?: number
	) {
		if (!e) return

		if (target === 'default') {
			if (e.currentTarget.type === 'checkbox') {
				const currentTarget = e.target as HTMLInputElement

				form.current = {
					...form.current,
					[e.currentTarget.name as keyof UserI]: currentTarget.checked
						? 'True'
						: 'False',
				}
			} else if (e.currentTarget.type === 'textarea') {
				form.current = {
					...form.current,
					[e.currentTarget.name as keyof UserI]: e.currentTarget.value,
				}
			} else if (e.currentTarget.type === 'date') {
				form.current = {
					...form.current,
					[e.currentTarget.name as keyof UserI]: e.currentTarget.value,
				}
			} else if (e.currentTarget.type === 'file') {
				const input = e.target as HTMLInputElement
				setEditState({
					...editState,
					image: input.files[0],
				})
			} else {
				form.current = {
					...form.current,
					[e.currentTarget.name as keyof UserI]:
						e.currentTarget.value !== '' ? e.currentTarget.value : null,
				}
			}
		} else if (target === 'interests' && index) {
			interests.current[index].value = !interests.current?.[index].value
		} else if (target === 'children') {
			const copy = [...children]

			copy[index] = {
				...copy[index],
				[e.currentTarget.name]: e.currentTarget.value,
			}

			setChildren(copy)
		} else if (target === 'names') {
			const first_name = form.current.first_name ?? meta.first_name
			const middle_name = form.current.middle_name ?? meta.middle_name
			const last_name = form.current.last_name ?? meta.last_name
			const prefix_name = form.current.prefix_name ?? meta.prefix_name
			const suffix_name = form.current.suffix_name ?? meta.suffix_name

			form.current = {
				...form.current,
				first_name,
				last_name,
				middle_name,
				prefix_name,
				suffix_name,
				[e.currentTarget.name]: e.currentTarget.value,
			}
		} else if (target === 'editor') {
			if (e.currentTarget.type === 'range') {
				setEditState({
					...editState,
					[e.currentTarget.name]: parseFloat(e.currentTarget.value),
				})
			}
		} else if (target === 'phones') {
			const customfields_main_page__admin_phone =
				form.current.customfields_main_page__admin_phone ??
				meta.customfields_main_page__admin_phone
			const home_phone = form.current.home_phone ?? meta.home_phone
			const mobile_phone = form.current.mobile_phone ?? meta.mobile_phone
			const alternatephone = form.current.alternatephone ?? meta.alternatephone
			const faxphone = form.current.faxphone ?? meta.faxphone

			form.current.customfields_main_page__admin_phone =
				customfields_main_page__admin_phone

			form.current = {
				...form.current,
				home_phone,
				mobile_phone,
				alternatephone,
				faxphone,
				[e.currentTarget.name]: e.currentTarget.value,
			}
		}
		if (message) setMessage(null)
	}

	const [passwordInfo, setPasswordInfo] = useState<{
		password: string | null
		newPassword: string | null
		confirmPassword: string | null
	}>({
		password: null,
		newPassword: null,
		confirmPassword: null,
	})

	function updatePassword() {
		if (
			(passwordInfo.newPassword === null ||
				passwordInfo.password === null ||
				passwordInfo.confirmPassword === null ||
				passwordInfo.newPassword === '' ||
				passwordInfo.password === '' ||
				passwordInfo.confirmPassword === '') &&
			open
		)
			return

		if (
			(passwordInfo.newPassword !== passwordInfo.confirmPassword ||
				passwordInfo.password === passwordInfo.newPassword) &&
			open
		)
			return

		if (open) {
			return changePassword({
				username: meta.member_number,
				password: passwordInfo.password,
				new_password: passwordInfo.newPassword,
			}).then(res => {
				setPasswordChangeStatus({
					message:
						res?.status === 200
							? 'Password changed successfully'
							: 'Failed to change password',
					code: res?.status,
				})
			})
		}
	}

	const [confirmModal, updateConfirmModal] = useState(false)

	const [pending, setPending] = useState(false)

	async function updateProfile() {
		if (requestLoading || requestError) return

		const mappedChildren = children
			.filter(item => !item.hide)
			.reduce(
				(
					acc: any,
					child: { name: string | null; birthday: string | null },
					index: number
				) => {
					acc[`customfields_personal__child_${index + 1}`] = child.name
					acc[`customfields_personal__child_${index + 1}_birthday`] =
						child.birthday
					return acc
				},
				{}
			)

		form.current = {
			...form.current,
			...mappedChildren,
		}

		const names = nameFields.map(i => ({
			field_name: i,
			prev_value: meta[i],
			new_value:
				i in form.current
					? form.current[i] === ''
						? null
						: form.current[i]
					: meta[i],
		}))

		const hasNameChange = names.some(name => name.prev_value !== name.new_value)

		const phones = phoneFields.map(i => ({
			field_name: i,
			prev_value: meta[i],
			new_value:
				i in form.current
					? form.current[i] === ''
						? null
						: form.current[i]
					: meta[i],
		}))

		const hasPhoneChange = phones.some(
			name => name.prev_value !== name.new_value
		)

		const mappedForm = Object.keys(form.current)
			.map(key => {
				return {
					field_name: key,
					prev_value: meta[key as keyof UserI],
					new_value:
						form.current[key as keyof UserI] !== ''
							? form.current[key as keyof UserI]
							: null,
				}
			})
			?.filter(
				item =>
					item.new_value !== item.prev_value &&
					!nameFields.some(i => i === item.field_name) &&
					!phoneFields.some(i => i === item.field_name)
			)

		const mappedInterests = interests.current
			?.filter(item => item.value)
			?.map(
				item =>
					`${item.label[0]?.toUpperCase()}${item.label?.slice(
						1,
						item.label.length
					)}`
			)
			?.join('; ')

		const final = [
			...mappedForm,
			...(hasNameChange ? names : []),
			...(hasPhoneChange ? phones : []),
			meta.customfields_activities__interest_candidate_form ===
				mappedInterests ||
			(mappedInterests === '' &&
				meta.customfields_activities__interest_candidate_form === null)
				? null
				: {
						field_name:
							'customfields_activities__interest_candidate_form' as keyof UserI,
						prev_value:
							meta.customfields_activities__interest_candidate_form ?? '',
						new_value: mappedInterests,
				  },
		].filter(item => item)

		if (final.length <= 0 && !editState.image) {
			updateConfirmModal(false)
			setPending(false)
			setMessage('No changes were detected')
			return
		}

		try {
			let file: File | null = null

			if (editor.current) {
				const blob: Blob = await new Promise(resolve =>
					editor.current?.getImageScaledToCanvas().toBlob(resolve)
				)

				const key = `${date().unix()}`.slice(-6)

				file = new File([blob], `${meta.user_login}_${key}.png`, {
					type: 'image/png',
				})
			}

			const { data } = await createRequest({
				variables: {
					updates: final,
					file: file ?? null,
				},
			})

			const status = data?.createULProfileUpdateRequest?.status

			if (status == 418) {
				if (!pending) setPending(true)

				setMessage(
					pendingMessage ??
						'You already have an update pending. Please try again later.'
				)
			} else {
				setMessage(
					confirmMessage ??
						'Please allow up to 48 hours for changes to be updated. Thank you!'
				)

				setPending(false)
			}
		} catch (error) {
			console.error('Failed to submit update to ACT profile meta:', error)
			setMessage(
				errorMessage ?? 'There was an error submitting your profile updates.'
			)
		} finally {
			updateConfirmModal(false)
		}
	}

	function handlePassword(e: FormEvent<HTMLInputElement>) {
		setPasswordInfo({
			...passwordInfo,
			[e.currentTarget.name]: e.currentTarget.value,
		})
		setPasswordChangeStatus({
			...passwordChangeStatus,
			message: null,
			code: null,
		})
	}

	const [open, setOpen] = useState(false)

	if (!meta) return null

	return (
		<>
			<MembersLayout
				hasBgColor={false}
				canSearch={false}
				hasSideBar={false}
				seo={{ title: page?.title }}
			>
				<div className={style.page}>
					{!profileLoading ? (
						<>
							<Modal open={confirmModal} className={style.modal}>
								<>
									<FontAwesomeIcon
										icon={faTimes}
										className={style.close}
										onClick={() => {
											updateConfirmModal(false)
											setPending(false)
										}}
									/>

									<span
										className={style.modalContent}
										dangerouslySetInnerHTML={{
											__html: confirmationModalMessage,
										}}
									/>

									<div className={style.buttons}>
										<Button onClick={updateProfile}>Yes</Button>

										<Button
											onClick={() => {
												updateConfirmModal(false)
												setPending(false)
											}}
										>
											No
										</Button>
									</div>
								</>
							</Modal>

							<form
								encType="multipart/form-data"
								method="post"
								onSubmit={e => {
									e.preventDefault()
									setPending(true)
									updateConfirmModal(true)
								}}
							>
								<h1 className={style.message}>
									{meta.first_name ?? ''} {meta.middle_name?.[0] ?? ''}{' '}
									{meta.last_name ?? ''}
								</h1>

								{opener ? (
									<span
										className={style.opener}
										dangerouslySetInnerHTML={{ __html: opener }}
									/>
								) : null}

								<div className={style.input}>
									<div className={style.left}>
										<div className={style.avatar}>
											{editState.image ? (
												<>
													<AvatarEditor
														className={style.editor}
														ref={editor}
														scale={editState.scale}
														width={editState.width}
														height={editState.height}
														border={editState.border}
														color={[255, 255, 255, 0.6]} // RGBA
														rotate={editState.rotate}
														image={editState.image}
													/>
													Zoom: &nbsp;
													<input
														name="scale"
														type="range"
														onChange={e => handleChange(e, 'editor')}
														min="0.1"
														max="2"
														step="0.01"
														defaultValue="1"
													/>
													Rotate: &nbsp;
													<input
														name="rotate"
														type="range"
														onChange={e => handleChange(e, 'editor')}
														min="-180"
														max="180"
														step="1.0"
														defaultValue="0"
													/>
													<Button
														onClick={() => {
															setEditState(editorDefaults.current)

															const input = document.getElementById(
																'getFile'
															) as HTMLInputElement

															if (input) input.value = null
														}}
													>
														cancel
													</Button>
												</>
											) : meta.profile_image ? (
												<Image
													src={meta.profile_image}
													width="150"
													height="150"
													alt=""
												/>
											) : (
												<Avatar
													variant="square"
													style={{
														width: '150px',
														height: '150px',
													}}
												/>
											)}
										</div>

										<a
											onClick={() => {
												document.getElementById('getFile').click()
											}}
											style={{
												cursor: 'pointer',
											}}
										>
											change profile picture
										</a>

										<input
											name="files"
											id="getFile"
											type="file"
											placeholder="photo upload"
											style={{
												display: 'none',
											}}
											onChange={handleChange}
										/>

										<a onClick={() => setOpen(true)}>change password</a>
									</div>

									<div className={style.right}>
										{open ? (
											<div className={style.dropDown}>
												<label>
													Current Password: <br />
													<input
														type="text"
														name="password"
														onChange={handlePassword}
														autoComplete="password"
														required
													/>
													{passwordInfo.password !== null &&
													passwordInfo.password !== '' ? (
														<FontAwesomeIcon
															icon={faCheck}
															className={style.check}
														/>
													) : (
														<FontAwesomeIcon
															icon={faTimes}
															className={style.x}
														/>
													)}
												</label>

												<label>
													New Password: <br />
													<input
														type="text"
														name="newPassword"
														onChange={handlePassword}
														autoComplete="new-password"
														required
													/>
													{passwordInfo.newPassword ===
														passwordInfo.confirmPassword &&
													passwordInfo.newPassword !== '' &&
													passwordInfo.newPassword !== null &&
													passwordInfo.newPassword !== passwordInfo.password ? (
														<FontAwesomeIcon
															icon={faCheck}
															className={style.check}
														/>
													) : (
														<FontAwesomeIcon
															icon={faTimes}
															className={style.x}
														/>
													)}
												</label>

												<label>
													Confirm Password: <br />
													<input
														type="text"
														name="confirmPassword"
														onChange={handlePassword}
														autoComplete="new-password"
														required
													/>
													{passwordInfo.confirmPassword ===
														passwordInfo.newPassword &&
													passwordInfo.confirmPassword !== '' &&
													passwordInfo.confirmPassword !== null &&
													passwordInfo.confirmPassword !==
														passwordInfo.password ? (
														<FontAwesomeIcon
															icon={faCheck}
															className={style.check}
														/>
													) : (
														<FontAwesomeIcon
															icon={faTimes}
															className={style.x}
														/>
													)}
												</label>

												<Button
													onClick={updatePassword}
													disabled={passwordChangeStatus?.code === 200}
												>
													submit
												</Button>

												<Button
													onClick={() => {
														setOpen(false)
														setPasswordInfo({
															password: null,
															newPassword: null,
															confirmPassword: null,
														})
														setPasswordChangeStatus({
															...passwordChangeStatus,
															message: null,
														})
													}}
												>
													cancel
												</Button>

												<ul>
													{passwordInfo.password !== null &&
													passwordInfo.password !== '' &&
													passwordInfo.password === passwordInfo.newPassword ? (
														<li className={style.error}>
															Your new password must be different from your
															current password
														</li>
													) : null}

													{passwordInfo.password === null ||
													passwordInfo.password === '' ||
													passwordInfo.confirmPassword === null ||
													passwordInfo.confirmPassword === '' ||
													passwordInfo.newPassword === null ||
													passwordInfo.newPassword === '' ? (
														<li className={style.error}>
															No empty fields allowed
														</li>
													) : null}

													{passwordInfo.confirmPassword !==
													passwordInfo.newPassword ? (
														<li className={style.error}>
															Please confirm your new password
														</li>
													) : null}
												</ul>

												{passwordChangeStatus?.message ? (
													<h3 className={style.message}>
														{passwordChangeStatus?.message}
													</h3>
												) : null}
											</div>
										) : null}
									</div>
								</div>

								<br />

								<span className={style.title}>Member Account Properties</span>

								<div className={style.input}>
									<span className={style.label}>Membership Number: </span>
									<span className={style.value}>{meta.member_number}</span>
								</div>

								<div className={style.input}>
									<span className={style.label}>Title/Prefix: </span>

									<select
										name="prefix_name"
										defaultValue={meta.prefix_name ?? ''}
										onChange={e => handleChange(e, 'names')}
									>
										<option value=""></option>
										<option value="Mr.">Mr.</option>
										<option value="Mrs.">Mrs.</option>
										<option value="Miss">Miss</option>
										<option value="Ms.">Ms.</option>
										<option value="Dr.">Dr.</option>
										<option value="Prof.">Prof.</option>
									</select>
								</div>

								<div className={style.input}>
									<span className={style.label}>First Name: </span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.first_name ?? ''}
										name="first_name"
										onChange={e => handleChange(e, 'names')}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Middle Name:</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.middle_name ?? ''}
										name="middle_name"
										onChange={e => handleChange(e, 'names')}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Last Name:</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.last_name ?? ''}
										name="last_name"
										onChange={e => handleChange(e, 'names')}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Suffix:</span>

									<select
										name="suffix_name"
										defaultValue={meta.suffix_name ?? ''}
										onChange={e => handleChange(e, 'names')}
									>
										<option value=""></option>
										<option value="Jr.">Jr.</option>
										<option value="Sr.">Sr.</option>
										<option value="II">II</option>
										<option value="III">III</option>
										<option value="M.D.">M.D.</option>
										<option value="P.h.D">P.h.D</option>
									</select>
								</div>

								<div className={style.input}>
									<span className={style.label}>Salutation:</span>

									<input
										type="text"
										className={style.value}
										defaultValue={meta.salutation ?? ''}
										name="salutation"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Email:</span>

									<span className={style.checkbox}>
										<input
											type="text"
											className={style.value}
											defaultValue={meta.user_email ?? ''}
											name="user_email"
											onChange={handleChange}
										/>

										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_email === 'True'
												}
												name="customfields_directory__private_email"
												onChange={handleChange}
											/>
											&nbsp; Make Private
										</label>
									</span>
								</div>

								<span className={style.title}>Social Networking</span>

								<div className={style.input}>
									<span className={style.label}>Linkedin</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.customfields_directory__linkedin ?? ''}
										name="customfields_directory__linkedin"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Facebook</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.customfields_directory__facebook ?? ''}
										name="customfields_directory__facebook"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Twitter</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.customfields_directory__twitter ?? ''}
										name="customfields_directory__twitter"
										onChange={handleChange}
									/>
								</div>

								<span className={style.title}>
									Business Contact Information
								</span>

								<div className={style.input}>
									<span className={style.label}>Company Name</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_company_name ?? ''}
										name="work_company_name"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Title</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_job_title ?? ''}
										name="work_job_title"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 1</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_address_1 ?? ''}
										name="work_address_1"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 2</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_address_2 ?? ''}
										name="work_address_2"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 3</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_address_3 ?? ''}
										name="work_address_3"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>City</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_city ?? ''}
										name="work_city"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>State</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_state ?? ''}
										name="work_state"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Postal Code</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_postal_code ?? ''}
										name="work_postal_code"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Fax</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.faxphone ?? ''}
										name="faxphone"
										onChange={e => handleChange(e, 'phones')}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Website</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.work_website ?? ''}
										name="work_website"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Administrator Name</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_main_page__admins_name ?? ''
										}
										name="customfields_main_page__admins_name"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Administrator Email</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_main_page__admins_email_email ?? ''
										}
										name="customfields_main_page__admins_email_email"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Administrator Phone</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_main_page__admin_phone ?? ''
										}
										name="customfields_main_page__admin_phone"
										onChange={e => handleChange(e, 'phones')}
									/>
								</div>

								<span className={style.title}>Home Contact Information</span>

								<div className={style.input}>
									<span className={style.label}>Show Contact Information</span>

									<div className={style.choices}>
										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_home_address ===
													'True'
												}
												name="customfields_directory__private_home_address"
												onChange={handleChange}
											/>
											&nbsp; Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 1</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.home_address_1 ?? ''}
										name="home_address_1"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 2</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.home_address_2 ?? ''}
										name="home_address_2"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 3</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.home_address_3 ?? ''}
										name="home_address_3"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>City</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.home_city ?? ''}
										name="home_city"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>State</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.home_state ?? ''}
										name="home_state"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Postal Code</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.home_postal_code ?? ''}
										name="home_postal_code"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Phone</span>

									<div className={style.value}>
										<input
											type="text"
											className={style.value}
											defaultValue={meta.home_phone ?? ''}
											name="home_phone"
											onChange={e => handleChange(e, 'phones')}
										/>
										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_phone_number ===
													'True'
												}
												name="customfields_directory__private_phone_number"
												onChange={handleChange}
											/>
											&nbsp; Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>Alternate Phone</span>

									<div className={style.value}>
										<input
											type="text"
											className={style.value}
											defaultValue={meta.alternatephone ?? ''}
											name="alternatephone"
											onChange={e => handleChange(e, 'phones')}
										/>

										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_alternate_phone ===
													'True'
												}
												name="customfields_directory__private_alternate_phone"
												onChange={handleChange}
											/>
											&nbsp; Private
										</label>
									</div>
								</div>

								<span className={style.title}>Other Contact Information</span>

								<div className={style.input}>
									<span className={style.label}>
										Show Other Contact Information
									</span>

									<div className={style.choices}>
										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_other_address ===
													'True'
												}
												name="customfields_directory__private_other_address"
												onChange={handleChange}
											/>
											&nbsp; Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 1</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.customfields_directory__other_add1 ?? ''}
										name="customfields_directory__other_add1"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 2</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.customfields_directory__other_add2 ?? ''}
										name="customfields_directory__other_add2"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Street Address Line 3</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_directory__other_address_3 ?? ''
										}
										name="customfields_directory__other_address_3"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>City</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.customfields_directory__other_city ?? ''}
										name="customfields_directory__other_city"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>State</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_directory__other_state ?? ''
										}
										name="customfields_directory__other_state"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Postal Code</span>
									<input
										type="text"
										className={style.value}
										defaultValue={meta.customfields_directory__other_zip ?? ''}
										name="customfields_directory__other_zip"
										onChange={handleChange}
									/>
								</div>

								<span className={style.title}>Personal Information</span>

								<div className={style.input}>
									<span className={style.label}>Birthdate</span>

									<div className={style.checkbox}>
										<input
											type="date"
											defaultValue={
												date(
													meta?.birthday?.replace(/-/g, '/')?.split('T')?.[0]
												)
													.format('YYYY/MM/DD')
													?.replace(/\//g, '-') ?? meta?.birthday
											}
											name="birthday"
											onChange={handleChange}
										/>

										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_birthday ===
													'True'
												}
												name="customfields_directory__private_birthday"
												onChange={handleChange}
											/>
											&nbsp; Make Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>
										Dietary restrictions/food allergies
									</span>

									<textarea
										className={style.value}
										defaultValue={meta.customfields_dietary_restrictions ?? ''}
										name="customfields_dietary_restrictions"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Education</span>

									<div className={style.checkbox}>
										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_education ===
													'True'
												}
												name="customfields_directory__private_education"
												onChange={handleChange}
											/>
											&nbsp; Make Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>High School</span>
									<textarea
										className={style.value}
										defaultValue={
											meta.customfields_education__high_school ?? ''
										}
										name="customfields_education__high_school"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>
										Year Graduated High School
									</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_education__high_school_date ?? ''
										}
										name="customfields_education__high_school_date"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Colleges/Universities</span>
									<textarea
										className={style.value}
										defaultValue={meta.customfields_education__college ?? ''}
										name="customfields_education__college"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Year Graduated College</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_education__college_date ?? ''
										}
										name="customfields_education__college_date"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Grad Schools</span>

									<textarea
										className={style.value}
										defaultValue={
											meta.customfields_education__grad_school ?? ''
										}
										name="customfields_education__grad_school"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>
										Year Graduated Grad School
									</span>
									<input
										type="text"
										className={style.value}
										defaultValue={
											meta.customfields_education__grad_school_date ?? ''
										}
										name="customfields_education__grad_school_date"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Corporate Affiliations</span>

									<div className={style.checkbox}>
										<textarea
											className={style.value}
											defaultValue={
												meta.customfields_activities__corporate_affiliations ??
												''
											}
											name="customfields_activities__corporate_affiliations"
											onChange={handleChange}
										/>

										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_corporate_affiliations ===
													'True'
												}
												name="customfields_directory__private_corporate_affiliations"
												onChange={handleChange}
											/>
											&nbsp; Make Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>Civic Affiliations</span>

									<div className={style.checkbox}>
										<textarea
											className={style.value}
											defaultValue={
												meta.customfields_activities__civic_affiliations ?? ''
											}
											name="customfields_activities__civic_affiliations"
											onChange={handleChange}
										/>

										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_civic_affiliations ===
													'True'
												}
												name="customfields_directory__private_civic_affiliations"
												onChange={handleChange}
											/>
											&nbsp; Make Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>Other Club Memberships</span>

									<div className={style.checkbox}>
										<textarea
											className={style.value}
											defaultValue={
												meta.customfields_activites__club_memberships ?? ''
											}
											name="customfields_activites__club_memberships"
											onChange={handleChange}
										/>

										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_other_memberships ===
													'True'
												}
												name="customfields_directory__private_other_memberships"
												onChange={handleChange}
											/>
											&nbsp; Make Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>Military Service</span>

									<div className={style.choices}>
										<label>
											<input
												type="checkbox"
												defaultChecked={
													meta.customfields_directory__private_military_ ===
													'True'
												}
												name="customfields_directory__private_military_"
												onChange={handleChange}
											/>
											&nbsp; Private
										</label>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>Branch</span>

									<select
										name="customfields_education__military"
										defaultValue={meta.customfields_education__military ?? ''}
										onChange={handleChange}
									>
										<option value=""></option>
										<option value="Army">Army</option>
										<option value="Navy">Navy</option>
										<option value="Air Force">Air Force</option>
										<option value="Marines">Marines</option>
										<option value="Coast Guard">Coast Guard</option>
										<option value="National Guard">National Guard</option>
										<option value="Reserves">Reserves</option>
										<option value="Other">Other</option>
									</select>
								</div>

								<div className={style.input}>
									<span className={style.label}>Years Served</span>
									<textarea
										className={style.value}
										defaultValue={
											meta.customfields_personal__military_years_served ?? ''
										}
										name="customfields_personal__military_years_served"
										onChange={handleChange}
									/>
								</div>

								<div className={style.input}>
									<span className={style.label}>Status</span>

									<select
										name="customfields_personal__military_service_status"
										defaultValue={
											meta.customfields_personal__military_service_status ?? ''
										}
										onChange={handleChange}
									>
										<option value=""></option>
										<option value="Active">Active</option>
										<option value="Reserves">Reserves</option>
										<option value="Retired ">Retired </option>
										<option value="Veteran">Veteran</option>
									</select>
								</div>

								<span className={style.title}>Family Information</span>

								<div className={style.input}>
									<span className={style.label}>
										Marital Status (Private Only)
									</span>

									<div className={style.value}>
										<select
											defaultValue={
												meta.customfields_personal__marital_status ?? ''
											}
											name="customfields_personal__marital_status"
											onChange={handleChange}
										>
											<option value=""></option>
											<option value="S">Single</option>
											<option value="M">Married</option>
											<option value="D">Divorced</option>
											<option value="W">Widowed</option>
										</select>
									</div>
								</div>

								<div className={style.input}>
									<span className={style.label}>
										Wedding Anniversary (Private Only)
									</span>

									<div className={style.anniversary}>
										<input
											type="date"
											defaultValue={
												meta?.wedding_anniversary?.split('T')?.[0] ??
												'1996-10-11'
											}
											name="wedding_anniversary"
											onChange={handleChange}
										/>
									</div>
								</div>

								<span className={style.title}>Children (Private Only)</span>
								{children.map((child, i: number) => {
									if (child.hide) return null

									return (
										<div className={style.input} key={i}>
											<span className={style.label}>
												Child {i + 1} Name and Birthday
											</span>

											<div className={style.children}>
												<input
													type="text"
													name="name"
													value={child.name ?? ''}
													onChange={e => handleChange(e, 'children', i)}
												/>

												<div className={style.birthdate}>
													<input
														type="date"
														defaultValue={child.birthday?.split('T')?.[0]}
														name="birthday"
														onChange={e => handleChange(e, 'children', i)}
													/>
												</div>

												<Button
													onClick={() => {
														const copy = [...children]
														copy[i].name = null
														copy[i].birthday = null
														copy[i].hide = true

														form.current = {
															...form.current,
															[`customfields_personal__child_${i + 1}`]: null,
															[`customfields_personal__child_${
																i + 1
															}_birthday`]: null,
														}
														setChildren(copy.filter(c => c !== copy[i]))
													}}
												>
													Remove
												</Button>
											</div>
										</div>
									)
								})}

								{children.filter(child => !child.hide).length < 4 ? (
									<>
										<Button
											className={style.addChild}
											onClick={() => {
												const copy = [...children]

												copy.push({
													name: null,
													birthday: null,
													hide: false,
												})

												setMessage(null)
												setChildren(copy)
											}}
										>
											Add a Child
										</Button>
										<br />
									</>
								) : null}

								<span className={style.title}>Interest Areas</span>

								<div className={style.input}>
									<div className={style.interests}>
										{interests.current?.map(
											(i: { label: string; value: boolean }, index: number) => {
												return (
													<label key={i.label}>
														<input
															type="checkbox"
															defaultChecked={i.value}
															onChange={e =>
																handleChange(e, 'interests', index)
															}
														/>
														{i.label}
													</label>
												)
											}
										)}
									</div>
								</div>

								{userPrompt ? (
									<span className={style.message}>{userPrompt}</span>
								) : null}

								<br />

								<Button type="submit" disabled={pending || message !== null}>
									Submit
								</Button>

								{message ? <h3 className={style.message}>{message}</h3> : null}
							</form>
						</>
					) : null}
				</div>
			</MembersLayout>
		</>
	)
}

export default function Component(props: any) {
	const { state } = useAppContext() as AppContextProps
	const loading = !state?.generalSettings

	if (!state?.loggedIn && !loading)
		top.location.replace('https://www.unionleague.org/members.php')

	return !loading && state?.loggedIn ? <Page data={props?.data} /> : null
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		adPreview: ctx?.asPreview,
	}
}

Component.createUpdateRequest = gql`
	mutation updateRequest(
		$file: Upload = null
		$updates: [ULProfileUpdateRequestMetaFields] = {}
	) {
		createULProfileUpdateRequest(input: { file: $file, updates: $updates }) {
			status
		}
	}
`

Component.query = gql`
	query GetMembersProfilePage($databaseId: ID!, $asPreview: Boolean = false) {
		page(id: $databaseId, idType: DATABASE_ID, asPreview: $asPreview) {
			id
			title
			content
			featuredImage {
				node {
					mediaItemUrl
				}
			}
			editProfileFormMessages {
				userPrompt
				message
				errorMessage
				pendingMessage
				confirmationModalMessage
			}
		}
	}
`
export const GetProfile = gql`
	query GetProfile {
		viewer {
			id
			username
			email
			unionLeagueProfileMeta {
				alternatecountrycode
				alternateextension
				alternatephone
				birthday
				customfields_activites__club_memberships
				customfields_activities__affinity_clubs
				customfields_activities__civic_affiliations
				customfields_activities__club_tables
				customfields_activities__corporate_affiliations
				customfields_activities__interest_candidate_form
				customfields_dietary_restrictions
				customfields_directory__facebook
				customfields_directory__linkedin
				customfields_directory__other_add1
				customfields_directory__other_add2
				customfields_directory__other_address_3
				customfields_directory__other_city
				customfields_directory__other_state
				customfields_directory__other_zip
				customfields_directory__private_alternate_phone
				customfields_directory__private_birthday
				customfields_directory__private_civic_affiliations
				customfields_directory__private_corporate_affiliations
				customfields_directory__private_education
				customfields_directory__private_email
				customfields_directory__private_home_address
				customfields_directory__private_military_
				customfields_directory__private_other_address
				customfields_directory__private_other_memberships
				customfields_directory__private_phone_number
				customfields_directory__twitter
				customfields_education__college
				customfields_education__college_date
				customfields_education__grad_school
				customfields_education__grad_school_date
				customfields_education__high_school
				customfields_education__high_school_date
				customfields_education__military
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
				customfields_personal__dietary_restrictions
				customfields_personal__marital_status
				customfields_personal__military_service_status
				customfields_personal__military_years_served
				customfields_spouse
				display_name
				faxcountrycode
				faxextension
				faxphone
				first_name
				user_login
				user_email
				gender
				home_address_1
				home_address_2
				home_address_3
				home_city
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
		}
	}
`
