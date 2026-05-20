import { describe, expect, it } from "vitest";
import { detectRedFlags } from "./symptoms";

describe("detectRedFlags", () => {
  it("detects English chest pain emergency language", () => {
    expect(detectRedFlags("severe chest pain and shortness of breath")).not.toHaveLength(0);
  });

  it("detects Chinese stroke symptoms", () => {
    expect(detectRedFlags("突然口角下垂和言语不清")).not.toHaveLength(0);
  });

  it("returns empty for mild symptoms", () => {
    expect(detectRedFlags("mild headache for one hour")).toHaveLength(0);
  });
});
