import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { Router } from 'express';
import { loadQueues } from '../queues/index.mjs';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');

const router: Router = Router();

createBullBoard({
    queues: await loadQueues(),
    serverAdapter: serverAdapter,
});

router.use(serverAdapter.getRouter());

export default router;

