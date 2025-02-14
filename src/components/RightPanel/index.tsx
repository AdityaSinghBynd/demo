import { Bell, Tag } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from 'next/image';
import Link from 'next/link';
import noDocument from '../../../public/Images/noDocumentSVG.svg';
import { useMemo } from 'react';

interface ExecutionTime {
  id: string;
  title: string;
  nextDate: string;
  willDeliveryHappen: boolean;
}

interface RightPanelProps {
  nextExecutionTimes?: ExecutionTime[];
}

export default function RightPanel({ nextExecutionTimes = [] }: RightPanelProps) {
  const {
    items: collections,
    loading,
    error,
  } = useSelector((state: RootState) => state.collections);

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

  const UpcomingCollections = useMemo(() => {
    if (collections.length === 0) {
      return (
        <div className="flex-1 flex flex-col gap-2 items-center justify-center text-center" key="no-upcoming">
          <Image src={noDocument} alt="noDocument" width={100} height={100} priority />
          <p className="text-[#9babc7]">No upcoming collections present</p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col gap-2 mt-2 overflow-y-auto scrollbar-hide">
        {collections.map((collection, index) => {
          const executionTime = nextExecutionTimes?.find(time => time.id === collection.id);
          const formattedDate = executionTime ? formatDate(executionTime.nextDate) : 'Not scheduled';

          return (
            <div key={index}>
              <Link
                href={`/collection/${collection.id}`}
                className="group block"
              >
                <div className="p-3 bg-[#F7F9FE] rounded-lg border-2 border-[#eaf0fc] hover:bg-white">
                  <h2 className="text-[16px] font-medium text-navy-900">
                    {collection.collectionName}
                  </h2>
                  <p className="text-[14px] text-[#9babc7]">
                    {formattedDate}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    );
  }, [collections, nextExecutionTimes]);

  return (
    <div className="h-full w-full flex flex-col gap-2 p-3">
      <div className="h-1/2 min-h-0 w-full p-3 rounded-[12px] bg-[#F7F9FE] border border-[#eaf0fc] flex flex-col gap-1">
        <div className="flex w-full gap-2 items-center justify-start">
          <Tag className="h-5 w-5" />
          <p>Upcoming Collections</p>
        </div>
        {UpcomingCollections}
      </div>

      <div className="h-1/2 min-h-0 w-full p-3 rounded-[12px] bg-[#F7F9FE] border border-[#eaf0fc] flex flex-col gap-1 shadow-custom-blue">
        <div className="flex w-full gap-2 items-center justify-start">
          <Bell className="h-5 w-5" />
          <p>Recent Instant Alerts</p>
        </div>
        <div className="flex-1 flex flex-col gap-2 items-center justify-center text-center" key="no-alerts">
          <Image src={noDocument} alt="noDocument" width={100} height={100} priority />
          <p className="text-[#9babc7]">No recent instant alerts present</p>
        </div>
      </div>
    </div>
  );
}