import { FitnessCenter } from "@/shared/types/requests";

interface LocationCoords {
  latitude: number;
  longitude: number;
}

interface SearchNearbyParams {
  location: LocationCoords;
  radius?: number;
  maxResults?: number;
}

/**
 * Fetches nearby fitness centers using Google Places API
 */
export async function searchNearbyFitnessCenters({
  location,
  radius = 5000,
  maxResults = 5,
}: SearchNearbyParams): Promise<FitnessCenter[]> {
  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Google Places API key is not configured");
  }

  const placesUrl = `https://places.googleapis.com/v1/places:searchNearby?key=${apiKey}`;

  const requestBody = {
    locationRestriction: {
      circle: {
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        radius,
      },
    },
    includedTypes: ["fitness_center", "gym"],
    maxResultCount: maxResults,
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
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.error?.message || `Failed to fetch fitness centers: ${response.status}`
    );
  }

  const data = await response.json();

  if (!data.places || !Array.isArray(data.places)) {
    return [];
  }

  return data.places.map((place: any) => ({
    id: place.id,
    name: place.displayName?.text || "Unknown Gym",
    address: place.formattedAddress || "",
    location: place.location,
    photo: place.photos?.[0],
    phoneNumber: place.nationalPhoneNumber,
    website: place.websiteUri,
    openNow: place.currentOpeningHours?.open_now,
    rating: place.rating,
  }));
}
