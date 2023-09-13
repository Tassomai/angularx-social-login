import { Injector, NgZone, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginProvider } from './entities/login-provider';
import { SocialUser } from './entities/social-user';
import * as i0 from "@angular/core";
/**
 * An interface to define the shape of the service configuration options.
 */
export interface SocialAuthServiceConfig {
    autoLogin?: boolean;
    providers: {
        id: string;
        provider: LoginProvider | Type<LoginProvider>;
    }[];
    onError?: (error: any) => any;
}
/**
 * The service encapsulating the social login functionality. Exposes methods like
 * `signIn`, `signOut`. Also, exposes an `authState` `Observable` that one can
 * subscribe to get the current logged in user information.
 *
 * @dynamic
 */
export declare class SocialAuthService {
    private readonly _ngZone;
    private readonly _injector;
    private static readonly ERR_LOGIN_PROVIDER_NOT_FOUND;
    private static readonly ERR_NOT_LOGGED_IN;
    private static readonly ERR_NOT_INITIALIZED;
    private static readonly ERR_NOT_SUPPORTED_FOR_REFRESH_TOKEN;
    private static readonly ERR_NOT_SUPPORTED_FOR_ACCESS_TOKEN;
    private providers;
    private autoLogin;
    private _user;
    private _authState;
    private initialized;
    private _initState;
    /** An `Observable` that one can subscribe to get the current logged in user information */
    get authState(): Observable<SocialUser>;
    /** An `Observable` to communicate the readiness of the service and associated login providers */
    get initState(): Observable<boolean>;
    /**
     * @param config A `SocialAuthServiceConfig` object or a `Promise` that resolves to a `SocialAuthServiceConfig` object
     */
    constructor(config: SocialAuthServiceConfig | Promise<SocialAuthServiceConfig>, _ngZone: NgZone, _injector: Injector);
    private initialize;
    getAccessToken(providerId: string): Promise<string>;
    refreshAuthToken(providerId: string): Promise<void>;
    refreshAccessToken(providerId: string): Promise<void>;
    /**
     * A method used to sign in a user with a specific `LoginProvider`.
     *
     * @param providerId Id with which the `LoginProvider` has been registered with the service
     * @param signInOptions Optional `LoginProvider` specific arguments
     * @returns A `Promise` that resolves to the authenticated user information
     */
    signIn(providerId: string, signInOptions?: any): Promise<SocialUser>;
    /**
     * A method used to sign out the currently loggen in user.
     *
     * @param revoke Optional parameter to specify whether a hard sign out is to be performed
     * @returns A `Promise` that resolves if the operation is successful, rejects otherwise
     */
    signOut(revoke?: boolean): Promise<void>;
    private setUser;
    static ɵfac: i0.ɵɵFactoryDeclaration<SocialAuthService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SocialAuthService>;
}
