"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, RefreshCcw, Linkedin, Globe } from "lucide-react"
import Image from "next/image"

interface AlertTarget {
  name: string
}

interface CompanyURL {
  name: string
  url: string
  logo: string
}

interface AlertDetailsProps {
  alertData?: any;
  onEdit?: () => void
}

export default function AlertDetails({
  alertData,
  onEdit,
}: AlertDetailsProps) {
  return (
    <Card className="w-full rounded-[8px] shadow-none border-2 border-[#eaf0fc] p-4 bg-[#f7f9fe]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[20px] font-medium text-[#001742]">Alert details</h1>
       {/*<Button variant="ghost" size="icon" onClick={onEdit}>
          <Pencil className="w-4 h-4" />
          <span className="sr-only">Edit alert details</span>
        </Button> */}
      </div>

      <div className="flex flex-col gap-4  items-start justify-center">
        <section>
          <h2 className="text-[16px] font-medium text-[#001742]">Alert type</h2>
          <Badge variant="secondary" className=" bg-[#FBFDFF] border border-[#eaf0fc] p-2 hover:bg-[#FBFDFF] shadow-custom-blue text-[#4e5971] font-medium gap-2">
            <RefreshCcw className="w-4 h-4" />
            {alertData?.alertType}
          </Badge>
        </section>

        <section>
          <h2 className="text-[16px] font-medium text-[#001742]">Source</h2>
          <Badge variant="secondary" className=" bg-[#FBFDFF] border border-[#eaf0fc] p-2 hover:bg-[#FBFDFF] shadow-custom-blue text-[#4e5971] font-medium gap-2">
            <Globe className="w-4 h-4" />
            {alertData?.alertCategory}
          </Badge>
        </section>

        <section>
          <h2 className="text-[16px] font-medium text-[#001742]">URL</h2>
          <div className="space-y-1 mt-1">
            {alertData?.["urls"]?.map((alert: string, index: number) => (
              <Badge key={index} variant="secondary" className=" bg-[#FBFDFF] border border-[#eaf0fc] p-2 hover:bg-[#FBFDFF] shadow-custom-blue font-medium gap-2 w-full justify-start">
                {alert}
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[16px] font-medium text-[#001742]">Alert targets</h2>
          <div className="space-y-1 mt-1">
            {alertData?.["linkedInCustomCategories"]?.map((target: { name: string }, index: number) => (
              <p key={index} className="text-[#4e5971] text-[14px]">
                {target.name}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-[16px] font-medium text-[#001742]">Alert prompt</h2>
          <p className="text-[#4e5971] text-[14px]">{alertData?.query}</p>
        </section>
      </div>
    </Card>
  )
}

