import { useRef, useState } from "react";
import Button from "./Button";

export default function Form({buttonTitle, onSubmit, username, setUsername, password, setPassword, isFailedLogin}) {

  const inputPassRef = useRef(null);
  const [inputPassType, setInputPassType] = useState("password");

  function handleInputPassType() {
    if (inputPassType === "password") {
      setInputPassType("text")
    } else {
      setInputPassType("password")
    }
  }

  return (
    <div className="flex flex-col items-start">
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <label className="flex gap-1" htmlFor="username"><p>Username:</p> {isFailedLogin ? <p className="text-red-500">Incorrect Username or Password</p> : (<p></p>)}</label>
        <input className="p-2 text-2xl leading-none w-64  md:w-72 lg:w-80" id="username" type="text" value={username} onChange={(e) => {
          setUsername(e.target.value);
        }} required/>
        <label htmlFor="password">Password:</label>
        <input className="p-2 text-2xl leading-none w-64 md:w-72 lg:w-80" id="password" type={inputPassType} value={password} onChange={(e) => {
          setPassword(e.target.value);
        }} required/>
        <div className="flex gap-4 p-4 items-center justify-start">
          <input onClick={() => {
            handleInputPassType();
          }} className="h-4 w-4 lg:h-6 lg:w-6" type="checkbox"/>
          <p>Show Password</p>
        </div>
        {/* <button type="submit">Submit</button> */}
        <Button type="submit">{buttonTitle}</Button>

      </form>
    </div>
  )
}