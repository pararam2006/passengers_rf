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

module.exports = router