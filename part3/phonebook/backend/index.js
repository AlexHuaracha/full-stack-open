require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express();
app.use(express.static('dist'))
app.use(express.json())

app.get('/' , (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response, next) => {
    Person.find({}).then(result => {
        response.json(result)
    })
    .catch(error => next(error))
})

// app.get('/info', (req, res) => {
//     const date = new Date()
//     res.send(`
//         <p>Phonebook has info for ${persons.length} people</p>
//         <p>${date}</p>
//     `)
// })

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Person.findById(id).then(person => {
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    }

    // if(persons.find(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})