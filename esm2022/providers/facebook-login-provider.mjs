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
    static { this.PROVIDER_ID = 'FACEBOOK'; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZWJvb2stbG9naW4tcHJvdmlkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9saWIvc3JjL3Byb3ZpZGVycy9mYWNlYm9vay1sb2dpbi1wcm92aWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFJckQsTUFBTSxPQUFPLHFCQUFzQixTQUFRLGlCQUFpQjtJQVUxRCxZQUFvQixRQUFnQixFQUFFLGNBQXNCLEVBQUU7UUFDNUQsS0FBSyxFQUFFLENBQUM7UUFEVSxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBUDVCLG1CQUFjLEdBQUc7WUFDdkIsS0FBSyxFQUFFLHNCQUFzQjtZQUM3QixNQUFNLEVBQUUsT0FBTztZQUNmLE1BQU0sRUFBRSx5Q0FBeUM7WUFDakQsT0FBTyxFQUFFLE9BQU87U0FDakIsQ0FBQztRQUtBLElBQUksQ0FBQyxjQUFjLEdBQUc7WUFDcEIsR0FBRyxJQUFJLENBQUMsY0FBYztZQUN0QixHQUFHLFdBQVc7U0FDZixDQUFDO0lBQ0osQ0FBQztJQWhCRCxTQUF1QixnQkFBVyxHQUFXLFVBQVUsQ0FBQyxFQUFBO0lBa0J4RCxVQUFVO1FBQ1IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxJQUFJO2dCQUNGLElBQUksQ0FBQyxVQUFVLENBQ2IscUJBQXFCLENBQUMsV0FBVyxFQUNqQywwQkFBMEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLFNBQVMsRUFDN0QsR0FBRyxFQUFFO29CQUNILEVBQUUsQ0FBQyxJQUFJLENBQUM7d0JBQ04sS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRO3dCQUNwQixnQkFBZ0IsRUFBRSxJQUFJO3dCQUN0QixNQUFNLEVBQUUsSUFBSTt3QkFDWixL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TUFBTSxDQUFDLFNBQVMsQ0FBQzt3QkFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDO3dCQUUxQyxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQzt3QkFFdkIsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoQixDQUFDLENBQUMsQ0FBQztpQkFDSjtxQkFBTTtvQkFDTCxNQUFNLENBQUMsa0RBQWtELENBQUMsQ0FBQztpQkFDNUQ7WUFDSCxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNyQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBYSxFQUFFLEVBQUU7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDO1lBQ1osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTG9naW5Qcm92aWRlciB9IGZyb20gJy4uL2VudGl0aWVzL2Jhc2UtbG9naW4tcHJvdmlkZXInO1xuaW1wb3J0IHsgU29jaWFsVXNlciB9IGZyb20gJy4uL2VudGl0aWVzL3NvY2lhbC11c2VyJztcblxuZGVjbGFyZSBsZXQgRkI6IGFueTtcblxuZXhwb3J0IGNsYXNzIEZhY2Vib29rTG9naW5Qcm92aWRlciBleHRlbmRzIEJhc2VMb2dpblByb3ZpZGVyIHtcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQUk9WSURFUl9JRDogc3RyaW5nID0gJ0ZBQ0VCT09LJztcblxuICBwcml2YXRlIHJlcXVlc3RPcHRpb25zID0ge1xuICAgIHNjb3BlOiAnZW1haWwscHVibGljX3Byb2ZpbGUnLFxuICAgIGxvY2FsZTogJ2VuX1VTJyxcbiAgICBmaWVsZHM6ICduYW1lLGVtYWlsLHBpY3R1cmUsZmlyc3RfbmFtZSxsYXN0X25hbWUnLFxuICAgIHZlcnNpb246ICd2MTAuMCcsXG4gIH07XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbGllbnRJZDogc3RyaW5nLCBpbml0T3B0aW9uczogT2JqZWN0ID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5yZXF1ZXN0T3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMucmVxdWVzdE9wdGlvbnMsXG4gICAgICAuLi5pbml0T3B0aW9ucyxcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5sb2FkU2NyaXB0KFxuICAgICAgICAgIEZhY2Vib29rTG9naW5Qcm92aWRlci5QUk9WSURFUl9JRCxcbiAgICAgICAgICBgLy9jb25uZWN0LmZhY2Vib29rLm5ldC8ke3RoaXMucmVxdWVzdE9wdGlvbnMubG9jYWxlfS9zZGsuanNgLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIEZCLmluaXQoe1xuICAgICAgICAgICAgICBhcHBJZDogdGhpcy5jbGllbnRJZCxcbiAgICAgICAgICAgICAgYXV0b0xvZ0FwcEV2ZW50czogdHJ1ZSxcbiAgICAgICAgICAgICAgY29va2llOiB0cnVlLFxuICAgICAgICAgICAgICB4ZmJtbDogdHJ1ZSxcbiAgICAgICAgICAgICAgdmVyc2lvbjogdGhpcy5yZXF1ZXN0T3B0aW9ucy52ZXJzaW9uLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXRMb2dpblN0YXR1cygpOiBQcm9taXNlPFNvY2lhbFVzZXI+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgRkIuZ2V0TG9naW5TdGF0dXMoKHJlc3BvbnNlOiBhbnkpID0+IHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gJ2Nvbm5lY3RlZCcpIHtcbiAgICAgICAgICBsZXQgYXV0aFJlc3BvbnNlID0gcmVzcG9uc2UuYXV0aFJlc3BvbnNlO1xuICAgICAgICAgIEZCLmFwaShgL21lP2ZpZWxkcz0ke3RoaXMucmVxdWVzdE9wdGlvbnMuZmllbGRzfWAsIChmYlVzZXI6IGFueSkgPT4ge1xuICAgICAgICAgICAgbGV0IHVzZXI6IFNvY2lhbFVzZXIgPSBuZXcgU29jaWFsVXNlcigpO1xuXG4gICAgICAgICAgICB1c2VyLmlkID0gZmJVc2VyLmlkO1xuICAgICAgICAgICAgdXNlci5uYW1lID0gZmJVc2VyLm5hbWU7XG4gICAgICAgICAgICB1c2VyLmVtYWlsID0gZmJVc2VyLmVtYWlsO1xuICAgICAgICAgICAgdXNlci5waG90b1VybCA9XG4gICAgICAgICAgICAgICdodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8nICtcbiAgICAgICAgICAgICAgZmJVc2VyLmlkICtcbiAgICAgICAgICAgICAgJy9waWN0dXJlP3R5cGU9bm9ybWFsJmFjY2Vzc190b2tlbj0nICtcbiAgICAgICAgICAgICAgYXV0aFJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgdXNlci5maXJzdE5hbWUgPSBmYlVzZXIuZmlyc3RfbmFtZTtcbiAgICAgICAgICAgIHVzZXIubGFzdE5hbWUgPSBmYlVzZXIubGFzdF9uYW1lO1xuICAgICAgICAgICAgdXNlci5hdXRoVG9rZW4gPSBhdXRoUmVzcG9uc2UuYWNjZXNzVG9rZW47XG5cbiAgICAgICAgICAgIHVzZXIucmVzcG9uc2UgPSBmYlVzZXI7XG5cbiAgICAgICAgICAgIHJlc29sdmUodXNlcik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KFxuICAgICAgICAgICAgYE5vIHVzZXIgaXMgY3VycmVudGx5IGxvZ2dlZCBpbiB3aXRoICR7RmFjZWJvb2tMb2dpblByb3ZpZGVyLlBST1ZJREVSX0lEfWBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNpZ25JbihzaWduSW5PcHRpb25zPzogYW55KTogUHJvbWlzZTxTb2NpYWxVc2VyPiB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsgLi4udGhpcy5yZXF1ZXN0T3B0aW9ucywgLi4uc2lnbkluT3B0aW9ucyB9O1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBGQi5sb2dpbigocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICBpZiAocmVzcG9uc2UuYXV0aFJlc3BvbnNlKSB7XG4gICAgICAgICAgbGV0IGF1dGhSZXNwb25zZSA9IHJlc3BvbnNlLmF1dGhSZXNwb25zZTtcbiAgICAgICAgICBGQi5hcGkoYC9tZT9maWVsZHM9JHtvcHRpb25zLmZpZWxkc31gLCAoZmJVc2VyOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGxldCB1c2VyOiBTb2NpYWxVc2VyID0gbmV3IFNvY2lhbFVzZXIoKTtcblxuICAgICAgICAgICAgdXNlci5pZCA9IGZiVXNlci5pZDtcbiAgICAgICAgICAgIHVzZXIubmFtZSA9IGZiVXNlci5uYW1lO1xuICAgICAgICAgICAgdXNlci5lbWFpbCA9IGZiVXNlci5lbWFpbDtcbiAgICAgICAgICAgIHVzZXIucGhvdG9VcmwgPVxuICAgICAgICAgICAgICAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJyArXG4gICAgICAgICAgICAgIGZiVXNlci5pZCArXG4gICAgICAgICAgICAgICcvcGljdHVyZT90eXBlPW5vcm1hbCc7XG4gICAgICAgICAgICB1c2VyLmZpcnN0TmFtZSA9IGZiVXNlci5maXJzdF9uYW1lO1xuICAgICAgICAgICAgdXNlci5sYXN0TmFtZSA9IGZiVXNlci5sYXN0X25hbWU7XG4gICAgICAgICAgICB1c2VyLmF1dGhUb2tlbiA9IGF1dGhSZXNwb25zZS5hY2Nlc3NUb2tlbjtcblxuICAgICAgICAgICAgdXNlci5yZXNwb25zZSA9IGZiVXNlcjtcblxuICAgICAgICAgICAgcmVzb2x2ZSh1c2VyKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ1VzZXIgY2FuY2VsbGVkIGxvZ2luIG9yIGRpZCBub3QgZnVsbHkgYXV0aG9yaXplLicpO1xuICAgICAgICB9XG4gICAgICB9LCBvcHRpb25zKTtcbiAgICB9KTtcbiAgfVxuXG4gIHNpZ25PdXQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIEZCLmxvZ291dCgocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19