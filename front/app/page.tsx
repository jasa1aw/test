import { redirect } from "next/navigation" // Added

export default function Home() {
  redirect("/task-list");
}

