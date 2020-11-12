const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();

//Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false}));
app.use(cors());

app.get('/',(req, res) => 
res.json({msg: 'Welcome to our Blog site where all Blogs are visible'})
);


// Define Route
app.use('/api/users', require('./routes/users'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/auth', require('./routes/auth'));
// app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));