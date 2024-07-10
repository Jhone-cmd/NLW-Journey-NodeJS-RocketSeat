import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { NotFound } from "../../errors/not-found";

export async function getParticipant(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participants/:participantId', {
        schema: {
            params: z.object({
                participantId: z.string().uuid()
            }),
        },
    }, async (request) => {
        const { participantId } = request.params;
        const participant = await prisma.participant.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                trip_id: true,
                is_confirmed: true
            },
            where: { id: participantId },
        });

        if (!participant) throw new NotFound('Participant not Found');

        return { participant }
    });
}