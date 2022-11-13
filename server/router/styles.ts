import { protectedProcedure, publicProcedure, router } from 'server/trpc'
import { z } from 'zod'
import dayjs from 'dayjs'

export const stylesRouter = router({
	my: protectedProcedure.query(async ({ ctx }) => {
		return ctx.prisma.styles.findMany({
			orderBy: { createdAt: 'desc' },
			where: {
				userId: ctx.session.user.id,
			},
		})
	}),
	recent: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.styles.findMany({
			orderBy: { createdAt: 'desc' },
			where: {
				OR: [{ public: true }, { userId: ctx.session?.user.id }],
			},
			take: 50,
		})
	}),
	popular: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.styles.findMany({
			orderBy: { content: 'asc' },
			where: {
				OR: [{ public: true }, { userId: ctx.session?.user.id }],
			},
			take: 10,
		})
	}),
	byUser: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
		return ctx.prisma.styles.findMany({
			orderBy: { createdAt: 'desc' },
			where: {
				user: {
					name: input,
				},
				public: true,
			},
		})
	}),
	byId: publicProcedure.input(z.string().cuid()).query(async ({ ctx, input }) => {
		return ctx.prisma.styles.findUnique({
			where: {
				id: input,
				public: true,
			},
		})
	}),
	create: protectedProcedure.mutation(async ({ ctx }) => {
		return ctx.prisma.styles.create({
			data: {
				content: `${ctx.session.user.name}\n\t${dayjs().format('HH:mm:ss DD.MM.YYYY')}`,
				userId: ctx.session.user.id,
			},
		})
	}),
	edit: protectedProcedure
		.input(
			z.object({
				id: z.string().cuid(),
				content: z.string().min(1),
				styles: z.object({}).passthrough(),
			})
		)
		.mutation(async ({ ctx, input: { id, ...input } }) => {
			return ctx.prisma.styles.update({
				where: { id },
				data: input,
			})
		}),
})
