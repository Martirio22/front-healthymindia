import { AuthService } from '@/app/core/auth/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

interface UserProfileMock {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    registrationDate: string;
    status: 'ACTIVE' | 'INACTIVE';
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputTextModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                        Mi perfil
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Consulta y actualiza la información asociada a tu cuenta.
                    </p>
                </div>

                <div class="flex flex-wrap gap-3">
                    @if (!editing) {
                        <p-button
                            label="Editar perfil"
                            icon="pi pi-pencil"
                            (onClick)="startEditing()"
                        />
                    } @else {
                        <p-button
                            label="Cancelar"
                            icon="pi pi-times"
                            severity="secondary"
                            [outlined]="true"
                            (onClick)="cancelEditing()"
                        />

                        <p-button
                            label="Guardar cambios"
                            icon="pi pi-save"
                            (onClick)="saveProfile()"
                        />
                    }
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex flex-col items-center text-center">
                            <div
                                class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 text-primary mb-5"
                                style="width: 8rem; height: 8rem"
                            >
                                <span class="text-4xl font-semibold">
                                    {{ initials }}
                                </span>
                            </div>

                            <h2 class="text-2xl font-semibold m-0">
                                {{ profile.firstName }}
                                {{ profile.lastName }}
                            </h2>

                            <span class="text-muted-color mt-2">
                                &#64;{{ profile.username }}
                            </span>

                            <p-tag
                                class="mt-4"
                                [value]="
                                    profile.status === 'ACTIVE'
                                        ? 'Cuenta activa'
                                        : 'Cuenta inactiva'
                                "
                                [severity]="
                                    profile.status === 'ACTIVE'
                                        ? 'success'
                                        : 'danger'
                                "
                                [icon]="
                                    profile.status === 'ACTIVE'
                                        ? 'pi pi-check-circle'
                                        : 'pi pi-ban'
                                "
                            />

                            <div class="w-full border-t border-surface-200 dark:border-surface-700 mt-7 pt-6">
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-muted-color">
                                        Identificador
                                    </span>

                                    <span class="font-semibold">
                                        #{{ profile.id }}
                                    </span>
                                </div>

                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-muted-color">
                                        Rol principal
                                    </span>

                                    <p-tag
                                        value="USER"
                                        severity="info"
                                        icon="pi pi-user"
                                    />
                                </div>

                                <div class="flex items-center justify-between">
                                    <span class="text-muted-color">
                                        Miembro desde
                                    </span>

                                    <span class="font-semibold text-right">
                                        {{ profile.registrationDate }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-8">
                    <div class="card mb-0">
                        <div class="flex items-center gap-4 mb-7">
                            <div
                                class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i class="pi pi-user text-primary text-xl"></i>
                            </div>

                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Información personal
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Datos visibles en tu perfil de HealthyMindIA
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    for="firstName"
                                    class="block font-medium text-surface-900 dark:text-surface-0 mb-2"
                                >
                                    Nombre
                                </label>

                                <input
                                    pInputText
                                    id="firstName"
                                    [(ngModel)]="editableProfile.firstName"
                                    class="w-full"
                                    [disabled]="!editing"
                                    maxlength="100"
                                />

                                @if (
                                    editing &&
                                    showErrors &&
                                    !editableProfile.firstName.trim()
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        El nombre es obligatorio.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="lastName"
                                    class="block font-medium text-surface-900 dark:text-surface-0 mb-2"
                                >
                                    Apellido
                                </label>

                                <input
                                    pInputText
                                    id="lastName"
                                    [(ngModel)]="editableProfile.lastName"
                                    class="w-full"
                                    [disabled]="!editing"
                                    maxlength="100"
                                />

                                @if (
                                    editing &&
                                    showErrors &&
                                    !editableProfile.lastName.trim()
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        El apellido es obligatorio.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="username"
                                    class="block font-medium text-surface-900 dark:text-surface-0 mb-2"
                                >
                                    Nombre de usuario
                                </label>

                                <div class="relative">
                                    <i
                                        class="pi pi-at absolute left-3 top-1/2 -translate-y-1/2 text-muted-color"
                                    ></i>

                                    <input
                                        pInputText
                                        id="username"
                                        [ngModel]="profile.username"
                                        class="w-full pl-10"
                                        disabled
                                    />
                                </div>

                                <small class="block text-muted-color mt-2">
                                    El nombre de usuario no se puede modificar.
                                </small>
                            </div>

                            <div>
                                <label
                                    for="email"
                                    class="block font-medium text-surface-900 dark:text-surface-0 mb-2"
                                >
                                    Correo electrónico
                                </label>

                                <div class="relative">
                                    <i
                                        class="pi pi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-muted-color"
                                    ></i>

                                    <input
                                        pInputText
                                        id="email"
                                        type="email"
                                        [(ngModel)]="editableProfile.email"
                                        class="w-full pl-10"
                                        [disabled]="!editing"
                                        maxlength="150"
                                    />
                                </div>

                                @if (
                                    editing &&
                                    showErrors &&
                                    !isValidEmail(editableProfile.email)
                                ) {
                                    <small class="block text-red-500 mt-2">
                                        Ingresa un correo electrónico válido.
                                    </small>
                                }
                            </div>
                        </div>

                        @if (editing) {
                            <div
                                class="flex items-start gap-3 mt-7 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20"
                            >
                                <i class="pi pi-info-circle text-blue-500 mt-1"></i>

                                <p class="text-muted-color leading-6 m-0">
                                    Puedes modificar tu nombre, apellido y correo electrónico.
                                    El usuario, estado y fecha de registro son administrados por
                                    el sistema.
                                </p>
                            </div>
                        }

                        <div class="flex justify-end gap-3 mt-8">
                            @if (!editing) {
                                <p-button
                                    label="Editar información"
                                    icon="pi pi-pencil"
                                    (onClick)="startEditing()"
                                />
                            } @else {
                                <p-button
                                    label="Descartar"
                                    icon="pi pi-times"
                                    severity="secondary"
                                    [outlined]="true"
                                    (onClick)="cancelEditing()"
                                />

                                <p-button
                                    label="Guardar cambios"
                                    icon="pi pi-save"
                                    (onClick)="saveProfile()"
                                />
                            }
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 md:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between mb-5">
                            <div
                                class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i class="pi pi-list-check text-blue-500 text-xl"></i>
                            </div>

                            <span class="text-3xl font-semibold">
                                5
                            </span>
                        </div>

                        <h3 class="text-lg font-semibold mt-0 mb-2">
                            Hábitos activos
                        </h3>

                        <p class="text-muted-color m-0">
                            Hábitos que actualmente forman parte de tu seguimiento.
                        </p>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between mb-5">
                            <div
                                class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i class="pi pi-bolt text-green-500 text-xl"></i>
                            </div>

                            <span class="text-3xl font-semibold">
                                4
                            </span>
                        </div>

                        <h3 class="text-lg font-semibold mt-0 mb-2">
                            Racha actual
                        </h3>

                        <p class="text-muted-color m-0">
                            Días consecutivos registrando progreso en tus hábitos.
                        </p>
                    </div>
                </div>

                <div class="col-span-12 md:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between mb-5">
                            <div
                                class="flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-400/10"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i class="pi pi-sparkles text-purple-500 text-xl"></i>
                            </div>

                            <span class="text-3xl font-semibold">
                                4
                            </span>
                        </div>

                        <h3 class="text-lg font-semibold mt-0 mb-2">
                            Recomendaciones IA
                        </h3>

                        <p class="text-muted-color m-0">
                            Análisis inteligentes disponibles en tu historial.
                        </p>
                    </div>
                </div>
            </div>

            <div class="card mb-0">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div class="flex items-start gap-4">
                        <div
                            class="flex items-center justify-center rounded-xl bg-red-100 dark:bg-red-400/10 shrink-0"
                            style="width: 3.5rem; height: 3.5rem"
                        >
                            <i class="pi pi-sign-out text-red-500 text-xl"></i>
                        </div>

                        <div>
                            <h2 class="text-xl font-semibold mt-0 mb-2">
                                Cerrar sesión
                            </h2>

                            <p class="text-muted-color m-0">
                                Finaliza tu sesión actual de manera segura.
                            </p>
                        </div>
                    </div>

                    <p-button
                        label="Cerrar sesión"
                        icon="pi pi-sign-out"
                        severity="danger"
                        [outlined]="true"
                        (onClick)="logout()"
                    />
                </div>
            </div>
        </div>
    `
})
export class Profile {
    editing = false;
    showErrors = false;

    profile: UserProfileMock = {
        id: 1,
        username: 'juan.perez',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        registrationDate: '15 de julio de 2026',
        status: 'ACTIVE'
    };

    editableProfile = {
        firstName: this.profile.firstName,
        lastName: this.profile.lastName,
        email: this.profile.email
    };

    constructor(
        private readonly messageService: MessageService,
        private readonly router: Router,
        private readonly authService: AuthService
    ) { }

    get initials(): string {
        const firstInitial =
            this.profile.firstName.charAt(0).toUpperCase();

        const lastInitial =
            this.profile.lastName.charAt(0).toUpperCase();

        return `${firstInitial}${lastInitial}`;
    }

    startEditing(): void {
        this.editableProfile = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            email: this.profile.email
        };

        this.showErrors = false;
        this.editing = true;
    }

    cancelEditing(): void {
        this.editableProfile = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            email: this.profile.email
        };

        this.showErrors = false;
        this.editing = false;
    }

    saveProfile(): void {
        this.showErrors = true;

        if (
            !this.editableProfile.firstName.trim() ||
            !this.editableProfile.lastName.trim() ||
            !this.isValidEmail(this.editableProfile.email)
        ) {
            return;
        }

        this.profile = {
            ...this.profile,
            firstName: this.editableProfile.firstName.trim(),
            lastName: this.editableProfile.lastName.trim(),
            email: this.editableProfile.email.trim().toLowerCase()
        };

        this.showErrors = false;
        this.editing = false;

        this.messageService.add({
            severity: 'success',
            summary: 'Perfil actualizado',
            detail: 'Tu información personal fue actualizada correctamente.'
        });
    }

    isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.trim()
        );
    }

    logout(): void {
        this.authService.logout().subscribe({
            next: () => {
                void this.router.navigate([
                    '/auth/login'
                ]);
            },
            error: () => {
                void this.router.navigate([
                    '/auth/login'
                ]);
            }
        });
    }
}
