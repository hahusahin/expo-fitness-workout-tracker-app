export interface WorkoutPayload {
  _type: "workout";
  userId: string;
  date: string;
  duration: number;
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
