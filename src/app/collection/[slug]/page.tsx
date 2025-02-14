"use client";

import { useEffect, useState } from "react";
import SubHeader from "@/components/SubHeader";
import AlertCard from "@/components/Card/Alert";
import CollectionDetails from "@/components/CollectionDetails";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { fetchAlerts } from "@/redux/Alerts/AlertThunk";
import { fetchCollections } from "@/redux/Collections/CollectionThunk";
import { useSession } from "next-auth/react";
import { Bell, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

export default function AlertsPage() {
  const params = useParams();
  const slug = params.slug;
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();

  const { items: alerts, loading: alertsLoading } = useSelector(
    (state: RootState) => state.alerts,
  );
  const { items: collections, loading: collectionsLoading } = useSelector(
    (state: RootState) => state.collections,
  );
  const [selected, setSelected] = useState("periodic");

  const handleToggle = (value: "instant" | "periodic") => {
    setSelected(value);
  };

  const collectionData = collections.find(
    (collection) => collection.id === slug,
  );


  const filteredAlerts = alerts?.filter((alert) => {
    if (selected === "instant") {
      return alert.alertType === "InstantAlerts";
    } else {
      return alert.alertType === "RecurringAlerts";
    }
  });

  useEffect(() => {
    if (slug) {
      dispatch(fetchAlerts(String(slug))).catch((error) => {
        console.error("Error loading alerts:", error);
      });
    }

    if (collections.length === 0 && session?.user?.id) {
      dispatch(fetchCollections(session.user.id)).catch((error) => {
        console.error("Error loading collections:", error);
      });
    }
  }, [dispatch, slug, collections.length, session?.user?.id]);

  return (
    <div className="min-h-screen w-full flex gap-1 px-2 py-4 bg-[#fbfdff]">
      <div className="flex flex-col w-3/4 px-4 gap-6">
        <div className="flex flex-col gap-1">
          <SubHeader collectionData={collectionData} variant="collection"/>
          <div className="relative inline-flex items-center rounded-[12px] bg-[#F8F9FE] p-1 max-w-fit text-sm">
            <motion.div
              className="absolute h-full rounded-[12px] bg-white shadow-custom-blue"
              initial={false}
              animate={{
                x: selected === "instant" ? 0 : "100%",
                width: selected === "instant" ? "50%" : "50%",
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
              }}
            />
            <button
              onClick={() => handleToggle("instant")}
              className={`relative z-10 flex w-[180px] items-center justify-center gap-2 rounded-full px-4 py-2.5 transition-colors ${
                selected === "instant" ? "text-[#1C1C1C]" : "text-[#9babc7]"
              }`}
            >
              <Bell className="h-4 w-4" />
              <span className="font-medium">Instant Alerts</span>
            </button>
            <button
              onClick={() => handleToggle("periodic")}
              className={`relative z-10 flex w-[180px] items-center justify-center gap-2 rounded-full px-4 py-2.5 transition-colors ${
                selected === "periodic" ? "text-[#1C1C1C]" : "text-[#9babc7]"
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              <span className="font-medium">Periodic Alerts</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {!alertsLoading && filteredAlerts?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
              <div className="text-gray-500 mb-2">
                {selected === "instant" ? (
                  <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                ) : (
                  <RefreshCw className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                )}
                <h3 className="text-lg font-medium mb-1">No {selected} alerts found</h3>
                <p className="text-sm text-gray-400">
                  {selected === "instant"
                    ? "You haven't created any instant alerts yet"
                    : "You haven't created any periodic alerts yet"}
                </p>
              </div>
            </div>
          ) : (
            filteredAlerts?.map((item) => <AlertCard key={item.id} alert={item} />)
          )}
        </div>
      </div>
      <div className="w-1/4">
        <CollectionDetails collections={collectionData} />
      </div>
    </div>
  );
}