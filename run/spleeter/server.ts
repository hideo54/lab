import Fastify from 'fastify';
import dotenv from 'dotenv';
dotenv.config();

const app = Fastify();

app.post<{
    Body: {
        url: string;
    };
}>('/', async (request, reply) => {
    const { url } = request.body;

    // TODO: Exec yt-dlp

    // TODO: Exec spleeter

    // TODO: Upload to Cloud Storage

    // TODO: Return URL

    reply.send({
        ok: true,
        url,
    });
});

app.listen({
    host: '::',
    port: Number(process.env.PORT) || 8080,
});
