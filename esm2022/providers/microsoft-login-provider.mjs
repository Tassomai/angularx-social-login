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
    static { this.PROVIDER_ID = 'MICROSOFT'; }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWljcm9zb2Z0LWxvZ2luLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGliL3NyYy9wcm92aWRlcnMvbWljcm9zb2Z0LWxvZ2luLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3BFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVyRDs7R0FFRztBQUNILE1BQU0sQ0FBTixJQUFZLFlBR1g7QUFIRCxXQUFZLFlBQVk7SUFDdEIsMkJBQVcsQ0FBQTtJQUNYLDZCQUFhLENBQUE7QUFDZixDQUFDLEVBSFcsWUFBWSxLQUFaLFlBQVksUUFHdkI7QUFrRkQsTUFBTSxnQkFBZ0IsR0FBVywyQ0FBMkMsQ0FBQztBQUU3RTs7R0FFRztBQUNILE1BQU0sT0FBTyxzQkFBdUIsU0FBUSxpQkFBaUI7SUFhM0QsWUFDVSxRQUFnQixFQUN4QixXQUE4QjtRQUU5QixLQUFLLEVBQUUsQ0FBQztRQUhBLGFBQVEsR0FBUixRQUFRLENBQVE7UUFWbEIsZ0JBQVcsR0FBcUI7WUFDdEMsU0FBUyxFQUFFLGdCQUFnQjtZQUMzQixNQUFNLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLENBQUM7WUFDbkQsZ0JBQWdCLEVBQUUsRUFBRTtZQUNwQixZQUFZLEVBQUUsWUFBWSxDQUFDLEdBQUc7WUFDOUIsa0JBQWtCLEVBQUUsRUFBRTtZQUN0QixhQUFhLEVBQUUsZ0JBQWdCO1NBQ2hDLENBQUM7UUFRQSxJQUFJLENBQUMsV0FBVyxHQUFHO1lBQ2pCLEdBQUcsSUFBSSxDQUFDLFdBQVc7WUFDbkIsR0FBRyxXQUFXO1NBQ2YsQ0FBQztJQUNKLENBQUM7SUFyQkQsU0FBdUIsZ0JBQVcsR0FBVyxXQUFXLENBQUMsRUFBQTtJQXVCekQsVUFBVTtRQUNSLE9BQU8sSUFBSSxP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TyxDQUFDLE1BQWdCO1FBQzVCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDakQsSUFBSSxRQUFRLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QixNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO2dCQUMvQixPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDcEIscUJBQXFCLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksSUFBSSxRQUFRLENBQUMsSUFBSTthQUM5RyxDQUFDLENBQUE7U0FDSDtJQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTG9naW5Qcm92aWRlciB9IGZyb20gJy4uL2VudGl0aWVzL2Jhc2UtbG9naW4tcHJvdmlkZXInO1xuaW1wb3J0IHsgU29jaWFsVXNlciB9IGZyb20gJy4uL2VudGl0aWVzL3NvY2lhbC11c2VyJztcblxuLyoqXG4gKiBQcm90b2NvbCBtb2RlcyBzdXBwb3J0ZWQgYnkgTVNBTC5cbiAqL1xuZXhwb3J0IGVudW0gUHJvdG9jb2xNb2RlIHtcbiAgQUFEID0gJ0FBRCcsXG4gIE9JREMgPSAnT0lEQydcbn1cblxuLyoqXG4gKiBJbml0aWFsaXphdGlvbiBPcHRpb25zIGZvciBNaWNyb3NvZnQgUHJvdmlkZXI6IGh0dHBzOi8vZ2l0aHViLmNvbS9BenVyZUFEL21pY3Jvc29mdC1hdXRoZW50aWNhdGlvbi1saWJyYXJ5LWZvci1qcy9ibG9iL2Rldi9saWIvbXNhbC1icm93c2VyL2RvY3MvaW5pdGlhbGl6YXRpb24ubWRcbiAqIERldGFpbHMgKG5vdCBhbGwgb3B0aW9ucyBhcmUgc3VwcG9ydGVkKTogaHR0cHM6Ly9naXRodWIuY29tL0F6dXJlQUQvbWljcm9zb2Z0LWF1dGhlbnRpY2F0aW9uLWxpYnJhcnktZm9yLWpzL2Jsb2IvZGV2L2xpYi9tc2FsLWJyb3dzZXIvZG9jcy9jb25maWd1cmF0aW9uLm1kXG4gKi9cbmV4cG9ydCB0eXBlIE1pY3Jvc29mdE9wdGlvbnMgPSB7XG4gIHJlZGlyZWN0X3VyaT86IHN0cmluZyxcbiAgbG9nb3V0X3JlZGlyZWN0X3VyaT86IHN0cmluZyxcbiAgYXV0aG9yaXR5Pzogc3RyaW5nLFxuICBrbm93bkF1dGhvcml0aWVzPzogc3RyaW5nW10sXG4gIHByb3RvY29sTW9kZT86IFByb3RvY29sTW9kZSxcbiAgY2xpZW50Q2FwYWJpbGl0aWVzPzogc3RyaW5nW10sXG4gIGNhY2hlTG9jYXRpb24/OiBzdHJpbmcsXG4gIHNjb3Blcz86IHN0cmluZ1tdLFxuICBwcm9tcHQ/OiBzdHJpbmcsXG59O1xuXG4vLyBDb2xsZWN0aW9uIG9mIGludGVybmFsIE1TQUwgaW50ZXJmYWNlcyBmcm9tOiBodHRwczovL2dpdGh1Yi5jb20vQXp1cmVBRC9taWNyb3NvZnQtYXV0aGVudGljYXRpb24tbGlicmFyeS1mb3ItanMvdHJlZS9kZXYvbGliL21zYWwtYnJvd3Nlci9zcmNcblxuaW50ZXJmYWNlIE1TQUxBY2NvdW50IHtcbiAgZW52aXJvbm1lbnQ6IHN0cmluZztcbiAgaG9tZUFjY291bnRJZDogc3RyaW5nO1xuICB0ZW5hbnRJZDogc3RyaW5nO1xuICB1c2VybmFtZTogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgTVNHcmFwaFVzZXJJbmZvIHtcbiAgYnVzaW5lc3NQaG9uZXM6IHN0cmluZ1tdO1xuICBkaXNwbGF5TmFtZTogc3RyaW5nO1xuICBnaXZlbk5hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgam9iVGl0bGU6IHN0cmluZztcbiAgbWFpbDogc3RyaW5nO1xuICBtb2JpbGVQaG9uZTogc3RyaW5nO1xuICBvZmZpY2VMb2NhdGlvbjogc3RyaW5nO1xuICBwcmVmZXJyZWRMYW5ndWFnZTogc3RyaW5nO1xuICBzdXJuYW1lOiBzdHJpbmc7XG4gIHVzZXJQcmluY2lwYWxOYW1lOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBNU0FMTG9naW5SZXF1ZXN0IHtcbiAgc2NvcGVzPzogc3RyaW5nW107XG4gIHNpZD86IHN0cmluZztcbiAgbG9naW5IaW50Pzogc3RyaW5nO1xuICBkb21haW5IaW50Pzogc3RyaW5nO1xuICBwcm9tcHQ/OiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBNU0FMTG9naW5SZXNwb25zZSB7XG4gIGFjY2Vzc1Rva2VuOiBzdHJpbmc7XG4gIGFjY291bnQ6IE1TQUxBY2NvdW50O1xuICBleHBpcmVzT246IERhdGU7XG4gIGV4dEV4cGlyZXNPbjogRGF0ZTtcbiAgZmFtaWx5SWQ6IHN0cmluZztcbiAgZnJvbUNhY2hlOiBib29sZWFuO1xuICBpZFRva2VuOiBzdHJpbmc7XG4gIGlkVG9rZW5DbGFpbXM6IGFueTtcbiAgc2NvcGVzOiBzdHJpbmdbXTtcbiAgc3RhdGU6IHN0cmluZztcbiAgdGVuYW50SWQ6IHN0cmluZztcbiAgdW5pcXVlSWQ6IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIE1TQUxMb2dvdXRSZXF1ZXN0IHtcbiAgYWNjb3VudD86IE1TQUxBY2NvdW50O1xuICBwb3N0TG9nb3V0UmVkaXJlY3RVcmk/OiBzdHJpbmc7XG4gIGF1dGhvcml0eT86IHN0cmluZztcbiAgY29ycmVsYXRpb25JZD86IHN0cmluZztcbn1cblxuaW50ZXJmYWNlIE1TQUxDbGllbnRBcHBsaWNhdGlvbiB7XG4gIGdldEFsbEFjY291bnRzKCk6IE1TQUxBY2NvdW50W107XG4gIGxvZ291dFBvcHVwKGxvZ291dFJlcXVlc3Q/OiBNU0FMTG9nb3V0UmVxdWVzdCk6IFByb21pc2U8dm9pZD47XG4gIGxvZ2luUG9wdXAobG9naW5SZXF1ZXN0OiBNU0FMTG9naW5SZXF1ZXN0KTogUHJvbWlzZTxNU0FMTG9naW5SZXNwb25zZT47XG4gIHNzb1NpbGVudChsb2dpblJlcXVlc3Q6IE1TQUxMb2dpblJlcXVlc3QpOiBQcm9taXNlPE1TQUxMb2dpblJlc3BvbnNlPjtcbiAgYWNxdWlyZVRva2VuU2lsZW50KGxvZ2luUmVxdWVzdDogTVNBTExvZ2luUmVxdWVzdCk6IFByb21pc2U8TVNBTExvZ2luUmVzcG9uc2U+O1xuICBnZXRBY2NvdW50QnlIb21lSWQoaG9tZUFjY291bnRJZDogc3RyaW5nKTogTVNBTEFjY291bnQ7XG59XG5cbmRlY2xhcmUgbGV0IG1zYWw6IGFueTtcblxuY29uc3QgQ09NTU9OX0FVVEhPUklUWTogc3RyaW5nID0gJ2h0dHBzOi8vbG9naW4ubWljcm9zb2Z0b25saW5lLmNvbS9jb21tb24vJztcblxuLyoqXG4gKiBNaWNyb3NvZnQgQXV0aGVudGljYXRpb24gdXNpbmcgTVNBTCB2MjogaHR0cHM6Ly9naXRodWIuY29tL0F6dXJlQUQvbWljcm9zb2Z0LWF1dGhlbnRpY2F0aW9uLWxpYnJhcnktZm9yLWpzL3RyZWUvZGV2L2xpYi9tc2FsLWJyb3dzZXJcbiAqL1xuZXhwb3J0IGNsYXNzIE1pY3Jvc29mdExvZ2luUHJvdmlkZXIgZXh0ZW5kcyBCYXNlTG9naW5Qcm92aWRlciB7XG4gIHByaXZhdGUgX2luc3RhbmNlOiBNU0FMQ2xpZW50QXBwbGljYXRpb247XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPVklERVJfSUQ6IHN0cmluZyA9ICdNSUNST1NPRlQnO1xuXG4gIHByaXZhdGUgaW5pdE9wdGlvbnM6IE1pY3Jvc29mdE9wdGlvbnMgPSB7XG4gICAgYXV0aG9yaXR5OiBDT01NT05fQVVUSE9SSVRZLFxuICAgIHNjb3BlczogWydvcGVuaWQnLCAnZW1haWwnLCAncHJvZmlsZScsICdVc2VyLlJlYWQnXSxcbiAgICBrbm93bkF1dGhvcml0aWVzOiBbXSxcbiAgICBwcm90b2NvbE1vZGU6IFByb3RvY29sTW9kZS5BQUQsXG4gICAgY2xpZW50Q2FwYWJpbGl0aWVzOiBbXSxcbiAgICBjYWNoZUxvY2F0aW9uOiAnc2Vzc2lvblN0b3JhZ2UnXG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjbGllbnRJZDogc3RyaW5nLFxuICAgIGluaXRPcHRpb25zPzogTWljcm9zb2Z0T3B0aW9uc1xuICApIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5pbml0T3B0aW9ucyA9IHtcbiAgICAgIC4uLnRoaXMuaW5pdE9wdGlvbnMsXG4gICAgICAuLi5pbml0T3B0aW9uc1xuICAgIH07XG4gIH1cblxuICBpbml0aWFsaXplKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLmxvYWRTY3JpcHQoXG4gICAgICAgIE1pY3Jvc29mdExvZ2luUHJvdmlkZXIuUFJPVklERVJfSUQsXG4gICAgICAgICdodHRwczovL2FsY2RuLm1zYXV0aC5uZXQvYnJvd3Nlci8yLjEzLjEvanMvbXNhbC1icm93c2VyLm1pbi5qcycsXG4gICAgICAgICgpID0+IHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgY29uZmlnID0ge1xuICAgICAgICAgICAgICBhdXRoOiB7XG4gICAgICAgICAgICAgICAgY2xpZW50SWQ6IHRoaXMuY2xpZW50SWQsXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RVcmk6IHRoaXMuaW5pdE9wdGlvbnMucmVkaXJlY3RfdXJpID8/IGxvY2F0aW9uLm9yaWdpbixcbiAgICAgICAgICAgICAgICBhdXRob3JpdHk6IHRoaXMuaW5pdE9wdGlvbnMuYXV0aG9yaXR5LFxuICAgICAgICAgICAgICAgIGtub3duQXV0aG9yaXRpZXM6IHRoaXMuaW5pdE9wdGlvbnMua25vd25BdXRob3JpdGllcyxcbiAgICAgICAgICAgICAgICBwcm90b2NvbE1vZGU6IHRoaXMuaW5pdE9wdGlvbnMucHJvdG9jb2xNb2RlLFxuICAgICAgICAgICAgICAgIGNsaWVudENhcGFiaWxpdGllczogdGhpcy5pbml0T3B0aW9ucy5jbGllbnRDYXBhYmlsaXRpZXNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgY2FjaGU6ICF0aGlzLmluaXRPcHRpb25zLmNhY2hlTG9jYXRpb24gPyBudWxsIDoge1xuICAgICAgICAgICAgICAgIGNhY2hlTG9jYXRpb246IHRoaXMuaW5pdE9wdGlvbnMuY2FjaGVMb2NhdGlvblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICB0aGlzLl9pbnN0YW5jZSA9IG5ldyBtc2FsLlB1YmxpY0NsaWVudEFwcGxpY2F0aW9uKGNvbmZpZyk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U29jaWFsVXNlcihsb2dpblJlc3BvbnNlKTogUHJvbWlzZTxTb2NpYWxVc2VyPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFNvY2lhbFVzZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vQWZ0ZXIgbG9naW4sIHVzZSBNaWNyb3NvZnQgR3JhcGggQVBJIHRvIGdldCB1c2VyIGluZm9cbiAgICAgIGxldCBtZVJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIG1lUmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSAoKSA9PiB7XG4gICAgICAgIGlmIChtZVJlcXVlc3QucmVhZHlTdGF0ZSA9PSA0KSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGlmIChtZVJlcXVlc3Quc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICBsZXQgdXNlckluZm8gPSA8TVNHcmFwaFVzZXJJbmZvPkpTT04ucGFyc2UobWVSZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG5cbiAgICAgICAgICAgICAgbGV0IHVzZXI6IFNvY2lhbFVzZXIgPSBuZXcgU29jaWFsVXNlcigpO1xuICAgICAgICAgICAgICB1c2VyLnByb3ZpZGVyID0gTWljcm9zb2Z0TG9naW5Qcm92aWRlci5QUk9WSURFUl9JRDtcbiAgICAgICAgICAgICAgdXNlci5pZCA9IGxvZ2luUmVzcG9uc2UuaWRUb2tlbjtcbiAgICAgICAgICAgICAgdXNlci5hdXRoVG9rZW4gPSBsb2dpblJlc3BvbnNlLmFjY2Vzc1Rva2VuO1xuICAgICAgICAgICAgICB1c2VyLm5hbWUgPSBsb2dpblJlc3BvbnNlLmlkVG9rZW5DbGFpbXMubmFtZTtcbiAgICAgICAgICAgICAgdXNlci5lbWFpbCA9IGxvZ2luUmVzcG9uc2UuYWNjb3VudC51c2VybmFtZTtcbiAgICAgICAgICAgICAgdXNlci5pZFRva2VuID0gbG9naW5SZXNwb25zZS5pZFRva2VuO1xuICAgICAgICAgICAgICB1c2VyLnJlc3BvbnNlID0gbG9naW5SZXNwb25zZTtcbiAgICAgICAgICAgICAgdXNlci5maXJzdE5hbWUgPSB1c2VySW5mby5naXZlbk5hbWU7XG4gICAgICAgICAgICAgIHVzZXIubGFzdE5hbWUgPSB1c2VySW5mby5zdXJuYW1lO1xuXG4gICAgICAgICAgICAgIHJlc29sdmUodXNlcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QoYEVycm9yIHJldHJpZXZpbmcgdXNlciBpbmZvOiAke21lUmVxdWVzdC5zdGF0dXN9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vTWljcm9zb2Z0IEdyYXBoIE1FIEVuZHBvaW50OiBodHRwczovL2RvY3MubWljcm9zb2Z0LmNvbS9lbi11cy9ncmFwaC9hcGkvdXNlci1nZXQ/dmlldz1ncmFwaC1yZXN0LTEuMCZ0YWJzPWh0dHBcbiAgICAgIG1lUmVxdWVzdC5vcGVuKCdHRVQnLCAnaHR0cHM6Ly9ncmFwaC5taWNyb3NvZnQuY29tL3YxLjAvbWUnKTtcbiAgICAgIG1lUmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdBdXRob3JpemF0aW9uJywgYEJlYXJlciAke2xvZ2luUmVzcG9uc2UuYWNjZXNzVG9rZW59YCk7XG4gICAgICB0cnkge1xuICAgICAgICBtZVJlcXVlc3Quc2VuZCgpO1xuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0TG9naW5TdGF0dXMoKTogUHJvbWlzZTxTb2NpYWxVc2VyPiB7XG4gICAgY29uc3QgYWNjb3VudHMgPSB0aGlzLl9pbnN0YW5jZS5nZXRBbGxBY2NvdW50cygpO1xuICAgIGlmIChhY2NvdW50cz8ubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgbG9naW5SZXNwb25zZSA9IGF3YWl0IHRoaXMuX2luc3RhbmNlLnNzb1NpbGVudCh7XG4gICAgICAgIHNjb3BlczogdGhpcy5pbml0T3B0aW9ucy5zY29wZXMsXG4gICAgICAgIGxvZ2luSGludDogYWNjb3VudHNbMF0udXNlcm5hbWVcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuZ2V0U29jaWFsVXNlcihsb2dpblJlc3BvbnNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgYE5vIHVzZXIgaXMgY3VycmVudGx5IGxvZ2dlZCBpbiB3aXRoICR7TWljcm9zb2Z0TG9naW5Qcm92aWRlci5QUk9WSURFUl9JRH1gO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHNpZ25JbigpOiBQcm9taXNlPFNvY2lhbFVzZXI+IHtcbiAgICBjb25zdCBsb2dpblJlc3BvbnNlID0gYXdhaXQgdGhpcy5faW5zdGFuY2UubG9naW5Qb3B1cCh7XG4gICAgICBzY29wZXM6IHRoaXMuaW5pdE9wdGlvbnMuc2NvcGVzLFxuICAgICAgcHJvbXB0OiB0aGlzLmluaXRPcHRpb25zLnByb21wdCxcbiAgICB9KTtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5nZXRTb2NpYWxVc2VyKGxvZ2luUmVzcG9uc2UpO1xuICB9XG5cbiAgYXN5bmMgc2lnbk91dChyZXZva2U/OiBib29sZWFuKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgYWNjb3VudHMgPSB0aGlzLl9pbnN0YW5jZS5nZXRBbGxBY2NvdW50cygpO1xuICAgIGlmIChhY2NvdW50cz8ubGVuZ3RoID4gMCkge1xuICAgICAgYXdhaXQgdGhpcy5faW5zdGFuY2UubG9nb3V0UG9wdXAoe1xuICAgICAgICBhY2NvdW50OiBhY2NvdW50c1swXSxcbiAgICAgICAgcG9zdExvZ291dFJlZGlyZWN0VXJpOiB0aGlzLmluaXRPcHRpb25zLmxvZ291dF9yZWRpcmVjdF91cmkgPz8gdGhpcy5pbml0T3B0aW9ucy5yZWRpcmVjdF91cmkgPz8gbG9jYXRpb24uaHJlZlxuICAgICAgfSlcbiAgICB9XG4gIH1cbn1cbiJdfQ==