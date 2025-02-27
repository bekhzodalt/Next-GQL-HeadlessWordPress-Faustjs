import NavigationLink from '@archipress/components/Links/Navigation'
import Image from 'next/image'
import style from '@styles/components/Banner.module.scss'
import ForeteesButton from '@archipress/components/Buttons/ForeteesButton'

export default function Banner({
	img,
	link,
	dual = false,
	img2,
	link2,
	teeTimes = false,
}: {
	img: string
	link: string
	dual?: boolean
	img2?: string
	link2?: string
	teeTimes?: boolean
}) {
	if (!img || !link || (dual && !img2) || (dual && !link2)) return null

	return dual ? (
		<div className={style.banner}>
			<div className={style.wrapper}>
				<NavigationLink href={link || ''}>
					<Image
						src={img}
						width={1000}
						height={125}
						alt="Banner Image"
						quality={100}
					/>
				</NavigationLink>

				<NavigationLink href={link2 || ''}>
					<Image
						src={img2}
						width={1000}
						height={125}
						alt="Banner Image"
						quality={100}
					/>
				</NavigationLink>
			</div>
		</div>
	) : (
		<div className={style.banner}>
			{!teeTimes ? (
				<NavigationLink href={link || ''}>
					<Image
						src={img}
						width={1000}
						height={125}
						alt="Banner Image"
						quality={100}
					/>
				</NavigationLink>
			) : (
				<ForeteesButton>
					<Image
						src={img}
						width={1000}
						height={125}
						alt="Banner Image"
						quality={100}
					/>
				</ForeteesButton>
			)}
		</div>
	)
}
