import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Hit the Target with <span className="text-primary">Hit.AI</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Your intelligent assistant for landing your dream job. Track applications, analyze your profile, generate cover letters, and prepare for interviews all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link prefetch={false} href="/applications" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Job Tracker</h2>
          <p className="text-muted-foreground">Keep track of your applications, interviews, and offers locally.</p>
        </Link>
        <Link prefetch={false} href="/analysis" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">AI Career Analysis</h2>
          <p className="text-muted-foreground">Analyze your CV against job descriptions. (Coming Soon)</p>
        </Link>
        <Link prefetch={false} href="/cover-letter" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Cover Letter Generator</h2>
          <p className="text-muted-foreground">Generate tailored cover letters effortlessly. (Coming Soon)</p>
        </Link>
        <Link prefetch={false} href="/linkedin" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">LinkedIn Optimizer</h2>
          <p className="text-muted-foreground">Get recommendations to improve your profile. (Coming Soon)</p>
        </Link>
        <Link prefetch={false} href="/interview" className="block p-6 bg-card border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Interview Prep</h2>
          <p className="text-muted-foreground">Practice and prepare for your upcoming interviews. (Coming Soon)</p>
        </Link>
      </div>
    </div>
  );
}
