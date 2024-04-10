"use client"
import { useEffect, useState } from "react"

export default function Button({children, onClick, isInForm}) {

  const [isSubmit, setIsSubmit] = useState("");

  useEffect(() => {
    if (isInForm) {
      setIsSubmit("submit");
    } else {
      setIsSubmit("");
    }  
  }, [])
  
  return (
    <button type={isSubmit} onClick={onClick} className="flex text-white text-base leading-none w-52 md:w-64 lg:w-80 items-center justify-center py-6 bg-[rgb(35,38,90)] border-solid border-[rgb(35,38,90)] hover:border-solid hover:border-[rgb(143,60,255)] rounded-full hover:cursor-pointer">
      {children}
    </button>
  )
}