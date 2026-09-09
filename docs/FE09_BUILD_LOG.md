# FE09 Build Log

## TDD Iteration: Accessible Form Name

**Goal**: Ensure `JobApplicationForm` has a proper accessible name (form role and label).

### RED Phase
Wrote a test querying the form by its accessible name:
```tsx
  test("FORM 3: Form has accessible name", () => {
    render(<JobApplicationForm onAdd={vi.fn()} />);
    expect(screen.getByRole("form", { name: /Add Application/i })).toBeInTheDocument();
  });
```

Test failed because the form lacked `aria-labelledby`:
```
TestingLibraryElementError: Unable to find an accessible element with the role "form" and name `/Add Application/i`
```

### GREEN Phase
Added `aria-labelledby="form-heading"` to the `<form>` and `id="form-heading"` to the `<h2>` inside the `JobApplicationForm` component.

```tsx
<form aria-labelledby="form-heading" ...>
  <h2 id="form-heading" ...>Add Application</h2>
```

Ran the test suite again. 
```
✓ src/__tests__/JobApplicationForm.test.tsx (3 tests) 113ms
```
The test passed.
