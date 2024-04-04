// Global imports
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Local imports
import prismadb from "@/lib/prismadb";

/**
 * Creates a new billboard associated with a specific store ID.
 * @param req - The incoming request object.
 * @param params - Object containing parameters from the request, specifically the store ID.
 * @param params.storeId - The ID of the store for which the billboard is to be created.
 * @returns A response containing the newly created billboard if successful, or an error response if any validation or internal error occurs.
 */
export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        // Retrieve user ID from authentication
        const { userId } = auth();
        // Parse request body as JSON
        const body = await req.json();
        // Extract name and billboardId from the request body
        const { name, billboardId } = body;

        // Checks if user is logged in
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Validate presence of name
        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Validate presence of billboardId
        if (!billboardId) {
            return new NextResponse("billboard id is required", { status: 400 });
        }

        // Checks if storeId is provided
        if (!params.storeId) {
            return new NextResponse("Store id URL is required", { status: 400 });
        }

        // Check if the store belongs to the logged-in user
        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        // User is logged in but not authorized to modify this store
        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // Create a new billboard associated with the provided store ID
        const category = await prismadb.category.create({
            data: {
                name,
                billboardId,
                storeId: params.storeId
            }
        });

        // Return the newly created billboard as a JSON response
        return NextResponse.json(category);
    } catch (error) {
        // Log any errors that occur during the process
        console.log('[CATEGORIES_POST]', error);
        // Return an internal server error response if an error occurs
        return new NextResponse("Internal error", { status: 500 });
    }
}


/**
 * Retrieves billboards associated with a specific store ID.
 * @param req - The incoming request object.
 * @param params - Object containing parameters from the request, specifically the store ID.
 * @param params.storeId - The ID of the store for which billboards are to be retrieved.
 * @returns A response containing billboards associated with the provided store ID.
 */
export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        // Check if storeId is provided
        if (!params.storeId) {
            // Return a bad request response if storeId is missing
            return new NextResponse("Store id URL is required", { status: 400 });
        }

        // Retrieve billboards from the database based on the provided storeId
        const categories = await prismadb.category.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        // Return the retrieved billboards as a JSON response
        return NextResponse.json(categories);
    } catch (error) {
        // Log any errors that occur during the process
        console.log('[CATEGORIES_GET]', error);
        // Return an internal server error response if an error occurs
        return new NextResponse("Internal error", { status: 500 });
    }
};
