import { adminClient } from "@/lib/sanity/client";
import { WorkoutPayload } from "@/types/requests";

export async function POST(request: Request) {
  try {
    const body: WorkoutPayload = await request.json();

    // Validate required fields
    if (!body.userId || !body.date || !body.duration || !body.exercises) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the workout document in Sanity
    const workout = await adminClient.create({
      _type: "workout",
      userId: body.userId,
      date: body.date,
      duration: body.duration,
      exercises: body.exercises,
    });

    return Response.json(
      { message: "Workout saved successfully", workoutId: workout._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving workout:", error);
    return Response.json(
      { error: "Failed to save workout" },
      { status: 500 }
    );
  }
}
