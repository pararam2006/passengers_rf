const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const authRoutes = require('./routes/auth')
const applicationsRoutes = require('./routes/applications')
const adminRoutes = require('./routes/admin')
const PORT = 3000

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(session({
    secret: 'demo_secret',
    resave: false,
    saveUninitialized: false,
}))

app.use(express.static(path.join(__dirname, 'public')))

app.use('/auth', authRoutes)
app.use('/applications', applicationsRoutes)
app.use('/admin', adminRoutes)

app.get('/', (req, res) => {
    res.redirect('/pages/login.html')
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})