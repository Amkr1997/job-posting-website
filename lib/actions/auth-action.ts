"use server";

import { headers } from "next/headers";
import { auth } from "../auth";

export const signup = async (name: string, email: string, password: string) => {
  console.log(name, email, password);
  const result = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
      callbackURL: "/signin",
    },
  });

  return result;
};

export const signin = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: "/",
    },
  });

  return result;
};

export const signout = async () => {
  const result = await auth.api.signOut({ headers: await headers() });

  return result;
};
