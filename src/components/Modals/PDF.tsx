import { faCloudDownloadAlt, faTimes } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Modal } from '@mui/material'
import style from '@styles/components/Modals/PDF.module.scss'

export default function PDFModal({
	pdf,
	open,
	callback,
}: {
	pdf: string
	open?: boolean
	callback: () => void
}) {
	return (
		<Modal open={open} className={style.modal} hideBackdrop={true}>
			<>
				<FontAwesomeIcon
					icon={faTimes}
					className="close"
					onClick={() => callback()}
				/>

				<div className="inner">
					<a href={pdf} target="_blank" download rel="noreferrer">
						<Button className="download">
							<span>Download</span>
							<FontAwesomeIcon icon={faCloudDownloadAlt} />
						</Button>
					</a>

					<iframe
						src={`${pdf + '#'}toolbar=0&view=FitH`}
						className="media"
						frame-border="0"
						scrolling="none"
					/>
				</div>
			</>
		</Modal>
	)
}
