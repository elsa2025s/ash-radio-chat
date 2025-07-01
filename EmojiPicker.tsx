"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dynamic from "next/dynamic";
import { useState } from "react";

// Import dynamique pour éviter les erreurs SSR
const EmojiPickerComponent = dynamic(() => import("emoji-picker-react"), {
  ssr: false,
  loading: () => (
    <div className="w-[350px] h-[400px] flex items-center justify-center">
      Chargement...
    </div>
  ),
});

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  trigger: React.ReactNode;
}

export default function EmojiPicker({
  onEmojiSelect,
  trigger,
}: EmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiClick = (emojiData: any) => {
    onEmojiSelect(emojiData.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-[350px] p-0 border-0 shadow-lg"
        side="top"
        align="start"
      >
        <EmojiPickerComponent
          onEmojiClick={handleEmojiClick}
          width={350}
          height={400}
          searchDisabled={false}
          skinTonesDisabled={false}
          previewConfig={{
            showPreview: false,
          }}
          lazyLoadEmojis={true}
        />
      </PopoverContent>
    </Popover>
  );
}
