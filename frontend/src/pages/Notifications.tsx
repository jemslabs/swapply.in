import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/stores/useAuth";
import { ArrowLeft, ArrowRight, Bell, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { notification } from "@/lib/types";

function Notifications() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "SWAP":
                return <RefreshCw className="text-blue-500 w-4 h-4" />;
            default:
                return <Bell className="w-4 h-4" />;
        }
    };

    const timeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 24) return new Date(date).toLocaleDateString();
        if (hours >= 1) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
        if (minutes >= 1) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
        return "Just now";
    };

    return (
        <div className="py-5 px-4 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" onClick={() => navigate(-1)} size="icon">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
            </div>

            {user?.notifications?.length === 0 ? (
                <p className="text-muted-foreground text-center text-sm mt-10">
                    You have no notifications yet.
                </p>
            ) : (
                <div className="space-y-3">
                    {user?.notifications.map((notification: notification) => (
                        <Card
                            key={notification.id}
                            className="hover:shadow-lg transition cursor-pointer border bg-muted/20 group"
                            onClick={() => navigate(notification.link)}
                        >
                            <CardContent className="py-2 px-4 flex gap-4 items-center justify-between">
                                <div className="flex gap-3 items-start flex-1">
                                    <div className="mt-1">{getCategoryIcon(notification.category)}</div>
                                    <div className="flex-1">
                                        <h2 className="font-medium">{notification.title}</h2>
                                        <p className="text-sm text-muted-foreground">{notification.body}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {timeAgo(notification.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <ArrowRight
                                    className="text-muted-foreground mt-1 shrink-0 transition-transform duration-200 group-hover:translate-x-1 hover:text-white"
                                />
                            </CardContent>
                        </Card>

                    ))}
                </div>
            )}
        </div>
    );
}

export default Notifications;
