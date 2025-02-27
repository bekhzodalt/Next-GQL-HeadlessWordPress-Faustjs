import { PublicLayout } from '@archipress/components'
import style from '@styles/pages/library.module.scss'
import Carousel, {
	CarouselSlide,
} from '@archipress/components/Carousels/Carousel'
import { faTimes } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/future/image'
import { useState } from 'react'
import { Modal } from '@mui/material'
import { LibraryPageDataFragment } from '@archipress/fragments/LibraryPages'
import NavigationLink from '@archipress/components/Links/Navigation'

export interface LibraryPageData {
	carousel: {
		media: {
			mediaItemUrl: string
		}
		type: string
	}[]
	overview: string
	subMenu: {
		label: string
		linkType: string
		modalImage: {
			mediaItemUrl: string
		}
		url: string
	}[]
	policies: {
		title: string
		content: string
	}
}

export default function Component(props: any) {
	const page = props?.data?.page
	const title = page?.title
	const libraryPage: LibraryPageData = page?.libraryPage?.pageContainer
	const slides: CarouselSlide[] = libraryPage?.carousel.map(
		(item: any) =>
			item && {
				src: item.media?.mediaItemUrl,
				type: item.type as any,
			}
	)

	const diagramSubMenuItem = libraryPage.subMenu.filter((item: any) => {
		return item.label == 'View the Library diagram'
	})
	const diagramImgUrl = diagramSubMenuItem[0].modalImage?.mediaItemUrl

	const [diagramModalOpened, setDiagramModalOpened] = useState(true)

	function viewDiagram() {
		setDiagramModalOpened(true)
	}

	return (
		<>
			<PublicLayout
				seo={{
					title,
				}}
			>
				<>
					<div className={`${style.page}`}>
						<Carousel slides={slides} type="golfCarousel" />

						<div className={style.overview}>
							<span
								className={style.content}
								dangerouslySetInnerHTML={{
									__html: libraryPage.overview,
								}}
							/>
						</div>

						<section className={style.subMenu}>
							<div className={style.inner}>
								{libraryPage.subMenu.map((item, i) => {
									if (item.label == 'View the Library diagram') {
										return (
											<a
												className={style.menuItem}
												key={i}
												onClick={() => viewDiagram()}
											>
												{item.label}
											</a>
										)
									} else {
										return (
											<NavigationLink
												className={style.menuItem}
												key={i}
												href={item.url || ''}
											>
												{item.label}
											</NavigationLink>
										)
									}
								})}
							</div>
						</section>

						<section className={style.policies}>
							<h2 className={style.title}>{libraryPage.policies.title}</h2>

							<span
								className={style.content}
								dangerouslySetInnerHTML={{
									__html: libraryPage.policies.content,
								}}
							/>
						</section>

						<Modal
							open={diagramModalOpened}
							className={style.modal}
							hideBackdrop={true}
						>
							<>
								<FontAwesomeIcon
									icon={faTimes}
									className={style.close}
									onClick={() => setDiagramModalOpened(false)}
								/>

								<section className={style.inner}>
									<h2>Library Diagram</h2>

									<div className={style.inner}>
										<Image src={diagramImgUrl} alt={`Diagram`} fill={true} />
									</div>
								</section>

								<div
									className={style.exitArea}
									onClick={() => setDiagramModalOpened(false)}
								/>
							</>
						</Modal>
					</div>
				</>
			</PublicLayout>
		</>
	)
}

Component.variables = ({ databaseId }: { databaseId: string }, ctx: any) => {
	return {
		databaseId,
		asPreview: ctx?.asPreview,
	}
}

Component.query = LibraryPageDataFragment
