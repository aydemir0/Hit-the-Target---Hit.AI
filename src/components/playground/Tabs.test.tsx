import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, describe } from 'vitest';
import { Tabs } from './Tabs';

describe('Tabs (Manual)', () => {
  test('follows W3C APG manual activation keyboard requirements', async () => {
    const user = userEvent.setup();
    const tabsData = [
      { id: 't1', label: 'Tab 1', content: <div data-testid="p1">Panel 1</div> },
      { id: 't2', label: 'Tab 2', content: <div data-testid="p2">Panel 2</div> },
      { id: 't3', label: 'Tab 3', content: <div data-testid="p3">Panel 3</div> },
    ];
    
    render(<Tabs tabs={tabsData} ariaLabel="Test Tabs" />);
    
    const tabs = screen.getAllByRole('tab');
    
    // 1. Tab enters the tablist on the currently active tab.
    await user.tab();
    expect(tabs[0]).toHaveFocus();
    
    // Check initial ARIA state and panel visibility
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('p1')).toBeVisible();
    expect(screen.queryByTestId('p2')).not.toBeVisible();
    
    // 2. Right Arrow moves focus to the next tab but DOES NOT activate it.
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveFocus();
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false'); // Should not be selected yet
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByTestId('p2')).not.toBeVisible(); // Panel 2 shouldn't show yet

    // 3. Right Arrow from the last tab wraps to the first.
    await user.keyboard('{ArrowRight}'); // to tab 3
    await user.keyboard('{ArrowRight}'); // wrap to tab 1
    expect(tabs[0]).toHaveFocus();

    // 4. Left Arrow wraps in the opposite direction.
    await user.keyboard('{ArrowLeft}'); // wrap to tab 3
    expect(tabs[2]).toHaveFocus();
    
    // 5. Home focuses the first tab.
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
    
    // 6. End focuses the last tab.
    await user.keyboard('{End}');
    expect(tabs[2]).toHaveFocus();

    // 7. Enter activates the focused tab.
    await user.keyboard('{Enter}');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('p3')).toBeVisible();
    
    // 8. Space activates the focused tab.
    await user.keyboard('{ArrowLeft}'); // focus tab 2
    await user.keyboard(' '); // Space to activate
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('p2')).toBeVisible();

    // 9. aria-selected and tabindex update correctly.
    // 10. Only the selected tabpanel is displayed.
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    expect(tabs[1]).toHaveAttribute('tabindex', '0'); // Active tab gets tabindex 0
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
    expect(screen.getByTestId('p1')).not.toBeVisible();
    expect(screen.getByTestId('p3')).not.toBeVisible();
  });
});
