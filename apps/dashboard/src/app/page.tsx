import { Button } from "@grove/ui/components/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Grove Dashboard</h1>
      <p className="text-muted-foreground">Staff dashboard</p>
      <Button>Dashboard Action</Button>
      <Button variant="outline">Settings</Button>
    </main>
  );
}
