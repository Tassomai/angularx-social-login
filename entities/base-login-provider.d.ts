import { EventEmitter } from '@angular/core';
import { LoginProvider } from './login-provider';
import { SocialUser } from './social-user';
export declare abstract class BaseLoginProvider implements LoginProvider {
    constructor();
    readonly changeUser?: EventEmitter<SocialUser>;
    abstract initialize(autoLogin?: boolean): Promise<void>;
    abstract getLoginStatus(): Promise<SocialUser>;
    abstract signIn(signInOptions?: object): Promise<SocialUser>;
    abstract signOut(revoke?: boolean): Promise<void>;
    refreshToken?(): Promise<SocialUser | null>;
    protected loadScript(id: string, src: string, onload: any, parentElement?: any): void;
}
