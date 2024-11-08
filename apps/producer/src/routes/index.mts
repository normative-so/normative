import { Router } from "express";
import postRouter from './post.mjs';
import bullBoardRouter from './bullBoardRoute.mjs';

const router: Router = Router();

router.use('/post', postRouter);
router.use('/queues', bullBoardRouter);

export default router;