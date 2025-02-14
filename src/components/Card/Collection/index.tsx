import { useCallback, useEffect, useMemo, useState } from 'react'
import { MoreVertical, Trash, SquarePen, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditModal } from '@/components/Modals/Actions/Edit'
import DeleteModal from '@/components/Modals/Actions/Delete'
import { useSession } from 'next-auth/react'
import { Collection } from '@/redux/Collections/types';
import { getCollectionScheduleFrequency } from '@/utils/utils'

interface ExecutionTime {
  id: string;
  title: string;
  nextDate: string;
  willDeliveryHappen: boolean;
}

interface CollectionCardProps {
  collection: Collection
  nextExecutionTime?: ExecutionTime;
}

export default function CollectionCard({ collection, nextExecutionTime }: CollectionCardProps) {
  const { data: session } = useSession();
  const [isHovered, setIsHovered] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const frequency = useMemo(() =>
    getCollectionScheduleFrequency(collection.schedule),
    [collection.schedule]
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const executionDate = new Date(date);
    executionDate.setHours(0, 0, 0, 0);

    if (executionDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (executionDate.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const handleModalClose = useCallback((modalType: 'edit' | 'delete') => {
    if (modalType === 'edit') {
      setIsEditModalOpen(false)
    } else {
      setIsDeleteModalOpen(false)
    }
  }, [])

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsEditModalOpen(true)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDeleteModalOpen(true)
  }

  // Create initialData object from collection
  const editModalInitialData = useMemo(() => ({
    collectionName: collection.collectionName,
    collectionDescription: collection.collectionDescription || "",
    email: collection.email || "",
    schedule: collection.schedule,
  }), [collection]);

  return (
    <>
      <Link
        href={`/collection/${collection.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card className="relative w-full rounded-xl border border-[#eaf0fc] bg-white shadow-none transition-all duration-200 group-hover:shadow-custom-blue overflow-hidden">

          <div className="relative">
            <CardContent className="bg-white p-3">
              <div className="flex flex-col gap-1">
                <div className="flex w-full justify-between items-center">
                  <h2 className="text-[20px] font-medium tracking-tight truncate text-gray-800">
                    {collection.collectionName}
                  </h2>
                  <p className="text-[14px] text-gray-600">
                    {collection.alerts ? collection.alerts.length : 0} Active Alert
                  </p>
                </div>

                <label className='flex w-full gap-2 items-center justify-start text-[14px] text-gray-600'>
                  <Calendar className='h-4 w-4' />
                  {frequency}
                </label>

                <div className="flex w-full justify-between items-center">
                  <p className="text-[14px] text-gray-600">
                    {nextExecutionTime ? formatDate(nextExecutionTime.nextDate) : 'Not scheduled'}
                  </p>
                  <div
                    className={`transition-opacity duration-200 ${isHovered || isDropdownOpen ? 'opacity-100' : 'opacity-0'}`}
                  >
                    <DropdownMenu
                      open={isDropdownOpen}
                      onOpenChange={setIsDropdownOpen}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-[190px] rounded border bg-white shadow-sm"
                      >
                        <DropdownMenuItem
                          onClick={handleEdit}
                          className="flex items-center py-2 justify-start gap-2 text-[14px] text-gray-800 cursor-pointer"
                        >
                          <SquarePen className="h-6 w-6" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleDelete}
                          className="flex items-center py-2 justify-start gap-2 text-[14px] text-gray-800 cursor-pointer"
                        >
                          <Trash className="h-6 w-6" />
                          Remove collection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => handleModalClose('edit')}
        ownerId={session?.user?.id || ''}
        collectionId={collection.id}
        initialData={{
          ...editModalInitialData,
          schedule: editModalInitialData.schedule as "Daily" | "Weekly" | "Monthly"
        }}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => handleModalClose('delete')}
        collectionId={collection.id}
      />
    </>
  )
}