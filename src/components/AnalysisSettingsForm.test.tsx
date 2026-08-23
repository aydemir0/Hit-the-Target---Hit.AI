import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test } from "vitest";
import { AnalysisSettingsForm } from "./AnalysisSettingsForm";

describe("AnalysisSettingsForm", () => {
  beforeEach(() => {
    render(<AnalysisSettingsForm />);
  });

  test("1. The four settings controls render with accessible names", () => {
    expect(screen.getByRole("textbox", { name: /target role/i })).toBeDefined();
    expect(screen.getByRole("combobox", { name: /experience level/i })).toBeDefined();
    expect(screen.getByRole("combobox", { name: /output language/i })).toBeDefined();
    expect(screen.getByRole("checkbox", { name: /strict matching/i })).toBeDefined();
  });

  test("7. The default values are Junior, English, and Strict matching unchecked", () => {
    const experienceLevel = screen.getByRole("combobox", {
      name: /experience level/i,
    }) as HTMLSelectElement;

    const outputLanguage = screen.getByRole("combobox", {
      name: /output language/i,
    }) as HTMLSelectElement;

    const strictMatching = screen.getByRole("checkbox", {
      name: /strict matching/i,
    }) as HTMLInputElement;

    expect(experienceLevel.value).toBe("Junior");
    expect(outputLanguage.value).toBe("English");
    expect(strictMatching.checked).toBe(false);
  });

  test("2. Submitting an empty Target role shows a validation error", async () => {
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage.textContent).toMatch(
      /Target role must be between 2 and 80 characters/i
    );
  });

  test("3. A whitespace-only Target role is rejected", async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole("textbox", {
      name: /target role/i,
    });

    await user.type(targetRoleInput, "     ");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage.textContent).toMatch(
      /Target role must be between 2 and 80 characters/i
    );
  });

  test("4. A Target role shorter than 2 characters is rejected", async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole("textbox", {
      name: /target role/i,
    });

    await user.type(targetRoleInput, "A");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage.textContent).toMatch(
      /Target role must be between 2 and 80 characters/i
    );
  });

  test("5. A Target role longer than 80 characters is rejected", async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole("textbox", {
      name: /target role/i,
    });

    await user.type(targetRoleInput, "A".repeat(81));
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const errorMessage = await screen.findByRole("alert");
    expect(errorMessage.textContent).toMatch(
      /Target role must be between 2 and 80 characters/i
    );
  });

  test("6. A valid submission shows the session-only success message", async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole("textbox", {
      name: /target role/i,
    });

    await user.type(targetRoleInput, "Junior Full-Stack Software Engineer");
    await user.click(screen.getByRole("button", { name: /save settings/i }));

    const successMessage = await screen.findByRole("status");
    expect(successMessage.textContent).toMatch(
      /Settings saved for this session/i
    );
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
