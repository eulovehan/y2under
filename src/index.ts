import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routers from './routes';

dotenv.config();

/** create a app */
const app = express();
const PORT = process.env.PORT || 5200;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** views set */
// app.set('views', path.join(__dirname, 'templates'));
// app.set('view engine', 'ejs');

/** routers */
app.use('/', routers);

/** start server */
app.listen(PORT, () => {
	console.log(`✅ Server is running on http://localhost:${PORT}`);
});
