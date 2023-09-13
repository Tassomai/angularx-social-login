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
    static { this.ERR_LOGIN_PROVIDER_NOT_FOUND = 'Login provider not found'; }
    static { this.ERR_NOT_LOGGED_IN = 'Not logged in'; }
    static { this.ERR_NOT_INITIALIZED = 'Login providers not ready yet. Are there errors on your console?'; }
    static { this.ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN = 'Chosen login provider is not supported for refreshing a token'; }
    static { this.ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN = 'Chosen login provider is not supported for getting an access token'; }
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialAuthService, deps: [{ token: 'SocialAuthServiceConfig' }, { token: i0.NgZone }, { token: i0.Injector }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialAuthService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialAuthService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: ['SocialAuthServiceConfig']
                }] }, { type: i0.NgZone }, { type: i0.Injector }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29jaWFsYXV0aC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvbGliL3NyYy9zb2NpYWxhdXRoLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQTBCLE1BQU0sZUFBZSxDQUFDO0FBQzNFLE9BQU8sRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFjLGFBQWEsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUc3RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQzs7QUFXeEU7Ozs7OztHQU1HO0FBRUgsTUFBTSxPQUFPLGlCQUFpQjtJQStCNUI7O09BRUc7SUFDSCxZQUVFLE1BQWtFLEVBQ2pELE9BQWUsRUFDZixTQUFtQjtRQURuQixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQTNCOUIsY0FBUyxHQUErQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2xELGNBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsVUFBSyxHQUFzQixJQUFJLENBQUM7UUFDaEMsZUFBVSxHQUFxQyxJQUFJLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU1RSwwRUFBMEU7UUFDbEUsZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFDcEIsZUFBVSxHQUEwQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBcUI3RCxJQUFJLE1BQU0sWUFBWSxPQUFPLEVBQUU7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQStCLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQTlDRCxTQUF3QixpQ0FBNEIsR0FDbEQsMEJBQTJCLENB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QUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3QixDQUFDOzhHQXpPVSxpQkFBaUIsa0JBbUNsQix5QkFBeUI7a0hBbkN4QixpQkFBaUIsY0FESixNQUFNOzsyRkFDbkIsaUJBQWlCO2tCQUQ3QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTs7MEJBb0M3QixNQUFNOzJCQUFDLHlCQUF5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE5nWm9uZSwgVHlwZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0LCBpc09ic2VydmFibGUsIE9ic2VydmFibGUsIFJlcGxheVN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IExvZ2luUHJvdmlkZXIgfSBmcm9tICcuL2VudGl0aWVzL2xvZ2luLXByb3ZpZGVyJztcbmltcG9ydCB7IFNvY2lhbFVzZXIgfSBmcm9tICcuL2VudGl0aWVzL3NvY2lhbC11c2VyJztcbmltcG9ydCB7IEdvb2dsZUxvZ2luUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9nb29nbGUtbG9naW4tcHJvdmlkZXInO1xuXG4vKipcbiAqIEFuIGludGVyZmFjZSB0byBkZWZpbmUgdGhlIHNoYXBlIG9mIHRoZSBzZXJ2aWNlIGNvbmZpZ3VyYXRpb24gb3B0aW9ucy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTb2NpYWxBdXRoU2VydmljZUNvbmZpZyB7XG4gIGF1dG9Mb2dpbj86IGJvb2xlYW47XG4gIHByb3ZpZGVyczogeyBpZDogc3RyaW5nOyBwcm92aWRlcjogTG9naW5Qcm92aWRlciB8IFR5cGU8TG9naW5Qcm92aWRlcj4gfVtdO1xuICBvbkVycm9yPzogKGVycm9yOiBhbnkpID0+IGFueTtcbn1cblxuLyoqXG4gKiBUaGUgc2VydmljZSBlbmNhcHN1bGF0aW5nIHRoZSBzb2NpYWwgbG9naW4gZnVuY3Rpb25hbGl0eS4gRXhwb3NlcyBtZXRob2RzIGxpa2VcbiAqIGBzaWduSW5gLCBgc2lnbk91dGAuIEFsc28sIGV4cG9zZXMgYW4gYGF1dGhTdGF0ZWAgYE9ic2VydmFibGVgIHRoYXQgb25lIGNhblxuICogc3Vic2NyaWJlIHRvIGdldCB0aGUgY3VycmVudCBsb2dnZWQgaW4gdXNlciBpbmZvcm1hdGlvbi5cbiAqXG4gKiBAZHluYW1pY1xuICovXG5ASW5qZWN0YWJsZSh7IHByb3ZpZGVkSW46ICdyb290JyB9KVxuZXhwb3J0IGNsYXNzIFNvY2lhbEF1dGhTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgRVJSX0xPR0lOX1BST1ZJREVSX05PVF9GT1VORCA9XG4gICAgJ0xvZ2luIHByb3ZpZGVyIG5vdCBmb3VuZCc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVSUl9OT1RfTE9HR0VEX0lOID0gJ05vdCBsb2dnZWQgaW4nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBFUlJfTk9UX0lOSVRJQUxJWkVEID1cbiAgICAnTG9naW4gcHJvdmlkZXJzIG5vdCByZWFkeSB5ZXQuIEFyZSB0aGVyZSBlcnJvcnMgb24geW91ciBjb25zb2xlPyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVSUl9OT1RfU1VQUE9SVEVEX0ZPUl9SRUZSRVNIX1RPS0VOID1cbiAgICAnQ2hvc2VuIGxvZ2luIHByb3ZpZGVyIGlzIG5vdCBzdXBwb3J0ZWQgZm9yIHJlZnJlc2hpbmcgYSB0b2tlbic7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEVSUl9OT1RfU1VQUE9SVEVEX0ZPUl9BQ0NFU1NfVE9LRU4gPVxuICAgICdDaG9zZW4gbG9naW4gcHJvdmlkZXIgaXMgbm90IHN1cHBvcnRlZCBmb3IgZ2V0dGluZyBhbiBhY2Nlc3MgdG9rZW4nO1xuXG4gIHByaXZhdGUgcHJvdmlkZXJzOiBNYXA8c3RyaW5nLCBMb2dpblByb3ZpZGVyPiA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSBhdXRvTG9naW4gPSBmYWxzZTtcblxuICBwcml2YXRlIF91c2VyOiBTb2NpYWxVc2VyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX2F1dGhTdGF0ZTogUmVwbGF5U3ViamVjdDxTb2NpYWxVc2VyIHwgbnVsbD4gPSBuZXcgUmVwbGF5U3ViamVjdCgxKTtcblxuICAvKiBDb25zaWRlciBtYWtpbmcgdGhpcyBhbiBlbnVtIGNvbXByaXNpbmcgTE9BRElORywgTE9BREVELCBGQUlMRUQgZXRjLiAqL1xuICBwcml2YXRlIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIHByaXZhdGUgX2luaXRTdGF0ZTogQXN5bmNTdWJqZWN0PGJvb2xlYW4+ID0gbmV3IEFzeW5jU3ViamVjdCgpO1xuXG4gIC8qKiBBbiBgT2JzZXJ2YWJsZWAgdGhhdCBvbmUgY2FuIHN1YnNjcmliZSB0byBnZXQgdGhlIGN1cnJlbnQgbG9nZ2VkIGluIHVzZXIgaW5mb3JtYXRpb24gKi9cbiAgZ2V0IGF1dGhTdGF0ZSgpOiBPYnNlcnZhYmxlPFNvY2lhbFVzZXI+IHtcbiAgICByZXR1cm4gdGhpcy5fYXV0aFN0YXRlLmFzT2JzZXJ2YWJsZSgpO1xuICB9XG5cbiAgLyoqIEFuIGBPYnNlcnZhYmxlYCB0byBjb21tdW5pY2F0ZSB0aGUgcmVhZGluZXNzIG9mIHRoZSBzZXJ2aWNlIGFuZCBhc3NvY2lhdGVkIGxvZ2luIHByb3ZpZGVycyAqL1xuICBnZXQgaW5pdFN0YXRlKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLl9pbml0U3RhdGUuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIGNvbmZpZyBBIGBTb2NpYWxBdXRoU2VydmljZUNvbmZpZ2Agb2JqZWN0IG9yIGEgYFByb21pc2VgIHRoYXQgcmVzb2x2ZXMgdG8gYSBgU29jaWFsQXV0aFNlcnZpY2VDb25maWdgIG9iamVjdFxuICAgKi9cbiAgY29uc3RydWN0b3IoXG4gICAgQEluamVjdCgnU29jaWFsQXV0aFNlcnZpY2VDb25maWcnKVxuICAgIGNvbmZpZzogU29jaWFsQXV0aFNlcnZpY2VDb25maWcgfCBQcm9taXNlPFNvY2lhbEF1dGhTZXJ2aWNlQ29uZmlnPixcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9uZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9pbmplY3RvcjogSW5qZWN0b3JcbiAgKSB7XG4gICAgaWYgKGNvbmZpZyBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIGNvbmZpZy50aGVuKChjb25maWc6IFNvY2lhbEF1dGhTZXJ2aWNlQ29uZmlnKSA9PiB7XG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZShjb25maWcpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZShjb25maWcpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5pdGlhbGl6ZShjb25maWc6IFNvY2lhbEF1dGhTZXJ2aWNlQ29uZmlnKSB7XG4gICAgdGhpcy5hdXRvTG9naW4gPSBjb25maWcuYXV0b0xvZ2luICE9PSB1bmRlZmluZWQgPyBjb25maWcuYXV0b0xvZ2luIDogZmFsc2U7XG4gICAgY29uc3QgeyBvbkVycm9yID0gY29uc29sZS5lcnJvciB9ID0gY29uZmlnO1xuXG4gICAgY29uZmlnLnByb3ZpZGVycy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICB0aGlzLnByb3ZpZGVycy5zZXQoXG4gICAgICAgIGl0ZW0uaWQsXG4gICAgICAgICdwcm90b3R5cGUnIGluIGl0ZW0ucHJvdmlkZXJcbiAgICAgICAgICA/IHRoaXMuX2luamVjdG9yLmdldChpdGVtLnByb3ZpZGVyKVxuICAgICAgICAgIDogaXRlbS5wcm92aWRlclxuICAgICAgKTtcbiAgICB9KTtcblxuICAgIFByb21pc2UuYWxsKFxuICAgICAgQXJyYXkuZnJvbSh0aGlzLnByb3ZpZGVycy52YWx1ZXMoKSkubWFwKChwcm92aWRlcikgPT5cbiAgICAgICAgcHJvdmlkZXIuaW5pdGlhbGl6ZSh0aGlzLmF1dG9Mb2dpbilcbiAgICAgIClcbiAgICApXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLmF1dG9Mb2dpbikge1xuICAgICAgICAgIGNvbnN0IGxvZ2luU3RhdHVzUHJvbWlzZXMgPSBbXTtcbiAgICAgICAgICBsZXQgbG9nZ2VkSW4gPSBmYWxzZTtcblxuICAgICAgICAgIHRoaXMucHJvdmlkZXJzLmZvckVhY2goKHByb3ZpZGVyOiBMb2dpblByb3ZpZGVyLCBrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IHByb3ZpZGVyLmdldExvZ2luU3RhdHVzKCk7XG4gICAgICAgICAgICBsb2dpblN0YXR1c1Byb21pc2VzLnB1c2gocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlXG4gICAgICAgICAgICAgIC50aGVuKCh1c2VyOiBTb2NpYWxVc2VyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVc2VyKHVzZXIsIGtleSk7XG4gICAgICAgICAgICAgICAgbG9nZ2VkSW4gPSB0cnVlO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goY29uc29sZS5kZWJ1Zyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgUHJvbWlzZS5hbGwobG9naW5TdGF0dXNQcm9taXNlcykuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFsb2dnZWRJbikge1xuICAgICAgICAgICAgICB0aGlzLl91c2VyID0gbnVsbDtcbiAgICAgICAgICAgICAgdGhpcy5fYXV0aFN0YXRlLm5leHQobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnByb3ZpZGVycy5mb3JFYWNoKChwcm92aWRlciwga2V5KSA9PiB7XG4gICAgICAgICAgaWYgKGlzT2JzZXJ2YWJsZShwcm92aWRlci5jaGFuZ2VVc2VyKSkge1xuICAgICAgICAgICAgcHJvdmlkZXIuY2hhbmdlVXNlci5zdWJzY3JpYmUoKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgdGhpcy5fbmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRVc2VyKHVzZXIsIGtleSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICAgIG9uRXJyb3IoZXJyb3IpO1xuICAgICAgfSlcbiAgICAgIC5maW5hbGx5KCgpID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgICAgIHRoaXMuX2luaXRTdGF0ZS5uZXh0KHRoaXMuaW5pdGlhbGl6ZWQpO1xuICAgICAgICB0aGlzLl9pbml0U3RhdGUuY29tcGxldGUoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0QWNjZXNzVG9rZW4ocHJvdmlkZXJJZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBwcm92aWRlck9iamVjdCA9IHRoaXMucHJvdmlkZXJzLmdldChwcm92aWRlcklkKTtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRocm93IFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9OT1RfSU5JVElBTElaRUQ7XG4gICAgfSBlbHNlIGlmICghcHJvdmlkZXJPYmplY3QpIHtcbiAgICAgIHRocm93IFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9MT0dJTl9QUk9WSURFUl9OT1RfRk9VTkQ7XG4gICAgfSBlbHNlIGlmICghKHByb3ZpZGVyT2JqZWN0IGluc3RhbmNlb2YgR29vZ2xlTG9naW5Qcm92aWRlcikpIHtcbiAgICAgIHRocm93IFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9OT1RfU1VQUE9SVEVEX0ZPUl9BQ0NFU1NfVE9LRU47XG4gICAgfVxuXG4gICAgcmV0dXJuIGF3YWl0IHByb3ZpZGVyT2JqZWN0LmdldEFjY2Vzc1Rva2VuKCk7XG4gIH1cblxuICByZWZyZXNoQXV0aFRva2VuKHByb3ZpZGVySWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgcmVqZWN0KFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9OT1RfSU5JVElBTElaRUQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcHJvdmlkZXJPYmplY3QgPSB0aGlzLnByb3ZpZGVycy5nZXQocHJvdmlkZXJJZCk7XG4gICAgICAgIGlmIChwcm92aWRlck9iamVjdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgcHJvdmlkZXJPYmplY3QucmVmcmVzaFRva2VuICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9TVVBQT1JURURfRk9SX1JFRlJFU0hfVE9LRU4pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm92aWRlck9iamVjdFxuICAgICAgICAgICAgICAucmVmcmVzaFRva2VuKClcbiAgICAgICAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFVzZXIodXNlciwgcHJvdmlkZXJJZCk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9MT0dJTl9QUk9WSURFUl9OT1RfRk9VTkQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZWZyZXNoQWNjZXNzVG9rZW4ocHJvdmlkZXJJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9JTklUSUFMSVpFRCk7XG4gICAgICB9IGVsc2UgaWYgKHByb3ZpZGVySWQgIT09IEdvb2dsZUxvZ2luUHJvdmlkZXIuUFJPVklERVJfSUQpIHtcbiAgICAgICAgcmVqZWN0KFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9OT1RfU1VQUE9SVEVEX0ZPUl9SRUZSRVNIX1RPS0VOKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyT2JqZWN0ID0gdGhpcy5wcm92aWRlcnMuZ2V0KHByb3ZpZGVySWQpO1xuICAgICAgICBpZiAocHJvdmlkZXJPYmplY3QgaW5zdGFuY2VvZiBHb29nbGVMb2dpblByb3ZpZGVyKSB7XG4gICAgICAgICAgcHJvdmlkZXJPYmplY3QucmV2b2tlQWNjZXNzVG9rZW4oKS50aGVuKHJlc29sdmUpLmNhdGNoKHJlamVjdCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9MT0dJTl9QUk9WSURFUl9OT1RfRk9VTkQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQSBtZXRob2QgdXNlZCB0byBzaWduIGluIGEgdXNlciB3aXRoIGEgc3BlY2lmaWMgYExvZ2luUHJvdmlkZXJgLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvdmlkZXJJZCBJZCB3aXRoIHdoaWNoIHRoZSBgTG9naW5Qcm92aWRlcmAgaGFzIGJlZW4gcmVnaXN0ZXJlZCB3aXRoIHRoZSBzZXJ2aWNlXG4gICAqIEBwYXJhbSBzaWduSW5PcHRpb25zIE9wdGlvbmFsIGBMb2dpblByb3ZpZGVyYCBzcGVjaWZpYyBhcmd1bWVudHNcbiAgICogQHJldHVybnMgQSBgUHJvbWlzZWAgdGhhdCByZXNvbHZlcyB0byB0aGUgYXV0aGVudGljYXRlZCB1c2VyIGluZm9ybWF0aW9uXG4gICAqL1xuICBzaWduSW4ocHJvdmlkZXJJZDogc3RyaW5nLCBzaWduSW5PcHRpb25zPzogYW55KTogUHJvbWlzZTxTb2NpYWxVc2VyPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9JTklUSUFMSVpFRCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJvdmlkZXJPYmplY3QgPSB0aGlzLnByb3ZpZGVycy5nZXQocHJvdmlkZXJJZCk7XG4gICAgICAgIGlmIChwcm92aWRlck9iamVjdCkge1xuICAgICAgICAgIHByb3ZpZGVyT2JqZWN0XG4gICAgICAgICAgICAuc2lnbkluKHNpZ25Jbk9wdGlvbnMpXG4gICAgICAgICAgICAudGhlbigodXNlcjogU29jaWFsVXNlcikgPT4ge1xuICAgICAgICAgICAgICB0aGlzLnNldFVzZXIodXNlciwgcHJvdmlkZXJJZCk7XG4gICAgICAgICAgICAgIHJlc29sdmUodXNlcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX0xPR0lOX1BST1ZJREVSX05PVF9GT1VORCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIG1ldGhvZCB1c2VkIHRvIHNpZ24gb3V0IHRoZSBjdXJyZW50bHkgbG9nZ2VuIGluIHVzZXIuXG4gICAqXG4gICAqIEBwYXJhbSByZXZva2UgT3B0aW9uYWwgcGFyYW1ldGVyIHRvIHNwZWNpZnkgd2hldGhlciBhIGhhcmQgc2lnbiBvdXQgaXMgdG8gYmUgcGVyZm9ybWVkXG4gICAqIEByZXR1cm5zIEEgYFByb21pc2VgIHRoYXQgcmVzb2x2ZXMgaWYgdGhlIG9wZXJhdGlvbiBpcyBzdWNjZXNzZnVsLCByZWplY3RzIG90aGVyd2lzZVxuICAgKi9cbiAgc2lnbk91dChyZXZva2U6IGJvb2xlYW4gPSBmYWxzZSk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgcmVqZWN0KFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9OT1RfSU5JVElBTElaRUQpO1xuICAgICAgfSBlbHNlIGlmICghdGhpcy5fdXNlcikge1xuICAgICAgICByZWplY3QoU29jaWFsQXV0aFNlcnZpY2UuRVJSX05PVF9MT0dHRURfSU4pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHByb3ZpZGVySWQgPSB0aGlzLl91c2VyLnByb3ZpZGVyO1xuICAgICAgICBsZXQgcHJvdmlkZXJPYmplY3QgPSB0aGlzLnByb3ZpZGVycy5nZXQocHJvdmlkZXJJZCk7XG4gICAgICAgIGlmIChwcm92aWRlck9iamVjdCkge1xuICAgICAgICAgIHByb3ZpZGVyT2JqZWN0XG4gICAgICAgICAgICAuc2lnbk91dChyZXZva2UpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgdGhpcy5zZXRVc2VyKG51bGwpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KFNvY2lhbEF1dGhTZXJ2aWNlLkVSUl9MT0dJTl9QUk9WSURFUl9OT1RfRk9VTkQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldFVzZXIodXNlcjogU29jaWFsVXNlciB8IG51bGwsIGlkPzogc3RyaW5nKSB7XG4gICAgaWYgKHVzZXIgJiYgaWQpIHVzZXIucHJvdmlkZXIgPSBpZDtcbiAgICB0aGlzLl91c2VyID0gdXNlcjtcbiAgICB0aGlzLl9hdXRoU3RhdGUubmV4dCh1c2VyKTtcbiAgfVxufVxuIl19