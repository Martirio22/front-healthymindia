import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        FormsModule,
        RouterModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        AppFloatingConfigurator
    ],
    template: `
        <app-floating-configurator />

        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen p-4">
            <div class="w-full max-w-2xl">
                <div
                    style="
                        border-radius: 56px;
                        padding: 0.3rem;
                        background: linear-gradient(
                            180deg,
                            var(--primary-color) 10%,
                            rgba(33, 150, 243, 0) 30%
                        );
                    "
                >
                    <div
                        class="w-full bg-surface-0 dark:bg-surface-900 py-10 px-8 sm:px-14"
                        style="border-radius: 53px"
                    >
                        <div class="text-center mb-8">
                            <i class="pi pi-user-plus text-primary text-5xl mb-4"></i>

                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-3">
                                Crear cuenta
                            </div>

                            <span class="text-muted-color">
                                Registra tus datos para comenzar
                            </span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label
                                    for="firstName"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Nombre
                                </label>

                                <input
                                    pInputText
                                    id="firstName"
                                    [(ngModel)]="firstName"
                                    class="w-full"
                                    placeholder="Juan"
                                />
                            </div>

                            <div>
                                <label
                                    for="lastName"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Apellido
                                </label>

                                <input
                                    pInputText
                                    id="lastName"
                                    [(ngModel)]="lastName"
                                    class="w-full"
                                    placeholder="Pérez"
                                />
                            </div>

                            <div>
                                <label
                                    for="username"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Nombre de usuario
                                </label>

                                <input
                                    pInputText
                                    id="username"
                                    [(ngModel)]="username"
                                    class="w-full"
                                    placeholder="juan.perez"
                                />
                            </div>

                            <div>
                                <label
                                    for="email"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Correo electrónico
                                </label>

                                <input
                                    pInputText
                                    id="email"
                                    type="email"
                                    [(ngModel)]="email"
                                    class="w-full"
                                    placeholder="juan@email.com"
                                />
                            </div>

                            <div>
                                <label
                                    for="password"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Contraseña
                                </label>

                                <p-password
                                    inputId="password"
                                    [(ngModel)]="password"
                                    [toggleMask]="true"
                                    [feedback]="true"
                                    [fluid]="true"
                                    placeholder="Mínimo 8 caracteres"
                                />
                            </div>

                            <div>
                                <label
                                    for="confirmPassword"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Confirmar contraseña
                                </label>

                                <p-password
                                    inputId="confirmPassword"
                                    [(ngModel)]="confirmPassword"
                                    [toggleMask]="true"
                                    [feedback]="false"
                                    [fluid]="true"
                                    placeholder="Repite la contraseña"
                                />
                            </div>
                        </div>

                        <div class="flex items-start gap-3 mt-6">
                            <p-checkbox
                                inputId="terms"
                                [(ngModel)]="acceptTerms"
                                [binary]="true"
                            />

                            <label
                                for="terms"
                                class="text-muted-color cursor-pointer leading-6"
                            >
                                Acepto los términos y condiciones de HealthyMindIA.
                            </label>
                        </div>

                        <p-button
                            label="Crear cuenta"
                            icon="pi pi-check"
                            styleClass="w-full mt-8"
                            routerLink="/auth/login"
                        />

                        <div class="text-center mt-6">
                            <span class="text-muted-color">
                                ¿Ya tienes una cuenta?
                            </span>

                            <a
                                routerLink="/auth/login"
                                class="ml-2 text-primary font-medium no-underline"
                            >
                                Iniciar sesión
                            </a>
                        </div>

                        <div class="text-center mt-4">
                            <a
                                routerLink="/"
                                class="text-muted-color font-medium no-underline"
                            >
                                Volver al inicio
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Register {
    firstName = '';
    lastName = '';
    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    acceptTerms = false;
}
