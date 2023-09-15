import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/social-user';
export class FacebookLoginProvider extends BaseLoginProvider {
    constructor(clientId, initOptions = {}) {
        super();
        this.clientId = clientId;
        this.requestOptions = {
            scope: 'email,public_profile',
            locale: 'en_US',
            fields: 'name,email,picture,first_name,last_name',
            version: 'v10.0',
        };
        this.requestOptions = {
            ...this.requestOptions,
            ...initOptions,
        };
    }
    initialize() {
        return new Promise((resolve, reject) => {
            try {
                this.loadScript(FacebookLoginProvider.PROVIDER_ID, `//connect.facebook.net/${this.requestOptions.locale}/sdk.js`, () => {
                    FB.init({
                        appId: this.clientId,
                        autoLogAppEvents: true,
                        cookie: true,
                        xfbml: true,
                        version: this.requestOptions.version,
                    });
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
            FB.getLoginStatus((response) => {
                if (response.status === 'connected') {
                    let authResponse = response.authResponse;
                    FB.api(`/me?fields=${this.requestOptions.fields}`, (fbUser) => {
                        let user = new SocialUser();
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl =
                            'https://graph.facebook.com/' +
                                fbUser.id +
                                '/picture?type=normal&access_token=' +
                                authResponse.accessToken;
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.authToken = authResponse.accessToken;
                        user.response = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject(`No user is currently logged in with ${FacebookLoginProvider.PROVIDER_ID}`);
                }
            });
        });
    }
    signIn(signInOptions) {
        const options = { ...this.requestOptions, ...signInOptions };
        return new Promise((resolve, reject) => {
            FB.login((response) => {
                if (response.authResponse) {
                    let authResponse = response.authResponse;
                    FB.api(`/me?fields=${options.fields}`, (fbUser) => {
                        let user = new SocialUser();
                        user.id = fbUser.id;
                        user.name = fbUser.name;
                        user.email = fbUser.email;
                        user.photoUrl =
                            'https://graph.facebook.com/' +
                                fbUser.id +
                                '/picture?type=normal';
                        user.firstName = fbUser.first_name;
                        user.lastName = fbUser.last_name;
                        user.authToken = authResponse.accessToken;
                        user.response = fbUser;
                        resolve(user);
                    });
                }
                else {
                    reject('User cancelled login or did not fully authorize.');
                }
            }, options);
        });
    }
    signOut() {
        return new Promise((resolve, reject) => {
            FB.logout((response) => {
                resolve();
            });
        });
    }
}
FacebookLoginProvider.PROVIDER_ID = 'FACEBOOK';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZWJvb2stbG9naW4tcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL3Byb3ZpZGVycy9mYWNlYm9vay1sb2dpbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFJckQsTUFBTSxPQUFPLHFCQUFzQixTQUFRLGlCQUFpQjtJQVUxRCxZQUFvQixRQUFnQixFQUFFLGNBQXNCLEVBQUU7UUFDNUQsS0FBSyxFQUFFLENBQUM7UUFEVSxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBUDVCLG1CQUFjLEdBQUc7WUFDdkIsS0FBSyxFQUFFLHNCQUFzQjtZQUM3QixNQUFNLEVBQUUsT0FBTztZQUNmLE1BQU0sRUFBRSx5Q0FBeUM7WUFDakQsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQztRQUtBLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsR0FBRyxJQUFJLENBQUMsY0FBYztZQUN0QixHQUFHLFdBQVc7U0FDZixDQUFDO0lBQ0osQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FDYixxQkFBcUIsQ0FBQyxXQUFXLEVBQ2pDLDBCQUEwQixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sU0FBUyxFQUM3RCxHQUFHLEVBQUU7b0JBQ0gsRUFBRSxDQUFDLElBQUksQ0FBQzt3QkFDTixLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7d0JBQ3BCLGdCQUFnQixFQUFFLElBQUk7d0JBQ3RCLE1BQU0sRUFBRSxJQUFJO3dCQUNaLEtBQUssRUFBRSxJQUFJO3dCQUNYLE9BQU8sRUFBRSxJQUFJLENBQUMs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UyxHQUFHLFlBQVksQ0FBQyxXQUFXLENBQUM7d0JBRTFDLElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDO3dCQUV2QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2hCLENBQUMsQ0FBQyxDQUFDO2lCQUNKO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO2lCQUM1RDtZQUNILENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3JDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFhLEVBQUUsRUFBRTtnQkFDMUIsT0FBTyxFQUFFLENBQUM7WUFDWixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7QUFoSHNCLGlDQUFXLEdBQVcsVUFBVSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxvZ2luUHJvdmlkZXIgfSBmcm9tICcuLi9lbnRpdGllcy9iYXNlLWxvZ2luLXByb3ZpZGVyJztcbmltcG9ydCB7IFNvY2lhbFVzZXIgfSBmcm9tICcuLi9lbnRpdGllcy9zb2NpYWwtdXNlcic7XG5cbmRlY2xhcmUgbGV0IEZCOiBhbnk7XG5cbmV4cG9ydCBjbGFzcyBGYWNlYm9va0xvZ2luUHJvdmlkZXIgZXh0ZW5kcyBCYXNlTG9naW5Qcm92aWRlciB7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPVklERVJfSUQ6IHN0cmluZyA9ICdGQUNFQk9PSyc7XG5cbiAgcHJpdmF0ZSByZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICBzY29wZTogJ2VtYWlsLHB1YmxpY19wcm9maWxlJyxcbiAgICBsb2NhbGU6ICdlbl9VUycsXG4gICAgZmllbGRzOiAnbmFtZSxlbWFpbCxwaWN0dXJlLGZpcnN0X25hbWUsbGFzdF9uYW1lJyxcbiAgICB2ZXJzaW9uOiAndjEwLjAnLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2xpZW50SWQ6IHN0cmluZywgaW5pdE9wdGlvbnM6IE9iamVjdCA9IHt9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMucmVxdWVzdE9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLnJlcXVlc3RPcHRpb25zLFxuICAgICAgLi4uaW5pdE9wdGlvbnMsXG4gICAgfTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRoaXMubG9hZFNjcmlwdChcbiAgICAgICAgICBGYWNlYm9va0xvZ2luUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICAgYC8vY29ubmVjdC5mYWNlYm9vay5uZXQvJHt0aGlzLnJlcXVlc3RPcHRpb25zLmxvY2FsZX0vc2RrLmpzYCxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBGQi5pbml0KHtcbiAgICAgICAgICAgICAgYXBwSWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICAgIGF1dG9Mb2dBcHBFdmVudHM6IHRydWUsXG4gICAgICAgICAgICAgIGNvb2tpZTogdHJ1ZSxcbiAgICAgICAgICAgICAgeGZibWw6IHRydWUsXG4gICAgICAgICAgICAgIHZlcnNpb246IHRoaXMucmVxdWVzdE9wdGlvbnMudmVyc2lvbixcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0TG9naW5TdGF0dXMoKTogUHJvbWlzZTxTb2NpYWxVc2VyPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIEZCLmdldExvZ2luU3RhdHVzKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09ICdjb25uZWN0ZWQnKSB7XG4gICAgICAgICAgbGV0IGF1dGhSZXNwb25zZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZTtcbiAgICAgICAgICBGQi5hcGkoYC9tZT9maWVsZHM9JHt0aGlzLnJlcXVlc3RPcHRpb25zLmZpZWxkc31gLCAoZmJVc2VyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCB1c2VyOiBTb2NpYWxVc2VyID0gbmV3IFNvY2lhbFVzZXIoKTtcblxuICAgICAgICAgICAgdXNlci5pZCA9IGZiVXNlci5pZDtcbiAgICAgICAgICAgIHVzZXIubmFtZSA9IGZiVXNlci5uYW1lO1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IGZiVXNlci5lbWFpbDtcbiAgICAgICAgICAgIHVzZXIucGhvdG9VcmwgPVxuICAgICAgICAgICAgICAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJyArXG4gICAgICAgICAgICAgIGZiVXNlci5pZCArXG4gICAgICAgICAgICAgICcvcGljdHVyZT90eXBlPW5vcm1hbCZhY2Nlc3NfdG9rZW49JyArXG4gICAgICAgICAgICAgIGF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgIHVzZXIuZmlyc3ROYW1lID0gZmJVc2VyLmZpcnN0X25hbWU7XG4gICAgICAgICAgICB1c2VyLmxhc3ROYW1lID0gZmJVc2VyLmxhc3RfbmFtZTtcbiAgICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xuXG4gICAgICAgICAgICB1c2VyLnJlc3BvbnNlID0gZmJVc2VyO1xuXG4gICAgICAgICAgICByZXNvbHZlKHVzZXIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChcbiAgICAgICAgICAgIGBObyB1c2VyIGlzIGN1cnJlbnRseSBsb2dnZWQgaW4gd2l0aCAke0ZhY2Vib29rTG9naW5Qcm92aWRlci5QUk9WSURFUl9JRH1gXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBzaWduSW4oc2lnbkluT3B0aW9ucz86IGFueSk6IFByb21pc2U8U29jaWFsVXNlcj4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7IC4uLnRoaXMucmVxdWVzdE9wdGlvbnMsIC4uLnNpZ25Jbk9wdGlvbnMgfTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgRkIubG9naW4oKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLmF1dGhSZXNwb25zZSkge1xuICAgICAgICAgIGxldCBhdXRoUmVzcG9uc2UgPSByZXNwb25zZS5hdXRoUmVzcG9uc2U7XG4gICAgICAgICAgRkIuYXBpKGAvbWU/ZmllbGRzPSR7b3B0aW9ucy5maWVsZHN9YCwgKGZiVXNlcjogYW55KSA9PiB7XG4gICAgICAgICAgICBsZXQgdXNlcjogU29jaWFsVXNlciA9IG5ldyBTb2NpYWxVc2VyKCk7XG5cbiAgICAgICAgICAgIHVzZXIuaWQgPSBmYlVzZXIuaWQ7XG4gICAgICAgICAgICB1c2VyLm5hbWUgPSBmYlVzZXIubmFtZTtcbiAgICAgICAgICAgIHVzZXIuZW1haWwgPSBmYlVzZXIuZW1haWw7XG4gICAgICAgICAgICB1c2VyLnBob3RvVXJsID1cbiAgICAgICAgICAgICAgJ2h0dHBzOi8vZ3JhcGguZmFjZWJvb2suY29tLycgK1xuICAgICAgICAgICAgICBmYlVzZXIuaWQgK1xuICAgICAgICAgICAgICAnL3BpY3R1cmU/dHlwZT1ub3JtYWwnO1xuICAgICAgICAgICAgdXNlci5maXJzdE5hbWUgPSBmYlVzZXIuZmlyc3RfbmFtZTtcbiAgICAgICAgICAgIHVzZXIubGFzdE5hbWUgPSBmYlVzZXIubGFzdF9uYW1lO1xuICAgICAgICAgICAgdXNlci5hdXRoVG9rZW4gPSBhdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW47XG5cbiAgICAgICAgICAgIHVzZXIucmVzcG9uc2UgPSBmYlVzZXI7XG5cbiAgICAgICAgICAgIHJlc29sdmUodXNlcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdVc2VyIGNhbmNlbGxlZCBsb2dpbiBvciBkaWQgbm90IGZ1bGx5IGF1dGhvcml6ZS4nKTtcbiAgICAgICAgfVxuICAgICAgfSwgb3B0aW9ucyk7XG4gICAgfSk7XG4gIH1cblxuICBzaWduT3V0KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBGQi5sb2dvdXQoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==