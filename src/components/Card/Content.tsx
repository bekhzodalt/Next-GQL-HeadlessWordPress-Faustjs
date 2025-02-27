import Carousel, {
	CarouselSlide,
} from '@archipress/components/Carousels/Carousel'
import { DropDownContent } from '@archipress/components'
import style from '@styles/components/Card/Content.module.scss'
import { useScrollTo } from '@archipress/utilities/functions'
import NavigationLink from '@archipress/components/Links/Navigation'

export interface ContentCardProps {
	slideshow: {
		mediaItemUrl: string
	}[]
	content: {
		contentText: string
		buttons: {
			buttonsLabel: string
			buttonsLink: string
			buttonsPdf: {
				mediaItemUrl: string
			}
		}[]
		contentServices: {
			contentServicesContent: string
			contentServicesLabel: string
		}[]
	}
}

export default function ContentCard({ card }: { card: ContentCardProps }) {
	const scroller = useScrollTo()
	const text = card.content.contentText

	const services = card.content.contentServices

	const buttons = card.content.buttons

	const slides: CarouselSlide[] = card.slideshow?.map(
		item =>
			item && {
				src: item.mediaItemUrl,
				type: 'img',
			}
	)

	return (
		<div className={`card ${style.card}`}>
			<div className={`left ${style.left}`}>
				<div className={style.contentWrap}>
					{text ? (
						<div className={style.contentTextWrap}>
							<div
								className={style.contentText}
								dangerouslySetInnerHTML={{ __html: text }}
							/>
						</div>
					) : null}

					{services ? (
						<div className={style.services}>
							{services.map((service, i) => {
								return (
									<DropDownContent
										label={service.contentServicesLabel}
										level="h6"
										content={service.contentServicesContent}
										key={i}
									/>
								)
							})}
						</div>
					) : null}
				</div>

				{buttons ? (
					<div className={style.buttons}>
						{buttons.map((button, i) => {
							return button.buttonsLink ? (
								button.buttonsLink.startsWith('#') ? (
									<a
										className={style.button}
										key={i}
										onClick={() => scroller(button.buttonsLink)}
									>
										{button.buttonsLabel}
									</a>
								) : (
									<NavigationLink
										href={button.buttonsLink}
										className={style.button}
										key={i}
									>
										{button?.buttonsLabel}
									</NavigationLink>
								)
							) : button.buttonsPdf ? (
								<a
									href={button.buttonsPdf.mediaItemUrl || ''}
									className={style.button}
									key={i}
									download="true"
									target="_blank"
									rel="noreferrer"
								>
									{button?.buttonsLabel}
								</a>
							) : null
						})}
					</div>
				) : null}
			</div>

			{slides ? (
				<Carousel slides={slides} className={`right ${style.right}`} />
			) : null}
		</div>
	)
}
