import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/social-user';
import { EventEmitter } from '@angular/core';
export interface GoogleInitOptions {
    /**
     * enables the One Tap mechanism, and makes auto-login possible
     */
    oneTapEnabled?: boolean;
    /**
     * list of permission scopes to grant in case we request an access token
     */
    scopes?: string | string[];
    /**
      * This attribute sets the DOM ID of the container element. If it's not set, the One Tap prompt is displayed in the top-right corner of the window.
      */
    prompt_parent_id?: string;
    /**
     * Optional, defaults to 'select_account'.
     * A space-delimited, case-sensitive list of prompts to present the
     * user.
     * Possible values are:
     * empty string The user will be prompted only the first time your
     *     app requests access. Cannot be specified with other values.
     * 'none' Do not display any authentication or consent screens. Must
     *     not be specified with other values.
     * 'consent' Prompt the user for consent.
     * 'select_account' Prompt the user to select an account.
     */
    prompt?: '' | 'none' | 'consent' | 'select_account';
}
export declare class GoogleLoginProvider extends BaseLoginProvider {
    private clientId;
    private readonly initOptions?;
    static readonly PROVIDER_ID: string;
    readonly changeUser: EventEmitter<SocialUser>;
    private readonly _socialUser;
    private readonly _accessToken;
    private readonly _receivedAccessToken;
    private _tokenClient;
    constructor(clientId: string, initOptions?: GoogleInitOptions);
    initialize(autoLogin?: boolean): Promise<void>;
    getLoginStatus(): Promise<SocialUser>;
    refreshToken(): Promise<SocialUser | null>;
    getAccessToken(): Promise<string>;
    revokeAccessToken(): Promise<void>;
    signIn(): Promise<SocialUser>;
    signOut(): Promise<void>;
    private createSocialUser;
    private decodeJwt;
}