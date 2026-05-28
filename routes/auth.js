const express = require('express')
const pool = require('../db')
const bcrypt = require('bcrypt')

const router = express.Router()

router.post('/register', async (req, res) => {
    const {
        login, 
        password,
        full_name,
        birth_date,
        phone,
        email
    } = req.body
    const loginRegex = /^[a-zA-Z0-9]{6,}$/

    if(!loginRegex.test(login)) {
        return res.send('Логин должен содержать минимум 6 символов')
    }

    if(password.length < 8) {
        return res.send('Пароль должен быть минимум 8 символов')
    }

    const existingUser = await pool.query(
        'SELECT * FROM users WHERE login = $1',
        [login]
    )

    if(existingUser.rows.length > 0) {
        return res.send('Пользователь уже существует')
    }

    const hash = await bcrypt.hash(password, 10)

    await pool.query(
        `INSERT INTO users (login, password_hash, full_name, birth_date, phone, email) VALUES ($1, $2, $3, $4, $5, $6)`,
        [login, password_hash, full_name, birth_date, phone, email]
    )

    res.redirect('/pages/login.html')
})

router.post('/login', async (req, res) => {
    const { login, password } = req.body

    const result = await pool.query(
        'SELECT * FROM users WHERE login = $1',
        [login]
    )

    if(result.rows.length === 0) {
        return res.send('Неверный логин')
    }

    const user = result.rows[0]

    const isValid = await bcrypt.compare(password, user.password_hash)

    if(!isValid) {
        return res.send('Неверный пароль')
    }

    req.session.user = {
        id: user.id,
        login: user.login,
        role: user.role
    }

    res.redirect('/pages/dashboard.html')
})

module.exports = router