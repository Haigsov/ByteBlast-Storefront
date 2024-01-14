import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
    params: { storeId: string };
};

const DashboardPage: React.FC<DashboardPageProps> = async ( {
    params
}) => {

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId
        }
    });
    // TODO: Add logic here
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

export default DashboardPage;