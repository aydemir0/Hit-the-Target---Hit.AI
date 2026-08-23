import { AnalysisSettingsForm } from "@/components/AnalysisSettingsForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">Hit.AI</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Your AI-powered career assistant. Let&apos;s tailor your profile to your dream job.
        </p>
      </div>

      <AnalysisSettingsForm />
    </div>
  );
}
