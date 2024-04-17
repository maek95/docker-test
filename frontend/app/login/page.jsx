"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Form from "@/components/Form";
import Socials from "@/components/Socials";
import TopBar from "@/components/TopBar";

import { host } from "../host";
import NavBar from "@/components/NavBar";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isFailedLogin, setisFailedLogin] = useState(false);

  function handlePostSession() {
    async function postSession() {
      try {
        //const response = await fetch("http://localhost:4000/sessions", {
        const response = await fetch(`${host}/sessions`, {
          // users sidan på backend! dvs inte riktiga sidan!
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username, // "backend får in detta som en "request" i "body"... se server.js när vi skriver t.ex. const data = req.body "
            password: password,
          }),
        });

        const data = await response.json();
        
        if (data.token) {
        localStorage.setItem("token", data.token);
        console.log(localStorage);
        router.push("/account");

        } else {
          console.log("token could not be fetched to login-page");
          setisFailedLogin(true);
        }
      
          //localStorage.setItem("userId", data.userId);

        
      } catch (error) {
        console.error("Error:", error);
      }
    }

    postSession();
  }

  // behöver inte hämta data ifrån user-sidan, användare som har skapats är lagrat på backend!

  function handleSubmit(e) {
    e.preventDefault(); // Prevent default form submission
    handlePostSession(); // Call the handlePostUser function
  }

  return (
    <main className="min-h-screen bg-taieri bg-repeat-y bg-16 bg-right">
      <div className="hidden md:block">
        <TopBar stickyOrFixed={"sticky"}></TopBar>
      </div>
      <div className="pt-8 px-6 flex flex-col gap-8 pb-24">
        <h1>Chas Bank</h1>

        <h2>Log In</h2>

        <Form
          isFailedLogin={isFailedLogin}
          buttonTitle={"Log In"}
          onSubmit={handleSubmit}
          password={password}
          setPassword={setPassword}
          username={username}
          setUsername={setUsername}
        ></Form>

        <div className="flex items-center justify-start">
          <Socials />
        </div>

        {/* 
      <div className="flex flex-col items-start">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="text"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>

      <button onClick={handlePostSession}>Login</button> */}
        {/*       <input type="text" /> */}
      </div>
      <div className="block md:hidden">
        <NavBar stickyOrFixed={"fixed"}></NavBar>
      </div>
    </main>
  );
}
