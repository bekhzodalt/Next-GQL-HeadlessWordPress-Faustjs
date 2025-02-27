import mainThemeOptions from '@archipress/themes/mainThemeOptions'
import { Modal } from '@mui/material'
import Image from 'next/image'
import style from '@styles/components/Effects/LoadingScreen.module.scss'

export default function LoadingScreen({ loading }: { loading?: boolean }) {
	const logo = mainThemeOptions.brand.secondLogo

	return (
		<Modal
			open={true}
			hideBackdrop={true}
			style={{
				backgroundColor: 'white',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
			}}
			className={`${style.modal} ${loading ? '' : style.notLoading}`}
		>
			<>
				<Image
					src={logo}
					alt="The Union League Logo"
					width={134}
					height={120}
					priority={true}
					layout="fixed"
				/>
			</>
		</Modal>
	)
}
