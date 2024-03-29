import UserDao from "../daos/UserDao";
import mongoose from "mongoose";

const userDao: UserDao = UserDao.getInstance();

// const PROTOCOL = "mongodb+srv";
// const DB_USERNAME = "giuseppi";//process.env.DB_USERNAME;
// const DB_PASSWORD = "supersecretpassword";//process.env.DB_PASSWORD;
// const HOST = "cluster0.m8jeh.mongodb.net";
// const DB_NAME = "myFirstDatabase";
// const DB_QUERY = "retryWrites=true&w=majority";
const connectionString = 'mongodb+srv://anandbr:anandbr@cluster0.pstb3.mongodb.net/FSEDatabase2?retryWrites=true&w=majority';
// connect to the database
mongoose.connect(connectionString);


export const login = (u: string, p: string) =>
  userDao.findUserByCredentials(u, p)
    .then(user => {
      if (user) {
        return user;
      } else {
        throw "Unknown user"
      }
    })
    .then(user => user)
    .catch(e => e)

export const register = (u: string, p: string, e: string) =>
  userDao.findUserByUsername(u)
    .then(user => {
      if (user) {
        throw 'User already exists';
      } else {
        return userDao.createUser({
          username: u, password: p, email: e
        });
      }
    })
    .then(newUser => newUser)
    .catch(e => e);

export const initializeSalaries = (salary: number) => {
  return userDao.findAllUsers()
    .then(users => {
      const sPromises = users.map(user =>
        userDao.updateUserSalaryByUsername(user.username, salary));
      const resultPromise = Promise.all(sPromises);
      resultPromise
        .then(values => {
          return values
        })
    })
}

export const giveRaise = (raise: number) => {
  return userDao.findAllUsers()
    .then(users => {
      const salaryPromises = users.map(user => {
        // @ts-ignore
        const newSalary = user.salary * (1 + raise / 100);
        return userDao.updateUserSalaryByUsername(
          user.username,
          newSalary)
      });
      const resultPromise = Promise.all(salaryPromises);
      resultPromise
        .then(values => {
          return values;
        })
    })
}

// giveRaise(50)
//   .then(results => console.log(results));
//
// initializeSalaries(50000)
//   .then(results => console.log(results));
//
// register('alice008', 'alice234', 'alice234@gmail.com')
//   .then(user => console.log(user))
//
login('alice008', 'alice234')
  .then(user => console.log(user))

// userDao.findAllUsers()
//   .then(users => console.log(users));
