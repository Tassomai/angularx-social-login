import { NgModule, Optional, SkipSelf, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialAuthService, } from './socialauth.service';
import * as i0 from "@angular/core";
/**
 * The main module of angularx-social-login library.
 */
export class SocialLoginModule {
    constructor(parentModule) {
        if (parentModule) {
            throw new Error('SocialLoginModule is already loaded. Import it in the AppModule only');
        }
    }
    static initialize(config) {
        return {
            ngModule: SocialLoginModule,
            providers: [
                SocialAuthService,
                {
                    provide: 'SocialAuthServiceConfig',
                    useValue: config
                }
            ]
        };
    }
}
SocialLoginModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialLoginModule, deps: [{ token: SocialLoginModule, optional: true, skipSelf: true }], target: i0.ɵɵFactoryTarget.NgModule });
SocialLoginModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialLoginModule, imports: [CommonModule] });
SocialLoginModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialLoginModule, providers: [SocialAuthService], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: SocialLoginModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    providers: [SocialAuthService],
                }]
        }], ctorParameters: function () { return [{ type: SocialLoginModule, decorators: [{
                    type: Optional
                }, {
                    type: SkipSelf
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29jaWFsbG9naW4ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vcHJvamVjdHMvbGliL3NyYy9zb2NpYWxsb2dpbi5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLFFBQVEsRUFDUixRQUFRLEVBQ1IsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQ0wsaUJBQWlCLEdBRWxCLE1BQU0sc0JBQXNCLENBQUM7O0FBRTlCOztHQUVHO0FBS0gsTUFBTSxPQUFPLGlCQUFpQjtJQWM1QixZQUFvQyxZQUErQjtRQUNqRSxJQUFJLFlBQVksRUFBRTtZQUNoQixNQUFNLElBQUksS0FBSyxDQUNiLHNFQUFzRSxDQUFDLENBQUM7U0FDM0U7SUFDSCxDQUFDO0lBbEJNLE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBK0I7UUFDdEQsT0FBTztZQUNMLFFBQVEsRUFBRSxpQkFBaUI7WUFDM0IsU0FBUyxFQUFFO2dCQUNULGlCQUFpQjtnQkFDakI7b0JBQ0UsT0FBTyxFQUFFLHlCQUF5QjtvQkFDbEMsUUFBUSxFQUFFLE1BQU07aUJBQ2pCO2FBQ0Y7U0FDRixDQUFDO0lBQ0osQ0FBQzs7OEdBWlUsaUJBQWlCLGtCQWNzQixpQkFBaUI7K0dBZHhELGlCQUFpQixZQUhsQixZQUFZOytHQUdYLGlCQUFpQixhQUZqQixDQUFDLGlCQUFpQixDQUFDLFlBRHJCLENBQUMsWUFBWSxDQUFDOzJGQUdaLGlCQUFpQjtrQkFKN0IsUUFBUTttQkFBQztvQkFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLFNBQVMsRUFBRSxDQUFDLGlCQUFpQixDQUFDO2lCQUMvQjswREFlbUQsaUJBQWlCOzBCQUF0RCxRQUFROzswQkFBSSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgTmdNb2R1bGUsXG4gIE9wdGlvbmFsLFxuICBTa2lwU2VsZixcbiAgTW9kdWxlV2l0aFByb3ZpZGVycyxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuXG5pbXBvcnQge1xuICBTb2NpYWxBdXRoU2VydmljZSxcbiAgU29jaWFsQXV0aFNlcnZpY2VDb25maWcsXG59IGZyb20gJy4vc29jaWFsYXV0aC5zZXJ2aWNlJztcblxuLyoqXG4gKiBUaGUgbWFpbiBtb2R1bGUgb2YgYW5ndWxhcngtc29jaWFsLWxvZ2luIGxpYnJhcnkuXG4gKi9cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICBwcm92aWRlcnM6IFtTb2NpYWxBdXRoU2VydmljZV0sXG59KVxuZXhwb3J0IGNsYXNzIFNvY2lhbExvZ2luTW9kdWxlIHtcbiAgcHVibGljIHN0YXRpYyBpbml0aWFsaXplKGNvbmZpZzogU29jaWFsQXV0aFNlcnZpY2VDb25maWcpOiBNb2R1bGVXaXRoUHJvdmlkZXJzPFNvY2lhbExvZ2luTW9kdWxlPiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBTb2NpYWxMb2dpbk1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1xuICAgICAgICBTb2NpYWxBdXRoU2VydmljZSxcbiAgICAgICAge1xuICAgICAgICAgIHByb3ZpZGU6ICdTb2NpYWxBdXRoU2VydmljZUNvbmZpZycsXG4gICAgICAgICAgdXNlVmFsdWU6IGNvbmZpZ1xuICAgICAgICB9XG4gICAgICBdXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKEBPcHRpb25hbCgpIEBTa2lwU2VsZigpIHBhcmVudE1vZHVsZTogU29jaWFsTG9naW5Nb2R1bGUpIHtcbiAgICBpZiAocGFyZW50TW9kdWxlKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICdTb2NpYWxMb2dpbk1vZHVsZSBpcyBhbHJlYWR5IGxvYWRlZC4gSW1wb3J0IGl0IGluIHRoZSBBcHBNb2R1bGUgb25seScpO1xuICAgIH1cbiAgfVxufVxuIl19