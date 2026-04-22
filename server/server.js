import express from 'express'
import cors from 'cors'
import authRouter from './routes/auth.js'

const app  = express()
app.use(express.json())
app.use(cors())

app.use('/api/auth', authRouter)



app.get('/', (req, res) => {
    res.status(200).send('<h1 style="text-align: center; margin-top: 50px;"> Dev Connect Back end</h1>')
})

app.get('health', (_, res) =>{
    res.status(200).json("Dev Connect: Back End")
})

// Start server on port 3001
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
})