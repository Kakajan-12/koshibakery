// Подсказки адресов по Лондону от photon.komoot.io (OpenStreetMap) — для регистрации и профиля

export interface PlaceFeature {
    geometry: { coordinates: [number, number] };
    properties: { housenumber?: string; street?: string; name?: string; city?: string; state?: string; postcode?: string };
}

// Выбранный из подсказок адрес: улица, город, индекс и координаты — от одного и того же места
export interface PickedPlace {
    street: string;
    city: string;
    postcode: string;
    latitude: number;
    longitude: number;
    label: string;
    housenumber: string;
}

const LONDON_BBOX = "-0.5103,51.2868,0.3340,51.6919";

export const placeLabel = (p: PlaceFeature["properties"]) =>
    [p.housenumber, p.street || p.name, p.city, p.postcode].filter(Boolean).join(", ");

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<PlaceFeature[]> {
    const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query + ", London")}&bbox=${LONDON_BBOX}&limit=10&lang=en`,
        {signal}
    );
    const data = await res.json();
    // Без повторов: один и тот же адрес приходит несколько раз (дом, подъезд, организация)
    return Array.from(
        new Map((data.features ?? []).map((f: PlaceFeature) => [placeLabel(f.properties), f])).values()
    ).slice(0, 5) as PlaceFeature[];
}

export const toPickedPlace = (f: PlaceFeature): PickedPlace => {
    const p = f.properties;
    return {
        street: p.street || p.name || "",
        city: p.city || p.state || "",
        postcode: p.postcode || "",
        latitude: f.geometry.coordinates[1],
        longitude: f.geometry.coordinates[0],
        label: placeLabel(p),
        housenumber: p.housenumber || "",
    };
};

// Название здания (необязательное) — в начало адреса: «Rose Court, 3 High Street, London, W1 2AB»
export const withBuildingName = (address: string, buildingName?: string) =>
    address && buildingName?.trim() ? `${buildingName.trim()}, ${address}` : address;

// Полный адрес для сохранения: номер дома (из подсказки или введённый вручную), улица, город, индекс
export const formatAddress = (place: PickedPlace, housenumber: string) =>
    `${housenumber.trim() ? housenumber.trim() + " " : ""}${place.street}, ${place.city}${place.postcode ? ", " + place.postcode : ""}`;
