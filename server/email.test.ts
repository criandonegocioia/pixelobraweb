import { describe, it, expect } from "vitest";
import { verifyEmailConfig } from "./email";

describe("Email Configuration", () => {
  it("should verify email configuration is valid", async () => {
    const result = await verifyEmailConfig();

    // Log the result for debugging
    console.log("Email verification result:", result);

    // The test passes if the email configuration is valid
    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  }, 30000); // 30 second timeout for SMTP connection
});
