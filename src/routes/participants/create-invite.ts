import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { z } from "zod";
import { dayjs } from "../../lib/dayjs";
import { getMailClient } from "../../lib/mail";
import { prisma } from "../../lib/prisma";
import { env } from "../../env/schema";
import { NotFound } from "../../errors/not-found";


export async function createInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invites', {
        schema: {
            params: z.object({
                tripId: z.string().uuid()
            }),
            body: z.object({
                email: z.string().email()
            }),
        },
    }, async (request) => {
        const { tripId } = request.params;
        const { email } = request.body;

        const trip = await prisma.trip.findUnique({
            where: { id: tripId }
        });

        if (!trip) throw new NotFound('Trip Not Found');

        const participantInvite = await prisma.participant.create({
            data: { 
                email,
                trip_id: tripId
            }
        });

        const formattedStartDate = dayjs(trip.starts_at).format('LL');
        const formattedEndDate = dayjs(trip.ends_at).format('LL');

        const mail = await getMailClient();
       
        const confirmationLink = `${env.API_BASE_URL}/participants/${participantInvite.id}/confirm`;
    
        const message = await mail.sendMail({
            from: {
                name: 'plann.er',
                address: 'contact@plann.er.com'
            }, 
            to: participantInvite.email,
            subject: `Confirme sua presença para ${trip.destination} em ${formattedStartDate}`,
            html: `
                <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                    <p>Você convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                    <p></p>
                    <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                    <p></p>
                    <p>
                        <a href="${confirmationLink}">Confirmar viagem</a>
                    </p>
                    <p></p>
                    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore esse e-mail.</p>
                </div>`
            .trim()
            });
            
            console.log(nodemailer.getTestMessageUrl(message));

        return { participant: participantInvite.id }
    });
}