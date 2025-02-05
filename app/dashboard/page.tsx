import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/lib/auth";
import { Button } from "../components/ui/button";
import { DashboardNavbar } from "../components/DashboardNavbar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNavbar />
      <main className="flex-1 container mx-auto max-w-[1200px] px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">
          Welcome, {session.user?.name || session.user?.email}
        </h1>
        <div className="grid gap-6">
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
            <p className="text-muted-foreground mb-4">
              Create your first resume or import an existing one to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="w-full sm:w-auto">Create New Resume</Button>
              <Button variant="outline" className="w-full sm:w-auto">
                Import Resume
              </Button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">Recent Activity</h3>
              <p className="text-muted-foreground">No recent activity</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">Resume Stats</h3>
              <p className="text-muted-foreground">No resumes created yet</p>
            </div>
            <div className="p-6 bg-card rounded-lg shadow-sm border">
              <h3 className="font-semibold mb-2">Tips & Resources</h3>
              <p className="text-muted-foreground">
                Check back soon for resume tips
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
