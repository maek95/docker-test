"use client"
//export const host = "http://16.16.192.164:4001";
    // ändra till https?
//export const host = "http://localhost:4001";
//export const host = "https://workshop-25-bank-backend.vercel.app";

//export const host = "http://16.171.111.156";

//export const host = "http://localhost:4000"; // when working locally, also change origin cors in server.js!

//export const host = "http://13.53.190.247:4000"

export const host = process.env.NEXT_PUBLIC_HOST;
