import { useState, useCallback, memo } from "react";
import { Plus, Tag, ArrowLeft } from "lucide-react";
import { CollectionModal } from "@/components/Modals/Collections";
import  CreateAlertModal  from "@/components/Modals/Alerts";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface SubHeaderProps {
  variant?: 'home' | 'collection' | 'alert';
  showDescription?: boolean;
  onCreate?: () => void;
  collectionData?: any;
  alertData?: any;
}

const SubHeader = memo(({
  variant = 'home',
  showDescription = true,
  collectionData,
  alertData,
  onCreate
}: SubHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  const collectionId = collectionData?.id

  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    onCreate?.();
  }, [onCreate]);

  const handleBackNavigation = useCallback(() => {
    router.back();
  }, [router]);

  const renderHeaderContent = useCallback(() => {
    switch (variant) {
      case 'home':
        return (
          <>
            <Tag className="h-5 w-5" />
            <p className="text-[#001742] font-medium text-[20px]">
              Your Collections
            </p>
          </>
        );
      case 'collection':
        return (
          <div className="flex items-center justify-start gap-3">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer"
              onClick={handleBackNavigation}
              role="button"
              aria-label="Go back"
            />
            <p className="text-[#001742] font-medium text-[20px]">
              {collectionData?.collectionName}
            </p>
          </div>
        );
      case 'alert':
        return (
          <div className="flex items-center justify-start gap-3">
            <ArrowLeft
              className="h-6 w-6 cursor-pointer"
              onClick={handleBackNavigation}
              role="button"
              aria-label="Go back"
            />
            <p className="text-[#001742] font-medium text-[20px]">
              <span className="text-[#9BABC7]">{alertData?.collection.collectionName} /</span> {alertData?.title}
            </p>
          </div>
        );
      default:
        return null;
    }
  }, [variant, handleBackNavigation, collectionData, alertData]);

  const buttonText = variant === 'home' ? 'New collection' : 'New alert';
  const showButton = variant === 'home' || variant === 'collection';

  return (
    <>
      <div className="flex items-center justify-between py-3 h-[80px]">
        <div>
          <div className="flex w-full items-center justify-start gap-2">
            {renderHeaderContent()}
          </div>
          {showDescription && variant === 'home' && (
            <p className="text-[#4E5971]">
              A Collection is a personalized group of alerts that monitors
              specific topics, events, or data sources.
            </p>
          )}
        </div>
        {showButton && (
          <button
            onClick={handleModalOpen}
            className="flex items-center justify-center px-5 py-2.5 gap-2 bg-[#004CE6] text-white rounded-[8px]"
            aria-label={buttonText}
          >
            {buttonText}
            <Plus className="h-5 w-5" />
          </button>
        )}
      </div>

      {variant === 'home' ? (
        <CollectionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          ownerId={session?.user?.id || ""}
        />
      ) : variant === 'collection' ? (
        <CreateAlertModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          ownerId={session?.user?.id || ""}
          collectionId={collectionId}
        />
      ) : null}
    </>
  );
});

SubHeader.displayName = 'SubHeader';

export default SubHeader;