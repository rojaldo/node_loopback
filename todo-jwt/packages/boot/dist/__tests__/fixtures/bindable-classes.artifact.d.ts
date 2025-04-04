import { Provider } from '@loopback/core';
export declare class BindableGreetingService {
    greet(whom?: string): Promise<string>;
}
export declare class DateProvider implements Provider<Date> {
    value(): Promise<Date>;
}
export declare class NotBindableGreetingService {
    greet(whom?: string): Promise<string>;
}
export declare class NotBindableDateProvider implements Provider<Date> {
    value(): Promise<Date>;
}
export declare class ServiceWithConstructorInject {
    private user;
    constructor(user: string);
}
export declare class ServiceWithPropertyInject {
    private user;
}
export declare class ServiceWithMethodInject {
    greet(user: string): string;
}
