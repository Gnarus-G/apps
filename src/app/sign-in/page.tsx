import { redirect } from "next/navigation";

export default async function SignIn() {
  redirect("/sign-in/email");
}
