const express = require('express');
const app = express();
const connectDB = require('./config/db')


const PORT = process.env.PORT || 3000;

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'))


//Define Routes
app.use('/api/guests', require('./routes/api/guests'));

//Listen on Port
app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));