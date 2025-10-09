import { adminClient } from "@/lib/sanity/client";
import { WorkoutPayload } from "@/types/requests";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { _id, userId, date, duration, exercises, status, title, notes, calendarEventId } = body;

    // Validate required fields based on status
    if (!userId || !date || !exercises) {
      return Response.json(
        { error: "Missing required fields: userId, date, exercises" },
        { status: 400 }
      );
    }

    // Default to completed if no status provided (backward compatibility)
    const workoutStatus = status || "completed";

    // Create the workout document
    const workoutDoc: WorkoutPayload = {
      _type: "workout",
      userId,
      status: workoutStatus,
      date,
      exercises,
    };

    // Add optional fields
    if (duration) workoutDoc.duration = duration;
    if (title) workoutDoc.title = title;
    if (notes) workoutDoc.notes = notes;
    if (calendarEventId) workoutDoc.calendarEventId = calendarEventId;

    let workout;
    if (_id) {
      // Update existing workout
      const updateDoc = { ...workoutDoc, _id };
      workout = await adminClient.createOrReplace(updateDoc);
    } else {
      // Create new workout
      workout = await adminClient.create(workoutDoc);
    }

    return Response.json(
      { 
        message: _id ? "Workout updated successfully" : "Workout saved successfully", 
        workoutId: workout._id 
      },
      { status: _id ? 200 : 201 }
    );
  } catch (error) {
    console.error("Error saving workout:", error);
    return Response.json(
      { error: "Failed to save workout" },
      { status: 500 }
    );
  }
}
