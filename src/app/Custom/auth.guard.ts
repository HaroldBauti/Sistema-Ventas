import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../Services/usuario.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const token=localStorage.getItem("usuario")||"";
  const router=inject(Router);
  const _usuarioServicio=inject(UsuarioService);

  if(token!=""){
    return _usuarioServicio.ValidarToken(token).pipe(
      map(data => {
        if(data.status){
          return true;
        }else{
          router.navigate(['']);
          return false;
        }
      }),
      catchError(error=>{
        router.navigate([''])
        return of(false);
      }));
  }else{
    // router.navigateByUrl("");
    // return false;
    const url=router.createUrlTree([""]);
    return url;
  }

};
