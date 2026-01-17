import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


function LoginPage() {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-69px)] bg-dark-800">
            <Card className="w-full max-w-md mx-4">
                <CardHeader>
                    <h2 className="text-2xl font-bold text-center">Login</h2>
                </CardHeader>
                <CardContent>
                    <form className="space-y-6">
                        <div>
                            <Label htmlFor="email" className="mb-2">Email:</Label>
                            <Input id="email" type="email" placeholder="Enter your email" required />
                        </div>
                        <div>
                            <Label htmlFor="password" className="mb-2">Password:</Label>
                            <Input id="password" type="password" placeholder="Enter your password" required />
                        </div>
                        <Button type="submit" className="w-full">Login</Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
export default LoginPage;
