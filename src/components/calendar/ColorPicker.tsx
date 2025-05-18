
import React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const CALENDAR_COLORS = [
  "#4361ee", // Blue
  "#3a0ca3", // Indigo
  "#7209b7", // Purple
  "#f72585", // Pink
  "#ef233c", // Red
  "#fb8500", // Orange 
  "#ffb703", // Amber
  "#8ac926", // Green
  "#38b000", // Emerald
  "#4cc9f0", // Cyan
  "#073b4c", // Dark Blue
  "#6c757d", // Gray
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start"
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-6 gap-2">
          {CALENDAR_COLORS.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              className={`w-8 h-8 rounded-full cursor-pointer transition-transform hover:scale-110 ${color === colorOption ? 'ring-2 ring-primary ring-offset-2' : ''}`}
              style={{ backgroundColor: colorOption }}
              onClick={() => onChange(colorOption)}
              title={colorOption}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
