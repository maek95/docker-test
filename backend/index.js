// "Startkod för server.js i backend": https://github.com/davidshore/chas_banksajt  OCH kollar på 38-todos-express index.js

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid"; // ta bort!

// TODO: KOM IHÅG ATT STARTA MAMP (mysql servern)

// slippa starta om hela tiden?
// npm i nodemon
// MED GITBASH!!!!!!!:
// nodemon api/index.js

// sen när vi ska ladda upp hela projektet på AWS Amazon:
// scp -i <din-nyckel>.pem -r ./ ubuntu@<din-ec2-instans>:/home/ubuntu/bank

// logga in via terminalen (terminalen på datorn, inte vscode kanske lättast)
// shh -i <din-nyckel>.pem -r ./ ubuntu@<din-ec2-instans>

const app = express();
const PORT = 4000;

// connect to DB
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank",
  port: 3307,
  //port: 3307,
  //port: 3307,
  //port: 3307,
  //port: 8889,
});

// help function to make code look nicer
async function query(sql, params) {
  const [results] = await pool.execute(sql, params); // får en array, så måste vara [results]...?
  return results;
}

// FÖR ATT STARTA
// node server.js
// om vi är i aws terminalen:
// sudo node server.js

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord (token)
function generateOTP() {
  //one time password
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Din kod här. Skriv dina arrayer

/* const users = [];
const accounts = [];
const sessions = []; */
//let accountId = 1; // first bank-account we create for THIS USER so we can set it to 1
// let transactionId = 1; // first bank-account we create for THIS USER so we can set it to 1

// Din kod här. Skriv dina routes:

app.get("/", (req, res) => {
  // "/ är startsidan, t.ex. http://localhost:4000 "
  res.send("Hello World");
});

// Skapa användare (POST): "/users"
// user arrayen: [{id: 101, username: "Joe", password: "hemligt" }, ...]
// account arrayen:
// [{id: 1, userId: 101, amount: 200 }, ...]
app.post("/users", async (req, res) => {
  try {
    const { username, password } = req.body;

    // SINCE WE HAVE MANY ERROR-responses we have a RETURN-STATEMENT for every response so the code is exited if an error occurs! At the end when everything is complete (after creating empty account) we return the last response with all data!

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and Password are required." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    let userCreationResult;
    try {
      // create new user
      userCreationResult = await query(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [username, hashedPassword]
      );
    } catch (error) {
      console.error("2:Error creating user", error);
      return res.status(500).send("2:Error creating user");
    }

    let userSearchResult;
    try {
      // fetch the created user
      userSearchResult = await query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
    } catch (error) {
      console.error("3:Error finding user", error);
      return res.status(500).send("3:Error finding user");
    }

    const user = userSearchResult[0];

    if (!user || !user.id) {
      console.error("4:Error finding user or user_id is undefined");
      return res
        .status(500)
        .send("4:Error finding user or user_id is undefined");
    }

    const user_id = user.id;

    try {
      // create an empty account (0 kr) for the user, with the user_id attached to it
      const accountCreationResult = await query(
        "INSERT INTO accounts (user_id, amount) VALUES (?, ?)",
        [user_id, 0]
      );

      // AFTER FULL SUCCESS WE RETURN A RESPONSE WITH ALL DATA (just for us to see what has been created)
      // Note: currently the data doesnt make much sense
      return res.status(201).json({
        message: `User created and empty account created for ${user.username}`,
        data: { userCreationResult, accountCreationResult }, // onödigt? används inte i frontend
      });
    } catch (error) {
      console.error("5:Error creating account", error);
      return res.status(500).send("5:Error creating account");
    }
  } catch (error) {
    console.error("1:Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// just to see users array on localhost:4000/users
app.get("/users", (req, res) => {
  //res.json(users);
});

// Logga in (POST): "/sessions"
// kolla så att användarens inmatade lösenord matchar det i users arrayen (med samma id), därefter i sessions arrayen lägger vi då in användarid:t och ett genererat engångslösenord. Skickar tillbaka detta med POST... därefter router.push(/account) för att komma till kontosidan.
// När man loggar in ska ett engångslösenord (för oss, inte användaren) skapas och skickas tillbaka i response.
// [{userId: 101, token: "nwuefweufh" }, ...]
app.post("/sessions", async (req, res) => {
  try {
    //const data = req.body; // type in username & password
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and Password are required." });
    }

    /*  const loggedInUser = users.find((user) => {
      return data.username === user.username && data.password === user.password;
    }); */

    let userSearchResult;
    try {
      // fetch the created user
      userSearchResult = await query("SELECT * FROM users WHERE username = ?", [
        username,
      ]);
    } catch (error) {
      console.error("2:Error finding user", error);
      return res.status(500).send("2:Error finding user");
    }
    const loggedInUser = userSearchResult[0];
    const passwordMatch = await bcrypt.compare(password, loggedInUser.password); // returnar true eller false, passwords på databasen är hashade så vi använder 'compare'

    if (!passwordMatch) {
      return res.status(401).send("invalid username or password");
    } else {
      const generatedOTP = generateOTP(); // token används på frontend och sparas i localStorage så den inte försvinner när de byter till account-sidan efter inloggning.

      try {
        const sessionCreationResult = await query(
          "INSERT INTO sessions (user_id, token) VALUES (?, ?)",
          [loggedInUser.id, generatedOTP]
        );

        // TODO: borde vi hämta (SELECT) token ifrån skapade session, eller kan vi skicka generatedOTP direkt som jag gjort nedanför?

        return res.status(201).json({
          message: `Session created for ${loggedInUser.username}`,
          data: { sessionCreationResult }, // onödigt?
          token: generatedOTP, // token hämtas i frontend
        });
      } catch (error) {
        console.error("3:Error creating session", error);
        return res.status(500).send("3:Error creating session");
      }
    }
  } catch (error) {
    console.error("1:Error finding user:", error);
    res.status(500).json({ error: "1:Internal server error" });
  }
});

app.get("/sessions", (req, res) => {
 // res.json(sessions);
});

// Visa salodo (POST): "/me/accounts"
// i frontend, useEffect hämta saldo och knapp att sätta in pengar (hitta rätt userId med hjälp av engångslösenordet)
// [{id: 1, userId: 101, amount: 200 }, ...]
// /me eftersom man måste vara inloggad för att få tillgång till detta!
app.post("/me/accounts", async (req, res) => {
  try {
    const { token } = req.body; // token from current session

    if (!token) {
      return res.status(400).json({ error: "Token not found." });
    }

    /* const currentSession = sessions.find((session) => {
    return data.token === session.token;
  }); */

    let sessionSearchResult;
    try {
      // use the token to find the current session (user_id that is logged in)
      sessionSearchResult = await query(
        "SELECT * FROM sessions WHERE token = ?",
        [token]
      );
    } catch (error) {
      console.error("2:Error finding session", error);
      return res.status(500).send("2:Error finding session");
    }
    const currentSession = sessionSearchResult[0];

    /* userAccount = accounts.find((account) => {
    return account.userId === currentSession.userId;
  }); */
    let userAccountSearchResult;
    try {
      // fetch the user's account by giving the user_id
      userAccountSearchResult = await query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [currentSession.user_id]
      );
    } catch (error) {
      console.error("4:Error finding user's account", error);
      return res.status(500).send("4:Error finding user's account");
    }
    const loggedInUserAccount = userAccountSearchResult[0];
    /*  currentUser = users.find((user) => {
    return user.userId === currentSession.userId;
  }); */
    let userSearchResult;
    try {
      // fetch the current session (stored in frontend localStorage)
      userSearchResult = await query("SELECT * FROM users WHERE id = ?", [
        currentSession.user_id,
      ]);
    } catch (error) {
      console.error("4:Error finding logged in user", error);
      return res.status(500).send("4:Error finding logged in user");
    }
    const loggedInUser = userSearchResult[0];

    /* res
    .status(200)
    .json({
      message: "Post data for ACCOUNTS received: ",
      amount: userAccount.amount,
      accountId: userAccount.accountId,
      username: currentUser.username,
    }); */
    return res.status(201).json({
      message: `Account and User info received for ${loggedInUser.username}`,
      amount: loggedInUserAccount.amount, // detta hämtas i frontend
      accountId: loggedInUserAccount.id,
      username: loggedInUser.username,
    });
  } catch (error) {
    console.error("1:Error finding session:", error);
    res.status(500).json({ error: "1:Internal server error" });
  }
});

app.get("/me/accounts", (req, res) => {
  //res.json(accounts);
});

// Sätt in pengar (POST): "/me/accounts/transactions"
app.post("/me/accounts/transactions", async (req, res) => {
  try {
    const { transaction, token } = req.body; // pengar som ska sättas in?

    if (!transaction || !token) {
      return res.status(400).json({ error: "Transaction or Token not found." });
    }
    console.log("Transaction received:", transaction);

    /* const currentSession = sessions.find((session) => {
    // find the token's session to later find the matching id
    return data.token === session.token;
  }); */

    let sessionSearchResult;
    try {
      // use token to retrieve the session information (i.e. the user_id)
      sessionSearchResult = await query(
        "SELECT * FROM sessions WHERE token = ?",
        [token]
      );
    } catch (error) {
      console.error("2:Error finding session", error);
      return res.status(500).send("2:Error finding session");
    }
    const currentSession = sessionSearchResult[0];

    /* userAccount = accounts.find((account) => {
      return account.userId === currentSession.userId;
    }); */

    let userAccountSearchResult;
    try {
      // fetch the user's account by giving the user_id
      userAccountSearchResult = await query(
        "SELECT * FROM accounts WHERE user_id = ?",
        [currentSession.user_id]
      );
    } catch (error) {
      console.error("3:Error finding user's account", error);
      return res.status(500).send("3:Error finding user's account");
    }
    const loggedInUserAccount = userAccountSearchResult[0];

    console.log(
      "/me/accounts/transactions: userAccount.amount: ",
      loggedInUserAccount
    );
    const updatedSaldo = loggedInUserAccount.amount + parseFloat(transaction); // parseFloat because transaction is read as a string from JSON
    console.log(
      "/me/accounts/transactions: new value that will be given to userAccount.amount: ",
      updatedSaldo
    );

   /*  userAccount.amount = updatedSaldo; */
    try {
      const updateAccountResult = await query(
        "UPDATE accounts SET amount = ? WHERE id = ?",
        [updatedSaldo, loggedInUserAccount.id]
      );
      console.log("updatedAccountAmount: ", updateAccountResult);
      //res.status(204).send("Account amount updated");

      return res.status(200).json({ // last thing we return, exiting here
        message: "Transaction has been received: ",
        transaction: transaction,
        message2: "Account's amount got updated to: ",
        updatedSaldo: updatedSaldo
      });
    } catch (e) {
      return res.status(500).send("Error updating account amount");
    }

  } catch (error) {
    console.error("1:Error finding session for transaction:", error);
    res.status(500).json({ error: "1:Internal server error at transaction" });
  }
});

app.get("/me/accounts/transactions", (req, res) => {
  //res.json(accounts);
});

// ska jag använda PUT något?
// PUT: This method is used to update an existing resource
// e.g. users/1  ?
//app.put("/users/:id", (req, res) => { })

// Starta servern
app.listen(PORT, () => {
  console.log(`Bankens backend körs på http://localhost:${PORT}`);
});

/* module.exports = app; */

export default app;
