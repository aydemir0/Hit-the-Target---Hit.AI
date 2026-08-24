export default function AnalysisPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-4 text-foreground">AI Career Analysis</h1>
      <p className="text-muted-foreground mb-8">
        (Placeholder) This feature will analyze your LinkedIn profile or CV against a target job description to highlight gaps and recommendations.
      </p>
      
      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">LinkedIn Profile URL</label>
          <input type="url" disabled className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed" placeholder="https://linkedin.com/in/..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Or Upload CV (PDF)</label>
          <input type="file" disabled className="w-full text-muted-foreground cursor-not-allowed" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Target Job Description</label>
          <textarea disabled rows={4} className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed" placeholder="Paste job description here..."></textarea>
        </div>
        <button disabled className="px-4 py-2 bg-primary text-primary-foreground rounded-md opacity-50 cursor-not-allowed">
          Analyze
        </button>
      </div>
    </div>
  );
}
