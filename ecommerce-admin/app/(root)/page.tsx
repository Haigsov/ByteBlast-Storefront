"use client";

import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import { use, useEffect } from "react";


// StoreModal component that acts as a wrapper for the Modal component
const SetupPage = () => {
  // Check if the store modal is open
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);


  useEffect(() => {
    // If the store modal is not open, open it
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return (
      <div className="p-4">
        Root Page
      </div>
    );
}

export default SetupPage;