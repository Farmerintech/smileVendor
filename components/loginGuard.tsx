import { useAppStore } from "@/app/store/useAppStore";
import { useRouter } from "expo-router"; // or your navigation hook
import React, { useEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const LoginGuard: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const { user } = useAppStore();

  useEffect(() => {
    if (!user) {
      // if user is not logged in, redirect to login
      router.replace("/(auth)/signin"); // or your login route
    }
  }, [user, router]);

  // Optionally, you can render null while redirecting
  if (!user) return null;

  return <>{children}</>;
};

export default LoginGuard;
