import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-bold">JS Content Calendar</h1>
      <p className="text-zinc-300">Go to the calendar editor.</p>
      <Link className="rounded-md bg-white/10 px-4 py-2 hover:bg-white/15" href="/calendar">
        Open /calendar
      </Link>
    </main>
  );
}
