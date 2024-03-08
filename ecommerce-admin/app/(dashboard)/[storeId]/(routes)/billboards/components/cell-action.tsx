"use client";

import {
    DropdownMenu,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { BillboardColumn } from "./columns";
import { MoreHorizontal } from "lucide-react";

interface CellActionProps {
    data: BillboardColumn
}


export const CellAction: React.FC<CellActionProps> = ({
    data
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal />
                </Button>
            </DropdownMenuTrigger>
        </DropdownMenu>
    );
};