import { redirect } from "next/navigation";
import { authenticate, verifyEmailToken } from "../../auth";

export default async function TokenAccept({
  params: { token },
}: {
  params: { token: string };
}) {
  verifyEmailToken(token).unwrap();

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
