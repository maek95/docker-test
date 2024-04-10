"use client";
import { useEffect, useState } from "react";
import { host } from "../host";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import Socials from "@/components/Socials";
import TopBar from "@/components/TopBar";

export default function AccountPage() {
  //const [token, setToken] = useState("");
  const [saldo, setSaldo] = useState(0);
  const [username, setUsername] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [input, setInput] = useState("");
  const [transaction, setTransaction] = useState(null);

  const [transactionKey, setTransactionKey] = useState(0); // Unique key for transaction // TODO: should maybe handle this in backend?

  useEffect(() => {
    postAccount();
  }, []);

  useEffect(() => {
    if (transaction != null) {
      console.log(
        "transaction state after received update from input: ",
        transaction
      );
      //handlePostTransaction();
      postTransaction();
      postAccount(); // post account information again
    } else {
      console.log("stopped post of NULL/undefined transaction");
    }

    //}, [transaction])
  }, [transaction]);

  async function postAccount() {
    // fetch the saldo  once when entering the page
    try {
      const tokenStorage = localStorage.getItem("token");

      console.log(
        "fetched localStorage token for Account data: ",
        tokenStorage
      );
    
      //setToken(tokenStorage);
      
      const response = await fetch(`${host}/me/accounts`, {
        // users sidan på backend! dvs inte riktiga sidan!
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenStorage, // "backend får in detta som en "request" i "body"... se server.js när vi skriver t.ex. const data = req.body "
        }),
      });

      const data = await response.json();
      console.log(
        "fetched data.amount: ",
        data.amount,
        " from accountID: ",
        data.accountId,
        " from username:",
        data.username
      );
      setSaldo(data.amount);
      setAccountId(data.accountId);
      setUsername(data.username);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  if (saldo > 0 && input == "") {
    // since we have if (data.amount > 0) {setSaldo(data.amount)} in the function above. Input == "" since REACT refreshes every time we type something in the input-field and we dont want to see a log every time we do that
    console.log(
      "saldo (state)",
      saldo,
      " in accountID (state)",
      accountId,
      "after inserting backend data"
    );
  }

  if (accountId == null) {
    return <div>Loading account...</div>;
  } else {
  }

  //function handlePostTransaction() {
  async function postTransaction() {
    try {
     
        const tokenStorage = localStorage.getItem("token");

        console.log(
          "fetched localStorage token for Account data: ",
          tokenStorage
        );

      
      //setToken(tokenStorage);
      console.log("fetched localStorage token for Transaction: ", tokenStorage);
      console.log("posting transaction of ", transaction, "kr");
      const response = await fetch(`${host}/me/accounts/transactions`, {
        // users sidan på backend! dvs inte riktiga sidan!
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenStorage, // to find the correct account
          transaction: transaction, // always sent as a string?
        }),
      });

      
      const data = await response.json();
      
      //console.log("me/accounts/transaction data: ", data);
      setInput(""); // clear input field... have to be done here due to async..?
    } catch (error) {
      console.error("Error:", error);
    }
  }

  /*  postTransaction(); 
  } */

  function handleClickDeposit(e) {
    if (input != "") {
      setTransaction(input);
      console.log("sent input: ", input, " to transaction state");
      // setTransactionKey(prevKey => prevKey + 1); // Increment transactionKey to trigger useEffect
      /* postTransaction();
      postAccount(); */
    } else {
      console.log("Can't make an empty deposit");
    }
    e.preventDefault();
  }

  return (
    <main className="min-h-screen">
      <div className="hidden md:block">
        <TopBar stickyOrFixed={"sticky"}></TopBar>
      </div>
      <div className="pt-8 pb-24 px-6 flex flex-col lg:flex-row gap-8 lg:gap-40">
        <div className="flex flex-col gap-8">
          <h1>Welcome {username}</h1>
          <h2>Your Account information</h2>

          <div>
            <img src="/visacard.png" alt="" />
          </div>

          <div className="hidden lg:flex items-center justify-start">
            <Socials />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <h4 className="font-normal">
            Total Balance on account id {accountId}:
          </h4>
          <p className="text-4xl font-bold">{saldo} kr</p>
          <div className="bg-[rgb(37,103,249)] h-2 rounded-full w-32"></div>
          <form
            className="flex flex-col w-[50%] gap-8 items-start justify-center"
            onSubmit={handleClickDeposit}
          >
            <div className="flex flex-col gap-8">
              <h4 className="font-normal" htmlFor="deposit">
                Insert Deposit:
              </h4>
              <input
                className="p-2 px-4 text-2xl leading-none rounded-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
                type="number"
                name="deposit"
                id="deposit"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
            </div>
            <button
              type="submit"
              className="flex text-white text-base leading-none w-48 items-center justify-center py-6 bg-[rgb(37,103,249)] border-solid border-[rgb(37,103,249)] hover:bg-[rgb(35,38,90)] rounded-full"
            >
              Deposit
            </button>
          </form>
        </div>

        <div className="flex lg:hidden items-center justify-start">
          <Socials />
        </div>
      </div>
      {/* <NavBar stickyOrFixed={"sticky"}></NavBar> */}
      <div className="block md:hidden">
        <NavBar stickyOrFixed={"fixed"}></NavBar>
      </div>
    </main>
  );
}
