const connectToMongo = require('./config/db');
var cors = require('cors')
connectToMongo();   // middleware express incoming request  
const express = require('express');
require('dotenv').config();

const app = express()

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

// Available routes 
app.use('/api', require('./routes/userRoute'))
app.use('/api', require('./routes/chatRoute'))

app.get('/', (req, res) => {
    res.send('Hello coders from Ai chatboot backend!');
});

app.listen(port, () => {
    console.log(`✅ Ai chatboot backend running at http://localhost:${port}`);
});
