"use client";
import { FaSuitcase, FaHome } from "react-icons/fa";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function TopBar({stickyOrFixed}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClickedWhenOffline, setIsClickedWhenOffline] = useState(false);

  // const tokenStorage = localStorage.getItem("token");
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
  }, [tokenStorage]);


  function handleClickWhenOffline() {
    setIsClickedWhenOffline(true);
    setTimeout(() => {
      setIsClickedWhenOffline(false);
    }, 2000);

  }

  return (

    <div className= {`z-50 ${stickyOrFixed} top-0 left-0 right-0 flex justify-start bg-[rgb(35,38,90)] items-center`}>
      
      
      <div className="flex ">
        <Link className="text-white no-underline" href={"/"}>
         <NavBox borderL={0}>
            <FaHome></FaHome>
            <h3 className="md:text-base">Home</h3>
          </NavBox>
        </Link>
      </div>
      <div className="flex">
        {isLoggedIn ? (
          <Link className="text-white no-underline" href={"/account"}>
            <NavBox>
              <FaSuitcase></FaSuitcase>
              <h3 className="md:text-base">My Economy</h3>
            </NavBox>
          </Link>
        ) : ( // no Link if not logged in:
         
            
            <NavBox onClick={() => {
              handleClickWhenOffline();
              console.log(isClickedWhenOffline);
            }}>
              {/* {isClickedWhenOffline ? (<div className="fixed mt-[-7rem]">
                Not Logged In
              </div>) : ("")} */}
              <div className="absolute mb-[-8rem] mr-[-8rem]" style={{opacity: `${isClickedWhenOffline ? (100) : (0)}`, transition: "ease-in-out", transitionDuration: "600ms"}}>
                <h3 className=" text-red-500 md:text-base">Not Logged In</h3>
              </div>
              <FaSuitcase></FaSuitcase>
              <h3 className="md:text-base">My Economy</h3>
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

  );
}

function NavBox({children, borderL, borderR, onClick}) {

  return (
    <div onClick={onClick} className={`w-32 flex flex-col gap-4 items-center justify-center  p-4 hover:cursor-pointer hover:bg-[rgb(18,20,51)]`}
    /* style={{borderLeft: `${borderL}`, borderRight: `${borderR}`}} */
    >
      {/* border-4 border-solid border-b-0 border-[rgb(35,38,90)] */}
      {children}
    </div>
    
  )
}