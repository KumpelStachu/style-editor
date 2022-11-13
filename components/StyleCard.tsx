import { Box, Card, CSSObject } from '@mantine/core'
import { Styles } from '@prisma/client'
import Link from 'next/link'

type Props = {
	style: Styles
}

export default function StyleCard({ style }: Props) {
	return (
		<Card
			sx={{ minHeight: 200, minWidth: 300, whiteSpace: 'pre' }}
			component={Link}
			href={`/s/${style.id}`}
		>
			<Box sx={style.styles as CSSObject}>{style.content}</Box>
		</Card>
	)
}
