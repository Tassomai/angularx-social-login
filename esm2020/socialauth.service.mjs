import { Inject, Injectable } from '@angular/core';
import { AsyncSubject, isObservable, ReplaySubject } from 'rxjs';
import { GoogleLoginProvider } from './providers/google-login-provider';
import * as i0 from "@angular/core";
/**
 * The service encapsulating the social login functionality. Exposes methods like
 * `signIn`, `signOut`. Also, exposes an `authState` `Observable` that one can
 * subscribe to get the current logged in user information.
 *
 * @dynamic
 */
export class SocialAuthService {
    /**
     * @param config A `SocialAuthServiceConfig` object or a `Promise` that resolves to a `SocialAuthServiceConfig` object
     */
    constructor(config, _ngZone, _injector) {
        this._ngZone = _ngZone;
        this._injector = _injector;
        this.providers = new Map();
        this.autoLogin = false;
        this._user = null;
        this._authState = new ReplaySubject(1);
        /* Consider making this an enum comprising LOADING, LOADED, FAILED etc. */
        this.initialized = false;
        this._initState = new AsyncSubject();
        if (config instanceof Promise) {
            config.then((config) => {
                this.initialize(config);
            });
        }
        else {
            this.initialize(config);
        }
    }
    /** An `Observable` that one can subscribe to get the current logged in user information */
    get authState() {
        return this._authState.asObservable();
    }
    /** An `Observable` to communicate the readiness of the service and associated login providers */
    get initState() {
        return this._initState.asObservable();
    }
    initialize(config) {
        this.autoLogin = config.autoLogin !== undefined ? config.autoLogin : false;
        const { onError = console.error } = config;
        config.providers.forEach((item) => {
            this.providers.set(item.id, 'prototype' in item.provider
                ? this._injector.get(item.provider)
                : item.provider);
        });
        Promise.all(Array.from(this.providers.values()).map((provider) => provider.initialize(this.autoLogin)))
            .then(() => {
            if (this.autoLogin) {
                const loginStatusPromises = [];
                let loggedIn = false;
                this.providers.forEach((provider, key) => {
                    const promise = provider.getLoginStatus();
                    loginStatusPromises.push(promise);
                    promise
                        .then((user) => {
                        this.setUser(user, key);
                        loggedIn = true;
                    })
                        .catch(console.debug);
                });
                Promise.all(loginStatusPromises).catch(() => {
                    if (!loggedIn) {
                        this._user = null;
                        this._authState.next(null);
                    }
                });
            }
            this.providers.forEach((provider, key) => {
                if (isObservable(provider.changeUser)) {
                    provider.changeUser.subscribe((user) => {
                        this._ngZone.run(() => {
                            this.setUser(user, key);
                        });
                    });
                }
            });
        })
            .catch((error) => {
            onError(error);
        })
            .finally(() => {
            this.initialized = true;
            this._initState.next(this.initialized);
            this._initState.complete();
        });
    }
    async getAccessToken(providerId) {
        const providerObject = this.providers.get(providerId);
        if (!this.initialized) {
            throw SocialAuthService.ERR_NOT_INITIALIZED;
        }
        else if (!providerObject) {
            throw SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND;
        }
        else if (!(providerObject instanceof GoogleLoginProvider)) {
            throw SocialAuthService.ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN;
        }
        return await providerObject.getAccessToken();
    }
    refreshAuthToken(providerId) {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(SocialAuthService.ERR_NOT_INITIALIZED);
            }
            else {
                const providerObject = this.providers.get(providerId);
                if (providerObject) {
                    if (typeof providerObject.refreshToken !== 'function') {
                        reject(SocialAuthService.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN);
                    }
                    else {
                        providerObject
                            .refreshToken()
                            .then((user) => {
                            this.setUser(user, providerId);
                            resolve();
                        })
                            .catch((err) => {
                            reject(err);
                        });
                    }
                }
                else {
                    reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
    refreshAccessToken(providerId) {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(SocialAuthService.ERR_NOT_INITIALIZED);
            }
            else if (providerId !== GoogleLoginProvider.PROVIDER_ID) {
                reject(SocialAuthService.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN);
            }
            else {
                const providerObject = this.providers.get(providerId);
                if (providerObject instanceof GoogleLoginProvider) {
                    providerObject.revokeAccessToken().then(resolve).catch(reject);
                }
                else {
                    reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
    /**
     * A method used to sign in a user with a specific `LoginProvider`.
     *
     * @param providerId Id with which the `LoginProvider` has been registered with the service
     * @param signInOptions Optional `LoginProvider` specific arguments
     * @returns A `Promise` that resolves to the authenticated user information
     */
    signIn(providerId, signInOptions) {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(SocialAuthService.ERR_NOT_INITIALIZED);
            }
            else {
                let providerObject = this.providers.get(providerId);
                if (providerObject) {
                    providerObject
                        .signIn(signInOptions)
                        .then((user) => {
                        this.setUser(user, providerId);
                        resolve(user);
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }
                else {
                    reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
    /**
     * A method used to sign out the currently loggen in user.
     *
     * @param revoke Optional parameter to specify whether a hard sign out is to be performed
     * @returns A `Promise` that resolves if the operation is successful, rejects otherwise
     */
    signOut(revoke = false) {
        return new Promise((resolve, reject) => {
            if (!this.initialized) {
                reject(SocialAuthService.ERR_NOT_INITIALIZED);
            }
            else if (!this._user) {
                reject(SocialAuthService.ERR_NOT_LOGGED_IN);
            }
            else {
                let providerId = this._user.provider;
                let providerObject = this.providers.get(providerId);
                if (providerObject) {
                    providerObject
                        .signOut(revoke)
                        .then(() => {
                        resolve();
                        this.setUser(null);
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }
                else {
                    reject(SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND);
                }
            }
        });
    }
    setUser(user, id) {
        if (user && id)
            user.provider = id;
        this._user = user;
        this._authState.next(user);
    }
}
SocialAuthService.ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found';
SocialAuthService.ERR_NOT_LOGGED_IN = 'Not logged in';
SocialAuthService.ERR_NOT_INITIALIZED = 'Login providers not ready yet. Are there errors on your console?';
SocialAuthService.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN = 'Chosen login provider is not supported for refreshing a token';
SocialAuthService.ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN = 'Chosen login provider is not supported for getting an access token';
SocialAuthService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialAuthService, deps: [{ token: 'SocialAuthServiceConfig' }, { token: i0.NgZone }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable });
SocialAuthService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialAuthService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialAuthService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: ['SocialAuthServiceConfig']
                }] }, { type: i0.NgZone }, { type: i0.Injector }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29jaWFsYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvbGliL3NyYy9zb2NpYWxhdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQTBCLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFjLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUc3RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFXeEU7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQStCNUI7O09BRUc7SUFDSCxZQUVFLE1BQWtFLEVBQ2pELE9BQWUsRUFDZixTQUFtQjtRQURuQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQTNCOUIsY0FBUyxHQUErQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2xELGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsVUFBSyxHQUFzQixJQUFJLENBQUM7UUFDaEMsZUFBVSxHQUFxQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1RSwwRUFBMEU7UUFDbEUsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIsZUFBVSxHQUEwQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBcUI3RCxJQUFJLE1BQU0sWUFBWSxPQUFPLEVBQUU7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQStCLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQTFCRCwyRkFBMkY7SUFDM0YsSUFBSSxTQUFTO1FBQ1gs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RUFBbUUsQ0FBQTtBQUM3QyxxREFBbUMsR0FDekQsK0RBQWdFLENBQUE7QUFDMUMsb0RBQWtDLEdBQ3hELG9FQUFxRSxDQUFBOzhHQVQ1RCxpQkFBaUIsa0JBbUNsQix5QkFBeUI7a0hBbkN4QixpQkFBaUIsY0FESixNQUFNOzJGQUNuQixpQkFBaUI7a0JBRDdCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzswQkFvQzdCLE1BQU07MkJBQUMseUJBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3RvciwgTmdab25lLCBUeXBlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBc3luY1N1YmplY3QsIGlzT2JzZXJ2YWJsZSwgT2JzZXJ2YWJsZSwgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTG9naW5Qcm92aWRlciB9IGZyb20gJy4vZW50aXRpZXMvbG9naW4tcHJvdmlkZXInO1xuaW1wb3J0IHsgU29jaWFsVXNlciB9IGZyb20gJy4vZW50aXRpZXMvc29jaWFsLXVzZXInO1xuaW1wb3J0IHsgR29vZ2xlTG9naW5Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL2dvb2dsZS1sb2dpbi1wcm92aWRlcic7XG5cbi8qKlxuICogQW4gaW50ZXJmYWNlIHRvIGRlZmluZSB0aGUgc2hhcGUgb2YgdGhlIHNlcnZpY2UgY29uZmlndXJhdGlvbiBvcHRpb25zLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNvY2lhbEF1dGhTZXJ2aWNlQ29uZmlnIHtcbiAgYXV0b0xvZ2luPzogYm9vbGVhbjtcbiAgcHJvdmlkZXJzOiB7IGlkOiBzdHJpbmc7IHByb3ZpZGVyOiBMb2dpblByb3ZpZGVyIHwgVHlwZTxMb2dpblByb3ZpZGVyPiB9W107XG4gIG9uRXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gYW55O1xufVxuXG4vKipcbiAqIFRoZSBzZXJ2aWNlIGVuY2Fwc3VsYXRpbmcgdGhlIHNvY2lhbCBsb2dpbiBmdW5jdGlvbmFsaXR5LiBFeHBvc2VzIG1ldGhvZHMgbGlrZVxuICogYHNpZ25JbmAsIGBzaWduT3V0YC4gQWxzbywgZXhwb3NlcyBhbiBgYXV0aFN0YXRlYCBgT2JzZXJ2YWJsZWAgdGhhdCBvbmUgY2FuXG4gKiBzdWJzY3JpYmUgdG8gZ2V0IHRoZSBjdXJyZW50IGxvZ2dlZCBpbiB1c2VyIGluZm9ybWF0aW9uLlxuICpcbiAqIEBkeW5hbWljXG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgU29jaWFsQXV0aFNlcnZpY2Uge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBFUlJfTE9HSU5fUFJPVklERVJfTk9UX0ZPVU5EID1cbiAgICAnTG9naW4gcHJvdmlkZXIgbm90IGZvdW5kJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVJSX05PVF9MT0dHRURfSU4gPSAnTm90IGxvZ2dlZCBpbic7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVSUl9OT1RfSU5JVElBTElaRUQgPVxuICAgICdMb2dpbiBwcm92aWRlcnMgbm90IHJlYWR5IHlldC4gQXJlIHRoZXJlIGVycm9ycyBvbiB5b3VyIGNvbnNvbGU/JztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVJSX05PVF9TVVBQT1JURURfRk9SX1JFRlJFU0hfVE9LRU4gPVxuICAgICdDaG9zZW4gbG9naW4gcHJvdmlkZXIgaXMgbm90IHN1cHBvcnRlZCBmb3IgcmVmcmVzaGluZyBhIHRva2VuJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVJSX05PVF9TVVBQT1JURURfRk9SX0FDQ0VTU19UT0tFTiA9XG4gICAgJ0Nob3NlbiBsb2dpbiBwcm92aWRlciBpcyBub3Qgc3VwcG9ydGVkIGZvciBnZXR0aW5nIGFuIGFjY2VzcyB0b2tlbic7XG5cbiAgcHJpdmF0ZSBwcm92aWRlcnM6IE1hcDxzdHJpbmcsIExvZ2luUHJvdmlkZXI+ID0gbmV3IE1hcCgpO1xuICBwcml2YXRlIGF1dG9Mb2dpbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgX3VzZXI6IFNvY2lhbFVzZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBfYXV0aFN0YXRlOiBSZXBsYXlTdWJqZWN0PFNvY2lhbFVzZXIgfCBudWxsPiA9IG5ldyBSZXBsYXlTdWJqZWN0KDEpO1xuXG4gIC8qIENvbnNpZGVyIG1ha2luZyB0aGlzIGFuIGVudW0gY29tcHJpc2luZyBMT0FESU5HLCBMT0FERUQsIEZBSUxFRCBldGMuICovXG4gIHByaXZhdGUgaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBfaW5pdFN0YXRlOiBBc3luY1N1YmplY3Q8Ym9vbGVhbj4gPSBuZXcgQXN5bmNTdWJqZWN0KCk7XG5cbiAgLyoqIEFuIGBPYnNlcnZhYmxlYCB0aGF0IG9uZSBjYW4gc3Vic2NyaWJlIHRvIGdldCB0aGUgY3VycmVudCBsb2dnZWQgaW4gdXNlciBpbmZvcm1hdGlvbiAqL1xuICBnZXQgYXV0aFN0YXRlKCk6IE9ic2VydmFibGU8U29jaWFsVXNlcj4ge1xuICAgIHJldHVybiB0aGlzLl9hdXRoU3RhdGUuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKiogQW4gYE9ic2VydmFibGVgIHRvIGNvbW11bmljYXRlIHRoZSByZWFkaW5lc3Mgb2YgdGhlIHNlcnZpY2UgYW5kIGFzc29jaWF0ZWQgbG9naW4gcHJvdmlkZXJzICovXG4gIGdldCBpbml0U3RhdGUoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuX2luaXRTdGF0ZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gY29uZmlnIEEgYFNvY2lhbEF1dGhTZXJ2aWNlQ29uZmlnYCBvYmplY3Qgb3IgYSBgUHJvbWlzZWAgdGhhdCByZXNvbHZlcyB0byBhIGBTb2NpYWxBdXRoU2VydmljZUNvbmZpZ2Agb2JqZWN0XG4gICAqL1xuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KCdTb2NpYWxBdXRoU2VydmljZUNvbmZpZycpXG4gICAgY29uZmlnOiBTb2NpYWxBdXRoU2VydmljZUNvbmZpZyB8IFByb21pc2U8U29jaWFsQXV0aFNlcnZpY2VDb25maWc+LFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX25nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2luamVjdG9yOiBJbmplY3RvclxuICApIHtcbiAgICBpZiAoY29uZmlnIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgY29uZmlnLnRoZW4oKGNvbmZpZzogU29jaWFsQXV0aFNlcnZpY2VDb25maWcpID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKGNvbmZpZyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbml0aWFsaXplKGNvbmZpZyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpbml0aWFsaXplKGNvbmZpZzogU29jaWFsQXV0aFNlcnZpY2VDb25maWcpIHtcbiAgICB0aGlzLmF1dG9Mb2dpbiA9IGNvbmZpZy5hdXRvTG9naW4gIT09IHVuZGVmaW5lZCA/IGNvbmZpZy5hdXRvTG9naW4gOiBmYWxzZTtcbiAgICBjb25zdCB7IG9uRXJyb3IgPSBjb25zb2xlLmVycm9yIH0gPSBjb25maWc7XG5cbiAgICBjb25maWcucHJvdmlkZXJzLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIHRoaXMucHJvdmlkZXJzLnNldChcbiAgICAgICAgaXRlbS5pZCxcbiAgICAgICAgJ3Byb3RvdHlwZScgaW4gaXRlbS5wcm92aWRlclxuICAgICAgICAgID8gdGhpcy5faW5qZWN0b3IuZ2V0KGl0ZW0ucHJvdmlkZXIpXG4gICAgICAgICAgOiBpdGVtLnByb3ZpZGVyXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgUHJvbWlzZS5hbGwoXG4gICAgICBBcnJheS5mcm9tKHRoaXMucHJvdmlkZXJzLnZhbHVlcygpKS5tYXAoKHByb3ZpZGVyKSA9PlxuICAgICAgICBwcm92aWRlci5pbml0aWFsaXplKHRoaXMuYXV0b0xvZ2luKVxuICAgICAgKVxuICAgIClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuYXV0b0xvZ2luKSB7XG4gICAgICAgICAgY29uc3QgbG9naW5TdGF0dXNQcm9taXNlcyA9IFtdO1xuICAgICAgICAgIGxldCBsb2dnZWRJbiA9IGZhbHNlO1xuXG4gICAgICAgICAgdGhpcy5wcm92aWRlcnMuZm9yRWFjaCgocHJvdmlkZXI6IExvZ2luUHJvdmlkZXIsIGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9taXNlID0gcHJvdmlkZXIuZ2V0TG9naW5TdGF0dXMoKTtcbiAgICAgICAgICAgIGxvZ2luU3RhdHVzUHJvbWlzZXMucHVzaChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2VcbiAgICAgICAgICAgICAgLnRoZW4oKHVzZXI6IFNvY2lhbFVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXIodXNlciwga2V5KTtcbiAgICAgICAgICAgICAgICBsb2dnZWRJbiA9IHRydWU7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaChjb25zb2xlLmRlYnVnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBQcm9taXNlLmFsbChsb2dpblN0YXR1c1Byb21pc2VzKS5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWxvZ2dlZEluKSB7XG4gICAgICAgICAgICAgIHRoaXMuX3VzZXIgPSBudWxsO1xuICAgICAgICAgICAgICB0aGlzLl9hdXRoU3RhdGUubmV4dChudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goKHByb3ZpZGVyLCBrZXkpID0+IHtcbiAgICAgICAgICBpZiAoaXNPYnNlcnZhYmxlKHByb3ZpZGVyLmNoYW5nZVVzZXIpKSB7XG4gICAgICAgICAgICBwcm92aWRlci5jaGFuZ2VVc2VyLnN1YnNjcmliZSgodXNlcikgPT4ge1xuICAgICAgICAgICAgICB0aGlzLl9uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXIodXNlciwga2V5KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgb25FcnJvcihlcnJvcik7XG4gICAgICB9KVxuICAgICAgLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faW5pdFN0YXRlLm5leHQodGhpcy5pbml0aWFsaXplZCk7XG4gICAgICAgIHRoaXMuX2luaXRTdGF0ZS5jb21wbGV0ZSgpO1xuICAgICAgfSk7XG4gIH1cblxuICBhc3luYyBnZXRBY2Nlc3NUb2tlbihwcm92aWRlcklkOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIGNvbnN0IHByb3ZpZGVyT2JqZWN0ID0gdGhpcy5wcm92aWRlcnMuZ2V0KHByb3ZpZGVySWQpO1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgdGhyb3cgU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9JTklUSUFMSVpFRDtcbiAgICB9IGVsc2UgaWYgKCFwcm92aWRlck9iamVjdCkge1xuICAgICAgdGhyb3cgU29jaWFsQXV0aFNlcnZpY2UuRVJSX0xPR0lOX1BST1ZJREVSX05PVF9GT1VORDtcbiAgICB9IGVsc2UgaWYgKCEocHJvdmlkZXJPYmplY3QgaW5zdGFuY2VvZiBHb29nbGVMb2dpblByb3ZpZGVyKSkge1xuICAgICAgdGhyb3cgU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9TVVBQT1JURURfRk9SX0FDQ0VTU19UT0tFTjtcbiAgICB9XG5cbiAgICByZXR1cm4gYXdhaXQgcHJvdmlkZXJPYmplY3QuZ2V0QWNjZXNzVG9rZW4oKTtcbiAgfVxuXG4gIHJlZnJlc2hBdXRoVG9rZW4ocHJvdmlkZXJJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9JTklUSUFMSVpFRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwcm92aWRlck9iamVjdCA9IHRoaXMucHJvdmlkZXJzLmdldChwcm92aWRlcklkKTtcbiAgICAgICAgaWYgKHByb3ZpZGVyT2JqZWN0KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBwcm92aWRlck9iamVjdC5yZWZyZXNoVG9rZW4gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJlamVjdChTb2NpYWxBdXRoU2VydmljZS5FUlJfTk9UX1NVUFBPUlRFRF9GT1JfUkVGUkVTSF9UT0tFTik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByb3ZpZGVyT2JqZWN0XG4gICAgICAgICAgICAgIC5yZWZyZXNoVG9rZW4oKVxuICAgICAgICAgICAgICAudGhlbigodXNlcikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0VXNlcih1c2VyLCBwcm92aWRlcklkKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX0xPR0lOX1BST1ZJREVSX05PVF9GT1VORCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZnJlc2hBY2Nlc3NUb2tlbihwcm92aWRlcklkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgIHJlamVjdChTb2NpYWxBdXRoU2VydmljZS5FUlJfTk9UX0lOSVRJQUxJWkVEKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvdmlkZXJJZCAhPT0gR29vZ2xlTG9naW5Qcm92aWRlci5QUk9WSURFUl9JRCkge1xuICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9TVVBQT1JURURfRk9SX1JFRlJFU0hfVE9LRU4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXJPYmplY3QgPSB0aGlzLnByb3ZpZGVycy5nZXQocHJvdmlkZXJJZCk7XG4gICAgICAgIGlmIChwcm92aWRlck9iamVjdCBpbnN0YW5jZW9mIEdvb2dsZUxvZ2luUHJvdmlkZXIpIHtcbiAgICAgICAgICBwcm92aWRlck9iamVjdC5yZXZva2VBY2Nlc3NUb2tlbigpLnRoZW4ocmVzb2x2ZSkuY2F0Y2gocmVqZWN0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX0xPR0lOX1BST1ZJREVSX05PVF9GT1VORCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB1c2VkIHRvIHNpZ24gaW4gYSB1c2VyIHdpdGggYSBzcGVjaWZpYyBgTG9naW5Qcm92aWRlcmAuXG4gICAqXG4gICAqIEBwYXJhbSBwcm92aWRlcklkIElkIHdpdGggd2hpY2ggdGhlIGBMb2dpblByb3ZpZGVyYCBoYXMgYmVlbiByZWdpc3RlcmVkIHdpdGggdGhlIHNlcnZpY2VcbiAgICogQHBhcmFtIHNpZ25Jbk9wdGlvbnMgT3B0aW9uYWwgYExvZ2luUHJvdmlkZXJgIHNwZWNpZmljIGFyZ3VtZW50c1xuICAgKiBAcmV0dXJucyBBIGBQcm9taXNlYCB0aGF0IHJlc29sdmVzIHRvIHRoZSBhdXRoZW50aWNhdGVkIHVzZXIgaW5mb3JtYXRpb25cbiAgICovXG4gIHNpZ25Jbihwcm92aWRlcklkOiBzdHJpbmcsIHNpZ25Jbk9wdGlvbnM/OiBhbnkpOiBQcm9taXNlPFNvY2lhbFVzZXI+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgIHJlamVjdChTb2NpYWxBdXRoU2VydmljZS5FUlJfTk9UX0lOSVRJQUxJWkVEKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBwcm92aWRlck9iamVjdCA9IHRoaXMucHJvdmlkZXJzLmdldChwcm92aWRlcklkKTtcbiAgICAgICAgaWYgKHByb3ZpZGVyT2JqZWN0KSB7XG4gICAgICAgICAgcHJvdmlkZXJPYmplY3RcbiAgICAgICAgICAgIC5zaWduSW4oc2lnbkluT3B0aW9ucylcbiAgICAgICAgICAgIC50aGVuKCh1c2VyOiBTb2NpYWxVc2VyKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMuc2V0VXNlcih1c2VyLCBwcm92aWRlcklkKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSh1c2VyKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChTb2NpYWxBdXRoU2VydmljZS5FUlJfTE9HSU5fUFJPVklERVJfTk9UX0ZPVU5EKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgbWV0aG9kIHVzZWQgdG8gc2lnbiBvdXQgdGhlIGN1cnJlbnRseSBsb2dnZW4gaW4gdXNlci5cbiAgICpcbiAgICogQHBhcmFtIHJldm9rZSBPcHRpb25hbCBwYXJhbWV0ZXIgdG8gc3BlY2lmeSB3aGV0aGVyIGEgaGFyZCBzaWduIG91dCBpcyB0byBiZSBwZXJmb3JtZWRcbiAgICogQHJldHVybnMgQSBgUHJvbWlzZWAgdGhhdCByZXNvbHZlcyBpZiB0aGUgb3BlcmF0aW9uIGlzIHN1Y2Nlc3NmdWwsIHJlamVjdHMgb3RoZXJ3aXNlXG4gICAqL1xuICBzaWduT3V0KHJldm9rZTogYm9vbGVhbiA9IGZhbHNlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9JTklUSUFMSVpFRCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl91c2VyKSB7XG4gICAgICAgIHJlamVjdChTb2NpYWxBdXRoU2VydmljZS5FUlJfTk9UX0xPR0dFRF9JTik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJvdmlkZXJJZCA9IHRoaXMuX3VzZXIucHJvdmlkZXI7XG4gICAgICAgIGxldCBwcm92aWRlck9iamVjdCA9IHRoaXMucHJvdmlkZXJzLmdldChwcm92aWRlcklkKTtcbiAgICAgICAgaWYgKHByb3ZpZGVyT2JqZWN0KSB7XG4gICAgICAgICAgcHJvdmlkZXJPYmplY3RcbiAgICAgICAgICAgIC5zaWduT3V0KHJldm9rZSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB0aGlzLnNldFVzZXIobnVsbCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX0xPR0lOX1BST1ZJREVSX05PVF9GT1VORCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VXNlcih1c2VyOiBTb2NpYWxVc2VyIHwgbnVsbCwgaWQ/OiBzdHJpbmcpIHtcbiAgICBpZiAodXNlciAmJiBpZCkgdXNlci5wcm92aWRlciA9IGlkO1xuICAgIHRoaXMuX3VzZXIgPSB1c2VyO1xuICAgIHRoaXMuX2F1dGhTdGF0ZS5uZXh0KHVzZXIpO1xuICB9XG59XG4iXX0=