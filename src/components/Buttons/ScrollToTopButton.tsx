import style from '@styles/components/ScrollToTopButton.module.scss'
import { faArrowCircleUp } from '@fortawesome/pro-light-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button } from '@mui/material'

export default function ScrollToTopButton() {
	const scrollToTop = () => {
		const element = document.getElementById("topSection")
		if (!element) return
		element.scrollIntoView({ behavior: 'smooth' })
	};

	return (
		<Button className={style.scrollBtn}>
			<FontAwesomeIcon
				onClick={scrollToTop}
				icon={faArrowCircleUp}
			/>
		</Button>
	);
}
