const cookieParser = require('cookie-parser')
const express = require('express')
const app = express()

app.use(cookieParser())

app.get('/', (req, res) => {
    res.cookie('whateverCookie', 'ValueValue', { maxAge: 1000 * 60 * 15 })
    res.cookie('anotherCookie', 'Value2', { maxAge: 1000 * 60 * 15 });
    res.redirect('/stuff')
})


app.get('/stuff', (req, res) => {
    if (req.cookies.whateverCookie) {
	res.send('Success')
    } else {
	res.send('Failure')
    }
})

app.listen(9001, () => console.log('Server listening on port 9001'))
