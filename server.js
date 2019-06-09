const express = require('express')
const mongodb = require('mongodb')

const app = express()

const uri = process.env.DATABASE_URI

app.get('/books', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('literature')
    const tracksCollection = db.collection('books')
    
    const searchObject = {}
    
    if (request.query.title) {
      searchObject.title = request.query.title
    }
    
    if (request.query.author) {
      searchObject.author = request.query.author
    }
    
    tracksCollection.find(searchObject).toArray(function(error, tracks) {
      response.json(error || tracks)
      client.close()
    })
  })
})

app.get('/books/:id', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('music')
    const tracksCollection = db.collection('tracks')
    
    const searchObject = {}
    
    if (request.query.artist) {
      searchObject.artist = request.query.artist
    }
    
    if (request.query.album) {
      searchObject.album = request.query.album
    }
    
    if (request.query.year) {
      searchObject.year = Number(request.query.year)
    }
    
    if (request.query.title) {
      searchObject.title = request.query.title
    }
    
    tracksCollection.find(searchObject).toArray(function(error, tracks) {
      response.json(error || tracks)
      client.close()
    })
  })
})

app.get('/books', function(request, response) {
  const client = new mongodb.MongoClient(uri)

  client.connect(function() {
    const db = client.db('literature')
    const booksCollection = db.collection('books')
    
    booksCollection.find().toArray(function(error, books) {
      response.json(error || books)
      client.close()
    })
  })
})

app.listen(process.env.PORT)