import { AppShell } from '@mantine/core'
import AppHeader from './AppHeader'

type Props = {
	children: React.ReactNode
}

export default function Layout({ children }: Props) {
	return (
		<AppShell header={<AppHeader />} sx={t => ({ backgroundColor: t.colors.dark[8] })}>
			{children}
		</AppShell>
	)
}
