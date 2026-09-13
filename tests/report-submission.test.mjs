import { test, describe, before } from "node:test";
import assert from "node:assert/strict";

describe("SurakshaNet Report Submission Flow & Deployment Safety", () => {
  let submitReport;
  let getStorageRepository;
  let repo;

  before(async () => {
    // Simulate deployed / serverless production mode without local filesystem DB
    process.env.NODE_ENV = "production";
    delete process.env.DATABASE_URL;

    const storageMod = await import("../src/lib/server/storage/index.ts");
    getStorageRepository = storageMod.getStorageRepository;
    repo = getStorageRepository();

    const reportMod = await import("../src/lib/server/report-handler.ts");
    submitReport = reportMod.handleAnonymousReport;
  });

  test("1. Submit a text-only anonymous report", async () => {
    const res = await submitReport({
      text: "Someone in my gaming group is asking where I live and told me not to tell my parents.",
      severity: 2,
      callback: false,
      screenshot: false,
      voice: false,
    });

    assert.ok(res.publicId, "Should return a public ID");
    assert.match(res.publicId, /^(SN-[A-Z0-9]+|SRK-\d+)$/, "Public ID should follow SN- or SRK- format");
    assert.equal(res.received, true, "Report should be confirmed as received");
  });

  test("2. Submit text + screenshot", async () => {
    const res = await submitReport({
      text: "They sent me this message on Discord asking for private photos.",
      severity: 3,
      callback: false,
      screenshot: true,
      voice: false,
    });

    assert.ok(res.publicId, "Should return a public ID");
    assert.equal(res.received, true);

    // Verify attachment in repository
    const cases = await repo.listCases("dev-responder");
    const found = cases.cases.find((c) => c.public_id === res.publicId);
    assert.ok(found, "Case should exist in case list");

    const detail = await repo.getCaseDetail(found.id, "dev-responder");
    assert.ok(detail, "Detail should exist");
    assert.ok(
      detail.attachments.some((a) => a.kind === "screenshot"),
      "Screenshot attachment should be registered",
    );
  });

  test("3. Submit text + voice note", async () => {
    const res = await submitReport({
      text: "Voice note: stranger asking to meet up after school.",
      severity: 3,
      callback: false,
      screenshot: false,
      voice: true,
    });

    assert.ok(res.publicId);
    assert.equal(res.received, true);

    const cases = await repo.listCases("dev-responder");
    const found = cases.cases.find((c) => c.public_id === res.publicId);
    assert.ok(found);

    const detail = await repo.getCaseDetail(found.id, "dev-responder");
    assert.ok(
      detail.attachments.some((a) => a.kind === "voice"),
      "Voice attachment should be registered",
    );
  });

  test("4. Submit text + screenshot + voice note", async () => {
    const res = await submitReport({
      text: "They called me and sent threatening messages to share my school photos.",
      severity: 4,
      callback: true,
      contact: "+919876543210",
      region: "MH",
      screenshot: true,
      voice: true,
    });

    assert.ok(res.publicId);
    assert.equal(res.received, true);

    const cases = await repo.listCases("dev-responder");
    const found = cases.cases.find((c) => c.public_id === res.publicId);
    assert.ok(found);
    assert.equal(found.priority, "P1", "Severity 4 report should be escalated to P1 priority");
    assert.equal(found.region_code, "MH");
    assert.equal(found.callback_requested, true);

    const detail = await repo.getCaseDetail(found.id, "dev-responder");
    assert.ok(detail.attachments.some((a) => a.kind === "screenshot"));
    assert.ok(detail.attachments.some((a) => a.kind === "voice"));
    assert.equal(detail.hasSealedIdentity, true, "Encrypted contact should be sealed");
  });

  test("5. Verify the report is persisted in storage", async () => {
    const res = await submitReport({
      text: "Persistence check: an adult asking for my address.",
      severity: 2,
      callback: false,
      screenshot: false,
      voice: false,
    });

    const cases = await repo.listCases("dev-responder");
    const found = cases.cases.find((c) => c.public_id === res.publicId);
    assert.ok(found, "Report must be persisted in repository");
    assert.equal(found.public_id, res.publicId);

    const detail = await repo.getCaseDetail(found.id, "dev-responder");
    assert.ok(detail.messages.length >= 1, "Report text messages must be persisted");
    assert.ok(detail.messages[0].redacted_text.includes("address"), "Text must be stored and redacted");
  });

  test("6. Verify the responder case is created and updated", async () => {
    const res = await submitReport({
      text: "Please keep this a secret between us, don't tell your parents or teachers.",
      severity: 3,
      callback: false,
      screenshot: false,
      voice: false,
    });

    const cases = await repo.listCases("dev-responder");
    const found = cases.cases.find((c) => c.public_id === res.publicId);
    assert.ok(found);

    const detail = await repo.getCaseDetail(found.id, "dev-responder");
    assert.ok(detail.case.risk_score > 0, "Risk score must be computed");
    assert.ok(["low", "med", "high", "critical"].includes(detail.case.risk_band), "Valid risk band");
    assert.ok(detail.scores.length > 0, "Scores record must be created");
    assert.ok(detail.safetyPack, "Safety case pack must be created");
    assert.ok(detail.stages.length > 0, "Stage history must be recorded");
  });

  test("7. Verify audit events are updated", async () => {
    await submitReport({
      text: "Audit logging verification report.",
      severity: 2,
      callback: false,
      screenshot: false,
      voice: false,
    });

    const auditList = await repo.listAudit("dev-responder");
    assert.ok(auditList.rows.length > 0, "Audit entries must be present");

    const caseAudits = auditList.rows.filter((a) => a.action === "case.ingested" || a.action === "report.submitted");
    assert.ok(caseAudits.length >= 1, "Should record case ingestion audit events");
  });

  test("8. Verify LLM analysis pipeline works and does not fail report submission", async () => {
    const res = await submitReport({
      text: "Someone offered me in-game currency if I install a special app on my phone.",
      severity: 3,
      callback: false,
      screenshot: false,
      voice: false,
    });

    assert.ok(res.publicId);
    const cases = await repo.listCases("dev-responder");
    const found = cases.cases.find((c) => c.public_id === res.publicId);
    assert.ok(found);

    const detail = await repo.getCaseDetail(found.id, "dev-responder");
    assert.ok(detail.safetyPack, "Safety pack must be generated");
    assert.ok(
      detail.safetyPack.analysis_mode === "live" || detail.safetyPack.analysis_mode === "fallback",
      "Analysis mode must be either live or fallback",
    );
  });

  test("9. Verify production/deployed mode never produces ENOENT for pglite.data", async () => {
    // Explicitly verify in production mode without DATABASE_URL
    process.env.NODE_ENV = "production";
    delete process.env.DATABASE_URL;

    try {
      const res = await submitReport({
        text: "Testing production serverless deployment without filesystem database.",
        severity: 1,
        callback: false,
        screenshot: false,
        voice: false,
      });

      assert.ok(res.publicId, "Should succeed in production environment");
    } catch (err) {
      assert.fail(`Production submission failed with unexpected error: ${err.message}`);
    }
  });
});
