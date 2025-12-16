import * as Express from 'express';
import { AsyncWrapper } from '../wrapper';
import { download, home } from '../controllers';

const router = Express.Router();

/** routes */
router.get(
	'/',
	AsyncWrapper((req, res) => home(req, res)),
);

router.post(
	'/download',
	AsyncWrapper((req, res) => download(req, res)),
);

export default router;
