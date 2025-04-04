// Uncomment these imports to begin using these cool features!

import { get, HttpErrors, param } from "@loopback/rest";
import { Echo } from "../models/echo.model";
import { intercept } from "@loopback/core";
import { SampleInterceptor } from "../interceptors/sample.interceptor";

// import {inject} from '@loopback/core';

@intercept(SampleInterceptor.BINDING_KEY)
export class EchoController {
  constructor() {}

  @get('/echo')

  async echo(
    @param.query.string('message')
    message: string,
  ): Promise<Echo> {
    if (!message || message.length === 0 || message.trim().length === 0 || message.length > 100) {
      throw new HttpErrors.BadRequest(
        'The `message` query parameter is required.',
      );
      
    }
    

    return new Echo({
      message: message,
      timestamp: (new Date()).toISOString(),
      status: 'success'
    });
  }
}
