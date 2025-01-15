"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CircularProgress, Box } from "@mui/material";
import { useUserData } from "helpers/hooks/useUserData";

export default function DefaultPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userRole = useUserData(session?.user?.uid).user?.role;
  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    // Handle redirection based on user role

    if (userRole === "admin") {
      router.push("/dashboard");
    }
    // For leaders, PermissionsProvider will handle the team selection and redirection
  }, [session, status, router]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <CircularProgress />
    </Box>
  );
}
