import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import AboutPageContent from "@/components/about-page-content";
import { getInfoPage } from "@/data/info-pages";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "About Us",
    description: "Learn how Solar Compare helps buyers make clearer solar decisions with verified guidance and trusted support.",
  };
}

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get("safwe:locale")?.value === "en" ? "en" : "hi";
  const page = getInfoPage("about-us", locale);

  if (!page) {
    notFound();
  }

  return <AboutPageContent page={page} />;
}