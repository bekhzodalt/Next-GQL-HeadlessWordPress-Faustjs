import { createTheme, ThemeOptions } from '@mui/material/styles'
import logo from '../../public/images/logo.svg'
import logoB from '../../public/images/logo.png'

/* Carriage House Fonts
	americana: 'Americana',
	darby: 'Darby',
	freight: 'FreightBook',
	freightBold: 'FreightBold',
	freightLight: 'FreightLight',
	freightDispLight: 'FreightDispLight',
	freightDispLightItalic: 'FreightDispLightItalic',
	freightBook: 'FreightBook',
	freightBookItalic: 'FreightBookItalic',
	freightProLight: 'FreightProLight',
	helvetica: 'Helvetica',
	minion: 'Minion',
*/

interface MyThemeOptions extends ThemeOptions {
	brand: {
		logo: string
		secondLogo: string
		name: string
	}
}

const mainThemeOptions: MyThemeOptions = {
	palette: {
		mode: 'light',
	},

	brand: {
		logo: logo,
		secondLogo: logoB.src,
		name: '',
	},

	typography: {
		h1: {
			fontFamily: 'Darby',
		},

		h2: {
			fontFamily: 'Darby',
			fontSize: '4.5em',
		},

		h3: {
			fontFamily: 'Americana',
		},

		h4: {
			fontFamily: 'Americana',
		},

		h5: {
			fontFamily: 'FreightDispLightItalic',
		},

		subtitle1: {
			fontFamily: 'FreightBook',
		},

		subtitle2: {
			fontFamily: 'Americana',
		},
	},
}

export default mainThemeOptions

export function getMainTheme() {
	return createTheme(mainThemeOptions)
}
