"use client";

import { Card } from "@/components/ui/card";
import { Building2, MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import DeleteModal from "@/components/Modals/Actions/Delete";
import Link from 'next/link'

interface AlertCardProps {
  alert: any;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleModalClose = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-2xl">
        <Link
          href={`/alert/${alert.id}`}
          className="group block"
        >
          <Card className="relative p-4 group shadow-custom-blue border-0 border-l-[#2D72FF] rounded-[8px] rounded-l-[2px] border-l-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-[20px] font-medium text-navy-900">
                  {alert.title}
                </h2>
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4 text-[#9BABC7]" />
                  <span className="text-[14px] text-[#9BABC7]">
                    {alert.alertCategory}
                  </span>
                </div>
              </div>
              <DropdownMenu
                open={isDropdownOpen}
                onOpenChange={setIsDropdownOpen}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 self-start transition-opacity ${isDropdownOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[190px] rounded border border-[#EAF0FC] bg-white shadow-[0px_2px_4px_0px_rgba(48,49,51,0.10),0px_0px_1px_0px_rgba(48,49,51,0.05)]"
                >
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="flex items-center py-2 justify-start gap-2 text-[14px] text-[#001742] rounded cursor-pointer"
                  >
                    <Trash className="h-6 w-6" />
                    Delete alert
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-3">
              <p className="text-gray-600 text-sm truncate">{alert.query}</p>
            </div>
          </Card>
        </Link>
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        alertId={alert.id}
        type="alert"
      />
    </>
  );
}
