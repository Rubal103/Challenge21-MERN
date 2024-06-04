const express = require('express');
const path = require('path');
const db = require('./config/connection');

//const routes = require('./routes');

//using resovers and typeDefs now
const { typeDefs, resolvers } = require('./schemas');

//added Apolloserver and applied it to express server as middleware
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

const app = express();
const PORT = process.env.PORT || 3001;

//created a new instance of ApolloServer with schemas (graphql)

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//waiting for the server (new instance created above) to start 
const startApolloServer = async () => {
await server.start();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//using graphql
app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware
}));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//app.use(routes);--no longer using routes

db.once('open', () => {
  console.log(`API server running on port ${PORT}!`);
  console.log(`GraphQL at http://localhost:${PORT}/graphql`);
});
};

startApolloServer();