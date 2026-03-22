import { Button } from "@grove/ui/components/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Grove</h1>
      <p className="text-muted-foreground">Marketing site</p>
      <Button>Get Started</Button>
      <Button variant="outline">Learn More</Button>
    </main>
  );
}
