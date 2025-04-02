import { Client } from '@loopback/testlab';
import { TodoApplication } from '../../application';
export declare function setupApplication(): Promise<AppWithClient>;
export interface AppWithClient {
    app: TodoApplication;
    client: Client;
}
