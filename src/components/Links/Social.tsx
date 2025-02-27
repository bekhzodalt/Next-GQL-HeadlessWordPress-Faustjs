import { IconProp } from '@fortawesome/fontawesome-svg-core'
import {
	faFacebookF,
	faInstagram,
	faLinkedinIn,
	faPinterest,
	faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import style from '@styles/components/Links/Social.module.scss'

export default function SocialLink({
	type = 'facebook',
	to = '#',
}: {
	type?: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'pinterest'
	to?: string
}) {
	const icons = () => {
		switch (type) {
			case 'facebook':
				return faFacebookF
			case 'instagram':
				return faInstagram
			case 'linkedin':
				return faLinkedinIn
			case 'twitter':
				return faTwitter
			case 'pinterest':
				return faPinterest
			default:
				return faFacebookF
		}
	}

	const icon = icons() as IconProp

	return (
		<a
			className={style.social}
			href={to || ''}
			target="_blank"
			rel="noreferrer"
		>
			<FontAwesomeIcon icon={icon} />
		</a>
	)
}
