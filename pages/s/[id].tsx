import {
	Box,
	Button,
	Card,
	ColorInput,
	CSSObject,
	Group,
	LoadingOverlay,
	ScrollArea,
	Select,
	Stack,
	Textarea,
	TextInput,
	Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Prism } from '@mantine/prism'
import { IconDeviceFloppy } from '@tabler/icons'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { prisma } from 'server/prisma'
import { trpc } from 'utils/trpc'
import prismTheme from 'prism-react-renderer/themes/vsDark'
import { useRef } from 'react'
import useSession from 'hooks/useSession'

export default function StylePage() {
	const { session } = useSession()

	const { query } = useRouter()
	const initial = trpc.styles.byId.useQuery(query.id as string, {
		refetchOnWindowFocus: false,
	})

	const utils = trpc.useContext()
	const save = trpc.styles.edit.useMutation({
		onMutate() {
			utils.styles.byId.invalidate(query.id as string)
		},
	})

	const form = useForm({
		initialValues: {
			content: initial.data?.content,
			styles: initial.data?.styles,
		},
	})

	const previewRef = useRef<HTMLDivElement>(null)

	return (
		<Box
			sx={t => ({
				height: `calc(100vh - 56px - ${2 * t.spacing.md}px)`,
				display: 'grid',
				gridTemplateColumns: 'auto 350px',
				gridTemplateRows: 'auto 40%',
				gap: t.spacing.md,
			})}
		>
			<Card withBorder component={ScrollArea} sx={{ whiteSpace: 'pre', position: 'relative' }}>
				<Box ref={previewRef} sx={form.values.styles as CSSObject}>
					{form.values.content}
				</Box>
			</Card>

			<Card withBorder component={ScrollArea} p={0}>
				<Card.Section>
					<Prism
						noCopy
						scrollAreaComponent="div"
						language="css"
						withLineNumbers
						getPrismTheme={() => prismTheme}
						styles={{
							code: {
								backgroundColor: 'transparent !important',
								tabSize: 4,
							},
						}}
					>
						{`.${previewRef.current?.className ?? 'className'} {
${Object.entries(form.values.styles ?? {})
	.filter(([, v]) => v)
	.map(([k, v]) => `\t${k.replace(/([A-Z])/g, v => `-${v.toLowerCase()}`)}: ${v};`)
	.join('\n')}\n}`}
					</Prism>
				</Card.Section>
			</Card>

			<Card
				p={0}
				component={ScrollArea}
				withBorder
				sx={{
					gridColumn: '2',
					gridRow: '1 / -1',
					position: 'relative',
				}}
			>
				<LoadingOverlay visible={save.isLoading} />

				<Card.Section
					p="md"
					component="form"
					onSubmit={form.onSubmit(
						values =>
							initial.data &&
							save.mutate({
								id: initial.data.id,
								content: values.content ?? '',
								styles: values.styles ?? {},
							})
					)}
				>
					<Stack>
						<Group position="apart">
							<Title mr="auto">Edytor</Title>

							<Button
								type="submit"
								leftIcon={<IconDeviceFloppy size={20} />}
								loading={save.isLoading}
								disabled={session?.user.id !== initial.data?.userId}
							>
								Zapisz
							</Button>
						</Group>

						<Textarea
							label="Tekst"
							placeholder="content"
							autosize
							{...form.getInputProps('content')}
						/>

						<Stack spacing="xs">
							<Title order={3}>Margines zewnętrzny</Title>

							<TextInput
								autoComplete="off"
								label="Górny"
								placeholder="margin-top"
								{...form.getInputProps('styles.marginTop')}
							/>
							<TextInput
								autoComplete="off"
								label="Lewy"
								placeholder="margin-left"
								{...form.getInputProps('styles.marginLeft')}
							/>
							<TextInput
								autoComplete="off"
								label="Prawy"
								placeholder="margin-right"
								{...form.getInputProps('styles.marginRight')}
							/>
							<TextInput
								autoComplete="off"
								label="Dolny"
								placeholder="margin-bottom"
								{...form.getInputProps('styles.marginBottom')}
							/>
						</Stack>

						<Stack spacing="xs">
							<Title order={3}>Margines wewnętrzny</Title>
							<TextInput
								autoComplete="off"
								label="Górny"
								placeholder="padding-top"
								{...form.getInputProps('styles.paddingTop')}
							/>
							<TextInput
								autoComplete="off"
								label="Lewy"
								placeholder="padding-left"
								{...form.getInputProps('styles.paddingLeft')}
							/>
							<TextInput
								autoComplete="off"
								label="Prawy"
								placeholder="padding-right"
								{...form.getInputProps('styles.paddingRight')}
							/>
							<TextInput
								autoComplete="off"
								label="Dolny"
								placeholder="padding-bottom"
								{...form.getInputProps('styles.paddingBottom')}
							/>
						</Stack>

						<Stack spacing="xs">
							<Title order={3}>Tekst</Title>

							<TextInput
								autoComplete="off"
								label="Wielkość"
								placeholder="font-size"
								{...form.getInputProps('styles.fontSize')}
							/>

							<Select
								autoComplete="off"
								allowDeselect
								data={[
									{ value: 'serif', label: 'Szeryfowa' },
									{ value: 'sans-serif', label: 'Bezszeryfowa' },
									{ value: 'monospace', label: 'Stała szerokość' },
									{ value: 'cursive', label: 'Kursywa' },
									{ value: 'fantasy', label: 'Fantastyczna' },
									{ value: 'system-ui', label: 'Systemowa' },
									{ value: 'ui-serif', label: 'Systemowa szeryfowa' },
									{ value: 'ui-sans-serif', label: 'Systemowa bezszeryfowa' },
									{ value: 'ui-monospace', label: 'Systemowa stała szerokość' },
									{ value: 'ui-rounded', label: 'Systemowa zaokrąglona' },
									{ value: 'emoji', label: 'Emoji' },
									{ value: 'math', label: 'Matematyczna' },
									{ value: 'fangsong', label: '饮水思源' },
								]}
								label="Czcionka"
								placeholder="font-family"
								{...form.getInputProps('styles.fontFamily')}
							/>

							<ColorInput
								withinPortal={false}
								swatchesPerRow={8}
								swatches={[
									'#ced4da',
									'#ff8787',
									'#f783ac',
									'#da77f2',
									'#9775fa',
									'#748ffc',
									'#4dabf7',
									'#3bc9db',
									'#38d9a9',
									'#69db7c',
									'#a9e34b',
									'#ffd43b',
									'#ffa94d',
								]}
								autoComplete="off"
								label="Kolor"
								placeholder="color"
								{...form.getInputProps('styles.color')}
							/>

							<Select
								autoComplete="off"
								allowDeselect
								data={[
									{ value: 'left', label: 'Do lewej' },
									{ value: 'center', label: 'Do środka' },
									{ value: 'right', label: 'Do prawej' },
									{ value: 'justify', label: 'Wyjustowany' },
								]}
								label="Wyrównanie"
								placeholder="Wyrównanie"
								{...form.getInputProps('styles.text-align')}
							/>
						</Stack>

						<Stack spacing="xs">
							<Title order={3}>Tło</Title>

							<ColorInput
								withinPortal={false}
								swatchesPerRow={8}
								swatches={[
									'#f1f3f5',
									'#212529',
									'#c92a2a',
									'#a61e4d',
									'#862e9c',
									'#5f3dc4',
									'#364fc7',
									'#1864ab',
									'#0b7285',
									'#087f5b',
									'#2b8a3e',
									'#5c940d',
									'#e67700',
									'#d9480f',
								]}
								autoComplete="off"
								label="Kolor"
								placeholder="background-color"
								{...form.getInputProps('styles.backgroundColor')}
							/>
						</Stack>

						<Stack spacing="xs">
							<Title order={3}>Obramowanie</Title>

							<TextInput
								autoComplete="off"
								label="Szerokość"
								placeholder="border-width"
								{...form.getInputProps('styles.borderWidth')}
							/>
							<Select
								autoComplete="off"
								data={[
									{ value: 'hidden', label: 'Ukryte' },
									{ value: 'dotted', label: 'Kropkowane' },
									{ value: 'dashed', label: 'Kreskowane' },
									{ value: 'solid', label: 'Stałe' },
									{ value: 'double', label: 'Podwójne' },
									{ value: 'groove', label: 'Rowkowane' },
									{ value: 'ridge', label: 'Rowkowane odwrotnie' },
									{ value: 'inset', label: 'Wklęsłe' },
									{ value: 'outset', label: 'Wypukłe' },
								]}
								label="Styl"
								placeholder="border-style"
								{...form.getInputProps('styles.borderStyle')}
							/>
							<ColorInput
								withinPortal={false}
								swatchesPerRow={8}
								swatches={[
									'#ced4da',
									'#ff8787',
									'#f783ac',
									'#da77f2',
									'#9775fa',
									'#748ffc',
									'#4dabf7',
									'#3bc9db',
									'#38d9a9',
									'#69db7c',
									'#a9e34b',
									'#ffd43b',
									'#ffa94d',
									'#000000',
								]}
								autoComplete="off"
								label="Kolor"
								placeholder="border-color"
								{...form.getInputProps('styles.borderColor')}
							/>
						</Stack>
					</Stack>
				</Card.Section>
			</Card>
		</Box>
	)
}

export const getServerSideProps: GetServerSideProps = async ctx => {
	const data = await prisma.styles.findUnique({
		where: {
			id: ctx.query.id as string,
		},
	})

	return data ? { props: {} } : { notFound: true }
}
