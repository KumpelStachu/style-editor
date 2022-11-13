import { createGetInitialProps } from '@mantine/next'
import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class _Document extends Document {
	static getInitialProps = createGetInitialProps()

	render() {
		return (
			<Html
				style={{
					scrollBehavior: 'smooth',
					scrollPaddingTop: 'calc(var(--mantine-header-height) + 16px)',
				}}
			>
				<Head />
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}
