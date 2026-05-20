import { describe, expect, it } from "vitest";
import { buildDrugLabelText, checkHealthProfileAgainstDrugText } from "./healthProfileCheck";

describe("checkHealthProfileAgainstDrugText", () => {
  it("flags penicillin allergy against amoxicillin label text", () => {
    const matches = checkHealthProfileAgainstDrugText(
      { allergies: ["penicillin"], conditions: [], currentMeds: [] },
      "Amoxicillin is contraindicated in patients with a history of penicillin allergy.",
    );
    expect(matches.some((m) => m.kind === "allergy" && m.term === "penicillin")).toBe(true);
  });

  it("flags liver condition against hepatic warnings", () => {
    const matches = checkHealthProfileAgainstDrugText(
      { allergies: [], conditions: ["liver disease"], currentMeds: [] },
      "Use with caution in patients with hepatic impairment or liver disease.",
    );
    expect(matches.some((m) => m.kind === "condition")).toBe(true);
  });

  it("flags overlapping current medication names", () => {
    const matches = checkHealthProfileAgainstDrugText(
      { allergies: [], conditions: [], currentMeds: ["warfarin"] },
      buildDrugLabelText({
        name: "Ibuprofen",
        drugInteractions: "Increased bleeding risk with anticoagulants such as warfarin.",
      }),
    );
    expect(matches.some((m) => m.kind === "currentMed" && m.term === "warfarin")).toBe(true);
  });
});
