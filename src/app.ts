import cors from "@fastify/cors";
import fastify from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { createActivity } from "./routes/activities/create-activity";
import { getActivities } from "./routes/activities/get-activities";
import { createLink } from "./routes/links/create-link";
import { getLinks } from "./routes/links/get-links";
import { confirmParticipant } from "./routes/participants/confirm-participant";
import { createInvite } from "./routes/participants/create-invite";
import { getParticipant } from "./routes/participants/get-participant";
import { getParticipants } from "./routes/participants/get-participants";
import { confirmTrip } from "./routes/trips/confirm-trip";
import { createTrip } from "./routes/trips/create-trip";
import { getTripDetails } from "./routes/trips/get-trip-details";
import { updateTrip } from "./routes/trips/update-trip";
import { errorHandler } from "./error-handlers";


export const app = fastify();

app.register(cors, {
    origin: true,
});

// Validation
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Error
app.setErrorHandler(errorHandler);

// Routes Trips
app.register(createTrip);
app.register(confirmTrip);
app.register(updateTrip);
app.register(getTripDetails);

// Routes Participants
app.register(confirmParticipant);
app.register(createInvite);
app.register(getParticipants);
app.register(getParticipant);

// Routes Activities
app.register(createActivity);
app.register(getActivities);

// Routes Links
app.register(createLink);
app.register(getLinks);
