import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { deleteCollection } from "@/redux/Collections/CollectionThunk";
import { AppDispatch } from "@/store/store";
import { toast } from 'react-toastify';
import { deleteAlert } from "@/redux/Alerts/AlertThunk";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionId?: string;
  alertId?: string;
  type?: 'collection' | 'alert';
}

export default function DeleteModal({
  isOpen,
  onClose,
  collectionId,
  alertId,
  type = 'collection'
}: DeleteModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isDeleting = useSelector(
    (state: RootState) => state.collections.loading.delete || state.alerts.loading.delete
  );

  const handleDelete = async () => {
    try {
      const toastId = toast.loading(`Deleting ${type}...`);
      
      if (type === 'alert' && alertId) {
        await dispatch(deleteAlert(alertId)).unwrap();
      } else if (type === 'collection' && collectionId) {
        await dispatch(deleteCollection(collectionId)).unwrap();
      }

      toast.update(toastId, {
        render: `${type === 'alert' ? 'Alert' : 'Collection'} Deleted.`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      onClose();
    } catch (error) {
      console.error(`Failed to delete ${type}:`, error);
      toast.error(`Failed to delete ${type}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-[#00174240]/25 fixed inset-0" />
      <DialogContent className="p-3 py-3 bg-[#fff] gap-0 rounded border border-[#EAF0FC] w-[500px] max-w-[90vw] z-50">
        <DialogHeader className="flex items-start">
          <DialogTitle className="text-[16px] font-semibold text-[#1C4980]">
            Remove {type === 'alert' ? 'Alert' : 'Collection'}
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[#1C4980]">
            This action will permanently delete the {type} and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div>
          <div className="flex justify-end gap-3 mt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[14px] font-medium text-[#1C4980] border border-[#EAF0FC] rounded"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-[14px] font-medium text-white bg-[#D63500] rounded disabled:opacity-50"
              disabled={isDeleting}
            >
              {isDeleting ? "Removing..." : "Remove permanently"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
