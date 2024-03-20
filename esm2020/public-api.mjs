export { SocialAuthService, } from './socialauth.service';
export { SocialLoginModule } from './sociallogin.module';
export { SocialUser } from './entities/social-user';
export { BaseLoginProvider } from './entities/base-login-provider';
export { DummyLoginProvider } from './providers/dummy-login-provider';
export { GoogleLoginProvider, } from './providers/google-login-provider';
export { FacebookLoginProvider } from './providers/facebook-login-provider';
export { AmazonLoginProvider } from './providers/amazon-login-provider';
export { VKLoginProvider } from './providers/vk-login-provider';
export { MicrosoftLoginProvider } from './providers/microsoft-login-provider';
export { GoogleSigninButtonDirective } from './directives/google-signin-button.directive';
export { GoogleSigninButtonModule } from './directives/google-signin-button.module';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGljLWFwaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Byb2plY3RzL2xpYi9zcmMvcHVibGljLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsaUJBQWlCLEdBRWxCLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDekQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBRXBELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ3RFLE9BQU8sRUFFTCxtQkFBbUIsR0FDcEIsTUFBTSxtQ0FBbUMsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxtQ0FBbUMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDaEUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDOUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDMUYsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0sMENBQTBDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQge1xuICBTb2NpYWxBdXRoU2VydmljZSxcbiAgU29jaWFsQXV0aFNlcnZpY2VDb25maWcsXG59IGZyb20gJy4vc29jaWFsYXV0aC5zZXJ2aWNlJztcbmV4cG9ydCB7IFNvY2lhbExvZ2luTW9kdWxlIH0gZnJvbSAnLi9zb2NpYWxsb2dpbi5tb2R1bGUnO1xuZXhwb3J0IHsgU29jaWFsVXNlciB9IGZyb20gJy4vZW50aXRpZXMvc29jaWFsLXVzZXInO1xuZXhwb3J0IHsgTG9naW5Qcm92aWRlciB9IGZyb20gJy4vZW50aXRpZXMvbG9naW4tcHJvdmlkZXInO1xuZXhwb3J0IHsgQmFzZUxvZ2luUHJvdmlkZXIgfSBmcm9tICcuL2VudGl0aWVzL2Jhc2UtbG9naW4tcHJvdmlkZXInO1xuZXhwb3J0IHsgRHVtbXlMb2dpblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvZHVtbXktbG9naW4tcHJvdmlkZXInO1xuZXhwb3J0IHtcbiAgR29vZ2xlSW5pdE9wdGlvbnMsXG4gIEdvb2dsZUxvZ2luUHJvdmlkZXIsXG59IGZyb20gJy4vcHJvdmlkZXJzL2dvb2dsZS1sb2dpbi1wcm92aWRlcic7XG5leHBvcnQgeyBGYWNlYm9va0xvZ2luUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9mYWNlYm9vay1sb2dpbi1wcm92aWRlcic7XG5leHBvcnQgeyBBbWF6b25Mb2dpblByb3ZpZGVyIH0gZnJvbSAnLi9wcm92aWRlcnMvYW1hem9uLWxvZ2luLXByb3ZpZGVyJztcbmV4cG9ydCB7IFZLTG9naW5Qcm92aWRlciB9IGZyb20gJy4vcHJvdmlkZXJzL3ZrLWxvZ2luLXByb3ZpZGVyJztcbmV4cG9ydCB7IE1pY3Jvc29mdExvZ2luUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9taWNyb3NvZnQtbG9naW4tcHJvdmlkZXInO1xuZXhwb3J0IHsgR29vZ2xlU2lnbmluQnV0dG9uRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2dvb2dsZS1zaWduaW4tYnV0dG9uLmRpcmVjdGl2ZSc7XG5leHBvcnQgeyBHb29nbGVTaWduaW5CdXR0b25Nb2R1bGUgfSBmcm9tICcuL2RpcmVjdGl2ZXMvZ29vZ2xlLXNpZ25pbi1idXR0b24ubW9kdWxlJztcbiJdfQ==