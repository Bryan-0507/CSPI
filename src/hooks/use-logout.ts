import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    // Remove the session token
    if (typeof window !== "undefined") {
      localStorage.removeItem("cspi_session");
    }
    // Redirect to login page
    router.push("/");
    router.refresh(); // Ensure client-side state is updated
  };

  return logout;
}
