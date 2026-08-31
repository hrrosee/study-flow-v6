import React, { useRef, useState, useLayoutEffect } from 'react';
import { Pin } from 'lucide-react';
import { Topic } from '../App';

interface CardTopicHeaderProps {
  topic: Topic;
  theme: any;
  iconText?: string;
  IconComp: any;
  countText: string;
}

export const CardTopicHeader: React.FC<CardTopicHeaderProps> = ({
  topic,
  theme,
  iconText,
  IconComp,
  countText,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [shouldFloatPin, setShouldFloatPin] = useState(false);

  useLayoutEffect(() => {
    if (!topic.isPinned) {
      setShouldFloatPin(false);
      return;
    }

    function checkSpace() {
      if (containerRef.current && titleRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const titleScrollWidth = titleRef.current.scrollWidth;
        const PIN_BADGE_WIDTH = 58; // Approx width of [📌 Pinned] badge + gap

        // If title text + badge exceeds available container width, float it to top-left!
        if (titleScrollWidth + PIN_BADGE_WIDTH > containerWidth) {
          setShouldFloatPin(true);
        } else {
          setShouldFloatPin(false);
        }
      }
    }

    checkSpace();

    const resizeObserver = new ResizeObserver(() => {
      checkSpace();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', checkSpace);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkSpace);
    };
  }, [topic.title, topic.isPinned]);

  return (
    <>
      {/* Dynamic Top Border Floating Pin Badge (positioned directly on Card's top-left border) */}
      {topic.isPinned && shouldFloatPin && (
        <div className="absolute top-0 -translate-y-1/2 left-3 z-30 flex items-center gap-1 px-1.5 py-0.5 rounded-[5px] bg-amber-50 border border-amber-200/90 text-rose-600 text-[9.5px] font-bold shadow-2xs select-none pointer-events-none">
          <Pin className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
          <span>Pinned</span>
        </div>
      )}

      {/* Left: Icon Box + Title & Subtext */}
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        {/* Subject Icon Box */}
        <div className="relative shrink-0 mt-0.5">
          <div className={`w-8.5 h-8.5 rounded-xl ${theme.cardIconBg} preserve-color flex items-center justify-center shrink-0 shadow-2xs`}>
            {iconText ? (
              <span className="text-white text-base font-black font-serif leading-none preserve-color">{iconText}</span>
            ) : (
              <IconComp className={`w-4 h-4 ${theme.cardIconColor} preserve-color stroke-[2.2]`} />
            )}
          </div>
        </div>

        {/* Title & Integrated Badges */}
        <div ref={containerRef} className="flex flex-col min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 flex-nowrap">
            <h4
              ref={titleRef}
              className="text-[12.5px] font-semibold font-serif text-[#0F172A] dark:text-slate-100 leading-snug truncate pl-0.5"
            >
              {topic.title}
            </h4>
            {/* Dynamic Inline Pin Badge (when space is available) */}
            {topic.isPinned && !shouldFloatPin && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[5px] bg-amber-50 border border-amber-200/80 text-rose-600 text-[9.5px] font-bold shadow-2xs shrink-0 select-none">
                <Pin className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                <span>Pinned</span>
              </span>
            )}
          </div>
          <span className="text-[10.5px] font-normal text-slate-400 mt-0.5 flex items-center gap-1.5">
            <span>{countText}</span>
          </span>
        </div>
      </div>
    </>
  );
};
