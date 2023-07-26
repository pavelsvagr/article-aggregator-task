import express from 'express'
import { controllers } from './container'

const server = express()

server.get('/api/v1/article/:slug', controllers.article.article)
server.get('/api/v1/articles', controllers.article.articles)

server.listen(3000)
