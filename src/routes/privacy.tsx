import { createFileRoute } from "@tanstack/react-router";
import { ChildChrome } from "@/components/child-chrome";
import { PrivacyFlow } from "@/components/privacy-flow";
import { ResponsibleAi } from "@/components/responsible-ai";
import { SimMark } from "@/components/sim-mark";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <ChildChrome>
      <article className="mx-auto max-w-3xl space-y-8">
        <div>
          <SimMark>Protective system · human confirmation required</SimMark>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">Privacy & law notes</h1>
          <p className="mt-3 text-ink-soft leading-relaxed">
            SurakshaNet is a protective, detective system. It is not a court, not a police desk,
            and not a substitute for Childline 1098 or a POCSO filing.
          </p>
        </div>
        <PrivacyFlow />
        <ResponsibleAi />
        <section className="space-y-2">
          <h2 className="font-display text-xl">What we keep — and what we refuse</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-ink-soft">
            <li>Anonymous tips store no IP address, email, or device identifier.</li>
            <li>Message text is NER-redacted (phones, emails, Aadhaar-like numbers, names) before storage.</li>
            <li>Original text is hashed, not stored. Screenshots and voice notes are sealed vault references, never displayed.</li>
            <li>Callback numbers live in a separate identity table, AES-256-GCM encrypted (simulated KMS), sealed by default.</li>
            <li>Identity reveal, authority escalation, and purge require an explicit human confirm.</li>
            <li>Access to cases is logged (who, what, when) without copying message bodies into logs.</li>
          </ul>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl">DPDP Act 2023</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Children’s data is treated as needing verifiable parental consent in production deployments.
            This preview uses purpose limitation (safety response only), data minimisation (redaction +
            hashes), storage limitation (configurable retention + purge), and access control (RBAC).
            Lawful processing for protection of children is a documented organisational decision —
            not something the model makes.
          </p>
        </section>
        <section className="space-y-2">
          <h2 className="font-display text-xl">POCSO evidentiary alignment</h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            Export packs are labeled <strong>SIMULATED</strong>. They are not Section 65B certificates,
            not hash-chained e-evidence, and not a complaint under the Protection of Children from
            Sexual Offences Act. A designated officer must review, confirm, and file through real
            channels. Agency integrations in this build are stubs.
          </p>
        </section>
      </article>
    </ChildChrome>
  );
}
