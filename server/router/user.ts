import { protectedProcedure, router } from 'server/trpc'

export const userRouter = router({
	// myStyles: protectedProcedure.query(async ({ ctx }) => {
	// 	return ctx.prisma.styles.findMany({
	// 		orderBy: { createdAt: 'desc' },
	// 		where: {
	// 			userId: ctx.session.user.id,
	// 		},
	// 	})
	// }),
})
