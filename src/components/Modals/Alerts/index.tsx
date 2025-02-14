"use client"

import { useState } from "react"
import { Bell, X, Wand2 } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SourceSelector from "./Source"
import { Textarea } from "@/components/ui/textarea"
import noPreview from '../../../../public/Images/noPreviewSVG.svg'
import MagicAiSVGIcon from '../../../../public/Images/MagicAiSVGIcon.svg'
import Image from "next/image"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/store/store"
import { createAlert, fetchAlerts, generateAlertPreview } from "@/redux/Alerts/AlertThunk"
import { AlertCategoryEnum, AlertTypeEnum, CreateAlert } from "@/redux/Alerts/types"
import { toast } from "react-toastify"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CreateAlertModalProps {
  isOpen: boolean
  onClose: () => void
  ownerId: string;
  collectionId: string;
}

export default function CreateAlertModal({ isOpen, onClose, ownerId, collectionId }: CreateAlertModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [alertType, setAlertType] = useState<AlertTypeEnum>(AlertTypeEnum.RECURRING_ALERTS)
  const [alertHeading, setAlertHeading] = useState("")
  const [alertDescription, setAlertDescription] = useState("")
  const [selectedTab, setSelectedTab] = useState("periodic")
  const [isLoading, setIsLoading] = useState(false)
  const [sourceData, setSourceData] = useState<any>(null)

  const handleTabChange = (value: string) => {
    if (value === "instant") {
      return;
    }
    setSelectedTab(value);
    setAlertType(value === "instant" ? AlertTypeEnum.INSTANT_ALERTS : AlertTypeEnum.RECURRING_ALERTS);
  };

  const handleSourceData = (data: any) => {
    setSourceData(data);
  };

  const resetForm = () => {
    setAlertHeading("");
    setAlertDescription("");
    setSelectedTab("periodic");
    setAlertType(AlertTypeEnum.RECURRING_ALERTS);
    setSourceData(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCreateAlert = async () => {
    if (!alertHeading.trim()) {
      toast.error("Please enter alert name");
      return;
    }

    if (!sourceData) {
      toast.error("Please select and configure a source");
      return;
    }

    try {
      setIsLoading(true);

      const alertData: CreateAlert = {
        title: alertHeading,
        alertType: alertType,
        query: alertDescription,
        alertCategory: sourceData.category,
        ...sourceData.data
      };

      await dispatch(createAlert({
        values: alertData,
        collectionId
      })).unwrap();

      await dispatch(fetchAlerts(collectionId));

      toast.success("Alert created successfully");
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to create alert");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePreview = async () => {
    if (!alertHeading.trim() || !sourceData) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const alertData: CreateAlert = {
        title: alertHeading,
        alertType: alertType,
        query: alertDescription,
        alertCategory: sourceData.category,
        ...sourceData.data
      };

      await dispatch(generateAlertPreview({
        values: alertData,
        collectionId
      })).unwrap();
    } catch (error: any) {
      toast.error(error.message || "Failed to generate preview");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0026731A]/30 backdrop-blur-sm z-50" onClick={handleOutsideClick}>
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-6xl max-h-[95vh] overflow-auto">
        <Card className="border shadow-lg h-full">
          <CardHeader className="flex flex-row items-center justify-between border-b border-[#eaf0fc] space-y-0 px-3 py-1">
            <h2 className="text-[20px] font-medium">Create Alert</h2>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-transparent"
              onClick={handleClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <div className="flex w-full min-h-[600px] bg-[#FFF]">
            <CardContent className="w-2/5 space-y-6 p-4 bg-[#FFF]">
              <div className="space-y-2">
                <Label htmlFor="heading" className="text-md font-normal">Name</Label>
                <Input
                  id="heading"
                  placeholder="Write alert name"
                  className="w-full shadow-none border-2 border-[#eaf0fc] bg-[#ffffff] focus:border-[#004ce6]"
                  value={alertHeading}
                  onChange={(e) => setAlertHeading(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label className="text-md font-normal">Alert type</label>
                <div className="relative flex rounded-lg bg-[#f7f9fe] p-1 border border-[#eaf0fc]">
                  <motion.div
                    className="absolute inset-0 z-0"
                    initial={false}
                    animate={{
                      x: selectedTab === "instant" ? "0%" : "50%"
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    <div className="h-full w-[50%] rounded-md bg-white border shadow-sm" />
                  </motion.div>

                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger asChild onClick={(e) => e.preventDefault()}>
                        <button
                          type="button"
                          className={`relative z-10 flex-1 rounded-md px-2 py-1 text-sm transition-colors flex items-center justify-center gap-2 cursor-not-allowed opacity-60
                                                        ${selectedTab === "instant" ? "text-black" : "text-muted-foreground"}`}
                        >
                          <Bell className="h-4 w-4" />
                          Instant Alerts
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-white px-3 py-1.5 text-sm text-gray-700 border border-gray-200 shadow-lg rounded-md"
                        sideOffset={5}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          <p className="font-medium">Coming soon</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <button
                    type="button"
                    onClick={() => handleTabChange("periodic")}
                    className={`relative z-10 flex-1 rounded-md px-2 py-1 text-sm transition-colors flex items-center justify-center gap-2
                                            ${selectedTab === "periodic" ? "text-black" : "text-muted-foreground hover:text-primary"}`}
                  >
                    <Bell className="h-4 w-4" />
                    Periodic Alerts
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <SourceSelector onSourceData={handleSourceData} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-md font-normal">Describe your alert</Label>
                <Textarea
                  id="description"
                  placeholder="e.g Tell me the causes of fluctuations"
                  className="min-h-[100px] shadow-none border-2 border-[#eaf0fc] bg-[#ffffff] resize-none"
                  value={alertDescription}
                  onChange={(e) => setAlertDescription(e.target.value)}
                />
              </div>
            </CardContent>

            <div className="relative w-3/5 bg-[#f7f9fe] border-l border-[#eaf0fc]">
              <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/50">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Preview</h3>
                    {/*  <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="border flex gap-1 px-4 py-3 items-center justify-center border-[#eaf0fc] bg-transparent text-black"
                                            onClick={handleGeneratePreview}
                                            disabled={isLoading}
                                        >
                                            <Image src={MagicAiSVGIcon} alt="wand" className="h-4 w-4 mr-2" />
                                            Generate
                                        </Button> */}
                  </div>
                  <div className='flex flex-col gap-3 items-center justify-center h-full'>
                    <label>
                      <Image src={noPreview} alt="noPreview" />
                    </label>
                    <p className="text-sm text-[#4e5971]">Fill the details to see preview</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <CardFooter className="flex justify-end px-3 py-2 bg-transparent border-t border-[#eaf0fc]">
            <Button
              className="bg-[#004CE6] hover:bg-[#004CE6]/90"
              onClick={handleCreateAlert}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create alert"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

