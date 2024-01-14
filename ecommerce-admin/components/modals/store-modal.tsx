// Import the "use client" library (assuming it's a custom library or module)

// Global imports
import * as z from "zod";  // Import Zod for schema validation
import axios from "axios";  // Import Axios for HTTP requests
import { useForm } from "react-hook-form";  // Import React Hook Form for form management
import { zodResolver } from "@hookform/resolvers/zod";  // Import Zod resolver for React Hook Form
import { useState } from "react";  // Import React hook for state management
import toast from "react-hot-toast";

// Local imports
import { useStoreModal } from "@/hooks/use-store-modal";  // Import custom hook for managing store modal
import { Modal } from "@/components/ui/modal";  // Import Modal component
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";  // Import form-related components
import { Input } from "../ui/input";  // Import Input component
import { Button } from "@/components/ui/button";  // Import Button component

// Define the form schema using Zod for validation
const formSchema = z.object({
    name: z.string().min(1),
});

// StoreModal component that acts as a wrapper for the Modal component
export const StoreModal = () => { 
    const storeModal = useStoreModal();  // Initialize the custom store modal hook

    // Loading state for the form. This will be used to disable the submit button
    const [loading, setLoading] = useState(false);

    // Initialize the form using useForm from React Hook Form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),  // Use Zod resolver for form validation
        defaultValues: {
            name: "",
        },
    });

    // Handle form submission
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);  // Set loading state to true during form submission

            // Send a POST request to the "/api/stores" endpoint with the form values
            const response = await axios.post("/api/stores", values);
            
            window.location.assign(`${response.data.id}`);  // Redirect to the newly created store
        }

        catch (error) {
            toast.error("Something went wrong");  // Display an error toast if something went wrong
        }

        finally {
            setLoading(false);  // Set loading state back to false after form submission (whether success or failure)
        }
    };

    // Return the Modal component with the title, description, isOpen, and onClose props
    return (
        <Modal
            title="Create store"
            description="Add a new store to manage products and categories"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={loading} 
                                                placeholder="E-Commerce" 
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                    disabled={loading}
                                    variant="outline"
                                    onClick={storeModal.onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    disabled={loading}
                                    type="submit">
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    );
};
