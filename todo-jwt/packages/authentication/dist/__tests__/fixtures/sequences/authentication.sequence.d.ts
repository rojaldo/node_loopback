import { FindRoute, InvokeMethod, ParseParams, Reject, RequestContext, Send, SequenceHandler } from '@loopback/rest';
import { AuthenticateFn } from '../../../';
export declare class MyAuthenticationSequence implements SequenceHandler {
    protected findRoute: FindRoute;
    protected parseParams: ParseParams;
    protected invoke: InvokeMethod;
    protected send: Send;
    protected reject: Reject;
    protected authenticateRequest: AuthenticateFn;
    constructor(findRoute: FindRoute, parseParams: ParseParams, invoke: InvokeMethod, send: Send, reject: Reject, authenticateRequest: AuthenticateFn);
    handle(context: RequestContext): Promise<void>;
}
