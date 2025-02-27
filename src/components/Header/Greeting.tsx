import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import style from '@styles/components/Header/Greeting.module.scss'

export default function HeaderGreeting() {
	const { state } = useAppContext() as AppContextProps
	return (
		<h4 className={`greeting ${style.greeting}`}>
			Good Afternoon, <br />
			{state?.viewer?.firstName ?? 'User'}
		</h4>
	)
}
