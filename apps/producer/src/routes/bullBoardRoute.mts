
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js';
import databaseQueue from '../queues/databaseQueue.mjs';
import pagesQueue from '../queues/pagesQueue.mjs';
import nestedBlockQueue from '../queues/nestedBlockQueue.mjs';
import { ExpressAdapter } from '@bull-board/express';
import { Router } from 'express';

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/queues');

const router: Router = Router();

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(databaseQueue), new BullMQAdapter(pagesQueue), new BullMQAdapter(nestedBlockQueue)],
    serverAdapter: serverAdapter,
});

router.use(serverAdapter.getRouter());

export default router;

