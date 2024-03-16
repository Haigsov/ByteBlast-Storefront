"use client";

import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";

interface ApiListProps {
    entityName: string;
    entityIdName: string;
}

export const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName
}) => {

    const params = useParams();
    const origin = useOrigin();

    return (
        <div>
            ApiList
        </div>
    )
}