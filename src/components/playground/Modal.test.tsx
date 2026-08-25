import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe } from 'vitest';
import { Modal } from './Modal';

describe('Modal (Manual)', () => {
  test('follows W3C APG keyboard requirements', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <button id="before">Before</button>
        <Modal triggerText="Open Modal" title="Test Dialog">
          <button id="inside-1">Inside 1</button>
          <a href="#" id="inside-2">Inside 2</a>
        </Modal>
        <button id="after">After</button>
      </div>
    );

    const trigger = screen.getByText('Open Modal');
    const beforeBtn = document.getElementById('before');
    
    // 1. Focus the trigger
    trigger.focus();
    expect(trigger).toHaveFocus();

    // 2. Press Enter to open
    await user.keyboard('{Enter}');
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    
    // ARIA checks
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    // Ensure accessible name exists (via aria-labelledby and the title)
    expect(dialog).toHaveAccessibleName('Test Dialog');

    // 3. Verify focus moves inside the dialog
    // Focus should be on the modal wrapper, or the first focusable element. 
    // The user's requirements said: "focuses modal or first focusable element"
    // Let's just check it's inside the dialog.
    expect(dialog.contains(document.activeElement)).toBe(true);

    const inside1 = document.getElementById('inside-1');
    const inside2 = document.getElementById('inside-2');
    const closeBtn = screen.getByText('Close');

    // 4. Press Tab repeatedly & 5. Verify focus never escapes the dialog
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true); // Should wrap, not escape

    // 6. Press Shift+Tab from the first focusable element
    // Let's force focus to the first element (inside-1 or close if order differs, wait actually Modal body itself might be first, let's focus inside1)
    inside1?.focus();
    await user.tab({ shift: true });
    
    // 7. Verify focus wraps to the last focusable element (closeBtn)
    // Actually the closeBtn is usually the last.
    expect(document.activeElement).toBe(closeBtn);

    // 8. Press Escape
    await user.keyboard('{Escape}');

    // 9. Verify the dialog closes
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // 10. Verify focus returns to the exact trigger that opened it
    expect(trigger).toHaveFocus();
  });
});
