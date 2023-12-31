// Note: This provider is used to render the modal component
"use client";

// Global imports
import { useState, useEffect } from "react";

// Local imports
import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
  // Create a state variable to track whether the modal component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Use useEffect to set the isMounted state variable to true when the component is first mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // If the component is not yet mounted, return null to prevent rendering anything
  if (!isMounted) {
    return null;
  }

  // If the component is mounted, return the StoreModal component
  return (
    <>
      <StoreModal />
    </>
  );
};
