import { redirect } from "next/navigation";
import { authenticate } from "./auth";

export default async function SignIn({
  searchParams,
}: {
  searchParams: { error?: boolean };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        action={async (data) => {
          "use server";
          const password = data.get("password");
          if (password) {
            const success = await authenticate(password as string);

            if (success) {
              redirect("/");
            } else {
              redirect("/sign-in?error");
            }
          }
        }}
      >
        <label className="block">
          Pass:
          <span className="flex flex-col">
            <input className="text-black" type="password" name="password" />
            {"error" in searchParams && (
              <p className="text-red-500">
                psych that&apos;s the wrong number!
              </p>
            )}
          </span>
        </label>
        <button className="float-right mt-3">Submit</button>
      </form>
    </main>
  );
}
