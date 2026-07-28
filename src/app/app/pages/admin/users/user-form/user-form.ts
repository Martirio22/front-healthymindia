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
import {
    Router,
    RouterModule
} from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import { AuthRole } from '@/app/core/auth/models/auth-role.enum';
import { CreateUserByAdminRequest } from '@/app/core/auth/models/create-user-by-admin-request.model';
import { AuthService } from '@/app/core/auth/services/auth.service';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
        SelectModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="flex flex-col gap-6">
            <div class="flex items-center gap-4">
                <p-button
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    [text]="true"
                    [rounded]="true"
                    routerLink="/admin/users"
                />

                <div>
                    <h1
                        class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                    >
                        Crear usuario
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Registra una cuenta desde el módulo administrativo.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 xl:col-span-8">
                    <div class="card mb-0">
                        <div class="flex items-center gap-4 mb-7">
                            <div
                                class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i
                                    class="pi pi-user-plus text-primary text-xl"
                                ></i>
                            </div>

                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Información de la cuenta
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Todos los campos son obligatorios
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    for="firstName"
                                    class="block font-medium mb-2"
                                >
                                    Nombre
                                </label>

                                <input
                                    pInputText
                                    id="firstName"
                                    [(ngModel)]="firstName"
                                    class="w-full"
                                    maxlength="100"
                                    [disabled]="saving"
                                />

                                @if (
                                    submitted &&
                                    !firstName.trim()
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        El nombre es obligatorio.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="lastName"
                                    class="block font-medium mb-2"
                                >
                                    Apellido
                                </label>

                                <input
                                    pInputText
                                    id="lastName"
                                    [(ngModel)]="lastName"
                                    class="w-full"
                                    maxlength="100"
                                    [disabled]="saving"
                                />

                                @if (
                                    submitted &&
                                    !lastName.trim()
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        El apellido es obligatorio.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="username"
                                    class="block font-medium mb-2"
                                >
                                    Nombre de usuario
                                </label>

                                <input
                                    pInputText
                                    id="username"
                                    [(ngModel)]="username"
                                    class="w-full"
                                    maxlength="50"
                                    [disabled]="saving"
                                />

                                @if (
                                    submitted &&
                                    !isValidUsername(username)
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        Usa entre 4 y 50 caracteres: letras,
                                        números, punto, guion o guion bajo.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="email"
                                    class="block font-medium mb-2"
                                >
                                    Correo electrónico
                                </label>

                                <input
                                    pInputText
                                    id="email"
                                    type="email"
                                    [(ngModel)]="email"
                                    class="w-full"
                                    maxlength="150"
                                    [disabled]="saving"
                                />

                                @if (
                                    submitted &&
                                    !isValidEmail(email)
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        Ingresa un correo válido.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="password"
                                    class="block font-medium mb-2"
                                >
                                    Contraseña
                                </label>

                                <p-password
                                    inputId="password"
                                    [(ngModel)]="password"
                                    [toggleMask]="true"
                                    [feedback]="true"
                                    [fluid]="true"
                                    [disabled]="saving"
                                />

                                @if (
                                    submitted &&
                                    password.length < 8
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        Debe tener al menos 8 caracteres.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="confirmPassword"
                                    class="block font-medium mb-2"
                                >
                                    Confirmar contraseña
                                </label>

                                <p-password
                                    inputId="confirmPassword"
                                    [(ngModel)]="confirmPassword"
                                    [toggleMask]="true"
                                    [feedback]="false"
                                    [fluid]="true"
                                    [disabled]="saving"
                                />

                                @if (
                                    submitted &&
                                    password !== confirmPassword
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        Las contraseñas no coinciden.
                                    </small>
                                }
                            </div>

                            <div class="md:col-span-2">
                                <label
                                    for="role"
                                    class="block font-medium mb-2"
                                >
                                    Rol de la cuenta
                                </label>

                                <p-select
                                    inputId="role"
                                    [(ngModel)]="role"
                                    [options]="roleOptions"
                                    optionLabel="label"
                                    optionValue="value"
                                    styleClass="w-full"
                                    [disabled]="saving"
                                />
                            </div>
                        </div>

                        <div
                            class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8"
                        >
                            <p-button
                                label="Cancelar"
                                icon="pi pi-times"
                                severity="secondary"
                                [outlined]="true"
                                routerLink="/admin/users"
                                [disabled]="saving"
                            />

                            <p-button
                                label="Crear usuario"
                                icon="pi pi-user-plus"
                                [loading]="saving"
                                (onClick)="saveUser()"
                            />
                        </div>
                    </div>
                </div>

                <div class="col-span-12 xl:col-span-4">
                    <div class="card mb-0">
                        <div class="flex items-center gap-4 mb-6">
                            <div
                                class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i
                                    class="pi pi-shield text-orange-500 text-xl"
                                ></i>
                            </div>

                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Permisos del rol
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Selecciona cuidadosamente
                                </span>
                            </div>
                        </div>

                        @if (role === adminRole) {
                            <div
                                class="p-5 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20"
                            >
                                <h3 class="font-semibold mt-0 mb-3">
                                    Administrador
                                </h3>

                                <ul class="text-muted-color leading-7 pl-5 m-0">
                                    <li>Consultar todos los usuarios.</li>
                                    <li>Activar o desactivar cuentas.</li>
                                    <li>Crear usuarios administrativos.</li>
                                    <li>Acceder al módulo protegido.</li>
                                </ul>
                            </div>
                        } @else {
                            <div
                                class="p-5 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20"
                            >
                                <h3 class="font-semibold mt-0 mb-3">
                                    Usuario
                                </h3>

                                <ul class="text-muted-color leading-7 pl-5 m-0">
                                    <li>Administrar sus hábitos.</li>
                                    <li>Registrar progreso diario.</li>
                                    <li>Consultar estadísticas.</li>
                                    <li>Generar recomendaciones IA.</li>
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `
})
export class UserForm {
    private readonly authService =
        inject(AuthService);

    private readonly router =
        inject(Router);

    private readonly messageService =
        inject(MessageService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly userRole = 'USER' as AuthRole;
    readonly adminRole = 'ADMIN' as AuthRole;

    readonly roleOptions = [
        {
            label: 'Usuario',
            value: this.userRole
        },
        {
            label: 'Administrador',
            value: this.adminRole
        }
    ];

    firstName = '';
    lastName = '';
    username = '';
    email = '';
    password = '';
    confirmPassword = '';

    role: AuthRole = this.userRole;

    submitted = false;

    saving = false;

    saveUser(): void {
        if (this.saving) {
            return;
        }

        this.submitted = true;

        if (!this.isValidForm()) {
            return;
        }

        this.saving = true;

        const request: CreateUserByAdminRequest = {
            username: this.username.trim(),
            email: this.email.trim().toLowerCase(),
            firstName: this.firstName.trim(),
            lastName: this.lastName.trim(),
            password: this.password,
            role: this.role
        };

        this.authService
            .createUserByAdmin(request)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    window.setTimeout(() => {
                        this.saving = false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Usuario creado',
                            detail:
                                `La cuenta ${request.username} fue creada correctamente.`
                        });

                        window.setTimeout(() => {
                            void this.router.navigate([
                                '/admin/users'
                            ]);
                        }, 700);
                    }, 0);
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    window.setTimeout(() => {
                        this.saving = false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'error',
                            summary:
                                'No fue posible crear',
                            detail:
                                this.getErrorMessage(error)
                        });
                    }, 0);
                }
            });
    }

    isValidUsername(value: string): boolean {
        return /^[a-zA-Z0-9._-]{4,50}$/.test(
            value.trim()
        );
    }

    isValidEmail(value: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            value.trim()
        );
    }

    private isValidForm(): boolean {
        return Boolean(
            this.firstName.trim() &&
            this.lastName.trim() &&
            this.isValidUsername(this.username) &&
            this.isValidEmail(this.email) &&
            this.password.length >= 8 &&
            this.password === this.confirmPassword &&
            this.role
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

        if (error.status === 401) {
            return 'La sesión expiró.';
        }

        if (error.status === 403) {
            return 'No tienes permisos para crear usuarios.';
        }

        if (error.status === 409) {
            return (
                error.error?.message ??
                'El usuario o correo ya se encuentra registrado.'
            );
        }

        return typeof error.error?.message === 'string'
            ? error.error.message
            : 'Ocurrió un error inesperado.';
    }
}
