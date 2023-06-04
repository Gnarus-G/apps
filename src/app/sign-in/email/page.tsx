import { redirect } from "next/navigation";
import { signToken } from "../auth";
import Link from "next/link";
import { sendVerificationRequest } from "../email";

export default function EmailForm({
  searchParams,
}: {
  searchParams: { error?: boolean; sent?: boolean };
}) {
  if ("sent" in searchParams) {
    return (
      <div className="text-center my-5">
        <EmailSent />
      </div>
    );
  }

  return (
    <form
      action={async (data) => {
        "use server";
        const email = data.get("email") as string;

        if (email) {
          const token = signToken({ forEmail: true }, "5m");

          await sendVerificationRequest({
            to: email,
            url: `http://localhost:3000/sign-in/token/${token}`,
            theme: {},
          });

          return redirect("/sign-in/email?sent");
        }
      }}
    >
      <label>
        Email:
        <br />
        <input type="email" name="email" />
      </label>

      <div className="mt-3">
        <Link
          className="text-blue-500 hover:underline"
          href="/sign-in/password"
        >
          Sign In with password
        </Link>
      </div>

      <button className="float-right mt-3">Submit</button>
    </form>
  );
}

function EmailSent() {
  return (
    <>
      <h1 className="text-2xl">Check your email!</h1>
      <p>You should have recieved a verfication link.</p>
    </>
  );
}
