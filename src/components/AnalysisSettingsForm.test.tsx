import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe, beforeEach } from 'vitest';
import { AnalysisSettingsForm } from './AnalysisSettingsForm';

describe('AnalysisSettingsForm', () => {
  beforeEach(() => {
    render(<AnalysisSettingsForm />);
  });

  test('1. The four settings controls render with accessible names', () => {
    expect(screen.getByRole('textbox', { name: /target role/i })).toBeDefined();
    expect(screen.getByRole('combobox', { name: /experience level/i })).toBeDefined();
    expect(screen.getByRole('combobox', { name: /output language/i })).toBeDefined();
    expect(screen.getByRole('checkbox', { name: /strict matching/i })).toBeDefined();
  });

  test('7. The default values are Junior, English, and Strict matching unchecked', () => {
    const experienceLevel = screen.getByRole('combobox', { name: /experience level/i }) as HTMLSelectElement;
    expect(experienceLevel.value).toBe('Junior');

    const outputLanguage = screen.getByRole('combobox', { name: /output language/i }) as HTMLSelectElement;
    expect(outputLanguage.value).toBe('English');

    const strictMatching = screen.getByRole('checkbox', { name: /strict matching/i }) as HTMLInputElement;
    expect(strictMatching.checked).toBe(false);
  });

  test('2. Submitting an empty Target role shows a validation error', async () => {
    // Try to submit with empty target role (which is the default)
    // Note: because the input has the 'required' attribute, HTML5 validation prevents submission natively.
    // However, for React tests we often have to either test the validation manually or bypass it depending on setup.
    // Let's remove the 'required' attribute temporarily in our minds? Or we can just submit via the form if `noValidate` wasn't set, it doesn't trigger JS submit in JSDOM, actually.
    // Wait, jsdom does support some form validation. But fireEvent.click(button) might still trigger JS submit if it bypasses jsdom native validation or if we mock it.
    // Let's simulate calling the form's submit event directly to test our JS logic.
    fireEvent.submit(screen.getByRole('button', { name: /save settings/i }).closest('form')!);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage.textContent).toMatch(/Target role must be between 2 and 80 characters/i);
  });

  test('3. A whitespace-only Target role is rejected', async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole('textbox', { name: /target role/i });
    
    await user.type(targetRoleInput, '     ');
    fireEvent.submit(screen.getByRole('button', { name: /save settings/i }).closest('form')!);
    
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage.textContent).toMatch(/Target role must be between 2 and 80 characters/i);
  });

  test('4. A Target role shorter than 2 characters is rejected', async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole('textbox', { name: /target role/i });
    
    await user.type(targetRoleInput, 'A');
    fireEvent.submit(screen.getByRole('button', { name: /save settings/i }).closest('form')!);
    
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage.textContent).toMatch(/Target role must be between 2 and 80 characters/i);
  });

  test('5. A Target role longer than 80 characters is rejected', async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole('textbox', { name: /target role/i });
    
    const longString = 'A'.repeat(81);
    await user.type(targetRoleInput, longString);
    fireEvent.submit(screen.getByRole('button', { name: /save settings/i }).closest('form')!);
    
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage.textContent).toMatch(/Target role must be between 2 and 80 characters/i);
  });

  test('6. A valid submission shows the session-only success message', async () => {
    const user = userEvent.setup();
    const targetRoleInput = screen.getByRole('textbox', { name: /target role/i });
    
    await user.type(targetRoleInput, 'Senior Frontend Engineer');
    fireEvent.submit(screen.getByRole('button', { name: /save settings/i }).closest('form')!);
    
    const successMessage = await screen.findByRole('status');
    expect(successMessage.textContent).toMatch(/Settings saved for this session/i);
    
    // Ensure error doesn't exist
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
