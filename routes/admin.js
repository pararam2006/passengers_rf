const express = require('express')
const pool = require('../db')

const router = express.Router()

function checkAdmin(req, res, next) {
    if(
        req.session.user && 
        req.session.role === 'admin'
    ) {
        return next()
    }
    res.send('Доступ запрещен')
}

router.get('/applications', checkAdmin, async (req, res) => {
    const result = await pool.query(
        `SELECT applications.id, users.full_name, applications.transport_type, applications.start_date, applications.payment_method, applications.status FROM applications JOIN users ON users.id = applications.user_id`
    )

    res.json(result.rows)
})

router.post('/status/:id', checkAdmin, async (req, res) => {
    const { status } = req.body

    await pool.query(
        'UPDATE applications SET status $1 WHERE id = $2', 
        [status, req.params.id]
    )

    res.send('Статус обновлен')
})

module.exports = router