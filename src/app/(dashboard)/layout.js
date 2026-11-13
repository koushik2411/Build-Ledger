import { Suspense } from "react";
import AuthenticatedDashboard from "@/components/auth/AuthenticatedDashboard";

export default function DashboardLayout({ children }) {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <AuthenticatedDashboard>
                {children}
            </AuthenticatedDashboard>
        </Suspense>
    );
}