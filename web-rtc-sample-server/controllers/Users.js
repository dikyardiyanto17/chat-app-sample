const { hashPassword, comparePassword } = require("../helpers/bcryptjs");
const { encodeToken } = require("../helpers/jwt");
const User = require("../schema/User");

class Users {
  static async register(req, res, next) {
    try {
      const { name, password } = req.body;
      const isExist = await User.findOne({ name })
      if (isExist?.name) {
        throw { name: "Registered", message: "Users with name " + name + " is already registered" }
      }
      if (!name) {
        throw { name: "Bad Request", message: "Name is required" };
      }
      if (!password) {
        throw { name: "Bad Request", message: "Password is required" };
      }
      const hashedPasswordUser = hashPassword(password);
      await User.create({ name, password: hashedPasswordUser });
      return res.status(201).json({ message: "Success Register" });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { name, password, socketId } = req.body;
      if (!name) {
        throw { name: "Bad Request", message: "Name is empty" };
      }
      if (!password) {
        throw { name: "Bad Request", message: "Password is empty" };
      }
      const user = await User.findOne({ name });
      if (!user) {
        throw { name: "Invalid", message: "Invalid Name/Password" };
      }
      let isValidPassword = comparePassword(password, user.password)
      if (!isValidPassword) {
        throw { name: "Invalid", message: "Invalid Name/Password" };
      }
      const encodedToken = { id: user._id }
      const access_token = encodeToken(encodedToken)
      res.status(201).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async fetchAllUser(req, res, next) {
    try {
      const userData = await User.find().select("socketId name status")
      res.status(200).json(userData)
    } catch (error) {
      next(error)
    }
  }

  static async updateSocketId(req, res, next) {
    try {
      const { socketId } = req.body
      const { userId } = req.user
      await User.findByIdAndUpdate(userId, { socketId })
    } catch (error) {
      next(error)
    }
  }

  static async removeSocketId(socketId) {
    try {
      const data = await User.findOneAndUpdate({ socketId }, { socketId: null })
    } catch (error) {
      console.log(error)
    }
  }

  static async findUser(req, res, next) {
    try {
      const { id } = req.params
      if (!id) throw { name: "Bad Request", message: "Who do you want to search" }
      const data = await User.findById(id).select("socketId name status id")
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }

  static async currentUser(req, res, next) {
    try {
      const { userId } = req.user
      const data = await User.findById(userId).select("socketId name status")
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { Users };