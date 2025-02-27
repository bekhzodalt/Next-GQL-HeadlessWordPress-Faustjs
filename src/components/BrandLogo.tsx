import mainThemeOptions from '@archipress/themes/mainThemeOptions'
import Image from 'next/image'

export default function BrandLogo() {
	const logo = mainThemeOptions.brand.logo
	const name = mainThemeOptions.brand.name

	return (
		<div className="brand-logo">
			<Image
				priority={true}
				src={logo}
				alt={name}
				width={60}
				height={60}
				style={{
					filter: 'brightness(10)',
				}}
			/>
		</div>
	)
}
