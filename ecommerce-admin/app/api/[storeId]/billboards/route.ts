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
        // Extract label and imageUrl from the request body
        const { label, imageUrl } = body;

        // Checks if user is logged in
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Validate presence of label
        if (!label) {
            return new NextResponse("Label is required", { status: 400 });
        }

        // Validate presence of imageUrl
        if (!imageUrl) {
            return new NextResponse("Image URL is required", { status: 400 });
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
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });

        // Return the newly created billboard as a JSON response
        return NextResponse.json(billboard);
    } catch (error) {
        // Log any errors that occur during the process
        console.log('[BILLBOARDS_POST]', error);
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
        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            },
        });

        // Return the retrieved billboards as a JSON response
        return NextResponse.json(billboards);
    } catch (error) {
        // Log any errors that occur during the process
        console.log('[BILLBOARDS_GET]', error);
        // Return an internal server error response if an error occurs
        return new NextResponse("Internal error", { status: 500 });
    }
};
