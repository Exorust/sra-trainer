import { DebriefClient } from "./DebriefClient";
import { CASES } from "@/lib/cases";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return CASES.map((c) => ({ caseId: c.id }));
}

export default async function DebriefPage({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const patientCase = CASES.find((c) => c.id === caseId);
  if (!patientCase) notFound();

  return <DebriefClient patientCase={patientCase} />;
}
