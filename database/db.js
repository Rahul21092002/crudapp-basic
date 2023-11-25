const mongoose = require('mongoose')

// Database connection
mongoose.connect(process.env.DB_URI)
const db = mongoose.connection
db.on('error',(err) => {
    console.log(err)
})
db.once('open', () => {
    console.log('Database connected successfully')
})
