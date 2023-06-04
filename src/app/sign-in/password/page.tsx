import { redirect } from "next/navigation";
import { authenticatePassword } from "../auth";
import Link from "next/link";

export default function PasswordForm({
  searchParams,
}: {
  searchParams: { error?: boolean };
}) {
  return (
    <form
      action={async (data) => {
        "use server";
        const password = data.get("password");

        if (password) {
          const result = await authenticatePassword(password as string);

          if (result.isOk) {
            console.log("auth success");
            redirect("/");
          } else {
            console.error(result.error.message);
            redirect("/sign-in/password?error");
          }
        }
      }}
    >
      <label>
        Pass:
        <span className="flex flex-col">
          <input type="password" name="password" />
          {"error" in searchParams && (
            <p className="text-red-500">psych that&apos;s the wrong number!</p>
          )}
        </span>
      </label>

      <div className="mt-3">
        <Link className="text-blue-500 hover:underline" href="/sign-in/email">
          Sign In with email
        </Link>
      </div>

      <button className="float-right mt-3">Submit</button>
    </form>
  );
}
