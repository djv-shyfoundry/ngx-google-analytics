import {TestBed} from '@angular/core/testing';
import {GoogleAnalyticsService} from './google-analytics.service';
import {provideGoogleAnalytics} from '../ngx-google-analytics.provider';
import {DataLayer} from '../types/data-layer.type';
import {GtagFnArgs} from '../types/gtag.type';
import {GaWindow} from '../tokens/ngx-google-analytics-window';

describe('GoogleAnalyticsService', () => {

    const globalWindow: GaWindow = window;

    globalWindow.dataLayer = [] as DataLayer;

    globalWindow.gtag = function (...args: GtagFnArgs): void {
        globalWindow.dataLayer.push(args);
    };

    const tracking = 'GA-000000000';
    let spyOnGtag: jest.SpyInstance<void, GtagFnArgs, unknown>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                provideGoogleAnalytics(tracking)
            ]
        });
    });

    beforeEach(() => {
        spyOnGtag = jest.spyOn(globalWindow, 'gtag');
    });

    it('should call gtag fn w/ action/command pair', () => {
        const action = 'action',
            command = 'command',
            ga = TestBed.inject(GoogleAnalyticsService);
        // act
        ga.gtag(action, command);
        // specs
        expect(spyOnGtag).toHaveBeenCalledWith(action, command);
    });

    describe('gtag(`event`)', () => {

        it('should call a `event` action on gtag command', () => {
            const action = 'video_auto_play_start',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.event(action);

            expect(spyOnGtag).toHaveBeenLastCalledWith('event', action);
        });

        it('should find `event_category` property on gtag command', () => {
            const action = 'video_auto_play_start',
                event_category = 'video_auto_play',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.event(action, {category: event_category});

            expect(spyOnGtag).toHaveBeenCalledWith('event', action, {event_category});
        });

        it('should find `event_label` property on gtag command', () => {
            const action = 'video_auto_play_start',
                event_label = 'My promotional video',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.event(action, {label: event_label});

            expect(spyOnGtag).toHaveBeenCalledWith('event', action, {event_label});
        });

        it('should find `value` property on gtag command', () => {
            const action = 'video_auto_play_start',
                value = 40,
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.event(action, {value});

            expect(spyOnGtag).toHaveBeenCalledWith('event', action, {value});
        });

        it('should find `interaction` property on gtag command', () => {
            const action = 'video_auto_play_start',
                interaction = true,
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.event(action, {interaction});

            expect(spyOnGtag).toHaveBeenCalledWith('event', action, {interaction});
        });

    });

    describe('gtag(`config`) aka pageView', () => {

        it('should call a `config` action on gtag command', () => {
            const page_path = '/page.html',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.pageView(page_path);

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'page_view', {
                page_path,
                page_location: document.location.href
            });
        });

        it('should send `page_title` attribute on gtag command', () => {
            const page_path = '/page.html',
                page_title = 'My Page View',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.pageView(page_path, {title: page_title});

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'page_view', {
                page_path,
                page_title,
                page_location: document.location.href
            });
        });

        it('should send `page_location` attribute on gtag command', () => {
            const page_path = '/page.html',
                page_location = 'my location',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.pageView(page_path, {location: page_location});

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'page_view', {page_path, page_location});
        });

        it('should use `document.location.href` as a default `page_location`', () => {
            const page_path = '/page.html',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.pageView(page_path, undefined);

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'page_view', {
                page_path,
                page_location: document.location.href
            });
        });

    });

    describe('gtag(`event`)', () => {

        it('should call a `event` action on gtag command', () => {
            const screen_name = 'Home Screen',
                app_name = 'My App',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.appView(screen_name, app_name);

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'screen_view', {screen_name, app_name});
        });

        it('should send `app_id` property on gtag command', () => {
            const screen_name = 'Home Screen',
                app_name = 'My App',
                app_id = '2333',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.appView(screen_name, app_name, {appId: app_id});

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'screen_view', {screen_name, app_name, app_id});
        });

        it('should send `app_version` property on gtag command', () => {
            const screen_name = 'Home Screen',
                app_name = 'My App',
                app_version = 'v1.0',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.appView(screen_name, app_name, {appVersion: app_version});

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'screen_view', {screen_name, app_name, app_version});
        });

        it('should send `app_installer_id` property on gtag command', () => {
            const screen_name = 'Home Screen',
                app_name = 'My App',
                app_installer_id = '30000',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.appView(screen_name, app_name, {installerId: app_installer_id});

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'screen_view', {screen_name, app_name, app_installer_id});
        });

    });

    describe('gtag(`event`, `exception`)', () => {

        it('should call `event` action w/ `exception type on gtag command`', () => {
            const ga = TestBed.inject(GoogleAnalyticsService);

            ga.exception();

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'app_exception');
        });

        it('should send `description` attribute on gtag command', () => {
            const description = 'Something went wrong',
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.exception(description);

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'app_exception', expect.objectContaining({description}));
        });

        it('should send `fatal` attribute on gtag command', () => {
            const fatal = true,
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.exception(undefined, fatal);

            expect(spyOnGtag).toHaveBeenCalledWith('event', 'app_exception', expect.objectContaining({fatal}));
        });

    });

    describe('gtag(`set`, ...)', () => {

        it('should send `set` command on gtag() call', () => {
            const setData = {currency: 'USD', country: 'US'},
                ga = TestBed.inject(GoogleAnalyticsService);

            ga.set(setData);

            expect(spyOnGtag).toHaveBeenCalledWith('set', setData);
        });
    });

});
