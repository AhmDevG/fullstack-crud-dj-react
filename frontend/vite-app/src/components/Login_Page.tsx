import {useState} from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Spinner } from "@/components/ui/spinner";
import API from "./utils/globals";
import {useNavigate} from "react-router-dom";


function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState<{
        type: "default" | "destructive";
        title: string;
        description: string;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        await fetch(`${API}/token/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then(async (response) => {
                const data = await response.json();
                if (response.ok) {
                    setAlert({
                        type: "default",
                        title: "Success",
                        description: "Logged in successfully!",
                    });
                    setUsername("");
                    setPassword("");

                    localStorage.setItem("access_token", data.access);
                    localStorage.setItem("refresh_token", data.refresh);

                    navigate("/products", { replace: true });

                } else {
                    setAlert({
                        type: "destructive",
                        title: "Login Failed",
                        description: data.detail || "Invalid username or password.",
                    });
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setAlert({
                    type: "destructive",
                    title: "Error",
                    description: "An unexpected error occurred.",
                });
            });

        setIsLoading(false);
    };

    return  (
        <div className="flex items-center justify-center h-[calc(100vh-69px)] bg-dark-800">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                </CardHeader>
                <CardContent>
                    {alert && (
                        <Alert variant={alert.type} className="mb-4">
                            <AlertTitle>{alert.title}</AlertTitle>
                            <AlertDescription>{alert.description}</AlertDescription>
                        </Alert>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <Label htmlFor="username" className="mb-2">
                                Username:
                            </Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Enter your username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password" className="mb-2">
                                Password:
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Spinner data-icon="inline-start" />}
                            {isLoading ? "Processing..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
export default LoginPage;
