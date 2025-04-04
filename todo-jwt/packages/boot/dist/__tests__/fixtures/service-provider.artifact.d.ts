import { Provider } from '@loopback/core';
export interface GeoPoint {
    lat: number;
    lng: number;
}
export interface GeocoderService {
    geocode(address: string): Promise<GeoPoint>;
}
export declare class GeocoderServiceProvider implements Provider<GeocoderService> {
    value(): Promise<GeocoderService>;
}
