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

import {
    catchError,
    forkJoin,
    of
} from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { AuthService } from '@/app/core/auth/services/auth.service';
import { TokenStorageService } from '@/app/core/auth/services/token-storage.service';

import { HabitResponse } from '@/app/core/habits/models/habit-response.model';
import { HabitService } from '@/app/core/habits/services/habit.service';

import { StatisticsService } from '@/app/core/statistics/services/statistics.service';

import { UserRequest } from '@/app/core/users/models/user-request.model';
import { UserResponse } from '@/app/core/users/models/user-response.model';
import { UserStatus } from '@/app/core/users/models/user-status.enum';
import { UserService } from '@/app/core/users/services/user.service';

interface EditableProfile {
    firstName: string;
    lastName: string;
    email: string;
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
        MessageModule,
        SkeletonModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="flex flex-col gap-6">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div>
                    <h1
                        class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                    >
                        Mi perfil
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Consulta y actualiza la información asociada a tu cuenta.
                    </p>
                </div>

                @if (!loadingProfile && profile) {
                    <div class="flex flex-wrap gap-3">
                        @if (!editing) {
                            <p-button
                                label="Editar perfil"
                                icon="pi pi-pencil"
                                [disabled]="savingProfile"
                                (onClick)="startEditing()"
                            />
                        } @else {
                            <p-button
                                label="Cancelar"
                                icon="pi pi-times"
                                severity="secondary"
                                [outlined]="true"
                                [disabled]="savingProfile"
                                (onClick)="cancelEditing()"
                            />

                            <p-button
                                label="Guardar cambios"
                                icon="pi pi-save"
                                [loading]="savingProfile"
                                (onClick)="saveProfile()"
                            />
                        }
                    </div>
                }
            </div>

            @if (errorMessage) {
                <p-message
                    severity="error"
                    [text]="errorMessage"
                    styleClass="w-full"
                />
            }

            @if (loadingProfile) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-4">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex flex-col items-center text-center"
                            >
                                <p-skeleton
                                    shape="circle"
                                    size="8rem"
                                    styleClass="mb-5"
                                />

                                <p-skeleton
                                    width="12rem"
                                    height="1.8rem"
                                    styleClass="mb-3"
                                />

                                <p-skeleton
                                    width="8rem"
                                    height="1rem"
                                    styleClass="mb-5"
                                />

                                <p-skeleton
                                    width="6rem"
                                    height="2rem"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-8">
                        <div class="card mb-0">
                            <p-skeleton
                                width="14rem"
                                height="1.5rem"
                                styleClass="mb-7"
                            />

                            <div
                                class="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
                                @for (item of formSkeletons; track item) {
                                    <div>
                                        <p-skeleton
                                            width="6rem"
                                            height="1rem"
                                            styleClass="mb-3"
                                        />

                                        <p-skeleton
                                            width="100%"
                                            height="3rem"
                                        />
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            } @else if (profile) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-4">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex flex-col items-center text-center"
                            >
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
                                    styleClass="mt-4"
                                    [value]="statusLabel"
                                    [severity]="statusSeverity"
                                    [icon]="statusIcon"
                                />

                                <div
                                    class="w-full border-t border-surface-200 dark:border-surface-700 mt-7 pt-6"
                                >
                                    <div
                                        class="flex items-center justify-between mb-4"
                                    >
                                        <span class="text-muted-color">
                                            Identificador
                                        </span>

                                        <span class="font-semibold">
                                            #{{ profile.id }}
                                        </span>
                                    </div>

                                    <div
                                        class="flex items-center justify-between mb-4"
                                    >
                                        <span class="text-muted-color">
                                            Rol principal
                                        </span>

                                        <p-tag
                                            [value]="mainRole"
                                            severity="info"
                                            icon="pi pi-shield"
                                        />
                                    </div>

                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span class="text-muted-color">
                                            Miembro desde
                                        </span>

                                        <span
                                            class="font-semibold text-right"
                                        >
                                            {{
                                                formatDate(
                                                    profile.registrationDate
                                                )
                                            }}
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
                                    <i
                                        class="pi pi-user text-primary text-xl"
                                    ></i>
                                </div>

                                <div>
                                    <h2
                                        class="text-xl font-semibold m-0"
                                    >
                                        Información personal
                                    </h2>

                                    <span
                                        class="text-muted-color text-sm"
                                    >
                                        Datos asociados a tu cuenta de
                                        HealthyMindIA
                                    </span>
                                </div>
                            </div>

                            <div
                                class="grid grid-cols-1 md:grid-cols-2 gap-6"
                            >
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
                                        [(ngModel)]="
                                            editableProfile.firstName
                                        "
                                        class="w-full"
                                        [disabled]="
                                            !editing || savingProfile
                                        "
                                        maxlength="100"
                                    />

                                    @if (
                                        editing &&
                                        submitted &&
                                        !editableProfile.firstName.trim()
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
                                        class="block font-medium mb-2"
                                    >
                                        Apellido
                                    </label>

                                    <input
                                        pInputText
                                        id="lastName"
                                        [(ngModel)]="
                                            editableProfile.lastName
                                        "
                                        class="w-full"
                                        [disabled]="
                                            !editing || savingProfile
                                        "
                                        maxlength="100"
                                    />

                                    @if (
                                        editing &&
                                        submitted &&
                                        !editableProfile.lastName.trim()
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
                                        class="block font-medium mb-2"
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

                                    <small
                                        class="block text-muted-color mt-2"
                                    >
                                        El nombre de usuario no puede
                                        modificarse.
                                    </small>
                                </div>

                                <div>
                                    <label
                                        for="email"
                                        class="block font-medium mb-2"
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
                                            [(ngModel)]="
                                                editableProfile.email
                                            "
                                            class="w-full pl-10"
                                            [disabled]="
                                                !editing || savingProfile
                                            "
                                            maxlength="150"
                                        />
                                    </div>

                                    @if (
                                        editing &&
                                        submitted &&
                                        !isValidEmail(
                                            editableProfile.email
                                        )
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            Ingresa un correo electrónico
                                            válido.
                                        </small>
                                    }
                                </div>
                            </div>

                            @if (editing) {
                                <div
                                    class="flex items-start gap-3 mt-7 p-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20"
                                >
                                    <i
                                        class="pi pi-info-circle text-blue-500 mt-1"
                                    ></i>

                                    <p
                                        class="text-muted-color leading-6 m-0"
                                    >
                                        Puedes modificar tu nombre, apellido
                                        y correo electrónico. El nombre de
                                        usuario, estado y fecha de registro
                                        son administrados por el sistema.
                                    </p>
                                </div>
                            }

                            <div
                                class="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8"
                            >
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
                                        [disabled]="savingProfile"
                                        (onClick)="cancelEditing()"
                                    />

                                    <p-button
                                        label="Guardar cambios"
                                        icon="pi pi-save"
                                        [loading]="savingProfile"
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
                            <div
                                class="flex items-center justify-between mb-5"
                            >
                                <div
                                    class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-list-check text-blue-500 text-xl"
                                    ></i>
                                </div>

                                @if (loadingSummary) {
                                    <p-skeleton
                                        width="3rem"
                                        height="2.5rem"
                                    />
                                } @else {
                                    <span
                                        class="text-3xl font-semibold"
                                    >
                                        {{ activeHabits }}
                                    </span>
                                }
                            </div>

                            <h3
                                class="text-lg font-semibold mt-0 mb-2"
                            >
                                Hábitos activos
                            </h3>

                            <p class="text-muted-color m-0">
                                Hábitos que actualmente forman parte de tu
                                seguimiento.
                            </p>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex items-center justify-between mb-5"
                            >
                                <div
                                    class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-bolt text-green-500 text-xl"
                                    ></i>
                                </div>

                                @if (loadingSummary) {
                                    <p-skeleton
                                        width="3rem"
                                        height="2.5rem"
                                    />
                                } @else {
                                    <span
                                        class="text-3xl font-semibold"
                                    >
                                        {{ currentStreak }}
                                    </span>
                                }
                            </div>

                            <h3
                                class="text-lg font-semibold mt-0 mb-2"
                            >
                                Racha actual
                            </h3>

                            <p class="text-muted-color m-0">
                                Días consecutivos registrando progreso en tus
                                hábitos.
                            </p>
                        </div>
                    </div>

                    <div class="col-span-12 md:col-span-4">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex items-center justify-between mb-5"
                            >
                                <div
                                    class="flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-sparkles text-purple-500 text-xl"
                                    ></i>
                                </div>

                                @if (loadingSummary) {
                                    <p-skeleton
                                        width="3rem"
                                        height="2.5rem"
                                    />
                                } @else {
                                    <span
                                        class="text-3xl font-semibold"
                                    >
                                        {{ recommendationCount }}
                                    </span>
                                }
                            </div>

                            <h3
                                class="text-lg font-semibold mt-0 mb-2"
                            >
                                Recomendaciones IA
                            </h3>

                            <p class="text-muted-color m-0">
                                Análisis inteligentes disponibles en tu
                                historial.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div
                        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                    >
                        <div class="flex items-start gap-4">
                            <div
                                class="flex items-center justify-center rounded-xl bg-red-100 dark:bg-red-400/10 shrink-0"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i
                                    class="pi pi-sign-out text-red-500 text-xl"
                                ></i>
                            </div>

                            <div>
                                <h2
                                    class="text-xl font-semibold mt-0 mb-2"
                                >
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
                            [loading]="loggingOut"
                            [disabled]="savingProfile"
                            (onClick)="logout()"
                        />
                    </div>
                </div>
            }
        </div>
    `
})
export class Profile implements OnInit {
    private readonly userService =
        inject(UserService);

    private readonly habitService =
        inject(HabitService);

    private readonly statisticsService =
        inject(StatisticsService);

    private readonly tokenStorage =
        inject(TokenStorageService);

    private readonly authService =
        inject(AuthService);

    private readonly messageService =
        inject(MessageService);

    private readonly router =
        inject(Router);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly formSkeletons = [1, 2, 3, 4];

    profile: UserResponse | null = null;

    editableProfile: EditableProfile = {
        firstName: '',
        lastName: '',
        email: ''
    };

    editing = false;

    submitted = false;

    loadingProfile = false;

    loadingSummary = false;

    savingProfile = false;

    loggingOut = false;

    errorMessage = '';

    activeHabits = 0;

    currentStreak = 0;

    recommendationCount = 0;

    ngOnInit(): void {
        window.setTimeout(() => {
            this.loadProfile();
            this.loadSummary();
        }, 0);
    }

    get initials(): string {
        if (!this.profile) {
            return 'US';
        }

        const firstInitial =
            this.profile.firstName
                ?.trim()
                .charAt(0)
                .toUpperCase() ?? '';

        const lastInitial =
            this.profile.lastName
                ?.trim()
                .charAt(0)
                .toUpperCase() ?? '';

        return (
            `${firstInitial}${lastInitial}` ||
            this.profile.username
                .substring(0, 2)
                .toUpperCase()
        );
    }

    get mainRole(): string {
        if (this.tokenStorage.isAdmin()) {
            return 'ADMIN';
        }

        if (this.tokenStorage.isUser()) {
            return 'USER';
        }

        return 'USUARIO';
    }

    get statusLabel(): string {
        return this.profile?.status ===
            UserStatus.Active
            ? 'Cuenta activa'
            : 'Cuenta inactiva';
    }

    get statusSeverity():
        | 'success'
        | 'danger' {
        return this.profile?.status ===
            UserStatus.Active
            ? 'success'
            : 'danger';
    }

    get statusIcon(): string {
        return this.profile?.status ===
            UserStatus.Active
            ? 'pi pi-check-circle'
            : 'pi pi-ban';
    }

    startEditing(): void {
        if (!this.profile) {
            return;
        }

        this.editableProfile = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            email: this.profile.email
        };

        this.submitted = false;
        this.editing = true;
    }

    cancelEditing(): void {
        this.resetEditableProfile();
        this.submitted = false;
        this.editing = false;
    }

    saveProfile(): void {
        if (
            !this.profile ||
            this.savingProfile
        ) {
            return;
        }

        this.submitted = true;

        if (!this.isValidForm()) {
            return;
        }

        this.savingProfile = true;

        const request: UserRequest = {
            firstName:
                this.editableProfile.firstName.trim(),

            lastName:
                this.editableProfile.lastName.trim(),

            email:
                this.editableProfile.email
                    .trim()
                    .toLowerCase()
        };

        this.userService
            .updateMyProfile(request)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.profile = response;

                    this.resetEditableProfile();

                    window.setTimeout(() => {
                        this.savingProfile = false;
                        this.editing = false;
                        this.submitted = false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Perfil actualizado',
                            detail:
                                'Tu información personal fue actualizada correctamente.'
                        });
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    window.setTimeout(() => {
                        this.savingProfile = false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'error',
                            summary:
                                'No fue posible actualizar',
                            detail:
                                this.getErrorMessage(
                                    error
                                )
                        });
                    }, 0);
                }
            });
    }

    isValidEmail(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email.trim()
        );
    }

    formatDate(value: string): string {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return new Intl.DateTimeFormat(
            'es-EC',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }
        ).format(date);
    }

    logout(): void {
        if (this.loggingOut) {
            return;
        }

        this.loggingOut = true;

        this.authService
            .logout()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
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

    private loadProfile(): void {
        if (this.loadingProfile) {
            return;
        }

        this.loadingProfile = true;
        this.errorMessage = '';

        this.userService
            .getMyProfile()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.profile = response;
                    this.resetEditableProfile();

                    window.setTimeout(() => {
                        this.loadingProfile = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.profile = null;
                    this.errorMessage =
                        this.getErrorMessage(error);

                    window.setTimeout(() => {
                        this.loadingProfile = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    private loadSummary(): void {
        if (this.loadingSummary) {
            return;
        }

        this.loadingSummary = true;

        forkJoin({
            habits: this.habitService
                .getMyHabits()
                .pipe(
                    catchError(() =>
                        of([] as HabitResponse[])
                    )
                ),

            dashboard:
                this.statisticsService
                    .getDashboard()
                    .pipe(
                        catchError(() =>
                            of(null)
                        )
                    ),

            recommendations:
                this.statisticsService
                    .getRecommendationHistory()
                    .pipe(
                        catchError(() =>
                            of([])
                        )
                    )
        })
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.activeHabits =
                        response.habits.filter(
                            habit => habit.active
                        ).length;

                    this.currentStreak =
                        response.dashboard
                            ?.currentStreak ?? 0;

                    this.recommendationCount =
                        response.recommendations.length;

                    window.setTimeout(() => {
                        this.loadingSummary = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },

                error: () => {
                    window.setTimeout(() => {
                        this.loadingSummary = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    private resetEditableProfile(): void {
        if (!this.profile) {
            this.editableProfile = {
                firstName: '',
                lastName: '',
                email: ''
            };

            return;
        }

        this.editableProfile = {
            firstName: this.profile.firstName,
            lastName: this.profile.lastName,
            email: this.profile.email
        };
    }

    private isValidForm(): boolean {
        return Boolean(
            this.editableProfile.firstName.trim() &&
            this.editableProfile.lastName.trim() &&
            this.isValidEmail(
                this.editableProfile.email
            )
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
            return 'La sesión expiró. Inicia sesión nuevamente.';
        }

        if (error.status === 403) {
            return 'No tienes permisos para realizar esta operación.';
        }

        if (error.status === 404) {
            return 'No se encontró el perfil del usuario.';
        }

        if (error.status === 409) {
            return (
                error.error?.message ??
                'El correo electrónico ya está siendo utilizado.'
            );
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
