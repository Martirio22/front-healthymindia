import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

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
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
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
                                <i class="pi pi-user-plus text-primary text-xl"></i>
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
                                    placeholder="Juan"
                                    maxlength="100"
                                />

                                @if (showErrors && !firstName.trim()) {
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
                                    placeholder="Pérez"
                                    maxlength="100"
                                />

                                @if (showErrors && !lastName.trim()) {
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
                                    placeholder="juan.perez"
                                    maxlength="50"
                                />

                                @if (
                                    showErrors &&
                                    !isValidUsername(username)
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        Debe tener entre 4 y 50 caracteres y usar solo letras, números, punto, guion o guion bajo.
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
                                    placeholder="juan@email.com"
                                    maxlength="150"
                                />

                                @if (
                                    showErrors &&
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
                                    placeholder="Mínimo 8 caracteres"
                                />

                                @if (
                                    showErrors &&
                                    password.length < 8
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        La contraseña debe tener al menos 8 caracteres.
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
                                    placeholder="Repite la contraseña"
                                />

                                @if (
                                    showErrors &&
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
                                    placeholder="Selecciona un rol"
                                    styleClass="w-full"
                                />

                                @if (showErrors && !role) {
                                    <small class="block text-red-500 mt-2">
                                        Debes seleccionar un rol.
                                    </small>
                                }
                            </div>
                        </div>

                        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8">
                            <p-button
                                label="Cancelar"
                                icon="pi pi-times"
                                severity="secondary"
                                [outlined]="true"
                                routerLink="/admin/users"
                            />

                            <p-button
                                label="Crear usuario"
                                icon="pi pi-user-plus"
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
                                <i class="pi pi-shield text-orange-500 text-xl"></i>
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

                        @if (role === 'ADMIN') {
                            <div
                                class="p-5 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20"
                            >
                                <h3 class="font-semibold mt-0 mb-3">
                                    Administrador
                                </h3>

                                <ul class="text-muted-color leading-7 pl-5 m-0">
                                    <li>Consultar todos los usuarios.</li>
                                    <li>Activar o desactivar cuentas.</li>
                                    <li>Crear usuarios normales o administrativos.</li>
                                    <li>Acceder al módulo administrativo.</li>
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
                                    <li>Administrar sus propios hábitos.</li>
                                    <li>Registrar progreso diario.</li>
                                    <li>Consultar estadísticas.</li>
                                    <li>Generar recomendaciones IA.</li>
                                </ul>
                            </div>
                        }

                        <div class="flex items-start gap-3 mt-6">
                            <i class="pi pi-info-circle text-primary mt-1"></i>

                            <p class="text-muted-color leading-6 m-0">
                                La creación de administradores debe estar disponible únicamente dentro de esta pantalla protegida.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class UserForm {
    firstName = '';
    lastName = '';
    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    role: 'USER' | 'ADMIN' = 'USER';
    showErrors = false;

    roleOptions = [
        {
            label: 'Usuario',
            value: 'USER'
        },
        {
            label: 'Administrador',
            value: 'ADMIN'
        }
    ];

    constructor(
        private readonly router: Router,
        private readonly messageService: MessageService
    ) {}

    saveUser(): void {
        this.showErrors = true;

        if (
            !this.firstName.trim() ||
            !this.lastName.trim() ||
            !this.isValidUsername(this.username) ||
            !this.isValidEmail(this.email) ||
            this.password.length < 8 ||
            this.password !== this.confirmPassword ||
            !this.role
        ) {
            return;
        }

        this.messageService.add({
            severity: 'success',
            summary: 'Usuario creado',
            detail: `La cuenta ${this.username} fue creada correctamente.`
        });

        window.setTimeout(() => {
            void this.router.navigate(['/admin/users']);
        }, 900);
    }

    isValidUsername(username: string): boolean {
        return /^[a-zA-Z0-9._-]{4,50}$/.test(
            username.trim()
        );
    }

    isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.trim()
        );
    }
}
