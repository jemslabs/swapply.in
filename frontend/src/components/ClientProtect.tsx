import { useAuth } from "@/stores/useAuth"; 
import type { JSX } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ClientProtect({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return children;
}

export default ClientProtect;
