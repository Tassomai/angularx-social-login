import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/social-user';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter, skip, take } from 'rxjs/operators';
const defaultInitOptions = {
    oneTapEnabled: true,
};
export class GoogleLoginProvider extends BaseLoginProvider {
    constructor(clientId, initOptions) {
        super();
        this.clientId = clientId;
        this.initOptions = initOptions;
        this.changeUser = new EventEmitter();
        this._socialUser = new BehaviorSubject(null);
        this._accessToken = new BehaviorSubject(null);
        this._receivedAccessToken = new EventEmitter();
        this.initOptions = { ...defaultInitOptions, ...this.initOptions };
        // emit changeUser events but skip initial value from behaviorSubject
        this._socialUser.pipe(skip(1)).subscribe(this.changeUser);
        // emit receivedAccessToken but skip initial value from behaviorSubject
        this._accessToken.pipe(skip(1)).subscribe(this._receivedAccessToken);
    }
    initialize(autoLogin) {
        return new Promise((resolve, reject) => {
            try {
                this.loadScript(GoogleLoginProvider.PROVIDER_ID, 'https://accounts.google.com/gsi/client', () => {
                    google.accounts.id.initialize({
                        client_id: this.clientId,
                        auto_select: autoLogin,
                        callback: ({ credential }) => {
                            const socialUser = this.createSocialUser(credential);
                            this._socialUser.next(socialUser);
                        },
                        prompt_parent_id: this.initOptions?.prompt_parent_id,
                        itp_support: this.initOptions.oneTapEnabled
                    });
                    if (this.initOptions.oneTapEnabled) {
                        this._socialUser
                            .pipe(filter((user) => user === null))
                            .subscribe(() => google.accounts.id.prompt(console.debug));
                    }
                    if (this.initOptions.scopes) {
                        const scope = this.initOptions.scopes instanceof Array
                            ? this.initOptions.scopes.filter((s) => s).join(' ')
                            : this.initOptions.scopes;
                        this._tokenClient = google.accounts.oauth2.initTokenClient({
                            client_id: this.clientId,
                            scope,
                            prompt: this.initOptions.prompt,
                            callback: (tokenResponse) => {
                                if (tokenResponse.error) {
                                    this._accessToken.error({
                                        code: tokenResponse.error,
                                        description: tokenResponse.error_description,
                                        uri: tokenResponse.error_uri,
                                    });
                                }
                                else {
                                    this._accessToken.next(tokenResponse.access_token);
                                }
                            },
                        });
                    }
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getLoginStatus() {
        return new Promise((resolve, reject) => {
            if (this._socialUser.value) {
                resolve(this._socialUser.value);
            }
            else {
                reject(`No user is currently logged in with ${GoogleLoginProvider.PROVIDER_ID}`);
            }
        });
    }
    refreshToken() {
        return new Promise((resolve, reject) => {
            google.accounts.id.revoke(this._socialUser.value.id, (response) => {
                if (response.error)
                    reject(response.error);
                else
                    resolve(this._socialUser.value);
            });
        });
    }
    getAccessToken() {
        return new Promise((resolve, reject) => {
            if (!this._tokenClient) {
                if (this._socialUser.value) {
                    reject('No token client was instantiated, you should specify some scopes.');
                }
                else {
                    reject('You should be logged-in first.');
                }
            }
            else {
                this._tokenClient.requestAccessToken({
                    hint: this._socialUser.value?.email,
                });
                this._receivedAccessToken.pipe(take(1)).subscribe(resolve);
            }
        });
    }
    revokeAccessToken() {
        return new Promise((resolve, reject) => {
            if (!this._tokenClient) {
                reject('No token client was instantiated, you should specify some scopes.');
            }
            else if (!this._accessToken.value) {
                reject('No access token to revoke');
            }
            else {
                google.accounts.oauth2.revoke(this._accessToken.value, () => {
                    this._accessToken.next(null);
                    resolve();
                });
            }
        });
    }
    signIn() {
        return Promise.reject('You should not call this method directly for Google, use "<asl-google-signin-button>" wrapper ' +
            'or generate the button yourself with "google.accounts.id.renderButton()" ' +
            '(https://developers.google.com/identity/gsi/web/guides/display-button#javascript)');
    }
    async signOut() {
        google.accounts.id.disableAutoSelect();
        this._socialUser.next(null);
    }
    createSocialUser(idToken) {
        const user = new SocialUser();
        user.idToken = idToken;
        const payload = this.decodeJwt(idToken);
        user.id = payload.sub;
        user.name = payload.name;
        user.email = payload.email;
        user.photoUrl = payload.picture;
        user.firstName = payload['given_name'];
        user.lastName = payload['family_name'];
        return user;
    }
    decodeJwt(idToken) {
        const base64Url = idToken.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(window.atob(base64)
            .split("")
            .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
            .join(""));
        return JSON.parse(jsonPayload);
    }
}
GoogleLoginProvider.PROVIDER_ID = 'GOOGLE';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWxvZ2luLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGliL3NyYy9wcm92aWRlcnMvZ29vZ2xlLWxvZ2luLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdkMsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUErQnBELE1BQU0sa0JBQWtCLEdBQXNCO0lBQzVDLGFBQWEsRUFBRSxJQUFJO0NBQ3BCLENBQUM7QUFFRixNQUFNLE9BQU8sbUJBQW9CLFNBQVEsaUJBQWlCO0lBVXhELFlBQ1UsUUFBZ0IsRUFDUCxXQUErQjtRQUVoRCxLQUFLLEVBQUUsQ0FBQztRQUhBLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDUCxnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFUbEMsZUFBVSxHQUFHLElBQUksWUFBWSxFQUFxQixDQUFDO1FBRWxELGdCQUFXLEdBQUcsSUFBSSxlQUFlLENBQW9CLElBQUksQ0FBQyxDQUFDO1FBQzNELGlCQUFZLEdBQUcsSUFBSSxlQUFlLENBQWdCLElBQUksQ0FBQyxDQUFDO1FBQ3hELHlCQUFvQixHQUFHLElBQUksWUFBWSxFQUFVLENBQUM7UUFTakUsSUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLEdBQUcsa0JBQWtCLEVBQUUsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFbEUscUVBQXFFO1FBQ3JFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFD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LENBQUMsQ0FBQztRQUMvRCxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsRUFBRSxDQUFDLENBQ1osQ0FBQztRQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqQyxDQUFDOztBQWhMc0IsK0JBQVcsR0FBVyxRQUFRLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTG9naW5Qcm92aWRlciB9IGZyb20gJy4uL2VudGl0aWVzL2Jhc2UtbG9naW4tcHJvdmlkZXInO1xuaW1wb3J0IHsgU29jaWFsVXNlciB9IGZyb20gJy4uL2VudGl0aWVzL3NvY2lhbC11c2VyJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBmaWx0ZXIsIHNraXAsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR29vZ2xlSW5pdE9wdGlvbnMge1xuICAvKipcbiAgICogZW5hYmxlcyB0aGUgT25lIFRhcCBtZWNoYW5pc20sIGFuZCBtYWtlcyBhdXRvLWxvZ2luIHBvc3NpYmxlXG4gICAqL1xuICBvbmVUYXBFbmFibGVkPzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIGxpc3Qgb2YgcGVybWlzc2lvbiBzY29wZXMgdG8gZ3JhbnQgaW4gY2FzZSB3ZSByZXF1ZXN0IGFuIGFjY2VzcyB0b2tlblxuICAgKi9cbiAgc2NvcGVzPzogc3RyaW5nIHwgc3RyaW5nW107XG4gLyoqXG4gICAqIFRoaXMgYXR0cmlidXRlIHNldHMgdGhlIERPTSBJRCBvZiB0aGUgY29udGFpbmVyIGVsZW1lbnQuIElmIGl0J3Mgbm90IHNldCwgdGhlIE9uZSBUYXAgcHJvbXB0IGlzIGRpc3BsYXllZCBpbiB0aGUgdG9wLXJpZ2h0IGNvcm5lciBvZiB0aGUgd2luZG93LlxuICAgKi9cbiAgcHJvbXB0X3BhcmVudF9pZD86IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9uYWwsIGRlZmF1bHRzIHRvICdzZWxlY3RfYWNjb3VudCcuXG4gICAqIEEgc3BhY2UtZGVsaW1pdGVkLCBjYXNlLXNlbnNpdGl2ZSBsaXN0IG9mIHByb21wdHMgdG8gcHJlc2VudCB0aGVcbiAgICogdXNlci5cbiAgICogUG9zc2libGUgdmFsdWVzIGFyZTpcbiAgICogZW1wdHkgc3RyaW5nIFRoZSB1c2VyIHdpbGwgYmUgcHJvbXB0ZWQgb25seSB0aGUgZmlyc3QgdGltZSB5b3VyXG4gICAqICAgICBhcHAgcmVxdWVzdHMgYWNjZXNzLiBDYW5ub3QgYmUgc3BlY2lmaWVkIHdpdGggb3RoZXIgdmFsdWVzLlxuICAgKiAnbm9uZScgRG8gbm90IGRpc3BsYXkgYW55IGF1dGhlbnRpY2F0aW9uIG9yIGNvbnNlbnQgc2NyZWVucy4gTXVzdFxuICAgKiAgICAgbm90IGJlIHNwZWNpZmllZCB3aXRoIG90aGVyIHZhbHVlcy5cbiAgICogJ2NvbnNlbnQnIFByb21wdCB0aGUgdXNlciBmb3IgY29uc2VudC5cbiAgICogJ3NlbGVjdF9hY2NvdW50JyBQcm9tcHQgdGhlIHVzZXIgdG8gc2VsZWN0IGFuIGFjY291bnQuXG4gICAqL1xuICBwcm9tcHQ/IDogJycgfCAnbm9uZScgfCAnY29uc2VudCcgfCAnc2VsZWN0X2FjY291bnQnO1xufVxuXG5jb25zdCBkZWZhdWx0SW5pdE9wdGlvbnM6IEdvb2dsZUluaXRPcHRpb25zID0ge1xuICBvbmVUYXBFbmFibGVkOiB0cnVlLFxufTtcblxuZXhwb3J0IGNsYXNzIEdvb2dsZUxvZ2luUHJvdmlkZXIgZXh0ZW5kcyBCYXNlTG9naW5Qcm92aWRlciB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPVklERVJfSUQ6IHN0cmluZyA9ICdHT09HTEUnO1xuXG4gIHB1YmxpYyByZWFkb25seSBjaGFuZ2VVc2VyID0gbmV3IEV2ZW50RW1pdHRlcjxTb2NpYWxVc2VyIHwgbnVsbD4oKTtcblxuICBwcml2YXRlIHJlYWRvbmx5IF9zb2NpYWxVc2VyID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTb2NpYWxVc2VyIHwgbnVsbD4obnVsbCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgX2FjY2Vzc1Rva2VuID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmcgfCBudWxsPihudWxsKTtcbiAgcHJpdmF0ZSByZWFkb25seSBfcmVjZWl2ZWRBY2Nlc3NUb2tlbiA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICBwcml2YXRlIF90b2tlbkNsaWVudDogZ29vZ2xlLmFjY291bnRzLm9hdXRoMi5Ub2tlbkNsaWVudCB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNsaWVudElkOiBzdHJpbmcsXG4gICAgcHJpdmF0ZSByZWFkb25seSBpbml0T3B0aW9ucz86IEdvb2dsZUluaXRPcHRpb25zXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmluaXRPcHRpb25zID0geyAuLi5kZWZhdWx0SW5pdE9wdGlvbnMsIC4uLnRoaXMuaW5pdE9wdGlvbnMgfTtcblxuICAgIC8vIGVtaXQgY2hhbmdlVXNlciBldmVudHMgYnV0IHNraXAgaW5pdGlhbCB2YWx1ZSBmcm9tIGJlaGF2aW9yU3ViamVjdFxuICAgIHRoaXMuX3NvY2lhbFVzZXIucGlwZShza2lwKDEpKS5zdWJzY3JpYmUodGhpcy5jaGFuZ2VVc2VyKTtcblxuICAgIC8vIGVtaXQgcmVjZWl2ZWRBY2Nlc3NUb2tlbiBidXQgc2tpcCBpbml0aWFsIHZhbHVlIGZyb20gYmVoYXZpb3JTdWJqZWN0XG4gICAgdGhpcy5fYWNjZXNzVG9rZW4ucGlwZShza2lwKDEpKS5zdWJzY3JpYmUodGhpcy5fcmVjZWl2ZWRBY2Nlc3NUb2tlbik7XG4gIH1cblxuICBpbml0aWFsaXplKGF1dG9Mb2dpbj86IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5sb2FkU2NyaXB0KFxuICAgICAgICAgIEdvb2dsZUxvZ2luUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgJ2h0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9nc2kvY2xpZW50JyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBnb29nbGUuYWNjb3VudHMuaWQuaW5pdGlhbGl6ZSh7XG4gICAgICAgICAgICAgIGNsaWVudF9pZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgYXV0b19zZWxlY3Q6IGF1dG9Mb2dpbixcbiAgICAgICAgICAgICAgY2FsbGJhY2s6ICh7IGNyZWRlbnRpYWwgfSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvY2lhbFVzZXIgPSB0aGlzLmNyZWF0ZVNvY2lhbFVzZXIoY3JlZGVudGlhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fc29jaWFsVXNlci5uZXh0KHNvY2lhbFVzZXIpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBwcm9tcHRfcGFyZW50X2lkOiB0aGlzLmluaXRPcHRpb25zPy5wcm9tcHRfcGFyZW50X2lkLFxuICAgICAgICAgICAgICBpdHBfc3VwcG9ydDogdGhpcy5pbml0T3B0aW9ucy5vbmVUYXBFbmFibGVkXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuaW5pdE9wdGlvbnMub25lVGFwRW5hYmxlZCkge1xuICAgICAgICAgICAgICB0aGlzLl9zb2NpYWxVc2VyXG4gICAgICAgICAgICAgICAgLnBpcGUoZmlsdGVyKCh1c2VyKSA9PiB1c2VyID09PSBudWxsKSlcbiAgICAgICAgICAgICAgICAuc3Vic2NyaWJlKCgpID0+IGdvb2dsZS5hY2NvdW50cy5pZC5wcm9tcHQoY29uc29sZS5kZWJ1ZykpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodGhpcy5pbml0T3B0aW9ucy5zY29wZXMpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2NvcGUgPVxuICAgICAgICAgICAgICAgIHRoaXMuaW5pdE9wdGlvbnMuc2NvcGVzIGluc3RhbmNlb2YgQXJyYXlcbiAgICAgICAgICAgICAgICAgID8gdGhpcy5pbml0T3B0aW9ucy5zY29wZXMuZmlsdGVyKChzKSA9PiBzKS5qb2luKCcgJylcbiAgICAgICAgICAgICAgICAgIDogdGhpcy5pbml0T3B0aW9ucy5zY29wZXM7XG5cbiAgICAgICAgICAgICAgdGhpcy5fdG9rZW5DbGllbnQgPSBnb29nbGUuYWNjb3VudHMub2F1dGgyLmluaXRUb2tlbkNsaWVudCh7XG4gICAgICAgICAgICAgICAgY2xpZW50X2lkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgICAgIHNjb3BlLFxuICAgICAgICAgICAgICAgIHByb21wdCA6IHRoaXMuaW5pdE9wdGlvbnMucHJvbXB0LFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiAodG9rZW5SZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHRva2VuUmVzcG9uc2UuZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW4uZXJyb3Ioe1xuICAgICAgICAgICAgICAgICAgICAgIGNvZGU6IHRva2VuUmVzcG9uc2UuZXJyb3IsXG4gICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHRva2VuUmVzcG9uc2UuZXJyb3JfZGVzY3JpcHRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgdXJpOiB0b2tlblJlc3BvbnNlLmVycm9yX3VyaSxcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9hY2Nlc3NUb2tlbi5uZXh0KHRva2VuUmVzcG9uc2UuYWNjZXNzX3Rva2VuKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldExvZ2luU3RhdHVzKCk6IFByb21pc2U8U29jaWFsVXNlcj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAodGhpcy5fc29jaWFsVXNlci52YWx1ZSkge1xuICAgICAgICByZXNvbHZlKHRoaXMuX3NvY2lhbFVzZXIudmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KFxuICAgICAgICAgIGBObyB1c2VyIGlzIGN1cnJlbnRseSBsb2dnZWQgaW4gd2l0aCAke0dvb2dsZUxvZ2luUHJvdmlkZXIuUFJPVklERVJfSUR9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmVmcmVzaFRva2VuKCk6IFByb21pc2U8U29jaWFsVXNlciB8IG51bGw+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZ29vZ2xlLmFjY291bnRzLmlkLnJldm9rZSh0aGlzLl9zb2NpYWxVc2VyLnZhbHVlLmlkLCAocmVzcG9uc2UpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSByZWplY3QocmVzcG9uc2UuZXJyb3IpO1xuICAgICAgICBlbHNlIHJlc29sdmUodGhpcy5fc29jaWFsVXNlci52YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldEFjY2Vzc1Rva2VuKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGlmICghdGhpcy5fdG9rZW5DbGllbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuX3NvY2lhbFVzZXIudmFsdWUpIHtcbiAgICAgICAgICByZWplY3QoXG4gICAgICAgICAgICAnTm8gdG9rZW4gY2xpZW50IHdhcyBpbnN0YW50aWF0ZWQsIHlvdSBzaG91bGQgc3BlY2lmeSBzb21lIHNjb3Blcy4nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ1lvdSBzaG91bGQgYmUgbG9nZ2VkLWluIGZpcnN0LicpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl90b2tlbkNsaWVudC5yZXF1ZXN0QWNjZXNzVG9rZW4oe1xuICAgICAgICAgIGhpbnQ6IHRoaXMuX3NvY2lhbFVzZXIudmFsdWU/LmVtYWlsLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcmVjZWl2ZWRBY2Nlc3NUb2tlbi5waXBlKHRha2UoMSkpLnN1YnNjcmliZShyZXNvbHZlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldm9rZUFjY2Vzc1Rva2VuKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBpZiAoIXRoaXMuX3Rva2VuQ2xpZW50KSB7XG4gICAgICAgIHJlamVjdChcbiAgICAgICAgICAnTm8gdG9rZW4gY2xpZW50IHdhcyBpbnN0YW50aWF0ZWQsIHlvdSBzaG91bGQgc3BlY2lmeSBzb21lIHNjb3Blcy4nXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLl9hY2Nlc3NUb2tlbi52YWx1ZSkge1xuICAgICAgICByZWplY3QoJ05vIGFjY2VzcyB0b2tlbiB0byByZXZva2UnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdvb2dsZS5hY2NvdW50cy5vYXV0aDIucmV2b2tlKHRoaXMuX2FjY2Vzc1Rva2VuLnZhbHVlLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5fYWNjZXNzVG9rZW4ubmV4dChudWxsKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2lnbkluKCk6IFByb21pc2U8U29jaWFsVXNlcj4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChcbiAgICAgICdZb3Ugc2hvdWxkIG5vdCBjYWxsIHRoaXMgbWV0aG9kIGRpcmVjdGx5IGZvciBHb29nbGUsIHVzZSBcIjxhc2wtZ29vZ2xlLXNpZ25pbi1idXR0b24+XCIgd3JhcHBlciAnICtcbiAgICAgICAgJ29yIGdlbmVyYXRlIHRoZSBidXR0b24geW91cnNlbGYgd2l0aCBcImdvb2dsZS5hY2NvdW50cy5pZC5yZW5kZXJCdXR0b24oKVwiICcgK1xuICAgICAgICAnKGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2lkZW50aXR5L2dzaS93ZWIvZ3VpZGVzL2Rpc3BsYXktYnV0dG9uI2phdmFzY3JpcHQpJ1xuICAgICk7XG4gIH1cblxuICBhc3luYyBzaWduT3V0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGdvb2dsZS5hY2NvdW50cy5pZC5kaXNhYmxlQXV0b1NlbGVjdCgpO1xuICAgIHRoaXMuX3NvY2lhbFVzZXIubmV4dChudWxsKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU29jaWFsVXNlcihpZFRva2VuOiBzdHJpbmcpIHtcbiAgICBjb25zdCB1c2VyID0gbmV3IFNvY2lhbFVzZXIoKTtcbiAgICB1c2VyLmlkVG9rZW4gPSBpZFRva2VuO1xuICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmRlY29kZUp3dChpZFRva2VuKTtcbiAgICB1c2VyLmlkID0gcGF5bG9hZC5zdWI7XG4gICAgdXNlci5uYW1lID0gcGF5bG9hZC5uYW1lO1xuICAgIHVzZXIuZW1haWwgPSBwYXlsb2FkLmVtYWlsO1xuICAgIHVzZXIucGhvdG9VcmwgPSBwYXlsb2FkLnBpY3R1cmU7XG4gICAgdXNlci5maXJzdE5hbWUgPSBwYXlsb2FkWydnaXZlbl9uYW1lJ107XG4gICAgdXNlci5sYXN0TmFtZSA9IHBheWxvYWRbJ2ZhbWlseV9uYW1lJ107XG4gICAgcmV0dXJuIHVzZXI7XG4gIH1cblxuICBwcml2YXRlIGRlY29kZUp3dChpZFRva2VuOiBzdHJpbmcpOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBiYXNlNjRVcmwgPSBpZFRva2VuLnNwbGl0KFwiLlwiKVsxXTtcbiAgICBjb25zdCBiYXNlNjQgPSBiYXNlNjRVcmwucmVwbGFjZSgvLS9nLCBcIitcIikucmVwbGFjZSgvXy9nLCBcIi9cIik7XG4gICAgY29uc3QganNvblBheWxvYWQgPSBkZWNvZGVVUklDb21wb25lbnQoXG4gICAgICB3aW5kb3cuYXRvYihiYXNlNjQpXG4gICAgICAgIC5zcGxpdChcIlwiKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChjKSB7XG4gICAgICAgICAgcmV0dXJuIFwiJVwiICsgKFwiMDBcIiArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC0yKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmpvaW4oXCJcIilcbiAgICApO1xuICAgIHJldHVybiBKU09OLnBhcnNlKGpzb25QYXlsb2FkKTtcbiAgfVxufVxuIl19