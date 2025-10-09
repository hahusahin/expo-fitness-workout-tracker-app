export interface WorkoutPayload {
  _id?: string; // Optional for updates
  _type: "workout";
  userId: string;
  date: string;
  duration?: number;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  title?: string;
  notes?: string;
  notificationSent?: boolean;
  calendarEventId?: string;
  exercises: {
    _type: "workoutExercise";
    _key: string;
    exercise: {
      _type: "reference";
      _ref: string;
    };
    sets: {
      _type: "set";
      _key: string;
      repetitions: number;
      weight: number;
      weightUnit: "lbs" | "kg";
    }[];
  }[];
}

export interface FitnessCenter {
  id: string;
  name: string;
  rating?: number;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  photo?: string;
  phoneNumber?: string;
  website?: string;
  openNow?: boolean;
}
