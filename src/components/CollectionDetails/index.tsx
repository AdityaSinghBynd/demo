import React from "react";
import { Calendar, Mail, Info, Bell } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCollectionScheduleFrequency } from "@/utils/utils";
import Image from "next/image";
import noDocument from '../../../public/Images/noDocumentSVG.svg';
import { Collection } from "@/redux/Collections/types";

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}

interface CollectionDetailsProps {
  collections?: Collection | Collection[];
  className?: string;
  loading?: boolean;
}

const SkeletonLoader = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-6 bg-gray-300 rounded w-3/4"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
  </div>
);

const InfoSection: React.FC<InfoSectionProps> = ({
  title,
  children,
  className = "",
  loading = false
}) => (
  <div className={`px-2 py-1 ${className}`}>
    <h2 className="text-[16px] font-medium text-[#001742] mb-1">{title}</h2>
    {loading ? <SkeletonLoader /> : children}
  </div>
);

const CollectionDetails: React.FC<CollectionDetailsProps> = ({
  collections,
  className = "",
  loading = false
}) => {
  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(3)].map((_, index) => (
          <div className="bg-white border border-[#eaf0fc] p-3 rounded-md shadow-custom-blue w-full h-32">
            <div className="h-4 bg-[#F7F9FE] rounded w-1/2 animate-pulse mb-2"></div>
            <div className="h-4 bg-[#F7F9FE] rounded w-1/3 animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!collections) {
    return (
      <Card className="bg-[#f7f9fe] border border-[#eaf0fc] shadow-none">
        <CardContent className="flex flex-col gap-2 items-center justify-center text-center h-full p-4">
          <Image src={noDocument} alt="noDocument" width={100} height={100} priority />
          <p className="text-[#9babc7]">No collection details available</p>
        </CardContent>
      </Card>
    );
  }

  const collectionsArray = Array.isArray(collections) ? collections : [collections];

  if (collectionsArray.length === 0) {
    return (
      <Card className="bg-[#f7f9fe] border border-[#eaf0fc] shadow-none">
        <CardContent className="flex flex-col gap-2 items-center justify-center text-center h-full p-4">
          <Image src={noDocument} alt="noDocument" width={100} height={100} priority />
          <p className="text-[#9babc7]">No collection details available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {collectionsArray.map((collection) => (
        <Card
          key={collection.id}
          className="bg-[#f7f9fe] border border-[#eaf0fc] shadow-none"
        >
          <CardContent className="flex flex-col gap-2 bg-transparent p-4">
            <InfoSection title="Collection Info">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-gray-500 mt-1" />
                <p className="text-[#4e5971]">
                  {collection.collectionDescription || 'No description available'}
                </p>
              </div>
            </InfoSection>

            <InfoSection title="Frequency & Alerts">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span className="text-[#4e5971]">
                  Schedule: {getCollectionScheduleFrequency(collection.schedule)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="text-[#4e5971]">
                  Active Alerts: {collection.alerts?.length || 0}
                </span>
              </div>
            </InfoSection>

            <InfoSection title="Delivery email">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <span className="text-[#4e5971] break-all">
                  {collection.email || 'Email not provided'}
                </span>
              </div>
            </InfoSection>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CollectionDetails;