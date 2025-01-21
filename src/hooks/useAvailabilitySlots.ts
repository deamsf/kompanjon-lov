import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useAvailabilitySlots = (weekStart: Date) => {
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<Map<string, string[]>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartSlot, setDragStartSlot] = useState<string | null>(null);
  const [currentDaySlots, setCurrentDaySlots] = useState<Set<string>>(new Set());
  const [dragStartDay, setDragStartDay] = useState<Date | null>(null);

  useEffect(() => {
    fetchSavedSlots();
  }, [weekStart]);

  const fetchSavedSlots = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in to view availability slots");
        return;
      }

      const weekEndDate = new Date(weekStart);
      weekEndDate.setDate(weekEndDate.getDate() + 7);
      
      const { data, error } = await supabase
        .from("availability_slots")
        .select("*")
        .eq("user_id", session.user.id)
        .gte("start_time", format(weekStart, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"))
        .lt("end_time", format(weekEndDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"));

      if (error) throw error;

      const slotsMap = new Map<string, string[]>();
      data?.forEach(slot => {
        const slotKey = `${format(parseISO(slot.start_time), "yyyy-MM-dd")}-${format(parseISO(slot.start_time), "HH:mm")}`;
        slotsMap.set(slotKey, slot.partner_categories);
      });
      setSelectedTimeSlots(slotsMap);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch availability slots");
    }
  };

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