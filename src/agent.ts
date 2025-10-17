import 'dotenv/config';
import fastify from 'fastify';

const app = fastify({ logger: true });

const PORT = Number(process.env.PORT || 8080);

app.get('/health', async () => ({ ok: true }));

app.listen({ host: '0.0.0.0', port: PORT }).then(() => {
  app.log.info(`agent listening on:${PORT}`);
});

