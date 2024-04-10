"use client";
import Button from "@/components/Button";
import NavBar from "@/components/NavBar";
import Socials from "@/components/Socials";
import TopBar from "@/components/TopBar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// npm run dev

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  let tokenStorage;

  useEffect(() => {
    tokenStorage = localStorage.getItem("token");
  }, [])

  useEffect(() => {
    if (tokenStorage != null) {
      setIsLoggedIn(true);
    } else {
      //setIsLoggedIn(false);
    }
  }, []);

  return (
    <main
      className="min-h-screen bg-taieriverytransparent" /* style={{backgroundImage: "url('Taieri.png')"}} */
    >
      <div className="flex flex-col h-lvh  justify-between gap-8">
        <div className="hidden md:flex flex-col gap-20">
          <TopBar stickyOrFixed={"sticky"}></TopBar>
          <div className="hidden md:flex justify-center md:justify-start px-8">
            <h1 className="md:text-6xl">Chas Bank</h1>
          </div>
        </div>

        
        <div className="flex justify-center pt-8 md:justify-start md:px-8 md:pt-12 md:hidden">
          <h1 className="">Chas Bank</h1>
        </div>
        <div className="flex flex-col gap-8 justify-center md:items-start md:px-8">
          {" "}
          
          <div className="flex flex-col justify-center items-center">
            {" "}
           
            <div className="">
              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    localStorage.clear("token");
                    setIsLoggedIn(false);
                  }}
                >
                  Log Out
                </Button>
              ) : (
                <div className="flex flex-col gap-8">
                  <Link className="text-white no-underline" href={"./login"}>
                    <Button>
                      <p>Log In</p>
                    </Button>
                  </Link>
                  <Link className="text-white no-underline" href={"./users"}>
                    <Button>Become a client</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/*  <div className="h-[1000px]">
          hi there
        </div> */}
          <div className="flex md:hidden items-center justify-center">
            <Socials />
          </div>
        </div>

        <div className="hidden md:flex items-center justify-start p-8 pb-24">
          <Socials />
        </div>
        {/* <div className="mt-20">
       <NavBar stickyOrFixed={"fixed"}></NavBar>
       </div> */}

        <div className="md:hidden">
          <NavBar stickyOrFixed={"fixed"}></NavBar>
        </div>
        {/* <NavBar stickyOrFixed={"fixed"}></NavBar> */}
      </div>
    </main>
  );
}
