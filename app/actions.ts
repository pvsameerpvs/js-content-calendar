"use server";

import { cookies } from "next/headers";

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Simulate delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (
    username?.trim() === "justSearch" && 
    password?.trim() === "justsearch123"
  ) {
    // Set HTTP-Only Cookie
    cookies().set("session_token", "valid_session", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    
    return { success: true, message: "Login Successful" };
  } else {
    return { success: false, message: "Invalid username or password" };
  }
}

export async function logoutAction() {
  cookies().delete("session_token");
}
