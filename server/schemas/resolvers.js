//needs User model, authentication for the login and sign in token 
const { User } = require("../models");
const { AuthenticationError } = require("apollo-server-express");
const { signToken } = require("../utils/auth");


//resolver for query to populate saved books to the logged in user, if not logged in will throw Authnetication error 
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select("-__v -password")
          .populate("savedBooks");   
          console.log(userData);

        return userData;
      }
      throw new AuthenticationError("Login required");
    },
  },

// mutataion to handle login, if no user is found with the email and password, it will throw authentication error that email or password is incorrect. 

//if email is correct but password is wrong, it will throw authentication error.
  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("email or password is incorrect");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("password is incorrect");
      }
      const token = signToken(user);

      return { token, user };
    },
 

    //to add user, wait for the user to input username, email and password
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    //to save books --user has to be logged in and it will add savedbooks to their page

    saveBook: async (parent, { input }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("needs login to perform this action");
    },
   
    //to handle removing books (pull savedbooks) from user, user should be logged in. 
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        ).populate("savedBooks");

        return updatedUser;
      }
      throw new AuthenticationError("needs login to perform this action");
    },
  },
};

module.exports = resolvers;