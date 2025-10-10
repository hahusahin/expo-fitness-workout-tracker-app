import { FitnessCenter } from "@/shared/types/requests";

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const latitude = url.searchParams.get("latitude");
    const longitude = url.searchParams.get("longitude");

    if (!latitude || !longitude) {
      return Response.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY!;

    const placesUrl = `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`;
    const requestBody = {
      locationRestriction: {
        circle: {
          center: {
            latitude: latitude,
            longitude: longitude,
          },
          radius: 5000,
        },
      },
      includedTypes: ["fitness_center"],
      maxResultCount: 5,
    };

    const response = await fetch(placesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.rating,places.formattedAddress,places.location,places.photos,places.nationalPhoneNumber,places.currentOpeningHours,places.websiteUri",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorDetail = await response.json();
      throw new Error(
        `HTTP error! Status: ${response.status}. Detail: ${errorDetail.error.message}`
      );
    }

    const data = await response.json();

    const fitnessCenters: FitnessCenter[] = data?.places?.map((place: any) => ({
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      location: place.location,
      photo: place.photos?.[0],
      phoneNumber: place.nationalPhoneNumber,
      website: place.websiteUri,
      openNow: place.currentOpeningHours?.open_now,
      rating: place.rating,
    }));

    return Response.json(fitnessCenters);
  } catch (error) {
    console.error("Error in nearest-gyms API:", error);
  }
}
