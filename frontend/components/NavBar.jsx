"use client";
import { FaSuitcase, FaHome } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function NavBar({isAccountPage, isHomePage, isLoggedIn, stickyOrFixed}) {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClickedWhenOffline, setIsClickedWhenOffline] = useState(false);

  function handleClickWhenOffline() {
    setIsClickedWhenOffline(true);
    setTimeout(() => {
      setIsClickedWhenOffline(false);
    }, 2000);

  }

  return (
    <div className="">

    <div className= {`z-50 ${stickyOrFixed} h-20 bottom-0 left-0 right-0 flex justify-between md:justify-evenly bg-[rgb(35,38,90)]`}>
      
      
      <div className="flex">
        <Link className="text-white no-underline" href={"/"}>
         <NavBox>
            <FaHome className={`${isHomePage ? "text-[rgb(37,103,249)]" : "text-white"}`}></FaHome>
            <h3 className={`${isHomePage ? "text-[rgb(37,103,249)]" : "text-white"}`}>Home</h3>
          </NavBox>
        </Link>
      </div>
      <div className="flex">
        {isLoggedIn ? (
          <Link className="text-white no-underline" href={"/account"}>
            <NavBox>
              <FaSuitcase className={`${isAccountPage ? "text-[rgb(37,103,249)]" : "text-white"}`}></FaSuitcase>
              <h3 className={`${isAccountPage ? "text-[rgb(37,103,249)]" : "text-white"}`}>My Economy</h3>
            </NavBox>
          </Link>
        ) : ( // no Link if not logged in:
         
            
            <NavBox onClick={() => {
              handleClickWhenOffline();
              console.log(isClickedWhenOffline);
            }} borderR={0}>
              {/* {isClickedWhenOffline ? (<div className="fixed mt-[-7rem]">
                Not Logged In
              </div>) : ("")} */}
              <div className="absolute mt-[-8rem] ml-[-8rem]" style={{opacity: `${isClickedWhenOffline ? (100) : (0)}`, transition: "ease-in-out", transitionDuration: "600ms"}}>
                <h3 className="text-red-500">Not Logged In</h3>
              </div>
              <FaSuitcase></FaSuitcase>
              <h3 className={`${isAccountPage ? "text-[rgb(37,103,249)]" : "text-white"}`}>My Economy</h3>
            </NavBox>
       
        )}
      </div>
      {/* <div className="flex">

      <Link className="text-white no-underline" href={"./users"}>Create Account</Link>
      </div> */}
      {/* <div className="flex">

      <Link className="text-white no-underline" href={"./login"}>Login</Link>
      </div> */}
    </div>
    </div>

  );
}

function NavBox({children, borderL, borderR, onClick}) {

  return (
    <div onClick={onClick} className={`w-32 flex flex-col gap-4 items-center justify-center  p-4 hover:cursor-pointer hover:bg-[rgb(18,20,51)]`}
    style={{borderLeft: `${borderL}`, borderRight: `${borderR}`}}
    >
      {/* border-4 border-solid border-b-0 border-[rgb(35,38,90)] */}
      {children}
    </div>
    
  )
}