'use client';

import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { AppDispatch, RootState } from '@/store/store';
import { fetchCollections } from '@/redux/Collections/CollectionThunk';
import { Collection } from '@/redux/Collections/types';
import SubHeader from '@/components/SubHeader';
import CollectionCard from '@/components/Card/Collection';
import RightPanel from '@/components/RightPanel';
import noDocument from '../../../public/Images/noDocumentSVG.svg';
import CardSkeleton from '../Skeleton/Card';
import { calculateNextExecutions } from "@/utils/utils";

export default function HomeLayout() {
  const { data: session } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { items: collections, loading, error } = useSelector((state: RootState) => state.collections);
  const [nextExecutionTimes, setNextExecutionTimes] = useState<
    {
      id: string;
      title: string;
      nextDate: string;
      willDeliveryHappen: boolean;
    }[]
  >([]);

  useEffect(() => {
    if (!session?.user?.id) return;

    dispatch(fetchCollections(session.user.id))
      .unwrap()
      .catch((err) => {
        console.error('Failed to fetch collections:', err);
      });
  }, [dispatch, session?.user?.id]);

  useEffect(() => {
    if (collections) {
      const nextTimes = calculateNextExecutions(collections);
      setNextExecutionTimes(
        nextTimes as {
          id: string;
          title: string;
          nextDate: string;
          willDeliveryHappen: boolean;
        }[]
      );
    }
  }, [collections]);

  const CollectionsGrid = useMemo(() => {
    if (loading.fetch) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      );
    }

    if (collections.length === 0 || error.fetch) {
      return (
        <div className="flex-1 flex flex-col gap-3 items-center justify-center">
          <Image src={noDocument} alt="noDocument" width={120} height={120} priority />
          <p className="text-[#9babc7]">No collection created</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto scrollbar-hide pb-[100px]">
        {collections.map((collection: Collection, index: number) => {
          const executionTime = nextExecutionTimes?.find(time => time.id === collection.id);
          return (
            <div key={index}>
              <CollectionCard
                collection={collection}
                nextExecutionTime={executionTime}
              />
            </div>
          );
        })}
      </div>
    );
  }, [collections, loading.fetch, error.fetch, nextExecutionTimes]);

  return (
    <div className="min-h-screen h-screen w-full flex gap-1 px-2 py-4 bg-[#FAFCFF]">
      <div className="flex flex-col w-3/4 gap-6 px-4 h-full">
        <SubHeader collectionData={" "} variant="home" showDescription={true} />
        {CollectionsGrid}
      </div>
      <div className="w-1/4 h-full">
        <RightPanel nextExecutionTimes={nextExecutionTimes} />
      </div>
    </div>
  );
}