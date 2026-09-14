"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  adminPath,
  adminSessionCookie,
  adminSessionMaxAge,
  createAdminSession,
  isAdminPassword,
} from "@/lib/uniform-delivery-admin";

export async function login(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || !isAdminPassword(password)) {
    redirect(`${adminPath}?erro=1`);
  }

  (await cookies()).set(adminSessionCookie, createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: adminPath,
    maxAge: adminSessionMaxAge,
  });
  redirect(adminPath);
}

export async function logout() {
  (await cookies()).set(adminSessionCookie, "", { path: adminPath, maxAge: 0 });
  redirect(adminPath);
}
