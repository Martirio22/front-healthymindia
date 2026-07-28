import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { ForgotPasswordRequest } from '@/app/core/auth/models/forgot-password-request.model';
import { AuthService } from '@/app/core/auth/services/auth.service';

import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

interface ForgotPasswordApiError {
    timestamp?: string;
    status?: number;
    message?: string;
    error?: string;
    errors?: Record<string, string>;
}

@Component({
    selector: 'app-forgot-password',
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
                                    class="pi pi-key text-primary text-4xl"
                                ></i>
                            </div>

                            <div
                                class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-3"
                            >
                                Recuperar contraseña
                            </div>

                            <p
                                class="text-muted-color font-medium leading-6 m-0"
                            >
                                Ingresa tu nombre de usuario o correo electrónico
                                para recibir instrucciones.
                            </p>
                        </div>

                        @if (success) {
                            <div
                                class="flex flex-col items-center text-center"
                            >
                                <div
                                    class="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-400/10 mb-5"
                                    style="width: 5rem; height: 5rem"
                                >
                                    <i
                                        class="pi pi-envelope text-green-500 text-3xl"
                                    ></i>
                                </div>

                                <h2
                                    class="text-2xl font-semibold text-surface-900 dark:text-surface-0 mt-0 mb-3"
                                >
                                    Revisa tu correo
                                </h2>

                                <p
                                    class="text-muted-color leading-7 mt-0 mb-7"
                                >
                                    Si existe una cuenta asociada, recibirás un
                                    correo con las instrucciones para cambiar tu
                                    contraseña.
                                </p>

                                <p-message
                                    severity="info"
                                    text="Por seguridad, no confirmamos si el usuario o correo se encuentra registrado."
                                    styleClass="w-full mb-7 text-left"
                                />

                                <div
                                    class="flex flex-col sm:flex-row justify-center gap-3 w-full"
                                >
                                    <p-button
                                        label="Volver al inicio de sesión"
                                        icon="pi pi-sign-in"
                                        styleClass="w-full"
                                        routerLink="/auth/login"
                                    />

                                    <p-button
                                        label="Enviar nuevamente"
                                        icon="pi pi-refresh"
                                        severity="secondary"
                                        [outlined]="true"
                                        styleClass="w-full"
                                        (onClick)="resetForm()"
                                    />
                                </div>
                            </div>
                        } @else {
                            @if (errorMessage) {
                                <p-message
                                    severity="error"
                                    [text]="errorMessage"
                                    styleClass="w-full mb-6"
                                />
                            }

                            <form
                                #forgotPasswordForm="ngForm"
                                (ngSubmit)="sendInstructions()"
                                novalidate
                            >
                                <div class="mb-6">
                                    <label
                                        for="usernameOrEmail"
                                        class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                                    >
                                        Usuario o correo electrónico
                                    </label>

                                    <p-iconfield>
                                        <p-inputicon
                                            class="pi pi-user"
                                        />

                                        <input
                                            pInputText
                                            id="usernameOrEmail"
                                            name="usernameOrEmail"
                                            type="text"
                                            [(ngModel)]="usernameOrEmail"
                                            #usernameOrEmailField="ngModel"
                                            class="w-full"
                                            placeholder="usuario o correo@email.com"
                                            autocomplete="username"
                                            maxlength="150"
                                            required
                                            [disabled]="sending"
                                            (ngModelChange)="clearError()"
                                        />
                                    </p-iconfield>

                                    @if (
                                        usernameOrEmailField.invalid &&
                                        (
                                            usernameOrEmailField.touched ||
                                            submitted
                                        )
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            Ingresa tu nombre de usuario o correo
                                            electrónico.
                                        </small>
                                    }

                                    @if (
                                        submitted &&
                                        usernameOrEmail.trim() &&
                                        !isValidIdentifier(
                                            usernameOrEmail
                                        )
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            Ingresa un usuario válido o un correo
                                            electrónico con formato correcto.
                                        </small>
                                    }
                                </div>

                                <div
                                    class="flex items-start gap-3 p-4 mb-7 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20"
                                >
                                    <i
                                        class="pi pi-info-circle text-blue-500 mt-1"
                                    ></i>

                                    <p
                                        class="text-muted-color leading-6 m-0"
                                    >
                                        Recibirás un enlace temporal para
                                        actualizar tu contraseña. Revisa también
                                        la carpeta de correo no deseado.
                                    </p>
                                </div>

                                <p-button
                                    type="submit"
                                    label="Enviar instrucciones"
                                    icon="pi pi-send"
                                    styleClass="w-full"
                                    [loading]="sending"
                                    [disabled]="sending"
                                />

                                <div class="text-center mt-6">
                                    <span class="text-muted-color">
                                        ¿Recordaste tu contraseña?
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
                                        <i class="pi pi-arrow-left mr-2"></i>
                                        Volver al inicio
                                    </a>
                                </div>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ForgotPassword {
    private readonly authService =
        inject(AuthService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    usernameOrEmail = '';

    submitted = false;

    sending = false;

    success = false;

    errorMessage = '';

    sendInstructions(): void {
        if (this.sending) {
            return;
        }

        this.submitted = true;
        this.errorMessage = '';

        const usernameOrEmail =
            this.usernameOrEmail.trim();

        if (
            !usernameOrEmail ||
            !this.isValidIdentifier(usernameOrEmail)
        ) {
            return;
        }

        this.sending = true;

        const request: ForgotPasswordRequest = {
            usernameOrEmail
        };

        this.authService
            .forgotPassword(request)
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                finalize(() => {
                    window.setTimeout(() => {
                        this.sending = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                })
            )
            .subscribe({
                next: () => {
                    this.success = true;

                    window.setTimeout(() => {
                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    /*
                     * Para evitar revelar usuarios registrados,
                     * un 404 también muestra el mensaje genérico.
                     */
                    if (
                        error.status === 404
                    ) {
                        this.success = true;

                        window.setTimeout(() => {
                            this.changeDetectorRef
                                .detectChanges();
                        }, 0);

                        return;
                    }

                    this.errorMessage =
                        this.getErrorMessage(error);

                    window.setTimeout(() => {
                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    resetForm(): void {
        this.usernameOrEmail = '';
        this.submitted = false;
        this.success = false;
        this.errorMessage = '';
    }

    clearError(): void {
        if (this.errorMessage) {
            this.errorMessage = '';
        }
    }

    isValidIdentifier(
        value: string
    ): boolean {
        const normalizedValue =
            value.trim();

        if (!normalizedValue) {
            return false;
        }

        if (
            normalizedValue.includes('@')
        ) {
            return this.isValidEmail(
                normalizedValue
            );
        }

        return this.isValidUsername(
            normalizedValue
        );
    }

    private isValidUsername(
        value: string
    ): boolean {
        return /^[a-zA-Z0-9._-]{4,50}$/.test(
            value
        );
    }

    private isValidEmail(
        value: string
    ): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value
        );
    }

    private getErrorMessage(
        error: HttpErrorResponse
    ): string {
        const response =
            error.error as
                | ForgotPasswordApiError
                | string
                | null;

        if (error.status === 0) {
            return 'No fue posible conectarse con el servidor.';
        }

        if (error.status === 400) {
            return (
                this.extractBackendMessage(
                    response
                ) ??
                'Ingresa un usuario o correo electrónico válido.'
            );
        }

        if (error.status === 401) {
            return 'La solicitud no pudo ser procesada.';
        }

        if (error.status === 429) {
            return 'Has realizado demasiados intentos. Espera unos minutos antes de volver a intentarlo.';
        }

        if (error.status === 502) {
            return (
                this.extractBackendMessage(
                    response
                ) ??
                'El servicio de recuperación no se encuentra disponible.'
            );
        }

        if (error.status === 503) {
            return 'El servicio se encuentra temporalmente fuera de servicio.';
        }

        if (error.status >= 500) {
            return (
                this.extractBackendMessage(
                    response
                ) ??
                'No fue posible enviar las instrucciones. Intenta nuevamente.'
            );
        }

        return (
            this.extractBackendMessage(
                response
            ) ??
            'No fue posible procesar la solicitud.'
        );
    }

    private extractBackendMessage(
        response:
            | ForgotPasswordApiError
            | string
            | null
    ): string | null {
        if (typeof response === 'string') {
            return response.trim() || null;
        }

        if (
            response &&
            typeof response.message ===
                'string' &&
            response.message.trim()
        ) {
            return response.message.trim();
        }

        if (
            response &&
            typeof response.error ===
                'string' &&
            response.error.trim()
        ) {
            return response.error.trim();
        }

        return null;
    }
}
