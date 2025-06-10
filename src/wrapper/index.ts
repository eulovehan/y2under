import { Request, Response, NextFunction } from 'express';

export function AsyncWrapper(callback: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
	return async (req: Request, res: Response, next: NextFunction) => {
		let cb = null;
		try {
			cb = await callback(req, res, next);
		} catch (err) {
			cb = await wrapperV3(req, res, err);
		}
		
		return cb;
	}
}

async function wrapperV3(req: Request, res: Response, err: any) {
	console.error(err);
	
	res.status(500).send({
		message: "Internal Server Error",
		error: err.message
	});
}