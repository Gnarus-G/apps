import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren<{}>) {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      {children}
    </main>
  );
}
