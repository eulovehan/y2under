import * as Express from 'express';
import youtubedl from 'youtube-dl-exec';
import fs from 'fs';
import path from 'path';

type Request = Express.Request;
type Response = Express.Response;

const downloadDir = `folders`;

/** 파일명 정리 함수 */
function sanitizeFilename(filename: string): string {
	// Windows에서 사용할 수 없는 문자만 제거
	return filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '');
}

/** server side render */
export async function home(req: Request, res: Response) {
	console.log("🚀 Home API is Running!");
	
	res.render("../templates/page/index.ejs");
}
// https://www.youtube.com/watch?v=Yc2xGzGLtNA
/** donwloader */
export async function download(req: Request, res: Response) {
	const {
		body
	} = req;

	const {
		url
	} = body;

	console.log("body => ", body);

	/** url 형태 검사 */
	if (!url) {
		throw new Error("url is required");
	}
	
	console.log("🚀 Download API is Running!");
	/** 다운로드 폴더 정리 */
	if (!fs.existsSync(downloadDir)) {
		fs.mkdirSync(downloadDir);
	}
	
	else {
		fs.rmdirSync(downloadDir, { recursive: true });
		fs.mkdirSync(downloadDir);
	}
	
	/** 다운로드 진행 */
	await youtubedl(url, {
		extractAudio: true,
		audioFormat: 'mp3',
		output: `${downloadDir}/y2mate.com - %(title)s.mp3`,
	})
	.then((output) => {
		console.log("youtube-dl output:", output);
		return output;
	})
	.catch((error) => {
		console.error(error);
		throw error;
	});

	/** 폴더 첫 번째 파일 정보 가져오기 */
	const files = fs.readdirSync(downloadDir);
	const file = files[0];
	console.log("Original filename:", file);

	/** 파일 정보가 없으면 캔슬 */
	if (!file) {
		throw new Error("file is not found");
	}
	
	/** 파일 다운로드 */
	const filePath = `${downloadDir}/${file}`;
	const finalFileName = sanitizeFilename(file);
	console.log("Final filename:", finalFileName);
	
	// 파일명을 URL-safe하게 인코딩
	const encodedFileName = encodeURIComponent(finalFileName);
	res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodedFileName}`);
	res.setHeader('Content-Type', 'application/octet-stream');
	
	const fileStream = fs.createReadStream(filePath);
	fileStream.pipe(res);
	
	fileStream.on('end', () => {
		console.log("success");
	});
	
	fileStream.on('error', (err) => {
		console.error(err);
		res.status(500).send('Error downloading file');
	});
}