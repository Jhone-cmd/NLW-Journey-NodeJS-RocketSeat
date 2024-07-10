import { FastifyInstance } from "fastify";
import { BadRequest } from "./errors/bad-request";
import { NotFound } from "./errors/not-found";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
    
    if (error instanceof ZodError) {
        return reply.status(400).send({ 
            message: 'Invalid Input',
            error: error.flatten().fieldErrors
         });
    } 

    if (error instanceof BadRequest) {
        return reply.status(400).send({ message: error.message });
    } 

    if (error instanceof NotFound) {
        return reply.status(404).send({ message: error.message });
    } 
    
    return reply.status(500).send({ message: 'Internal Server Error' })
}