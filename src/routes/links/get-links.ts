import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { NotFound } from "../../errors/not-found";

export async function getLinks(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/links', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
        },
    }, async (request) => {
        const { tripId } = request.params;
        const trip = await prisma.trip.findUnique({
            where: { id: tripId },
            include: {
                links: true
            }
        });

        if (!trip) throw new NotFound('Trip not Found');

        return { links: trip.links }
    });
}