import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import {
    Router,
    RouterModule
} from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '@/app/core/auth/services/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

interface LoginApiError {
    timestamp?: string;
    status?: number;
    message?: string;
    error?: string;
    errors?: Record<string, string>;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        MessageModule,
        PasswordModule,
        AppFloatingConfigurator
    ],
    template: `
        <app-floating-configurator />

        <div
            class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden p-4"
        >
            <div class="flex flex-col items-center justify-center w-full">
                <div
                    class="w-full max-w-xl"
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
                        class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-16"
                        style="border-radius: 53px"
                    >
                        <div class="text-center mb-8">
                            <div
                                class="flex items-center justify-center mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-400/10"
                                style="width: 5rem; height: 5rem"
                            >
                                <i
                                    class="pi pi-heart-fill text-primary text-4xl"
                                ></i>
                            </div>

                            <div
                                class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-3"
                            >
                                HealthyMindIA
                            </div>

                            <span class="text-muted-color font-medium">
                                Inicia sesión para continuar con tus hábitos
                            </span>
                        </div>

                        @if (errorMessage) {
                            <p-message
                                severity="error"
                                [text]="errorMessage"
                                styleClass="w-full mb-6"
                            />
                        }

                        <form
                            #loginForm="ngForm"
                            (ngSubmit)="login()"
                            novalidate
                        >
                            <div class="mb-6">
                                <label
                                    for="username"
                                    class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                                >
                                    Nombre de usuario
                                </label>

                                <p-iconfield>
                                    <p-inputicon class="pi pi-user" />

                                    <input
                                        pInputText
                                        id="username"
                                        name="loginUsername"
                                        type="text"
                                        [(ngModel)]="username"
                                        #usernameField="ngModel"
                                        class="w-full"
                                        placeholder="Ingresa tu nombre de usuario"
                                        autocomplete="username"
                                        maxlength="50"
                                        required
                                        [disabled]="loading"
                                        (ngModelChange)="clearApiError()"
                                    />
                                </p-iconfield>

                                @if (
                                    usernameField.invalid &&
                                    (
                                        usernameField.touched ||
                                        submitted
                                    )
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        El nombre de usuario es obligatorio.
                                    </small>
                                }
                            </div>

                            <div class="mb-4">
                                <label
                                    for="password"
                                    class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                                >
                                    Contraseña
                                </label>

                                <p-password
                                    inputId="password"
                                    name="loginPassword"
                                    [(ngModel)]="password"
                                    #passwordField="ngModel"
                                    placeholder="Ingresa tu contraseña"
                                    [toggleMask]="true"
                                    [feedback]="false"
                                    [fluid]="true"
                                    autocomplete="current-password"
                                    required
                                    [disabled]="loading"
                                    (ngModelChange)="clearApiError()"
                                />

                                @if (
                                    passwordField.invalid &&
                                    (
                                        passwordField.touched ||
                                        submitted
                                    )
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        La contraseña es obligatoria.
                                    </small>
                                }
                            </div>

                            <div
                                class="flex items-center justify-end mt-2 mb-8"
                            >
                                <a
                                    routerLink="/auth/forgot-password"
                                    class="font-medium no-underline cursor-pointer text-primary"
                                >
                                    ¿Olvidaste tu contraseña?
                                </a>
                            </div>

                            <p-button
                                type="submit"
                                label="Iniciar sesión"
                                icon="pi pi-sign-in"
                                styleClass="w-full"
                                [loading]="loading"
                                [disabled]="loading"
                            />

                            <div class="text-center mt-6">
                                <span class="text-muted-color">
                                    ¿Todavía no tienes una cuenta?
                                </span>

                                <a
                                    routerLink="/auth/register"
                                    class="ml-2 text-primary font-medium no-underline"
                                >
                                    Crear cuenta
                                </a>
                            </div>

                            <div class="text-center mt-4">
                                <a
                                    routerLink="/"
                                    class="text-muted-color font-medium no-underline"
                                >
                                    <i class="pi pi-arrow-left mr-2"></i>
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
export class Login implements OnInit {
    private readonly authService =
        inject(AuthService);

    private readonly router =
        inject(Router);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    username = '';
    password = '';

    loading = false;
    submitted = false;
    errorMessage = '';

    ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            void this.router.navigate(['/dashboard']);
        }
    }

    login(): void {
        if (this.loading) {
            return;
        }

        this.submitted = true;
        this.errorMessage = '';

        const username = this.username.trim();

        if (!username || !this.password) {
            return;
        }

        this.loading = true;

        this.authService
            .login({
                username,
                password: this.password
            })
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    window.setTimeout(() => {
                        this.loading = false;

                        this.changeDetectorRef.detectChanges();
                    }, 0);
                })
            )
            .subscribe({
                next: () => {
                    void this.router.navigate([
                        '/dashboard'
                    ]);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.errorMessage =
                        this.getErrorMessage(error);

                    window.setTimeout(() => {
                        this.changeDetectorRef.detectChanges();
                    }, 0);
                }
            });
    }

    clearApiError(): void {
        if (this.errorMessage) {
            this.errorMessage = '';
        }
    }

    private getErrorMessage(
        error: HttpErrorResponse
    ): string {
        const response =
            error.error as LoginApiError | string | null;

        if (error.status === 0) {
            return 'No fue posible conectarse con el servidor.';
        }

        if (error.status === 400) {
            return this.extractBackendMessage(response) ??
                'Revisa el usuario y la contraseña ingresados.';
        }

        if (error.status === 401) {
            return 'Usuario o contraseña incorrectos.';
        }

        if (error.status === 403) {
            return 'Tu cuenta no tiene permisos para ingresar.';
        }

        if (error.status === 404) {
            return 'No se encontró el servicio de autenticación.';
        }

        if (error.status === 502) {
            return this.extractBackendMessage(response) ??
                'El servicio de autenticación no está disponible.';
        }

        if (error.status === 503) {
            return 'El servicio se encuentra temporalmente fuera de servicio.';
        }

        if (error.status >= 500) {
            return this.extractBackendMessage(response) ??
                'Ocurrió un problema en el servidor. Intenta nuevamente.';
        }

        return this.extractBackendMessage(response) ??
            'No fue posible iniciar sesión.';
    }

    private extractBackendMessage(
        response: LoginApiError | string | null
    ): string | null {
        if (typeof response === 'string') {
            return response.trim() || null;
        }

        if (
            response &&
            typeof response.message === 'string' &&
            response.message.trim()
        ) {
            return response.message.trim();
        }

        if (
            response &&
            typeof response.error === 'string' &&
            response.error.trim()
        ) {
            return response.error.trim();
        }

        return null;
    }
}
