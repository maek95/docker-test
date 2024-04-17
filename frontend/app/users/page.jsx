"use client";

import { useState } from "react";

import { host } from "../host";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import Socials from "@/components/Socials";
import TopBar from "@/components/TopBar";

export default function UsersPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUserCreated, setIsUserCreated] = useState(false);

  /* useEffect(() => {
    fetch('http://localhost:4000/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'Användarnamn',
       // password: 'Lösenord',
    }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => {
        console.error('Error:', error);
    });

  }, []) */

  const handlePostUser = () => {
    fetch(`${host}/users`, {
      // users sidan på backend! dvs inte riktiga sidan!
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username, // "backend får in detta som en "request" i "body"... se server.js när vi skriver t.ex. const data = req.body "
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    handlePostUser(); // Call the handlePostUser function
    setIsUserCreated(true);
  }

  return (
    <main className="min-h-full mb-">
      <div className="hidden md:block">
        <TopBar stickyOrFixed={"sticky"}></TopBar>
      </div>

      <div className="pt-8 px-6 flex flex-col gap-8 pb-24">
        <h1>Chas Bank</h1>

        <h2>Create your account</h2>
        {isUserCreated ? (
          <div className="flex flex-col">
            <div className="flex">
              
                {" "}
                <p className="text-green-500">Your account has been created</p><p>. Welcome <strong>{username}</strong>!</p>
      
            </div>
            <p>
              Please proceed to the{" "}
              <Link className="text-white" href={"/login"}>
                Log In screen
              </Link>
              .
            </p>
          </div>
        ) : (
          <Form
            buttonTitle={"Create"}
            onSubmit={handleSubmit}
            password={password}
            setPassword={setPassword}
            username={username}
            setUsername={setUsername}
          ></Form>
        )}

        <div className="flex items-center justify-start">
          <Socials />
        </div>
      </div>
      <div className="block md:hidden">
        <NavBar stickyOrFixed={"fixed"}></NavBar>
      </div>
    </main>
  );
}
