const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');


const db = require('./config/connection');

//const routes = require('./routes');

//using resovers and typeDefs now


//added Apolloserver and applied it to express server as middleware

const PORT = process.env.PORT || 3001;
const app = express();

//created a new instance of ApolloServer with schemas (graphql)

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

//waiting for the server (new instance created above) to start 
const startApolloServer = async () => {
await server.start();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//using graphql
app.use('/graphql', expressMiddleware(server, {
  context: authMiddleware
}));

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));


  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

//app.use(routes);--no longer using routes




db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
});
};

startApolloServer();