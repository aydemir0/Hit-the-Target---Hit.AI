export default function CoverLetterPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4 text-foreground">Cover Letter Generator</h1>
      <p className="text-muted-foreground mb-8">
        (Placeholder) Automatically generate tailored cover letters based on your profile and target job.
      </p>
      
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="p-4 bg-muted rounded border border-border text-center text-muted-foreground">
          Future Feature: Select a saved job application or paste a job description to generate a cover letter.
        </div>
      </div>
    </div>
  );
}
