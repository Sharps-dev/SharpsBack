const app = require('express')();
const PORT = 8030;


app.listen(
    PORT,
    () => console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/test' , (req , res) => {
    res.status(200).send({
        'message' : 'hi',
        'user' : 'me from future'
    })
}); 
