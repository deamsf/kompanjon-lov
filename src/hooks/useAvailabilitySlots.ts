import { useState, useEffect } from "react";
import { format, startOfDay, endOfDay } from "date-fns";
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

        // Format dates properly for PostgreSQL timestamp
        const startDate = startOfDay(weekStart);
        const endDate = endOfDay(new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000));
        
        const { data, error } = await supabase
          .from("availability_slots")
          .select("*")
          .gte("start_time", startDate.toISOString())
          .lte("start_time", endDate.toISOString())
          .eq("user_id", session.user.id);

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
        console.error("Error fetching availability slots:", error);
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