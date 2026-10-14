// Адрес доставки, выбранный по индексу (components/AddressPicker.tsx)

// Выбранный адрес: улица, город, индекс и координаты — от одного и того же места
export interface PickedPlace {
    street: string;
    city: string;
    postcode: string;
    latitude: number;
    longitude: number;
    label: string;
    housenumber: string;
}

// Название здания (необязательное) — в начало адреса: «Rose Court, 3 High Street, London, W1 2AB»
export const withBuildingName = (address: string, buildingName?: string) =>
    address && buildingName?.trim() ? `${buildingName.trim()}, ${address}` : address;

// Полный адрес для сохранения: номер дома (из списка или введённый вручную), улица, город, индекс
export const formatAddress = (place: PickedPlace, housenumber: string) =>
    `${housenumber.trim() ? housenumber.trim() + " " : ""}${place.street}, ${place.city}${place.postcode ? ", " + place.postcode : ""}`;
