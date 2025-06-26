import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../Interfaces/login';
import { UsuarioService } from '../../Services/usuario.service';
import { UtilidadService } from '../../Reutilizable/utilidad.service';
import { SharedModule } from '../../Reutilizable/shared/shared.module';
import { AppModule } from '../../app.module';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule],
  providers: [UsuarioService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formulariologin: FormGroup;

  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioServicio: UsuarioService,
    private utilidadServicio: UtilidadService
  ) {
    this.formulariologin = this.crearFormulario();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}
  IniciarSesion(): void {
    if (this.formulariologin.invalid) {
      this.utilidadServicio.MostrarAlerta(
        'Complete todos los campos requeridos',
        'Advertencia'
      );
      return;
    }

    this.toggleLoading(true);

    const loginData: Login = this.obtenerDatosFormulario();

    this.usuarioServicio.IniciarSesion(loginData).subscribe({
      next: (data) => this.procesarRespuesta(data),
      error: () => this.manejarError(),
      complete: () => this.toggleLoading(false),
    });
  }

  private obtenerDatosFormulario(): Login {
    return {
      correo: this.formulariologin.value.email,
      clave: this.formulariologin.value.password,
    };
  }

  private procesarRespuesta(data: any): void {
    if (data.status) {
      this.utilidadServicio.GuardarSesionUsuario(data.value);
      this.router.navigate(['pages']);
    } else {
      this.utilidadServicio.MostrarAlerta(
        'No se encontraron coincidencias',
        'Opps!'
      );
    }
  }

  private manejarError(): void {
    this.utilidadServicio.MostrarAlerta(
      'Hubo un error al iniciar sesión',
      'Error'
    );
  }

  private toggleLoading(valor: boolean): void {
    this.mostrarLoading = valor;
  }
}
