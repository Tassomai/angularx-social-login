import { BaseLoginProvider } from '../entities/base-login-provider';
import { SocialUser } from '../entities/social-user';
/**
 * Protocol modes supported by MSAL.
 */
export var ProtocolMode;
(function (ProtocolMode) {
    ProtocolMode["AAD"] = "AAD";
    ProtocolMode["OIDC"] = "OIDC";
})(ProtocolMode || (ProtocolMode = {}));
const COMMON_AUTHORITY = 'https://login.microsoftonline.com/common/';
/**
 * Microsoft Authentication using MSAL v2: https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser
 */
export class MicrosoftLoginProvider extends BaseLoginProvider {
    constructor(clientId, initOptions) {
        super();
        this.clientId = clientId;
        this.initOptions = {
            authority: COMMON_AUTHORITY,
            scopes: ['openid', 'email', 'profile', 'User.Read'],
            knownAuthorities: [],
            protocolMode: ProtocolMode.AAD,
            clientCapabilities: [],
            cacheLocation: 'sessionStorage'
        };
        this.initOptions = {
            ...this.initOptions,
            ...initOptions
        };
    }
    initialize() {
        return new Promise((resolve, reject) => {
            this.loadScript(MicrosoftLoginProvider.PROVIDER_ID, 'https://alcdn.msauth.net/browser/2.13.1/js/msal-browser.min.js', () => {
                try {
                    const config = {
                        auth: {
                            clientId: this.clientId,
                            redirectUri: this.initOptions.redirect_uri ?? location.origin,
                            authority: this.initOptions.authority,
                            knownAuthorities: this.initOptions.knownAuthorities,
                            protocolMode: this.initOptions.protocolMode,
                            clientCapabilities: this.initOptions.clientCapabilities
                        },
                        cache: !this.initOptions.cacheLocation ? null : {
                            cacheLocation: this.initOptions.cacheLocation
                        }
                    };
                    this._instance = new msal.PublicClientApplication(config);
                    resolve();
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    getSocialUser(loginResponse) {
        return new Promise((resolve, reject) => {
            //After login, use Microsoft Graph API to get user info
            let meRequest = new XMLHttpRequest();
            meRequest.onreadystatechange = () => {
                if (meRequest.readyState == 4) {
                    try {
                        if (meRequest.status == 200) {
                            let userInfo = JSON.parse(meRequest.responseText);
                            let user = new SocialUser();
                            user.provider = MicrosoftLoginProvider.PROVIDER_ID;
                            user.id = loginResponse.idToken;
                            user.authToken = loginResponse.accessToken;
                            user.name = loginResponse.idTokenClaims.name;
                            user.email = loginResponse.account.username;
                            user.idToken = loginResponse.idToken;
                            user.response = loginResponse;
                            user.firstName = userInfo.givenName;
                            user.lastName = userInfo.surname;
                            resolve(user);
                        }
                        else {
                            reject(`Error retrieving user info: ${meRequest.status}`);
                        }
                    }
                    catch (err) {
                        reject(err);
                    }
                }
            };
            //Microsoft Graph ME Endpoint: https://docs.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http
            meRequest.open('GET', 'https://graph.microsoft.com/v1.0/me');
            meRequest.setRequestHeader('Authorization', `Bearer ${loginResponse.accessToken}`);
            try {
                meRequest.send();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async getLoginStatus() {
        const accounts = this._instance.getAllAccounts();
        if (accounts?.length > 0) {
            const loginResponse = await this._instance.ssoSilent({
                scopes: this.initOptions.scopes,
                loginHint: accounts[0].username
            });
            return await this.getSocialUser(loginResponse);
        }
        else {
            throw `No user is currently logged in with ${MicrosoftLoginProvider.PROVIDER_ID}`;
        }
    }
    async signIn() {
        const loginResponse = await this._instance.loginPopup({
            scopes: this.initOptions.scopes,
            prompt: this.initOptions.prompt,
        });
        return await this.getSocialUser(loginResponse);
    }
    async signOut(revoke) {
        const accounts = this._instance.getAllAccounts();
        if (accounts?.length > 0) {
            await this._instance.logoutPopup({
                account: accounts[0],
                postLogoutRedirectUri: this.initOptions.logout_redirect_uri ?? this.initOptions.redirect_uri ?? location.href
            });
        }
    }
}
MicrosoftLoginProvider.PROVIDER_ID = 'MICROSOFT';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWljcm9zb2Z0LWxvZ2luLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGliL3NyYy9wcm92aWRlcnMvbWljcm9zb2Z0LWxvZ2luLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVyRDs7R0FFRztBQUNILE1BQU0sQ0FBTixJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDdEIsMkJBQVcsQ0FBQTtJQUNYLDZCQUFhLENBQUE7QUFDZixDQUFDLEVBSFcsWUFBWSxLQUFaLFlBQVksUUFHdkI7QUFrRkQsTUFBTSxnQkFBZ0IsR0FBVywyQ0FBMkMsQ0FBQztBQUU3RTs7R0FFRztBQUNILE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxpQkFBaUI7SUFhM0QsWUFDVSxRQUFnQixFQUN4QixXQUE4QjtRQUU5QixLQUFLLEVBQUUsQ0FBQztRQUhBLGFBQVEsR0FBUixRQUFRLENBQVE7UUFWbEIsZ0JBQVcsR0FBcUI7WUFDdEMsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUM7WUFDbkQsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixZQUFZLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDOUIsa0JBQWtCLEVBQUUsRUFBRTtZQUN0QixhQUFhLEVBQUUsZ0JBQWdCO1NBQ2hDLENBQUM7UUFRQSxJQUFJLENBQUMsV0FBVyxHQUFHO1lBQ2pCLEdBQUcsSUFBSSxDQUFDLFdBQVc7WUFDbkIsR0FBRyxXQUFXO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFFRCxVQUFVO1FBQ1IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZ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QUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNqRCxJQUFJLFFBQVEsRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7Z0JBQy9CLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixxQkFBcUIsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsWUFBWSxJQUFJLFFBQVEsQ0FBQyxJQUFJO2FBQzlHLENBQUMsQ0FBQTtTQUNIO0lBQ0gsQ0FBQzs7QUE3SHNCLGtDQUFXLEdBQVcsV0FBVyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxvZ2luUHJvdmlkZXIgfSBmcm9tICcuLi9lbnRpdGllcy9iYXNlLWxvZ2luLXByb3ZpZGVyJztcbmltcG9ydCB7IFNvY2lhbFVzZXIgfSBmcm9tICcuLi9lbnRpdGllcy9zb2NpYWwtdXNlcic7XG5cbi8qKlxuICogUHJvdG9jb2wgbW9kZXMgc3VwcG9ydGVkIGJ5IE1TQUwuXG4gKi9cbmV4cG9ydCBlbnVtIFByb3RvY29sTW9kZSB7XG4gIEFBRCA9ICdBQUQnLFxuICBPSURDID0gJ09JREMnXG59XG5cbi8qKlxuICogSW5pdGlhbGl6YXRpb24gT3B0aW9ucyBmb3IgTWljcm9zb2Z0IFByb3ZpZGVyOiBodHRwczovL2dpdGh1Yi5jb20vQXp1cmVBRC9taWNyb3NvZnQtYXV0aGVudGljYXRpb24tbGlicmFyeS1mb3ItanMvYmxvYi9kZXYvbGliL21zYWwtYnJvd3Nlci9kb2NzL2luaXRpYWxpemF0aW9uLm1kXG4gKiBEZXRhaWxzIChub3QgYWxsIG9wdGlvbnMgYXJlIHN1cHBvcnRlZCk6IGh0dHBzOi8vZ2l0aHViLmNvbS9BenVyZUFEL21pY3Jvc29mdC1hdXRoZW50aWNhdGlvbi1saWJyYXJ5LWZvci1qcy9ibG9iL2Rldi9saWIvbXNhbC1icm93c2VyL2RvY3MvY29uZmlndXJhdGlvbi5tZFxuICovXG5leHBvcnQgdHlwZSBNaWNyb3NvZnRPcHRpb25zID0ge1xuICByZWRpcmVjdF91cmk/OiBzdHJpbmcsXG4gIGxvZ291dF9yZWRpcmVjdF91cmk/OiBzdHJpbmcsXG4gIGF1dGhvcml0eT86IHN0cmluZyxcbiAga25vd25BdXRob3JpdGllcz86IHN0cmluZ1tdLFxuICBwcm90b2NvbE1vZGU/OiBQcm90b2NvbE1vZGUsXG4gIGNsaWVudENhcGFiaWxpdGllcz86IHN0cmluZ1tdLFxuICBjYWNoZUxvY2F0aW9uPzogc3RyaW5nLFxuICBzY29wZXM/OiBzdHJpbmdbXSxcbiAgcHJvbXB0Pzogc3RyaW5nLFxufTtcblxuLy8gQ29sbGVjdGlvbiBvZiBpbnRlcm5hbCBNU0FMIGludGVyZmFjZXMgZnJvbTogaHR0cHM6Ly9naXRodWIuY29tL0F6dXJlQUQvbWljcm9zb2Z0LWF1dGhlbnRpY2F0aW9uLWxpYnJhcnktZm9yLWpzL3RyZWUvZGV2L2xpYi9tc2FsLWJyb3dzZXIvc3JjXG5cbmludGVyZmFjZSBNU0FMQWNjb3VudCB7XG4gIGVudmlyb25tZW50OiBzdHJpbmc7XG4gIGhvbWVBY2NvdW50SWQ6IHN0cmluZztcbiAgdGVuYW50SWQ6IHN0cmluZztcbiAgdXNlcm5hbWU6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIE1TR3JhcGhVc2VySW5mbyB7XG4gIGJ1c2luZXNzUGhvbmVzOiBzdHJpbmdbXTtcbiAgZGlzcGxheU5hbWU6IHN0cmluZztcbiAgZ2l2ZW5OYW1lOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGpvYlRpdGxlOiBzdHJpbmc7XG4gIG1haWw6IHN0cmluZztcbiAgbW9iaWxlUGhvbmU6IHN0cmluZztcbiAgb2ZmaWNlTG9jYXRpb246IHN0cmluZztcbiAgcHJlZmVycmVkTGFuZ3VhZ2U6IHN0cmluZztcbiAgc3VybmFtZTogc3RyaW5nO1xuICB1c2VyUHJpbmNpcGFsTmFtZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgTVNBTExvZ2luUmVxdWVzdCB7XG4gIHNjb3Blcz86IHN0cmluZ1tdO1xuICBzaWQ/OiBzdHJpbmc7XG4gIGxvZ2luSGludD86IHN0cmluZztcbiAgZG9tYWluSGludD86IHN0cmluZztcbiAgcHJvbXB0Pzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgTVNBTExvZ2luUmVzcG9uc2Uge1xuICBhY2Nlc3NUb2tlbjogc3RyaW5nO1xuICBhY2NvdW50OiBNU0FMQWNjb3VudDtcbiAgZXhwaXJlc09uOiBEYXRlO1xuICBleHRFeHBpcmVzT246IERhdGU7XG4gIGZhbWlseUlkOiBzdHJpbmc7XG4gIGZyb21DYWNoZTogYm9vbGVhbjtcbiAgaWRUb2tlbjogc3RyaW5nO1xuICBpZFRva2VuQ2xhaW1zOiBhbnk7XG4gIHNjb3Blczogc3RyaW5nW107XG4gIHN0YXRlOiBzdHJpbmc7XG4gIHRlbmFudElkOiBzdHJpbmc7XG4gIHVuaXF1ZUlkOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBNU0FMTG9nb3V0UmVxdWVzdCB7XG4gIGFjY291bnQ/OiBNU0FMQWNjb3VudDtcbiAgcG9zdExvZ291dFJlZGlyZWN0VXJpPzogc3RyaW5nO1xuICBhdXRob3JpdHk/OiBzdHJpbmc7XG4gIGNvcnJlbGF0aW9uSWQ/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBNU0FMQ2xpZW50QXBwbGljYXRpb24ge1xuICBnZXRBbGxBY2NvdW50cygpOiBNU0FMQWNjb3VudFtdO1xuICBsb2dvdXRQb3B1cChsb2dvdXRSZXF1ZXN0PzogTVNBTExvZ291dFJlcXVlc3QpOiBQcm9taXNlPHZvaWQ+O1xuICBsb2dpblBvcHVwKGxvZ2luUmVxdWVzdDogTVNBTExvZ2luUmVxdWVzdCk6IFByb21pc2U8TVNBTExvZ2luUmVzcG9uc2U+O1xuICBzc29TaWxlbnQobG9naW5SZXF1ZXN0OiBNU0FMTG9naW5SZXF1ZXN0KTogUHJvbWlzZTxNU0FMTG9naW5SZXNwb25zZT47XG4gIGFjcXVpcmVUb2tlblNpbGVudChsb2dpblJlcXVlc3Q6IE1TQUxMb2dpblJlcXVlc3QpOiBQcm9taXNlPE1TQUxMb2dpblJlc3BvbnNlPjtcbiAgZ2V0QWNjb3VudEJ5SG9tZUlkKGhvbWVBY2NvdW50SWQ6IHN0cmluZyk6IE1TQUxBY2NvdW50O1xufVxuXG5kZWNsYXJlIGxldCBtc2FsOiBhbnk7XG5cbmNvbnN0IENPTU1PTl9BVVRIT1JJVFk6IHN0cmluZyA9ICdodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vY29tbW9uLyc7XG5cbi8qKlxuICogTWljcm9zb2Z0IEF1dGhlbnRpY2F0aW9uIHVzaW5nIE1TQUwgdjI6IGh0dHBzOi8vZ2l0aHViLmNvbS9BenVyZUFEL21pY3Jvc29mdC1hdXRoZW50aWNhdGlvbi1saWJyYXJ5LWZvci1qcy90cmVlL2Rldi9saWIvbXNhbC1icm93c2VyXG4gKi9cbmV4cG9ydCBjbGFzcyBNaWNyb3NvZnRMb2dpblByb3ZpZGVyIGV4dGVuZHMgQmFzZUxvZ2luUHJvdmlkZXIge1xuICBwcml2YXRlIF9pbnN0YW5jZTogTVNBTENsaWVudEFwcGxpY2F0aW9uO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBST1ZJREVSX0lEOiBzdHJpbmcgPSAnTUlDUk9TT0ZUJztcblxuICBwcml2YXRlIGluaXRPcHRpb25zOiBNaWNyb3NvZnRPcHRpb25zID0ge1xuICAgIGF1dGhvcml0eTogQ09NTU9OX0FVVEhPUklUWSxcbiAgICBzY29wZXM6IFsnb3BlbmlkJywgJ2VtYWlsJywgJ3Byb2ZpbGUnLCAnVXNlci5SZWFkJ10sXG4gICAga25vd25BdXRob3JpdGllczogW10sXG4gICAgcHJvdG9jb2xNb2RlOiBQcm90b2NvbE1vZGUuQUFELFxuICAgIGNsaWVudENhcGFiaWxpdGllczogW10sXG4gICAgY2FjaGVMb2NhdGlvbjogJ3Nlc3Npb25TdG9yYWdlJ1xuICB9O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2xpZW50SWQ6IHN0cmluZyxcbiAgICBpbml0T3B0aW9ucz86IE1pY3Jvc29mdE9wdGlvbnNcbiAgKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuaW5pdE9wdGlvbnMgPSB7XG4gICAgICAuLi50aGlzLmluaXRPcHRpb25zLFxuICAgICAgLi4uaW5pdE9wdGlvbnNcbiAgICB9O1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5sb2FkU2NyaXB0KFxuICAgICAgICBNaWNyb3NvZnRMb2dpblByb3ZpZGVyLlBST1ZJREVSX0lELFxuICAgICAgICAnaHR0cHM6Ly9hbGNkbi5tc2F1dGgubmV0L2Jyb3dzZXIvMi4xMy4xL2pzL21zYWwtYnJvd3Nlci5taW4uanMnLFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgYXV0aDoge1xuICAgICAgICAgICAgICAgIGNsaWVudElkOiB0aGlzLmNsaWVudElkLFxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VXJpOiB0aGlzLmluaXRPcHRpb25zLnJlZGlyZWN0X3VyaSA/PyBsb2NhdGlvbi5vcmlnaW4sXG4gICAgICAgICAgICAgICAgYXV0aG9yaXR5OiB0aGlzLmluaXRPcHRpb25zLmF1dGhvcml0eSxcbiAgICAgICAgICAgICAgICBrbm93bkF1dGhvcml0aWVzOiB0aGlzLmluaXRPcHRpb25zLmtub3duQXV0aG9yaXRpZXMsXG4gICAgICAgICAgICAgICAgcHJvdG9jb2xNb2RlOiB0aGlzLmluaXRPcHRpb25zLnByb3RvY29sTW9kZSxcbiAgICAgICAgICAgICAgICBjbGllbnRDYXBhYmlsaXRpZXM6IHRoaXMuaW5pdE9wdGlvbnMuY2xpZW50Q2FwYWJpbGl0aWVzXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIGNhY2hlOiAhdGhpcy5pbml0T3B0aW9ucy5jYWNoZUxvY2F0aW9uID8gbnVsbCA6IHtcbiAgICAgICAgICAgICAgICBjYWNoZUxvY2F0aW9uOiB0aGlzLmluaXRPcHRpb25zLmNhY2hlTG9jYXRpb25cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgbXNhbC5QdWJsaWNDbGllbnRBcHBsaWNhdGlvbihjb25maWcpO1xuICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldFNvY2lhbFVzZXIobG9naW5SZXNwb25zZSk6IFByb21pc2U8U29jaWFsVXNlcj4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxTb2NpYWxVc2VyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvL0FmdGVyIGxvZ2luLCB1c2UgTWljcm9zb2Z0IEdyYXBoIEFQSSB0byBnZXQgdXNlciBpbmZvXG4gICAgICBsZXQgbWVSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICBtZVJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICBpZiAobWVSZXF1ZXN0LnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAobWVSZXF1ZXN0LnN0YXR1cyA9PSAyMDApIHtcbiAgICAgICAgICAgICAgbGV0IHVzZXJJbmZvID0gPE1TR3JhcGhVc2VySW5mbz5KU09OLnBhcnNlKG1lUmVxdWVzdC5yZXNwb25zZVRleHQpO1xuXG4gICAgICAgICAgICAgIGxldCB1c2VyOiBTb2NpYWxVc2VyID0gbmV3IFNvY2lhbFVzZXIoKTtcbiAgICAgICAgICAgICAgdXNlci5wcm92aWRlciA9IE1pY3Jvc29mdExvZ2luUHJvdmlkZXIuUFJPVklERVJfSUQ7XG4gICAgICAgICAgICAgIHVzZXIuaWQgPSBsb2dpblJlc3BvbnNlLmlkVG9rZW47XG4gICAgICAgICAgICAgIHVzZXIuYXV0aFRva2VuID0gbG9naW5SZXNwb25zZS5hY2Nlc3NUb2tlbjtcbiAgICAgICAgICAgICAgdXNlci5uYW1lID0gbG9naW5SZXNwb25zZS5pZFRva2VuQ2xhaW1zLm5hbWU7XG4gICAgICAgICAgICAgIHVzZXIuZW1haWwgPSBsb2dpblJlc3BvbnNlLmFjY291bnQudXNlcm5hbWU7XG4gICAgICAgICAgICAgIHVzZXIuaWRUb2tlbiA9IGxvZ2luUmVzcG9uc2UuaWRUb2tlbjtcbiAgICAgICAgICAgICAgdXNlci5yZXNwb25zZSA9IGxvZ2luUmVzcG9uc2U7XG4gICAgICAgICAgICAgIHVzZXIuZmlyc3ROYW1lID0gdXNlckluZm8uZ2l2ZW5OYW1lO1xuICAgICAgICAgICAgICB1c2VyLmxhc3ROYW1lID0gdXNlckluZm8uc3VybmFtZTtcblxuICAgICAgICAgICAgICByZXNvbHZlKHVzZXIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGBFcnJvciByZXRyaWV2aW5nIHVzZXIgaW5mbzogJHttZVJlcXVlc3Quc3RhdHVzfWApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvL01pY3Jvc29mdCBHcmFwaCBNRSBFbmRwb2ludDogaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvZ3JhcGgvYXBpL3VzZXItZ2V0P3ZpZXc9Z3JhcGgtcmVzdC0xLjAmdGFicz1odHRwXG4gICAgICBtZVJlcXVlc3Qub3BlbignR0VUJywgJ2h0dHBzOi8vZ3JhcGgubWljcm9zb2Z0LmNvbS92MS4wL21lJyk7XG4gICAgICBtZVJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcignQXV0aG9yaXphdGlvbicsIGBCZWFyZXIgJHtsb2dpblJlc3BvbnNlLmFjY2Vzc1Rva2VufWApO1xuICAgICAgdHJ5IHtcbiAgICAgICAgbWVSZXF1ZXN0LnNlbmQoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGFzeW5jIGdldExvZ2luU3RhdHVzKCk6IFByb21pc2U8U29jaWFsVXNlcj4ge1xuICAgIGNvbnN0IGFjY291bnRzID0gdGhpcy5faW5zdGFuY2UuZ2V0QWxsQWNjb3VudHMoKTtcbiAgICBpZiAoYWNjb3VudHM/Lmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGxvZ2luUmVzcG9uc2UgPSBhd2FpdCB0aGlzLl9pbnN0YW5jZS5zc29TaWxlbnQoe1xuICAgICAgICBzY29wZXM6IHRoaXMuaW5pdE9wdGlvbnMuc2NvcGVzLFxuICAgICAgICBsb2dpbkhpbnQ6IGFjY291bnRzWzBdLnVzZXJuYW1lXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBhd2FpdCB0aGlzLmdldFNvY2lhbFVzZXIobG9naW5SZXNwb25zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGBObyB1c2VyIGlzIGN1cnJlbnRseSBsb2dnZWQgaW4gd2l0aCAke01pY3Jvc29mdExvZ2luUHJvdmlkZXIuUFJPVklERVJfSUR9YDtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzaWduSW4oKTogUHJvbWlzZTxTb2NpYWxVc2VyPiB7XG4gICAgY29uc3QgbG9naW5SZXNwb25zZSA9IGF3YWl0IHRoaXMuX2luc3RhbmNlLmxvZ2luUG9wdXAoe1xuICAgICAgc2NvcGVzOiB0aGlzLmluaXRPcHRpb25zLnNjb3BlcyxcbiAgICAgIHByb21wdDogdGhpcy5pbml0T3B0aW9ucy5wcm9tcHQsXG4gICAgfSk7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0U29jaWFsVXNlcihsb2dpblJlc3BvbnNlKTtcbiAgfVxuXG4gIGFzeW5jIHNpZ25PdXQocmV2b2tlPzogYm9vbGVhbik6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFjY291bnRzID0gdGhpcy5faW5zdGFuY2UuZ2V0QWxsQWNjb3VudHMoKTtcbiAgICBpZiAoYWNjb3VudHM/Lmxlbmd0aCA+IDApIHtcbiAgICAgIGF3YWl0IHRoaXMuX2luc3RhbmNlLmxvZ291dFBvcHVwKHtcbiAgICAgICAgYWNjb3VudDogYWNjb3VudHNbMF0sXG4gICAgICAgIHBvc3RMb2dvdXRSZWRpcmVjdFVyaTogdGhpcy5pbml0T3B0aW9ucy5sb2dvdXRfcmVkaXJlY3RfdXJpID8/IHRoaXMuaW5pdE9wdGlvbnMucmVkaXJlY3RfdXJpID8/IGxvY2F0aW9uLmhyZWZcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG4iXX0=