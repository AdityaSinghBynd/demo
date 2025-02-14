import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import type { UpdateEntry } from "@/types/product-updates";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import noDocument from '../../../public/Images/noDocumentSVG.svg';

interface AlertSummaryProps {
    updates: UpdateEntry[];
    onToggleExpand: (date: string) => void;
}

export function AlertSummary({ updates, onToggleExpand }: AlertSummaryProps) {
    if (updates.length === 0) {
        return (
            <div className="flex-1 flex flex-col gap-3 items-center justify-center">
                <Image src={noDocument} alt="noDocument" width={120} height={120} priority />
                <p className="text-[#9babc7]">No alert data available</p>
            </div>
        );
    }

    return (
        <div className="flex-1 border-r border-gray-200">
            {updates.map((update) => (
                <div key={update.date} className="border-b border-gray-200">
                    <button
                        onClick={() => onToggleExpand(update.date)}
                        className="flex w-full items-center justify-between px-6 py-4 hover:bg-gray-50"
                    >
                        <span className="font-medium">{update.date}</span>
                        {update.isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                        )}
                    </button>

                    {update.isExpanded && (
                        <div className="px-6 pb-4">
                            <div className="mb-4">
                                <div className="flex items-start justify-between">
                                    <h2 className="font-medium">Preview</h2>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="mt-2 text-gray-600">
                                    <span className="font-medium">Key Takeaway:</span> {update.preview.keyTakeaway}
                                </p>
                            </div>

                            {update.preview.details.map((detail, index) => (
                                <div key={index} className="mt-4">
                                    <h3 className="font-medium">{detail.title}</h3>
                                    {detail.sections.map((section, sIndex) => (
                                        <div key={sIndex} className="mt-3">
                                            <h4 className="text-gray-700">{section.title}</h4>
                                            <ul className="mt-2 space-y-2">
                                                {section.content.map((item, iIndex) => (
                                                    <li key={iIndex} className="text-gray-600">
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
