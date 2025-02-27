import NavigationLink from '@archipress/components/Links/Navigation'
import style from '@styles/components/Card/Fade.module.scss'
import Image from 'next/image'

export default function FadeCard({
	img,
	label,
	url,
}: {
	img: string
	label: string
	url?: string
}) {
	return (
		<div className={style.fadeCard}>
			{url ? (
				<NavigationLink href={url}>
					<h4 className={style.label}>{label}</h4>
					<Image src={img} alt={label} width={400} height={400} />
				</NavigationLink>
			) : (
				<>
					<h4 className={style.label}>{label}</h4>
					<Image src={img} alt={label} width={400} height={400} />
				</>
			)}
		</div>
	)
}
