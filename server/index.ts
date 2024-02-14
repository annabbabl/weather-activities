import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import { 
  indexRouter, 
  testAPIRouter, 
  usersRouter, 
  registrationRouter,
  loginRouter, 
  profileRouter
} from './routes'; 
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

interface ErrorWithStatus extends Error {
  status?: number;
}

const PORT = process.env.PORT || 3001;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter); // Index router
app.use('/user', usersRouter); // User router
app.use('/api', testAPIRouter); // API router
app.use('/testAPI', testAPIRouter); // Test API router
app.use('/login', loginRouter); // Login router
app.use('/registration', registrationRouter); // Registration router
app.use('/profile', profileRouter); // Profile router

app.use(function(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
