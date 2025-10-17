import 'dotenv/config';
import fastify from 'fastify';

const app = fastify({ logger: true });

const AGENT_API_KEY = process.env.AGENT_API_KEY || '';

app.addHook('preHandler', async (req, res) => {
  const key = req.headers['x-api-key'];
  if (!key || key !== AGENT_API_KEY) {
    return res.code(401).send({ error: 'unauthorized' });
  }
});

const PORT = Number(process.env.PORT || 8080);

app.get('/health', async () => ({ ok: true }));

app.listen({ host: '0.0.0.0', port: PORT }).then(() => {
  app.log.info(`agent listening on:${PORT}`);
});

