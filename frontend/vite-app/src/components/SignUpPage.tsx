import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const API = "http://127.0.0.1:8000/api";

function SignUpPage() {
  const [alert, setAlert] = useState<{
    type: "default" | "destructive" | "success";
    title: string;
    description: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignUp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    const formData = new FormData(form);
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);

    await fetch(`${API}/create-user/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    })
      .then(async (response) => {
        if (response.ok) {
          setAlert({
            type: "success",
            title: "Success",
            description: "User created successfully!",
          });
          form.reset();
        } else {
          setAlert({
            type: "destructive",
            title: "Failed",
            description: `email or username may already exist.`,
          });
        }
      })
      .catch(async (error) => {
        console.error("Error:", error);
        setAlert({
          type: "destructive",
          title: "Error",
          description: "An unexpected error occurred.",
        });
      });

    setIsLoading(false);
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-69px)] bg-dark-800">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        </CardHeader>
        <CardContent>
          {alert && (
            <Alert variant={alert.type} className="mb-4">
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.description}</AlertDescription>
            </Alert>
          )}

          <form className="space-y-6" onSubmit={handleSignUp}>
            <div>
              <Label htmlFor="email" className="mb-2">
                Email:
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="username" className="mb-2">
                Username:
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-2">
                Password:
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Spinner data-icon="inline-start" />}
              {isLoading ? "Processing..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUpPage;
