import TutorApp from "./tutor-app.tsx";
import { connection } from "next/server";
import { getRuntimeCapabilities } from "../src/services/runtimeConfiguration.ts";

export default async function HomePage() {
  await connection();
  return <TutorApp capabilities={getRuntimeCapabilities()} />;
}
