import { ElementRef } from '@angular/core';
import { SocialAuthService } from '../socialauth.service';
import * as i0 from "@angular/core";
export declare class GoogleSigninButtonDirective {
    type: 'icon' | 'standard';
    size: 'small' | 'medium' | 'large';
    text: 'signin_with' | 'signup_with' | 'continue_with';
    shape: 'square' | 'circle' | 'pill' | 'rectangular';
    theme: 'outline' | 'filled_blue' | 'filled_black';
    logo_alignment: 'left' | 'center';
    width: string;
    locale: string;
    constructor(el: ElementRef, socialAuthService: SocialAuthService);
    static ɵfac: i0.ɵɵFactoryDeclaration<GoogleSigninButtonDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<GoogleSigninButtonDirective, "asl-google-signin-button", never, { "type": "type"; "size": "size"; "text": "text"; "shape": "shape"; "theme": "theme"; "logo_alignment": "logo_alignment"; "width": "width"; "locale": "locale"; }, {}, never>;
}