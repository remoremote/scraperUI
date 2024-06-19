"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const exampleTasks = [
  { 
    name: "eichelmann", 
    url: "https://www.homegate.ch/anbieter/t056/eichelmann-real-estate-gmb-h/mieten/alle-mietinserate/trefferliste-ag",
    jsonUrl: "https://www.homegate.ch/anbieter/t056/eichelmann-real-estate-gmb-h/mieten/alle-mietinserate/trefferliste-ag.json",
  },
  { 
    name: "centerio", 
    url: "https://www.homegate.ch/agency/n187/centerio-ag/rent/rent-listings/matching-list-ag",
    jsonUrl: "https://www.homegate.ch/agency/n187/centerio-ag/rent/rent-listings/matching-list-ag.json",
  },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await triggerScrapingTask(url, name);
  };

  const triggerScrapingTask = async (url: string, name: string) => {
    const response = await fetch("/api/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, name }),
    });

    if (response.ok) {
      toast({
        title: "Success",
        description: `Scraping task ${name} added successfully!`,
        duration: 2500,
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to add scraping task ${name}.`,
        duration: 2500,
      });
    }
  };

  const handleScrapeAll = async () => {
    for (const task of exampleTasks) {
      await triggerScrapingTask(task.url, task.name);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <Card className="w-full max-w-xl mb-8">
        <CardHeader>
          <CardTitle>Homegate.ch Scraper</CardTitle>
          <CardDescription>
            Input URLs and name each scraping task to extract detailed information from property listings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Task Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., eichelmann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="p-2"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.homegate.ch/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="p-2"
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-2">
              Add Scraping Task
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="w-full max-w-xl mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Scraper Task list</CardTitle>
            <CardDescription>
              Below are some example URLs and task names to help visualize the UI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exampleTasks.map((task, index) => (
              <div key={index} className="mb-4 border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <p className="font-medium"><strong>Task Name:</strong> {task.name}</p>
                <p className="mb-2"><strong>URL:</strong> 
                  <a href={task.url} target="_blank" rel="noopener noreferrer" className="underline text-gray-800 hover:text-gray-600">{task.url}</a>
                </p>
                <div className="flex gap-2">
                  <Button as="a" href={task.jsonUrl} target="_blank" variant="secondary" className="flex-1">
                    View JSON
                  </Button>
                  <Button onClick={() => triggerScrapingTask(task.url, task.name)} variant="secondary" className="flex-1">
                    Scrape
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleScrapeAll} className="w-full max-w-xs py-3" variant="destructive" size="lg">
        Scrape All Tasks
      </Button>
    </main>
  );
}