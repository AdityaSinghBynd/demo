import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCollection } from "@/redux/Collections/CollectionThunk";
import { clearErrors } from "@/redux/Collections/CollectionSlice";
import { AppDispatch, RootState } from "@/store/store";
import { CreateNewCollection } from "@/redux/Collections/types";
import { toast } from 'react-toastify';
import { scheduleFormatToCron } from '@/utils/utils';

interface CreateNewCollectionPayload extends Omit<CreateNewCollection, 'schedule'> {
  schedule: any;
}

interface CollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownerId: string;
}

export function CollectionModal({
  isOpen,
  onClose,
  ownerId,
}: CollectionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => ({
    loading: state.collections.loading.create,
    error: state.collections.error.create,
  }));

  const [formData, setFormData] = useState<CreateNewCollection>({
    collectionDescription: "",
    collectionName: "",
    schedule: "Daily",
    email: "",
    ownerId,
  });

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    [],
  );

  const setFrequency = useCallback(
    (schedule: CreateNewCollection["schedule"]) => {
      setFormData((prev) => ({ ...prev, schedule }));
    },
    [],
  );

  const resetForm = useCallback(() => {
    setFormData({
      collectionDescription: "",
      collectionName: "",
      schedule: "Daily",
      email: "",
      ownerId,
    });
    dispatch(clearErrors());
  }, [dispatch, ownerId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const toastId = toast.loading("Creating Collection...");

      const payload: CreateNewCollectionPayload = {
        ...formData,
        collectionName: formData.collectionName.trim(),
        email: formData.email.trim(),
        ownerId: ownerId,
        schedule: scheduleFormatToCron(formData.schedule),
      };

      const result = await dispatch(createCollection(payload)).unwrap();

      toast.update(toastId, {
        render: "Collection Created.",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      resetForm();
      onClose();
    } catch (err: any) {
      const toastId = toast.loading("Creating Collection...");
      console.error("Error creating collection:", err);
      toast.update(toastId, {
        render: "Oops, something went wrong",
        type: "error",
        isLoading: false,
        autoClose: 2000,
      });
    }
  };

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  const getFrequencyText = useCallback((schedule: string) => {
    switch (schedule) {
      case "Daily":
        return "day at 3:30 AM";
      case "Weekly":
        return "Monday at 9:00 AM";
      case "Monthly":
        return "1st of the month at 9:00 AM";
      default:
        return "";
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] p-3">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">
            Create New Collection
          </DialogTitle>
          <DialogDescription className="text-[#4E5971] text-[12px]">
            e.g. A "Fintech Monitoring" Collection delivers a weekly summary
            every Monday at 9 AM.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="collectionName" className="text-sm font-normal">
              Name
            </label>
            <Input
              id="collectionName"
              name="collectionName"
              placeholder="Enter collection name"
              value={formData.collectionName}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="h-12 focus-within:border-[#004ce6] shadow-none border-[#eaf0fc]"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="collectionName" className="text-sm font-normal">
              Description
            </label>
            <Input
              id="collectionDescription"
              name="collectionDescription"
              placeholder="Enter collection description"
              value={formData.collectionDescription}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="h-12 focus-within:border-[#004ce6] shadow-none border-[#eaf0fc]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-normal">Frequency</label>
            <div className="relative flex rounded-lg bg-[#f7f9fe] p-1 border-[#eaf0fc]">
              <motion.div
                className="absolute inset-0 z-0"
                initial={false}
                animate={{
                  x:
                    formData.schedule === "Daily"
                      ? 0
                      : formData.schedule === "Weekly"
                        ? "33.33%"
                        : "66.66%",
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              >
                <div className="h-full w-[33.33%] rounded-md bg-white border shadow-sm" />
              </motion.div>
              {["Daily", "Weekly", "Monthly"].map((option) => (
                <button
                  key={option}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    setFrequency(option as CreateNewCollection["schedule"])
                  }
                  className={`relative z-10 flex-1 rounded-md px-3 py-2 text-sm transition-colors ${formData.schedule === option
                      ? "text-black"
                      : "text-muted-foreground hover:text-primary"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Updates every {getFrequencyText(formData.schedule)}
            </p>
          </div>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-normal">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Provide the email where you want to be alerted"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="h-12 focus-within:border-[#004ce6] shadow-none border-[#eaf0fc]"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="flex gap-2 items-center justify-center bg-[#004CE6] hover:bg-[#004CE6]/90"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
