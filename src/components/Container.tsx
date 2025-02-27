import styles from '@styles/components/Container.module.scss'
import { ReactNode } from 'react'

export default function Container({ children }: { children: ReactNode }) {
	return <div className={styles.component}>{children}</div>
}
