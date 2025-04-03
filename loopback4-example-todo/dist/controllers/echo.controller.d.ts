import { Echo } from "../models/echo.model";
export declare class EchoController {
    constructor();
    echo(message: string): Promise<Echo>;
}
