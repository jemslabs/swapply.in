import { useAuth } from "@/stores/useAuth"; 
import type { JSX } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ClientProtect({ children }: { children: JSX.Element }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/"); // redirect if no user
    } else {
      setChecked(true); // allow rendering children if user exists
    }
  }, [user, navigate]);

  if (!checked) return null; // prevent rendering while checking

  return children;
}

export default ClientProtect;
