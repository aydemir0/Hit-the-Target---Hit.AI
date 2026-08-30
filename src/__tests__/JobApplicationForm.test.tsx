import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import React from "react";
import { JobApplicationForm } from "../components/JobApplicationForm";

describe("JobApplicationForm", () => {
  afterEach(cleanup);
  
  test("FORM 1: Required validation on empty submit", () => {
    const onAdd = vi.fn();
    render(<JobApplicationForm onAdd={onAdd} />);
    
    const submitButton = screen.getByRole("button", { name: /Add Application/i });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Company name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Job title is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Application date is required/i)).toBeInTheDocument();
    
    expect(onAdd).not.toHaveBeenCalled();
  });

  test("FORM 2: Valid submission with trimmed values", () => {
    const onAdd = vi.fn();
    render(<JobApplicationForm onAdd={onAdd} />);
    
    fireEvent.change(screen.getByLabelText(/Company Name/i), { target: { value: "  Acme Corp  " } });
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: "  Frontend Engineer  " } });
    fireEvent.change(screen.getByLabelText(/Status/i), { target: { value: "Applied" } });
    fireEvent.change(screen.getByLabelText(/Application Date/i), { target: { value: "2026-08-30" } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: "  Great company  " } });
    
    fireEvent.click(screen.getByRole("button", { name: /Add Application/i }));
    
    expect(onAdd).toHaveBeenCalledWith({
      companyName: "Acme Corp",
      jobTitle: "Frontend Engineer",
      status: "Applied",
      applicationDate: "2026-08-30",
      notes: "Great company",
    });
  });

  test("FORM 3: Form has accessible name", () => {
    render(<JobApplicationForm onAdd={vi.fn()} />);
    expect(screen.getByRole("form", { name: /Add Application/i })).toBeInTheDocument();
  });
});
