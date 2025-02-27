import style from '@styles/components/Header/Public.module.scss'
import MenuButton from '../Buttons/MenuButton'
import mainLogo from '../../../public/images/logo.svg'
import Image from 'next/future/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOut } from '@fortawesome/pro-light-svg-icons'

import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { useRouter } from 'next/router'
import ForeteesButton from '@archipress/components/Buttons/ForeteesButton'
import NavigationLink from '@archipress/components/Links/Navigation'
import MainMenu from '@archipress/components/Navigation/Menu'
import { useState } from 'react'

export default function PublicHeader({ logo }: { logo: string }) {
	const router = useRouter()
	const { state } = useAppContext() as AppContextProps

	const authed = state?.loggedIn
	const isGolfPage =
		router.asPath.startsWith('/golf') || router.asPath.startsWith('/golf/')
			? true
			: false
	const logoURL = router.asPath.startsWith('/golf/')
		? '/golf'
		: authed
		? 'https://www.unionleague.org/members/index.php'
		: '/'

	const [open, toggleOpen] = useState(false)

	return (
		<>
			<div className={style.header}>
				<div className="left">
					<MenuButton toggleOpen={() => toggleOpen(!open)} open={open} />
				</div>

				<div className="middle">
					<NavigationLink href={logoURL}>
						<Image
							src={logo ?? mainLogo}
							alt="Logo SVG"
							width={100}
							height={100}
							priority={true}
						/>
					</NavigationLink>
				</div>

				<div className="right">
					{authed && isGolfPage ? (
						<>
							<div className="foretees">
								<ForeteesButton className="foreteesBtn">
									<h4>Tee Times</h4>
								</ForeteesButton>
							</div>

							<span className="separator">|</span>
						</>
					) : null}

					{authed ? (
						<NavigationLink href="/account/logout">
							<h4>Logout</h4>
							<FontAwesomeIcon icon={faSignOut} />
						</NavigationLink>
					) : (
						<NavigationLink href="https://www.unionleague.org/members.php">
							<h4>Member Login</h4>
						</NavigationLink>
					)}
				</div>

				<MainMenu
					type="main"
					open={open}
					toggleOpen={() => toggleOpen(!open)}
					primaryID="primary"
					primaryAuthedID="primary_menu__members"
					secondaryID="members_menu"
					menuIdType="LOCATION"
					limit={100}
				/>
			</div>
		</>
	)
}
