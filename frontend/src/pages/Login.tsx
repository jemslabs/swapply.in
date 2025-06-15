import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/stores/useAuth";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2} from "lucide-react";
import * as EmailValidator from 'email-validator';
import { toast } from "sonner";
import swapply from '/swapply-nobg.png'
function Login() {
    const { login, user } = useAuth();
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

    useEffect(() => {
        if (user) {
            navigate("/browse/items")
        }
    }, [user])

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#00000] px-4">
          
                <div className="flex-1 max-w-lg bg-[#0a0a0a] p-8 rounded-2xl shadow-md border border-white/10">
                    <div className="h-16 w-40 mb-10 mx-auto">
                        <img src={swapply} alt="Swapply Logo" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2 font-playfair text-white text-center">
                        Welcome back!
                    </h1>
                    <p className="text-sm text-gray-400 mb-6 text-center">Please log in to continue</p>

                    <form onSubmit={handleSignup} className="flex flex-col gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label className="text-white">Email</Label>
                            <Input
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                                placeholder="eg. isonikrish@gmail.com"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label className="text-white">Password</Label>
                            <div className="relative">
                                <Input
                                    value={data.password}
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
                                <p className="text-red-600 text-xs">{passwordError}</p>
                            )}
                        </div>
                        <Button disabled={isLoading} className="w-full">
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Logging in...
                                </div>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </form>

                    <p className="text-sm text-gray-400 text-center mt-6">
                        Don&apos;t have an account?{" "}
                        <Link to="/signup" className="text-[#c084fc] underline">
                            Signup
                        </Link>
                    </p>
                </div>
        </div>

    );
}

export default Login;
