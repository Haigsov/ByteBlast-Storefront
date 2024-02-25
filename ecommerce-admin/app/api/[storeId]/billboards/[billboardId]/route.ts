// Global imports
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// Local imports
import prismadb from "@/lib/prismadb";

/**
 * Retrieves a billboard by its ID.
 * @param req - The incoming request object.
 * @param params - Object containing parameters from the request, specifically the billboard ID.
 * @param params.billboardId - The ID of the billboard to retrieve.
 * @returns A response containing the billboard details if successful, or an error response if the billboard ID is missing or an internal error occurs.
 */
export async function GET (
    req: Request,
    { params }: { params: { billboardId: string }}
) {
    try {
        // Check if billboardId is provided
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }

        // Retrieve the billboard details based on the provided billboardId
        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        // Return the retrieved billboard details as a JSON response
        return NextResponse.json(billboard);
    } catch (error) {
        // Log any errors that occur during the process
        console.log('[BILLBOARD_GET]', error);
        // Return an internal server error response if an error occurs
        return new NextResponse("Internal error", { status: 500 });
    }
};

/**
 * Updates a billboard's details.
 * @param req - The incoming request object.
 * @param params - Object containing parameters from the request, specifically the billboard ID and store ID.
 * @param params.billboardId - The ID of the billboard to update.
 * @param params.storeId - The ID of the store to which the billboard belongs.
 * @returns A response containing the updated billboard details if successful, or an error response if validation fails, the user is unauthorized, or an internal error occurs.
 */
export async function PATCH (
    req: Request,
    { params }: { params: { billboardId: string, storeId: string }}
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

        // Checks if billboardId is provided
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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

        // Update the billboard details based on the provided billboardId
        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        // Return the updated billboard details as a JSON response
        return NextResponse.json(billboard);
    } catch (error) {
        // Log any errors that occur during the process
        console.log('[BILLBOARD_PATCH]', error);
        // Return an internal server error response if an error occurs
        return new NextResponse("Internal error", { status: 500 });
    }
};

/**
 * Deletes a billboard.
 * @param req - The incoming request object.
 * @param params - Object containing parameters from the request, specifically the store ID and billboard ID.
 * @param params.storeId - The ID of the store to which the billboard belongs.
 * @param params.billboardId - The ID of the billboard to delete.
 * @returns A response indicating success or failure of the deletion operation.
 */
export async function DELETE (
    req: Request,
    { params }: { params: { storeId: string, billboardId: string }}
) {
    try {
        // Retrieve user ID from authentication
        const { userId } = auth();

        // Checks if user is logged in
        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Checks if billboardId is provided
        if (!params.billboardId) {
            return new NextResponse("Billboard id is required", { status: 400 });
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

        // Delete the billboard based on the provided billboardId
        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: params.billboardId,
            }
        });

        // Return a success response
        return NextResponse.json(billboard);
    } catch (error) {
        // Log any errors that occur during the process
        console.log('[BILLBOARD_DELETE]', error);
        // Return an internal server error response if an error occurs
        return new NextResponse("Internal error", { status: 500 });
    }
};