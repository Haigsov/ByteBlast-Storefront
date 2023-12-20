"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";

//StoreModal component that acts as a wrapper for the Modal component
export const StoreModal = () => { 
    const storeModal = useStoreModal();

    //Return the Modal component with the title, description, isOpen, and onClose props
    return (
    <Modal
        title="Create store"
        description="Add a new store to manage products and categories"
        isOpen={false}
        onClose={() => {}}
    >
        Future Create Store Form
    </Modal>
    );

};