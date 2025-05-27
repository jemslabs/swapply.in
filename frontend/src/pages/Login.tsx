import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/stores/useAuth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import * as EmailValidator from 'email-validator';
import { toast } from "sonner";

function Login() {
    const { login } = useAuth();
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate()
    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data.email || !data.password) {
            toast.error("All fields are required.");
            return;
        }
        if (!EmailValidator.validate(data.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        setIsLoading(true);
        await login(data, navigate);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen justify-center items-center">
            <div className="border border-[#3a3a3a] p-5 rounded-2xl w-[450px] bg-[#000000]">
                <h1 className="text-3xl font-bold mb-2 text-center font-playfair">
                    Login
                </h1>
                <p className="text-sm text-gray-400 text-center mb-6">
                    Welcome back! Please log in to continue
                </p>

                <form onSubmit={handleSignup} className="flex flex-col gap-3 py-4">
                    <div className="flex flex-col gap-2">
                        <Label>Email</Label>
                        <Input
                            value={data?.email}
                            onChange={(e) => setData({ ...data, email: e.target.value })}
                            placeholder="eg. isonikrish@gmail.com"
                        />
                    </div>
                    <div className="flex flex-col gap-2 relative">
                        <Label>Password</Label>
                        <div className="relative">
                            <Input
                                value={data?.password}
                                onChange={(e) => {
                                    const newPassword = e.target.value;
                                    setData({ ...data, password: newPassword });

                                    if (newPassword.length < 6) {
                                        setPasswordError("Password must be at least 6 characters.");
                                    } else {
                                        setPasswordError("");
                                    }
                                }}
                                type={showPassword ? "text" : "password"}
                                placeholder="******"
                            />
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-[#868686]"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </div>
                        </div>
                        {passwordError && (
                            <p className="text-red-700 text-xs">{passwordError}</p>
                        )}
                    </div>

                    <Button disabled={isLoading}>
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                        ) : (
                            "Login"
                        )}
                    </Button>
                </form>
                <p className="text-sm text-gray-400 text-center mb-6">
                    Don&apos;t have an account?{" "}
                    <Link to={"/signup"} className="text-[#c084fc] underline">
                        Signup
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
