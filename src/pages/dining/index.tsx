import { gql } from '@apollo/client'
import LoadingScreen from '@archipress/components/Effects/LoadingScreen'
import DiningLayout from '@archipress/components/Layouts/Dining'
import apolloClient from '@archipress/utilities/ApolloClient'
import {
	AppContextProps,
	useAppContext,
} from '@archipress/utilities/AppContext'
import { ReservationProvider } from '@archipress/utilities/ReservationContext'
import { useRouter } from 'next/router'

export default function DiningPage() {
	const { state } = useAppContext() as AppContextProps
	const router = useRouter()
	const loading = !state?.generalSettings
	if (!state?.loggedIn && !loading) {
		top.location.replace(
			`https://www.unionleague.org/members.php?redirect_uri=${router.asPath}`
		)
	}
	return <>{!loading ? <Page /> : <LoadingScreen />}</>
}

function Page() {
	return (
		<>
			<ReservationProvider>
				<DiningLayout page="dining" seo={{ title: 'Dining' }} />
			</ReservationProvider>
		</>
	)
}

export async function getStaticProps(ctx: any) {
	return { props: {}, revalidate: 600 }
}
