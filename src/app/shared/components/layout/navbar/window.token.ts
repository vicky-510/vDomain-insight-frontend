import { InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window | null>('WindowToken', {
  providedIn: 'root',
  factory: () => {
    return typeof window !== 'undefined' ? window : null;
  }
});
