import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {TokenService} from "./token.service";

@Injectable()
export class NeedAuthGuard implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];

    if (this.tokenService.isLogged()) {
      return true;
    }

    this.router.navigateByUrl(
      this.router.createUrlTree(
        [''], {
          queryParams: {
            redirectUrl
          }
        }
      )
    );

    return false;
  }
}
