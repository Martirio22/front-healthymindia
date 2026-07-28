import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
    Component,
    DestroyRef,
    inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
    Router,
    RouterModule
} from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

import { RegisterRequest } from '@/app/core/auth/models/register-request.model';
import { AuthService } from '@/app/core/auth/services/auth.service';

import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        CheckboxModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        PasswordModule,
        ToastModule,
        AppFloatingConfigurator
    ],
    providers: [MessageService],
    template: `
        <p-toast />
        <app-floating-configurator />

        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen p-4"
        >
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
                            <i
                                class="pi pi-user-plus text-primary text-5xl mb-4"
                            ></i>

                            <div
                                class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-3"
                            >
                                Crear cuenta
                            </div>

                            <span class="text-muted-color">
                                Registra tus datos para comenzar
                            </span>
                        </div>

                        <form
                            #registerForm="ngForm"
                            (ngSubmit)="register()"
                            novalidate
                        >
                            <div
                                class="grid grid-cols-1 md:grid-cols-2 gap-5"
                            >
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
                                        name="firstName"
                                        [(ngModel)]="firstName"
                                        class="w-full"
                                        placeholder="Juan"
                                        maxlength="100"
                                        autocomplete="given-name"
                                        [disabled]="registering"
                                    />

                                    @if (
                                        submitted &&
                                        !firstName.trim()
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            El nombre es obligatorio.
                                        </small>
                                    }
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
                                        name="lastName"
                                        [(ngModel)]="lastName"
                                        class="w-full"
                                        placeholder="Pérez"
                                        maxlength="100"
                                        autocomplete="family-name"
                                        [disabled]="registering"
                                    />

                                    @if (
                                        submitted &&
                                        !lastName.trim()
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            El apellido es obligatorio.
                                        </small>
                                    }
                                </div>

                                <div>
                                    <label
                                        for="username"
                                        class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                    >
                                        Nombre de usuario
                                    </label>

                                    <p-iconfield>
                                        <p-inputicon class="pi pi-at" />

                                        <input
                                            pInputText
                                            id="username"
                                            name="registerUsername"
                                            [(ngModel)]="username"
                                            class="w-full"
                                            placeholder="alejandro.pinto"
                                            maxlength="50"
                                            autocomplete="username"
                                            [disabled]="registering"
                                        />
                                    </p-iconfield>

                                    @if (
                                        submitted &&
                                        !isValidUsername(username)
                                    ) {
                                        <small class="block text-red-500 mt-2">
                                            El usuario debe tener entre 4 y 50 caracteres.
                                            Solo puede contener letras, números, punto, guion
                                            o guion bajo.
                                        </small>
                                    }
                                </div>

                                <div>
                                    <label
                                        for="email"
                                        class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                    >
                                        Correo electrónico
                                    </label>

                                    <p-iconfield>
                                        <p-inputicon class="pi pi-envelope" />

                                        <input
                                            pInputText
                                            id="email"
                                            name="registerEmail"
                                            type="email"
                                            [(ngModel)]="email"
                                            class="w-full"
                                            placeholder="alejandro@mail.com"
                                            maxlength="150"
                                            autocomplete="email"
                                            [disabled]="registering"
                                        />
                                    </p-iconfield>

                                    @if (
                                        submitted &&
                                        !isValidEmail(email)
                                    ) {
                                        <small class="block text-red-500 mt-2">
                                            Ingresa un correo electrónico válido.
                                        </small>
                                    }
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
                                        name="password"
                                        [(ngModel)]="password"
                                        [toggleMask]="true"
                                        [feedback]="true"
                                        [fluid]="true"
                                        autocomplete="new-password"
                                        placeholder="Mínimo 8 caracteres"
                                        [disabled]="registering"
                                        promptLabel="Ingresa una contraseña"
                                        weakLabel="Débil"
                                        mediumLabel="Media"
                                        strongLabel="Segura"
                                    />

                                    @if (
                                        submitted &&
                                        !isValidPassword(password)
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            La contraseña debe tener mínimo 8
                                            caracteres, una mayúscula, una
                                            minúscula, un número y un carácter
                                            especial.
                                        </small>
                                    }
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
                                        name="confirmPassword"
                                        [(ngModel)]="confirmPassword"
                                        [toggleMask]="true"
                                        [feedback]="false"
                                        [fluid]="true"
                                        autocomplete="new-password"
                                        placeholder="Repite la contraseña"
                                        [disabled]="registering"
                                    />

                                    @if (
                                        submitted &&
                                        !confirmPassword
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            Debes confirmar la contraseña.
                                        </small>
                                    } @else if (
                                        submitted &&
                                        password !== confirmPassword
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            Las contraseñas no coinciden.
                                        </small>
                                    }
                                </div>
                            </div>

                            <div class="flex items-start gap-3 mt-6">
                                <p-checkbox
                                    inputId="terms"
                                    name="terms"
                                    [(ngModel)]="acceptTerms"
                                    [binary]="true"
                                    [disabled]="registering"
                                />

                                <label
                                    for="terms"
                                    class="text-muted-color cursor-pointer leading-6"
                                >
                                    Acepto los términos y condiciones de
                                    HealthyMindIA.
                                </label>
                            </div>

                            @if (
                                submitted &&
                                !acceptTerms
                            ) {
                                <small
                                    class="block text-red-500 mt-2"
                                >
                                    Debes aceptar los términos y condiciones.
                                </small>
                            }

                            <p-button
                                type="submit"
                                label="Crear cuenta"
                                icon="pi pi-check"
                                styleClass="w-full mt-8"
                                [loading]="registering"
                                [disabled]="registering"
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Register {
    private readonly authService =
        inject(AuthService);

    private readonly router =
        inject(Router);

    private readonly messageService =
        inject(MessageService);

    private readonly destroyRef =
        inject(DestroyRef);

    firstName = '';

    lastName = '';

    username = '';

    email = '';

    password = '';

    confirmPassword = '';

    acceptTerms = false;

    submitted = false;

    registering = false;

    register(): void {
        if (this.registering) {
            return;
        }

        this.submitted = true;

        if (!this.isValidForm()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Formulario incompleto',
                detail:
                    'Revisa los campos marcados antes de continuar.'
            });

            return;
        }

        this.registering = true;

        const request: RegisterRequest = {
            username:
                this.username.trim(),

            email:
                this.email
                    .trim()
                    .toLowerCase(),

            firstName:
                this.firstName.trim(),

            lastName:
                this.lastName.trim(),

            password:
                this.password
        };

        this.authService
            .register(request)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: () => {
                    this.registering = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Cuenta creada',
                        detail:
                            'Tu cuenta fue registrada correctamente. Ya puedes iniciar sesión.'
                    });

                    window.setTimeout(() => {
                        void this.router.navigate([
                            '/auth/login'
                        ]);
                    }, 1200);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.registering = false;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible crear la cuenta',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    isValidUsername(
        value: string
    ): boolean {
        return /^[a-zA-Z0-9._-]{4,50}$/.test(
            value.trim()
        );
    }

    isValidEmail(
        value: string
    ): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value.trim()
        );
    }

    isValidPassword(
        value: string
    ): boolean {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,}$/.test(
            value
        );
    }

    private isValidForm(): boolean {
        return Boolean(
            this.firstName.trim() &&
            this.lastName.trim() &&
            this.isValidUsername(
                this.username
            ) &&
            this.isValidEmail(
                this.email
            ) &&
            this.isValidPassword(
                this.password
            ) &&
            this.confirmPassword &&
            this.password ===
                this.confirmPassword &&
            this.acceptTerms
        );
    }

    private getErrorMessage(
        error: HttpErrorResponse
    ): string {
        if (error.status === 0) {
            return 'No fue posible conectarse con el servidor.';
        }

        if (error.status === 400) {
            return (
                error.error?.message ??
                'Revisa la información ingresada.'
            );
        }

        if (error.status === 409) {
            return (
                error.error?.message ??
                'El nombre de usuario o correo electrónico ya está registrado.'
            );
        }

        if (error.status === 500) {
            return 'El servidor no pudo crear la cuenta. Intenta nuevamente.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
