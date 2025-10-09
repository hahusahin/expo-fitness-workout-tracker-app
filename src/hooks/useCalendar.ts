import { useState, useCallback } from "react";
import * as Calendar from "expo-calendar";
import { Platform } from "react-native";

export interface WorkoutCalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  exercises: string[];
  location?: string;
  notes?: string;
}

export const useCalendar = () => {
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      const granted = status === "granted";
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error("Error requesting calendar permissions:", error);
      return false;
    }
  }, []);

  const getDefaultCalendar = useCallback(async () => {
    try {
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) return null;
      }

      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT
      );

      // Find the default calendar
      let defaultCalendar = calendars.find((cal) =>
        Platform.OS === "ios"
          ? cal.source?.type === Calendar.SourceType.LOCAL ||
            cal.source?.type === Calendar.SourceType.CALDAV
          : cal.isPrimary
      );

      // Fallback to first writable calendar
      if (!defaultCalendar) {
        defaultCalendar = calendars.find((cal) => cal.allowsModifications);
      }

      return defaultCalendar || calendars[0];
    } catch (error) {
      console.error("Error getting default calendar:", error);
      return null;
    }
  }, [hasPermission, requestPermissions]);

  const buildEventNotes = useCallback(
    (workoutEvent: WorkoutCalendarEvent): string => {
      let notes = workoutEvent.notes || "";

      if (workoutEvent.exercises && workoutEvent.exercises.length > 0) {
        notes += "\n\nPlanned Exercises:\n";
        workoutEvent.exercises.forEach((exercise, index) => {
          notes += `${index + 1}. ${exercise}\n`;
        });
      }

      notes += "\n📱 Created with Fitness Tracker App";

      return notes.trim();
    },
    []
  );

  const createWorkoutEvent = useCallback(
    async (workoutEvent: WorkoutCalendarEvent): Promise<string | null> => {
      try {
        const calendar = await getDefaultCalendar();
        if (!calendar) {
          throw new Error("No available calendar found");
        }

        const eventDetails = {
          title: workoutEvent.title || "Scheduled Workout",
          startDate: workoutEvent.startDate,
          endDate: workoutEvent.endDate,
          location: workoutEvent.location || "Gym",
          notes: buildEventNotes(workoutEvent),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          calendarId: calendar.id,
        };

        const eventId = await Calendar.createEventAsync(
          calendar.id,
          eventDetails
        );
        return eventId;
      } catch (error) {
        console.error("Error creating calendar event:", error);
        throw error;
      }
    },
    [getDefaultCalendar, buildEventNotes]
  );

  const deleteWorkoutEvent = useCallback(
    async (eventId: string): Promise<void> => {
      try {
        await Calendar.deleteEventAsync(eventId);
      } catch (error) {
        console.error("Error deleting calendar event:", error);
        throw error;
      }
    },
    []
  );

  const hasCalendarPermissions = useCallback(async (): Promise<boolean> => {
    const { status } = await Calendar.getCalendarPermissionsAsync();
    return status === "granted";
  }, []);

  const getAllCalendars = useCallback(async () => {
    try {
      if (!hasPermission) {
        const granted = await requestPermissions();
        if (!granted) return [];
      }

      return await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    } catch (error) {
      console.error("Error getting calendars:", error);
      return [];
    }
  }, [hasPermission, requestPermissions]);

  return {
    hasPermission,
    requestPermissions,
    createWorkoutEvent,
    deleteWorkoutEvent,
    hasCalendarPermissions,
    getAllCalendars,
  };
};
