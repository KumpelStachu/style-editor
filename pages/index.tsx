import { Container, Divider, Grid, Stack, Title } from '@mantine/core'
import StyleCard from 'components/StyleCard'
import { trpc } from 'utils/trpc'

export default function Home() {
	const recent = trpc.styles.recent.useQuery()
	// const popular = trpc.styles.popular.useQuery()

	return (
		<Container size="lg">
			<Stack>
				<Title color="white">Najnowsze style</Title>
				<Grid>
					{recent.data?.map(style => (
						<Grid.Col key={style.id} span="auto">
							<StyleCard style={style} />
						</Grid.Col>
					))}
				</Grid>

				{/* <Divider />

				<Title color="white">Popularne style</Title>
				<Grid>
					{popular.data?.map(style => (
						<Grid.Col key={style.id} span="auto">
							<StyleCard style={style} />
						</Grid.Col>
					))}
				</Grid> */}
			</Stack>
		</Container>
	)
}
