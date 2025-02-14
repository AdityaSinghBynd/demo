"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/components/SubHeader";
import AlertDetails from "@/components/AlertDetails";
import { AlertSummary } from "@/components/AlertSummary";
import type { UpdateEntry, AlertDetail } from "@/types/product-updates"
import { AppDispatch, RootState } from "@/store/store";
import { useDispatch, useSelector } from "react-redux";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

const initialUpdates: UpdateEntry[] = [
  {
    date: "11 Dec, 2024",
    isExpanded: true,
    preview: {
      keyTakeaway:
        "In the past two months, significant natural disasters have included Hurricane Helene in North Carolina and Super Typhoon Pepito in the Philippines, both causing widespread devastation and challenging local and federal response efforts.",
      details: [
        {
          title: "Hurricane Helene in North Carolina",
          sections: [
            {
              title: "Overview and Impact",
              content: [
                "Hurricane Helene, a Category 4 storm that made landfall on September 26, 2024, resulted in substantial destruction, claiming around 227 lives and causing massive power outages (SOURCE_1).",
                "The hurricane's aftermath has sparked discussion about the inefficiency of federal relief efforts, and reliance on local communities for immediate help (SOURCE_1).",
              ],
            },
          ],
        },
      ],
    },
  },
  {
    date: "11 Nov, 2024",
    isExpanded: false,
    preview: { keyTakeaway: "", details: [] },
  },
  {
    date: "11 Sept, 2024",
    isExpanded: false,
    preview: { keyTakeaway: "", details: [] },
  },
]

const alertDetails: AlertDetail = {
  type: "Periodic Alert",
  source: "LinkedIn",
  companyLinkedInUrl: "www.jio.com",
  companyName: "Bharti Airtel",
  targets: ["Conference updates", "Product launch"],
  prompt: "Some detailed prompt of the alert very detailed",
}

export default function AlertsPage() {
  const params = useParams();
  const slug = params.slug;
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const [updates, setUpdates] = useState<UpdateEntry[]>(initialUpdates)
  const { items: collections, loading: collectionsLoading } = useSelector(
    (state: RootState) => state.collections,
  );

  const { items: alerts, loading: alertsLoading } = useSelector(
    (state: RootState) => state.alerts,
  );
  const [selected, setSelected] = useState("instant");

  const handleToggle = (value: "instant" | "periodic") => {
    setSelected(value);
  };

  const alertData = alerts.find(
    (collection) => collection.id === slug,
  );

  const handleToggleExpand = (date: string) => {
    setUpdates(
      updates.map((update) => ({
        ...update,
        isExpanded: update.date === date ? !update.isExpanded : update.isExpanded,
      })),
    )
  }

  return (
    <div className="min-h-screen w-full flex gap-1 px-2 py-4 bg-[#fbfdff]">
      <div className="flex flex-col w-3/4 px-4 gap-2">
        <div className="flex flex-col gap-1">
          <SubHeader alertData={alertData} variant="alert" />
        </div>
        <AlertSummary updates={ []} onToggleExpand={handleToggleExpand} />

      </div>
      <div className="w-1/4">
        <AlertDetails 
        alertData={alertData}
        />
      </div>
    </div>
  );
}
