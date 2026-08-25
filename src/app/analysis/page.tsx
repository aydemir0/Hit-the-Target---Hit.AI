import CareerChat from '@/components/analysis/CareerChat';

export const metadata = {
  title: 'Career Analysis - Hit.AI',
};

export default function AnalysisPage() {
  const isDemoMode = !process.env.ANTHROPIC_API_KEY;

  return (
    <div className="w-full bg-muted/30">
      <CareerChat isDemoMode={isDemoMode} />
    </div>
  );
}
