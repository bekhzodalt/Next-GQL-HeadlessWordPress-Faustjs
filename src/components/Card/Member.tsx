import { faUser } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/future/image'
import style from '@styles/components/Card/Member.module.scss'
import { UserI } from '@archipress/components/Search/Panel'
import { Button } from '@mui/material'
import SocialLink from '@archipress/components/Links/Social'
import NavigationLink from '@archipress/components/Links/Navigation'

const mappedRoleNames = {
	Member: 'Member',
	'Spousal Member': 'Spouse',
	'Honorary Spousal Member': 'Honorary Spouse',
	'Honorary Member': 'Honorary Member',
}

function getRoleName(role: string) {
	return mappedRoleNames?.[role as keyof typeof mappedRoleNames]
}

function initalizeString(string: string) {
	if (string.length <= 2) return string.replace(/(.{1})/g, '$1.')
	if (string.length <= 2) return string.replace(/(.{1})/g, '$1.')
	return string
}

export default function MemberCard({
	meta,
	toggleOpen,
}: {
	meta: UserI
	toggleOpen?: ({ open, user }: { open: boolean; user: any }) => void
}) {
	return (
		<div className={style.card}>
			<div className={style.left}>
				<div className={style.avatar}>
					{meta?.profile_image !== null ? (
						<Image
							src={meta.profile_image}
							height={100}
							width={100}
							alt="Avatar Image"
						/>
					) : (
						<FontAwesomeIcon icon={faUser} />
					)}
				</div>

				<span className={style.memberType}>{getRoleName(meta.role)}</span>
			</div>

			<div className={style.center}>
				<div className={style.info}>
					<Button
						className={style.fullname}
						onClick={() =>
							toggleOpen({
								open: true,
								user: meta,
							})
						}
					>
						<>
							<span>
								{meta.last_name}
								{meta.suffix_name
									? ` ${initalizeString(meta.suffix_name)}`
									: null}
								,&nbsp;
							</span>

							{meta.prefix_name ? <span>{meta.prefix_name}&nbsp;</span> : null}

							<span>
								{meta.first_name}
								{meta.middle_name ? ` ${meta.middle_name}` : null}
							</span>
						</>
					</Button>

					<div className={style.socials}>
						{meta?.customfields_directory__facebook ? (
							<SocialLink
								type="facebook"
								to={meta?.customfields_directory__facebook}
							/>
						) : null}

						{meta?.customfields_directory__linkedin ? (
							<SocialLink
								type="linkedin"
								to={meta?.customfields_directory__linkedin}
							/>
						) : null}

						{meta?.customfields_directory__twitter ? (
							<SocialLink
								type="twitter"
								to={meta?.customfields_directory__twitter}
							/>
						) : null}
					</div>
				</div>

				{meta.work_address_1 || meta.work_address_2 || meta.work_address_3 ? (
					<div className={style.addressContainer}>
						<span className={style.addressType}>Business</span>

						{meta.work_company_name ? (
							<span className={style.businessName}>
								{meta.work_company_name}
							</span>
						) : null}

						<div className={style.address}>
							{meta.work_address_1 ? (
								<span className={style.address1}>{meta.work_address_1}</span>
							) : null}
							{meta.work_address_2 ? (
								<span className={style.address2}>{meta.work_address_2}</span>
							) : null}
							{meta.work_address_3 ? (
								<span className={style.address3}>{meta.work_address_3}</span>
							) : null}

							<span className={style.city}>
								{meta.work_city ? meta.work_city : null}
								{meta.work_state ? `, ${meta.work_state}` : null}
								{meta.work_postal_code ? ` ${meta.work_postal_code}` : null}
							</span>
						</div>

						{meta.work_website ? (
							<NavigationLink
								href={meta.work_website || ''}
								className={style.visitWebsite}
								target="_parent"
								rel="noreferrer"
							>
								View Website
							</NavigationLink>
						) : null}
					</div>
				) : null}

				{meta.customfields_directory__private_home_address === 'False' &&
				(meta.home_address_1 || meta.home_address_2 || meta.home_address_3) ? (
					<div className={style.addressContainer}>
						<span className={style.addressType}>Home</span>
						<div className={style.address}>
							{meta.home_address_1 ? (
								<span className={style.address1}>{meta.home_address_1}</span>
							) : null}
							{meta.home_address_2 ? (
								<span className={style.address2}>{meta.home_address_2}</span>
							) : null}
							{meta.home_address_3 ? (
								<span className={style.address3}>{meta.home_address_3}</span>
							) : null}

							<span className={style.city}>
								{meta.home_city ? meta.home_city : null}
								{meta.home_state ? `, ${meta.home_state}` : null}
								{meta.home_postal_code ? ` ${meta.home_postal_code}` : null}
							</span>
						</div>
					</div>
				) : null}

				<div className={style.contacts}>
					{meta?.customfields_directory__private_phone_number === 'False' ? (
						<>
							{meta?.home_phone ? (
								<span>
									<span>Phone: &nbsp;</span>
									<a
										href={`tel:${meta.home_phone}${
											meta.home_phone_extension
												? `,${meta.home_phone_extension}`
												: ''
										}`}
									>
										{meta.home_phone}
									</a>
								</span>
							) : null}
							{meta?.home_phone_extension ? (
								<span>
									<span>Ext: &nbsp;</span>
									<a
										href={`tel:${meta.home_phone}${
											meta.home_phone_extension
												? `,${meta.home_phone_extension}`
												: ''
										}`}
									>
										{meta.home_phone_extension}
									</a>
								</span>
							) : null}
						</>
					) : null}

					{meta?.customfields_directory__private_alternate_phone === 'False' ? (
						<>
							{meta.alternatephone ? (
								<span>
									<span>Alt Phone: &nbsp;</span>
									<a
										href={`tel:${meta.alternatephone}${
											meta.alternateextension
												? `,${meta.alternateextension}`
												: ''
										}`}
									>
										{meta.alternatephone}
									</a>
								</span>
							) : null}
							{meta.alternateextension ? (
								<span>
									<span>Ext: &nbsp;</span>
									<a
										href={`tel:${meta.alternatephone}${
											meta.alternateextension
												? `,${meta.alternateextension}`
												: ''
										}`}
									>
										{meta.alternateextension}
									</a>
								</span>
							) : null}
						</>
					) : null}

					{meta.faxphone ? (
						<span>
							<span>Fax: &nbsp;</span>
							<a href={`tel:${meta.faxphone}`}>{meta.faxphone}</a>
						</span>
					) : null}

					{meta.user_email &&
					!meta.user_email?.includes('@archimail') &&
					meta.customfields_directory__private_email === 'False' ? (
						<span>
							Email:&nbsp;
							<a href={`mailto:${meta.user_email}`}>{meta.user_email}</a>
						</span>
					) : null}
				</div>
			</div>
		</div>
	)
}
