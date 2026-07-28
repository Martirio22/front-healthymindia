import { HttpErrorResponse } from '@angular/common/http';
import {
    Component,
    inject,
    OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    Router,
    RouterModule
} from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '@/app/core/auth/services/auth.service';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

interface LoginApiError {
    timestamp?: string;
    status?: number;
    message?: string;
    errors?: Record<string, string>;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        FormsModule,
        RouterModule,
        ButtonModule,
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

                                <div class="relative">
                                    <i
                                        class="pi pi-user absolute left-3 top-1/2 -translate-y-1/2 text-muted-color z-10"
                                    ></i>

                                    <input
                                        pInputText
                                        id="username"
                                        name="username"
                                        type="text"
                                        [(ngModel)]="username"
                                        #usernameField="ngModel"
                                        class="w-full pl-10"
                                        placeholder="Ingresa tu nombre de usuario"
                                        autocomplete="username"
                                        maxlength="50"
                                        required
                                        [disabled]="loading"
                                    />
                                </div>

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
                                    name="password"
                                    [(ngModel)]="password"
                                    #passwordField="ngModel"
                                    placeholder="Ingresa tu contraseña"
                                    [toggleMask]="true"
                                    [feedback]="false"
                                    [fluid]="true"
                                    autocomplete="current-password"
                                    required
                                    [disabled]="loading"
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
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);

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
            .subscribe({
                next: () => {
                    this.loading = false;
                    void this.router.navigate(['/dashboard']);
                },
                error: (error: HttpErrorResponse) => {
                    this.loading = false;

                    const response =
                        error.error as LoginApiError | null;

                    if (error.status === 0) {
                        this.errorMessage =
                            'No fue posible conectarse con el servidor.';
                        return;
                    }

                    if (error.status === 401) {
                        this.errorMessage =
                            'Usuario o contraseña incorrectos.';
                        return;
                    }

                    if (error.status === 502) {
                        this.errorMessage =
                            response?.message ??
                            'El servicio de autenticación no está disponible.';
                        return;
                    }

                    this.errorMessage =
                        response?.message ??
                        'No fue posible iniciar sesión.';
                }
            });
    }
}
