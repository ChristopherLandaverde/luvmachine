const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

app.get('/', (req, res) => {
    console.log("Welcome to Certified State Lover.")
    res.status(500).send("Hey Bitch")
})


const userRouter = require('./routes/image')

app.use('/image',userRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})