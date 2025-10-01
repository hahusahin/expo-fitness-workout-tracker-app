import { adminClient } from "@/lib/sanity/client";

export async function DELETE(request: Request) {
  try {
    const { workoutId } = await request.json();

    if (!workoutId) {
      return Response.json(
        { error: "Workout ID is required" },
        { status: 400 }
      );
    }

    const result = await adminClient.delete(workoutId);

    if (!result) {
      return Response.json(
        { error: "Failed to delete workout" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: "Workout deleted successfully",
      deletedId: result.id,
    });
  } catch (error) {
    console.error("Delete workout API error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
