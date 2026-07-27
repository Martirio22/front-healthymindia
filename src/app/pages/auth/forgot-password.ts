import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        MessageModule,
        AppFloatingConfigurator
    ],
    template: `
        <app-floating-configurator />

        <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen p-4">
            <div class="w-full max-w-xl">
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
                        class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-14"
                        style="border-radius: 53px"
                    >
                        <div class="text-center mb-8">
                            <div
                                class="flex justify-center items-center mx-auto mb-6 border-2 border-primary rounded-full"
                                style="width: 4rem; height: 4rem"
                            >
                                <i class="pi pi-key text-primary text-3xl"></i>
                            </div>

                            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-3">
                                Recuperar contraseña
                            </div>

                            <span class="text-muted-color">
                                Ingresa tu correo electrónico o nombre de usuario
                            </span>
                        </div>

                        @if (emailSent) {
                            <p-message
                                severity="success"
                                styleClass="w-full mb-6"
                                text="Si la cuenta existe, recibirás un correo con las instrucciones para restablecer tu contraseña."
                            />
                        }

                        <div>
                            <label
                                for="usernameOrEmail"
                                class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-2"
                            >
                                Correo o nombre de usuario
                            </label>

                            <input
                                pInputText
                                id="usernameOrEmail"
                                type="text"
                                [(ngModel)]="usernameOrEmail"
                                placeholder="martin@gmail.com"
                                class="w-full"
                                autocomplete="username"
                            />

                            @if (showRequiredError) {
                                <small class="text-red-500 block mt-2">
                                    El correo o nombre de usuario es obligatorio.
                                </small>
                            }

                            <p-button
                                label="Enviar instrucciones"
                                icon="pi pi-envelope"
                                styleClass="w-full mt-8"
                                (onClick)="sendRecoveryEmail()"
                            />

                            <div class="text-center mt-6">
                                <a
                                    routerLink="/auth/login"
                                    class="text-primary font-medium no-underline"
                                >
                                    <i class="pi pi-arrow-left mr-2"></i>
                                    Volver al inicio de sesión
                                </a>
                            </div>

                            <div class="text-center mt-4">
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

                            <div class="mt-8 p-4 border border-surface-200 dark:border-surface-700 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <div class="flex gap-3">
                                    <i class="pi pi-info-circle text-primary mt-1"></i>

                                    <div>
                                        <div class="font-medium text-surface-900 dark:text-surface-0 mb-1">
                                            Revisa tu correo
                                        </div>

                                        <div class="text-muted-color text-sm leading-6">
                                            Te enviaremos un enlace temporal para crear una nueva contraseña. Revisa también la carpeta de correo no deseado.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class ForgotPassword {
    usernameOrEmail = '';
    emailSent = false;
    showRequiredError = false;

    sendRecoveryEmail(): void {
        const value = this.usernameOrEmail.trim();

        if (!value) {
            this.showRequiredError = true;
            this.emailSent = false;
            return;
        }

        this.showRequiredError = false;
        this.emailSent = true;
    }
}
