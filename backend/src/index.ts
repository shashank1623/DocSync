import express from 'express';
import userRouter from './routes/user';
const app = express();
const port = 3000;

//Middlewares to parse JSON request
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use("/api/v1/user",userRouter);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});