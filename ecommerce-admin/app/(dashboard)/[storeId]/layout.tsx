import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

import Navbar from "@/components/navbar";

/**
 * Renders the layout for the dashboard page.
 *
 * @param children - The child components to render within the layout.
 * @param params - The parameters for the layout, including the storeId.
 * @returns The rendered layout component.
 */
export default async function DashboardLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { storeId: string };
}) {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    });

    if (!store) {
        redirect("/");
    }

    return (
        <>
            <Navbar />
            {children}
        </>

    )
}
