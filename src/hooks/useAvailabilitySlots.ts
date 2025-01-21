import { useState, useEffect } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAvailabilitySlots = (weekStart: Date) => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Map<string, string[]>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
  const [dragStartDay, setDragStartDay] = useState<Date | null>(null);
  const [currentDaySlots, setCurrentDaySlots] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchAvailabilitySlots = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const startOfWeek = format(weekStart, "yyyy-MM-dd");
        const endOfWeek = format(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000), "yyyy-MM-dd");

        const { data, error } = await supabase
          .from("availability_slots")
          .select("*")
          .gte("start_time", `${startOfWeek}T00:00:00Z`)
          .lte("start_time", `${endOfWeek}T23:59:59Z`);

        if (error) throw error;

        const slotsMap = new Map<string, string[]>();
        data?.forEach(slot => {
          const date = format(new Date(slot.start_time), "yyyy-MM-dd");
          const time = format(new Date(slot.start_time), "HH:mm");
          const slotKey = `${date}-${time}`;
          slotsMap.set(slotKey, slot.partner_categories);
        });

        setSelectedTimeSlots(slotsMap);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch availability slots");
      }
    };

    fetchAvailabilitySlots();
  }, [weekStart]);

  return {
    selectedTimeSlots,
    setSelectedTimeSlots,
    isDragging,
    setIsDragging,
    dragStartSlot,
    setDragStartSlot,
    currentDaySlots,
    setCurrentDaySlots,
    dragStartDay,
    setDragStartDay,
  };
};