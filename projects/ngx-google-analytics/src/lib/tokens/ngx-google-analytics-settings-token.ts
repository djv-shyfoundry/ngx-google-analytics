import {InjectionToken} from '@angular/core';
import {IGoogleAnalyticsSettings} from '../interfaces/i-google-analytics-settings';

/**
 * Provide an Injection Token for global settings.
 */
export const NGX_GOOGLE_ANALYTICS_SETTINGS_TOKEN = new InjectionToken<IGoogleAnalyticsSettings>('ngx-google-analytics-settings', {
    factory: () => ({ga4TagId: '', enableTracing: false})
});
