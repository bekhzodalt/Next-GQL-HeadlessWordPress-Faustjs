import { useAppContext, AppContextProps } from "@archipress/utilities/AppContext";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export default function AuthorizedContent({
	children,
}: {
	children: ReactNode;
}) {
	const { state } = useAppContext() as AppContextProps
	const router = useRouter();

	// Navigate unauthenticated users to Log In page.
	useEffect(() => {
		if (!state.viewer) {
			router.push("/account/login");
		}
	}, [state, router]);

	if (state.viewer) {
		return <>{children}</>;
	}

	return <p>Loading...</p>;
}
