const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4')

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function repositoryNotFound (request, response, next) {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)
  if (repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository Not Found" })
  }
  return next()
}
app.use('/repositories/:id', repositoryNotFound)

function validRepositoryUUID (request, response, next) {
  const { id } = request.params
  if (!isUuid(id)) {
    return response.status(400).json({
      error: 'Invalid Respository Id.'
    })
  }
  return next()
}
app.use('/repositories/:id', validRepositoryUUID)

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, techs, url } = request.body
  const repository = {
    id: uuid(),
    title,
    techs,
    url,
    likes: 0
  }
  repositories.push(repository)
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, techs, url } = request.body
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)
  repositories[repositoryIndex] = {
    ...repositories[repositoryIndex],
    title,
    techs,
    url
  }
  return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)
  repositories.splice(repositoryIndex, 1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)
  repositories[repositoryIndex].likes += 1
  return response.json(repositories[repositoryIndex])
});

module.exports = app;
