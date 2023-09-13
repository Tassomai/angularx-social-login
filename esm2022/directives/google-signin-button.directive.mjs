import { Directive, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../socialauth.service";
export class GoogleSigninButtonDirective {
    constructor(el, socialAuthService) {
        this.type = 'icon';
        this.size = 'medium';
        this.text = 'signin_with';
        this.shape = 'rectangular';
        this.theme = 'outline';
        this.logo_alignment = 'left';
        this.width = '';
        this.locale = '';
        socialAuthService.initState.pipe(take(1)).subscribe(() => {
            Promise.resolve(this.width).then((value) => {
                if (value > '400' || (value < '200' && value != '')) {
                    Promise.reject('Please note .. max-width 400 , min-width 200 ' +
                        '(https://developers.google.com/identity/gsi/web/tools/configurator)');
                }
                else {
                    google.accounts.id.renderButton(el.nativeElement, {
                        type: this.type,
                        size: this.size,
                        text: this.text,
                        width: this.width,
                        shape: this.shape,
                        theme: this.theme,
                        logo_alignment: this.logo_alignment,
                        locale: this.locale,
                    });
                }
            });
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: GoogleSigninButtonDirective, deps: [{ token: i0.ElementRef }, { token: i1.SocialAuthService }], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.4.0", type: GoogleSigninButtonDirective, selector: "asl-google-signin-button", inputs: { type: "type", size: "size", text: "text", shape: "shape", theme: "theme", logo_alignment: "logo_alignment", width: "width", locale: "locale" }, ngImport: i0 }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.4.0", ngImport: i0, type: GoogleSigninButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    // eslint-disable-next-line @angular-eslint/directive-selector
                    selector: 'asl-google-signin-button',
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.SocialAuthService }]; }, propDecorators: { type: [{
                type: Input
            }], size: [{
                type: Input
            }], text: [{
                type: Input
            }], shape: [{
                type: Input
            }], theme: [{
                type: Input
            }], logo_alignment: [{
                type: Input
            }], width: [{
                type: Input
            }], locale: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLXNpZ25pbi1idXR0b24uZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbGliL3NyYy9kaXJlY3RpdmVzL2dvb2dsZS1zaWduaW4tYnV0dG9uLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFjLEtBQUssRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM3RCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7OztBQU90QyxNQUFNLE9BQU8sMkJBQTJCO0lBeUJ0QyxZQUFZLEVBQWMsRUFBRSxpQkFBb0M7UUF2QmhFLFNBQUksR0FBd0IsTUFBTSxDQUFDO1FBR25DLFNBQUksR0FBaUMsUUFBUSxDQUFDO1FBRzlDLFNBQUksR0FBb0QsYUFBYSxDQUFDO1FBR3RFLFVBQUssR0FBaUQsYUFBYSxDQUFDO1FBR3BFLFVBQUssR0FBK0MsU0FBUyxDQUFDO1FBRzlELG1CQUFjLEdBQXNCLE1BQU0sQ0FBQztRQUczQyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBR25CLFdBQU0sR0FBVyxFQUFFLENBQUM7UUFHbEIsaUJBQWlCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3ZELE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUN6QyxJQUFJLEtBQUssR0FBRyxLQUFLLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxJQUFJLEtBQUssSUFBSSxFQUFFLENBQUMsRUFBRTtvQkFDbkQsT0FBTyxDQUFDLE1BQU0sQ0FDWiwrQ0FBK0M7d0JBQzdDLHFFQUFxRSxDQUN4RSxDQUFDO2lCQUNIO3FCQUFNO29CQUNMLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFO3dCQUNoRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7d0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO3dCQUNmLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTt3QkFDZixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7d0JBQ2pCLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSzt3QkFDakIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3dCQUNqQixjQUFjLEVBQUUsSUFBSSxDQUFDLGNBQWM7d0JBQ25DLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTTtxQkFDcEIsQ0FBQyxDQUFDO2lCQUNKO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7OEdBL0NVLDJCQUEyQjtrR0FBM0IsMkJBQTJCOzsyRkFBM0IsMkJBQTJCO2tCQUp2QyxTQUFTO21CQUFDO29CQUNULDhEQUE4RDtvQkFDOUQsUUFBUSxFQUFFLDBCQUEwQjtpQkFDckM7aUlBR0MsSUFBSTtzQkFESCxLQUFLO2dCQUlOLElBQUk7c0JBREgsS0FBSztnQkFJTixJQUFJO3NCQURILEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLEtBQUs7c0JBREosS0FBSztnQkFJTixjQUFjO3NCQURiLEtBQUs7Z0JBSU4sS0FBSztzQkFESixLQUFLO2dCQUlOLE1BQU07c0JBREwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBTb2NpYWxBdXRoU2VydmljZSB9IGZyb20gJy4uL3NvY2lhbGF1dGguc2VydmljZSc7XG5cbkBEaXJlY3RpdmUoe1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQGFuZ3VsYXItZXNsaW50L2RpcmVjdGl2ZS1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2FzbC1nb29nbGUtc2lnbmluLWJ1dHRvbicsXG59KVxuZXhwb3J0IGNsYXNzIEdvb2dsZVNpZ25pbkJ1dHRvbkRpcmVjdGl2ZSB7XG4gIEBJbnB1dCgpXG4gIHR5cGU6ICdpY29uJyB8ICdzdGFuZGFyZCcgPSAnaWNvbic7XG5cbiAgQElucHV0KClcbiAgc2l6ZTogJ3NtYWxsJyB8ICdtZWRpdW0nIHwgJ2xhcmdlJyA9ICdtZWRpdW0nO1xuXG4gIEBJbnB1dCgpXG4gIHRleHQ6ICdzaWduaW5fd2l0aCcgfCAnc2lnbnVwX3dpdGgnIHwgJ2NvbnRpbnVlX3dpdGgnID0gJ3NpZ25pbl93aXRoJztcblxuICBASW5wdXQoKVxuICBzaGFwZTogJ3NxdWFyZScgfCAnY2lyY2xlJyB8ICdwaWxsJyB8ICdyZWN0YW5ndWxhcicgPSAncmVjdGFuZ3VsYXInO1xuXG4gIEBJbnB1dCgpXG4gIHRoZW1lOiAnb3V0bGluZScgfCAnZmlsbGVkX2JsdWUnIHwgJ2ZpbGxlZF9ibGFjaycgPSAnb3V0bGluZSc7XG5cbiAgQElucHV0KClcbiAgbG9nb19hbGlnbm1lbnQ6ICdsZWZ0JyB8ICdjZW50ZXInID0gJ2xlZnQnO1xuXG4gIEBJbnB1dCgpXG4gIHdpZHRoOiBzdHJpbmcgPSAnJztcblxuICBASW5wdXQoKVxuICBsb2NhbGU6IHN0cmluZyA9ICcnO1xuXG4gIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBzb2NpYWxBdXRoU2VydmljZTogU29jaWFsQXV0aFNlcnZpY2UpIHtcbiAgICBzb2NpYWxBdXRoU2VydmljZS5pbml0U3RhdGUucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgUHJvbWlzZS5yZXNvbHZlKHRoaXMud2lkdGgpLnRoZW4oKHZhbHVlKSA9PiB7XG4gICAgICAgIGlmICh2YWx1ZSA+ICc0MDAnIHx8ICh2YWx1ZSA8ICcyMDAnICYmIHZhbHVlICE9ICcnKSkge1xuICAgICAgICAgIFByb21pc2UucmVqZWN0KFxuICAgICAgICAgICAgJ1BsZWFzZSBub3RlIC4uIG1heC13aWR0aCA0MDAgLCBtaW4td2lkdGggMjAwICcgK1xuICAgICAgICAgICAgICAnKGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2lkZW50aXR5L2dzaS93ZWIvdG9vbHMvY29uZmlndXJhdG9yKSdcbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdvb2dsZS5hY2NvdW50cy5pZC5yZW5kZXJCdXR0b24oZWwubmF0aXZlRWxlbWVudCwge1xuICAgICAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICAgICAgc2l6ZTogdGhpcy5zaXplLFxuICAgICAgICAgICAgdGV4dDogdGhpcy50ZXh0LFxuICAgICAgICAgICAgd2lkdGg6IHRoaXMud2lkdGgsXG4gICAgICAgICAgICBzaGFwZTogdGhpcy5zaGFwZSxcbiAgICAgICAgICAgIHRoZW1lOiB0aGlzLnRoZW1lLFxuICAgICAgICAgICAgbG9nb19hbGlnbm1lbnQ6IHRoaXMubG9nb19hbGlnbm1lbnQsXG4gICAgICAgICAgICBsb2NhbGU6IHRoaXMubG9jYWxlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19