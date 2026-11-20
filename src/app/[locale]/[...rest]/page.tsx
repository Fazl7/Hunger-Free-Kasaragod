import { notFound } from "next/navigation";

// Unknown nested paths render the localized not-found page (with header/footer) and a real 404 status.
export default function CatchAll() {
  notFound();
}
