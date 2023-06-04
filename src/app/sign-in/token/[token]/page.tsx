import { redirect } from "next/navigation";
import { authenticate, verifyEmailToken } from "../../auth";
import Link from "next/link";

export default async function TokenAccept({
  params: { token },
}: {
  params: { token: string };
}) {
  if (verifyEmailToken(token).isOk) {
    return (
      <div className="text-center">
        <p className="text-green-100">Verification successfull!</p>
        <form
          action={async () => {
            "use server";
            await authenticate();
            redirect("/");
          }}
        >
          <button>Sign in</button>
        </form>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-yellow-100">Unrecognized or expired token</p>
      <Link href="/sign-in">Sign in</Link>
    </div>
  );
}
