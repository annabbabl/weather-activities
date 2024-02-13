import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from "cors";
import { 
  indexRouter, 
  testAPIRouter, 
  usersRouter, 
  registrationRouter,
  loginRouter 
} from './routes'; 
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


dotenv.config();

interface ErrorWithStatus extends Error {
  status?: number;
}

const PORT = process.env.PORT || 3001;
const app = express();
app.listen(PORT);


app.set("users",path.join(__dirname, "users"))
app.set("users engine", "jade")

app.use(cors());
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/textAPI", testAPIRouter)
app.use("/login", loginRouter)
app.use("/registration", registrationRouter)


app.use(function(err: ErrorWithStatus, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);

  res.render("error");
});
module.exports = app






