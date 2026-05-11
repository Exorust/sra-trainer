import { SessionClient } from "./SessionClient";
import { CASES } from "@/lib/cases";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CASES.map((c) => ({ caseId: c.id }));
}

export default async function SessionPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const patientCase = CASES.find((c) => c.id === caseId);
  if (!patientCase) notFound();

  return <SessionClient patientCase={patientCase} />;
}
