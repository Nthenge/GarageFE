// src/main.server.ts
import { ApplicationRef } from '@angular/core';
import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { App } from './app/app'; // Your root component
import { config } from './app/app.config.server'; // Your server config

/**
 * The default server bootstrap function.
 * @param context The BootstrapContext passed by Angular Universal/SSR tooling.
 * @returns A promise that resolves to the ApplicationRef.
 */
export default function bootstrap(context: BootstrapContext): Promise<ApplicationRef> {
  // Pass 'App' as the root component and 'config' as the application config.
  // The 'context' is passed as the third argument.
  return bootstrapApplication(App, config, context);
}
