const express = require('express')
const pool = require('../db')

const router = express.Router()

router.post('/create', async (req, res) => {
    if(!req.session.user) {
        return res.send('Необходим вход')
    }
    const {
        transport_type,
        start_date,
        payment_method
    } = req.body
    await pool.query(`INSERT INTO applications (user_id, transport_type, start_date, payment_method) VALUES ($1, $2, $3, $4)`, 
        [req.session.user.id, transport_type, start_date, payment_method]
    )
    res.send('Заявка успешно создана')
})

router.post('/review',  async (req, res) => {
    if(!req.session.user) {
        return res.status(401).send('Не авторизован')
    }

    const {
        application_id,
        review_text
    } = req.body

    await pool.query(
        `INSERT INTO reviews (user_id, application_id, review_text) VALUES ($1, $2, $3)`,
        [req.session.user.id, application_id, review_text]
    )

    res.send('Отзыв добавлен')
})

router.get('/my', async (req, res) => {
    if(!req.session.user) {
        return res.status(401).send('Не авторизован')
    }
    const result = await pool.query(
        `SELECT * FROM applications WHERE user_id = $1 ORDER BY id DESC`,
        [req.session.user.id]
    )

    res.json(result.rows)
})

module.exports = router