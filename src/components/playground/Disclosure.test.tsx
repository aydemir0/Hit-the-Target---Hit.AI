import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe } from 'vitest';
import { Disclosure } from './Disclosure';

describe('Disclosure (Manual)', () => {
  test('follows W3C APG keyboard requirements', async () => {
    const user = userEvent.setup();
    render(
      <Disclosure title="Toggle Info">
        <div data-testid="content">Hidden Content</div>
      </Disclosure>
    );

    const button = screen.getByRole('button', { name: 'Toggle Info' });

    // 1. Focus the disclosure button.
    await user.tab();
    expect(button).toHaveFocus();

    // Initial state
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('content')).not.toBeVisible();

    // 2. Enter toggles it open.
    await user.keyboard('{Enter}');
    
    // 3. aria-expanded becomes true.
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('content')).toBeVisible();

    // 4. Space toggles it closed.
    await user.keyboard(' ');

    // 5. aria-expanded becomes false.
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByTestId('content')).not.toBeVisible();

    // 6. aria-controls points to the controlled content.
    const controlsId = button.getAttribute('aria-controls');
    expect(controlsId).toBeTruthy();
    expect(screen.getByTestId('content').parentElement).toHaveAttribute('id', controlsId);
  });
});
