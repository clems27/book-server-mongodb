const express = require('express')
const mongodb = require('mongodb')

const app = express()

const uri = process.env.DATABASE_URI

app.get('/api/books', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('literature')
    const collection = db.collection('books')
    
    const searchObject = {}
    
    if (request.query.title) {
      searchObject.title = request.query.title
    }
    
    if (request.query.author) {
      searchObject.author = request.query.author
    }
    
    collection.find(searchObject).toArray(function(error, books) {
      response.json(error || books)
      client.close()
    })
  })
})

app.get('/api/books/:id', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('literature')
    const collection = db.collection('books')
    
    let id
    try {
      id = new mongodb.ObjectID(request.params.id)
    } catch (error) {
      response.status(500).send(error)
      return
    }
    
    const searchObject = { _id: id }
    
    collection.findOne(searchObject, function(error, book) {
      response.json(error || book)
      client.close()
    })
  })
})



/* Use these if you do not want to use React. */

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
})

app.get('/books/:id', function(request, response) {
  response.sendFile(__dirname + '/book.html');
})

app.get('/authors/:name', function(request, response) {
  response.sendFile(__dirname + '/author.html');
})



app.listen(process.env.PORT)