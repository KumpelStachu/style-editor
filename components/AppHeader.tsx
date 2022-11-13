import { Button, ButtonProps, Group, Header } from '@mantine/core'
import { IconChecklist, IconHome, TablerIcon, IconPlus } from '@tabler/icons'
import useSession from 'hooks/useSession'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'
import UserDropdown from './UserDropdown'

export default function AppHeader() {
	const { session } = useSession()
	const router = useRouter()
	const create = trpc.styles.create.useMutation({
		onSuccess(data) {
			router.push(`/s/${data.id}`)
		},
	})

	return (
		<Header height={56} px="sm">
			<Group style={{ height: '100%' }} spacing="xs" position="apart" noWrap>
				<Group spacing="xs" noWrap>
					<NavLink href="/" icon={IconHome} exact>
						Strona główna
					</NavLink>

					{session && (
						<NavLink href={`/u/${session.user.name}`} icon={IconChecklist}>
							Moje style
						</NavLink>
					)}
				</Group>

				<Group spacing="xs" noWrap>
					{session && (
						<Button
							variant="subtle"
							leftIcon={<IconPlus size={20} />}
							onClick={() => create.mutate()}
							loading={create.isLoading}
						>
							Nowy edytor
						</Button>
					)}

					<UserDropdown />
				</Group>
			</Group>
		</Header>
	)
}

type NavProps = ButtonProps & {
	exact?: boolean
	href: string
	icon: TablerIcon
	leftIcon?: undefined
	hidden?: boolean
}

function NavLink({ icon, exact, href, ...props }: NavProps) {
	const { asPath } = useRouter()
	const Icon = icon

	return (
		<Button
			component={Link}
			href={href}
			variant={(exact ? asPath === href : asPath.startsWith(href)) ? 'light' : 'subtle'}
			leftIcon={<Icon size={20} />}
			{...props}
		/>
	)
}
