import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { NotFound } from "../../errors/not-found";

export async function getTripDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
        },
    }, async (request) => {
        const { tripId } = request.params;
        const trip = await prisma.trip.findUnique({
            select: {
                id: true,
                destination: true,
                starts_at: true,
                ends_at: true,
                is_confirmed: true
            },
            where: { id: tripId },
        });

        if (!trip) throw new NotFound('Trip not Found');

        return { trip }
    });
}