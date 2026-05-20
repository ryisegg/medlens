import { describe, expect, it } from "vitest";
import { analyzeDrugRisks } from "./drugIntelligence";

describe("analyzeDrugRisks", () => {
  it("detects alcohol warnings", () => {
    const risks = analyzeDrugRisks({
      warnings: "Do not drink alcohol while taking this medication.",
    });
    expect(risks.hasAlcoholWarning).toBe(true);
    expect(risks.alcoholWarningText).toBeTruthy();
  });

  it("detects acetaminophen duplicate ingredient risk", () => {
    const risks = analyzeDrugRisks({
      name: "Tylenol Extra Strength",
      activeIngredients: ["acetaminophen"],
      warnings: "Contains acetaminophen. Do not use with other acetaminophen products.",
    });
    expect(risks.hasDuplicateIngredientWarning).toBe(true);
  });
});
