import { router } from '../trpc'
import { authRouter } from './auth'
import { stylesRouter } from './styles'
import { userRouter } from './user'

export const appRouter = router({
	auth: authRouter,
	user: userRouter,
	styles: stylesRouter,
})

export type AppRouter = typeof appRouter
