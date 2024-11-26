import { useNavigate } from "@tanstack/react-router";

import { ArrowUpIcon } from "lucide-react";

import type { OrderBy, SortBy } from "@/shared/types";
import { cn } from "@/lib/utils";

import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function SortBar({
  sortBy,
  orderBy,
}: {
  sortBy: SortBy;
  orderBy: OrderBy;
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex items-center justify-between">
      <Select
        value={sortBy}
        onValueChange={(sortBy: SortBy) =>
          navigate({ to: ".", search: (prev) => ({ ...prev, sortBy }) })
        }
      >
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="points">Points</SelectItem>
          <SelectItem value="recent">Recent</SelectItem>
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="icon"
        onClick={() =>
          navigate({
            to: ".",
            search: (prev) => ({
              ...prev,
              orderBy: orderBy === "asc" ? "desc" : "asc",
            }),
          })
        }
        aria-label={orderBy === "desc" ? "Sort Descending" : "Sort Ascending"}
      >
        <ArrowUpIcon
          className={cn(
            "transition-transform duration-300",
            orderBy === "desc" ? "rotate-180" : "",
          )}
        />
      </Button>
    </div>
  );
}
