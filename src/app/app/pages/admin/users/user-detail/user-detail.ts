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
import {
    ActivatedRoute,
    RouterModule
} from '@angular/router';

import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { UserResponse } from '@/app/core/users/models/user-response.model';
import { UserStatus } from '@/app/core/users/models/user-status.enum';
import { UserService } from '@/app/core/users/services/user.service';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ConfirmDialogModule,
        MessageModule,
        SkeletonModule,
        TagModule,
        ToastModule
    ],
    providers: [
        ConfirmationService,
        MessageService
    ],
    template: `
        <p-toast />
        <p-confirmdialog />

        <div class="flex flex-col gap-6">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
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
                            Detalle del usuario
                        </h1>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta la información y administra el estado de la cuenta.
                        </p>
                    </div>
                </div>

                @if (user && !loadingUser) {
                    <p-button
                        [label]="
                            isActive
                                ? 'Desactivar cuenta'
                                : 'Activar cuenta'
                        "
                        [icon]="
                            isActive
                                ? 'pi pi-ban'
                                : 'pi pi-check-circle'
                        "
                        [severity]="
                            isActive
                                ? 'danger'
                                : 'success'
                        "
                        [outlined]="true"
                        [loading]="changingStatus"
                        (onClick)="confirmStatusChange()"
                    />
                }
            </div>

            @if (errorMessage) {
                <p-message
                    severity="error"
                    [text]="errorMessage"
                    styleClass="w-full"
                />
            }

            @if (loadingUser) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-4">
                        <div class="card mb-0">
                            <div class="flex flex-col items-center">
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
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-8">
                        <div class="card mb-0">
                            @for (item of detailSkeletons; track item) {
                                <p-skeleton
                                    width="100%"
                                    height="5rem"
                                    styleClass="mb-4"
                                />
                            }
                        </div>
                    </div>
                </div>
            } @else if (user) {
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
                                    {{ user.firstName }}
                                    {{ user.lastName }}
                                </h2>

                                <span class="text-muted-color mt-2">
                                    &#64;{{ user.username }}
                                </span>

                                <p-tag
                                    styleClass="mt-4"
                                    [value]="
                                        isActive
                                            ? 'Cuenta activa'
                                            : 'Cuenta inactiva'
                                    "
                                    [severity]="
                                        isActive
                                            ? 'success'
                                            : 'danger'
                                    "
                                    [icon]="
                                        isActive
                                            ? 'pi pi-check-circle'
                                            : 'pi pi-ban'
                                    "
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
                                            #{{ user.id }}
                                        </span>
                                    </div>

                                    <div
                                        class="flex items-center justify-between"
                                    >
                                        <span class="text-muted-color">
                                            Fecha de registro
                                        </span>

                                        <span class="font-semibold text-right">
                                            {{
                                                formatDate(
                                                    user.registrationDate
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
                                        class="pi pi-id-card text-primary text-xl"
                                    ></i>
                                </div>

                                <div>
                                    <h2
                                        class="text-xl font-semibold m-0"
                                    >
                                        Información de la cuenta
                                    </h2>

                                    <span class="text-muted-color text-sm">
                                        Datos registrados en el sistema
                                    </span>
                                </div>
                            </div>

                            <div
                                class="grid grid-cols-1 md:grid-cols-2 gap-5"
                            >
                                <div
                                    class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Nombre
                                    </span>

                                    <span class="text-lg font-semibold">
                                        {{ user.firstName }}
                                    </span>
                                </div>

                                <div
                                    class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Apellido
                                    </span>

                                    <span class="text-lg font-semibold">
                                        {{ user.lastName }}
                                    </span>
                                </div>

                                <div
                                    class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Usuario
                                    </span>

                                    <span class="text-lg font-semibold">
                                        {{ user.username }}
                                    </span>
                                </div>

                                <div
                                    class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Correo electrónico
                                    </span>

                                    <span
                                        class="text-lg font-semibold break-all"
                                    >
                                        {{ user.email }}
                                    </span>
                                </div>
                            </div>

                            <div
                                class="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-7 p-5 rounded-xl border"
                                [class.border-green-200]="isActive"
                                [class.bg-green-50]="isActive"
                                [class.dark:bg-green-950/20]="isActive"
                                [class.border-red-200]="!isActive"
                                [class.bg-red-50]="!isActive"
                                [class.dark:bg-red-950/20]="!isActive"
                            >
                                <div class="flex items-start gap-4">
                                    <i
                                        class="pi text-2xl mt-1"
                                        [class.pi-check-circle]="isActive"
                                        [class.text-green-500]="isActive"
                                        [class.pi-ban]="!isActive"
                                        [class.text-red-500]="!isActive"
                                    ></i>

                                    <div>
                                        <h3
                                            class="text-lg font-semibold mt-0 mb-2"
                                        >
                                            {{
                                                isActive
                                                    ? 'Usuario activo'
                                                    : 'Usuario inactivo'
                                            }}
                                        </h3>

                                        <p
                                            class="text-muted-color m-0 leading-6"
                                        >
                                            {{
                                                isActive
                                                    ? 'La cuenta puede iniciar sesión y utilizar las funcionalidades permitidas.'
                                                    : 'La cuenta se encuentra desactivada administrativamente.'
                                            }}
                                        </p>
                                    </div>
                                </div>

                                <p-button
                                    [label]="
                                        isActive
                                            ? 'Desactivar'
                                            : 'Activar'
                                    "
                                    [icon]="
                                        isActive
                                            ? 'pi pi-ban'
                                            : 'pi pi-check'
                                    "
                                    [severity]="
                                        isActive
                                            ? 'danger'
                                            : 'success'
                                    "
                                    [loading]="changingStatus"
                                    (onClick)="confirmStatusChange()"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div class="flex items-start gap-4">
                        <div
                            class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10 shrink-0"
                            style="width: 3.5rem; height: 3.5rem"
                        >
                            <i
                                class="pi pi-shield text-orange-500 text-xl"
                            ></i>
                        </div>

                        <div>
                            <h2
                                class="text-xl font-semibold mt-0 mb-2"
                            >
                                Acción administrativa
                            </h2>

                            <p class="text-muted-color leading-6 m-0">
                                El cambio de estado afecta el acceso del usuario,
                                pero no elimina su perfil ni su información.
                            </p>
                        </div>
                    </div>
                </div>
            }
        </div>
    `
})
export class UserDetail implements OnInit {
    private readonly route =
        inject(ActivatedRoute);

    private readonly userService =
        inject(UserService);

    private readonly confirmationService =
        inject(ConfirmationService);

    private readonly messageService =
        inject(MessageService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly detailSkeletons = [1, 2, 3, 4];

    userId: number | null = null;

    user: UserResponse | null = null;

    loadingUser = false;

    changingStatus = false;

    errorMessage = '';

    constructor() {
        const idValue =
            this.route.snapshot.paramMap.get('id');

        const id = Number(idValue);

        if (
            idValue &&
            Number.isInteger(id) &&
            id > 0
        ) {
            this.userId = id;
            this.loadingUser = true;
        }
    }

    ngOnInit(): void {
        if (!this.userId) {
            this.errorMessage =
                'El identificador del usuario no es válido.';

            return;
        }

        this.loadUser(this.userId);
    }

    get isActive(): boolean {
        return this.user?.status ===
            UserStatus.Active;
    }

    get initials(): string {
        if (!this.user) {
            return 'US';
        }

        return (
            this.user.firstName.charAt(0) +
            this.user.lastName.charAt(0)
        ).toUpperCase();
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

    confirmStatusChange(): void {
        if (!this.user) {
            return;
        }

        const activating = !this.isActive;

        this.confirmationService.confirm({
            header: activating
                ? 'Activar cuenta'
                : 'Desactivar cuenta',

            message: activating
                ? '¿Deseas habilitar nuevamente el acceso de este usuario?'
                : '¿Deseas desactivar el acceso de este usuario?',

            icon: activating
                ? 'pi pi-check-circle'
                : 'pi pi-exclamation-triangle',

            acceptLabel: activating
                ? 'Activar'
                : 'Desactivar',

            rejectLabel: 'Cancelar',

            acceptButtonStyleClass: activating
                ? 'p-button-success'
                : 'p-button-danger',

            accept: () => {
                this.changeStatus();
            }
        });
    }

    private loadUser(id: number): void {
        this.userService
            .getUserById(id)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.user = response;

                    window.setTimeout(() => {
                        this.loadingUser = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.user = null;
                    this.errorMessage =
                        this.getErrorMessage(error);

                    window.setTimeout(() => {
                        this.loadingUser = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    private changeStatus(): void {
        if (
            !this.user ||
            this.changingStatus
        ) {
            return;
        }

        this.changingStatus = true;

        this.userService
            .changeUserStatus(this.user.id)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.user = response;

                    window.setTimeout(() => {
                        this.changingStatus = false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Estado actualizado',
                            detail: this.isActive
                                ? 'La cuenta fue activada correctamente.'
                                : 'La cuenta fue desactivada correctamente.'
                        });
                    }, 0);
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    window.setTimeout(() => {
                        this.changingStatus = false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'error',
                            summary:
                                'No fue posible actualizar',
                            detail:
                                this.getErrorMessage(error)
                        });
                    }, 0);
                }
            });
    }

    private getErrorMessage(
        error: HttpErrorResponse
    ): string {
        if (error.status === 0) {
            return 'No fue posible conectarse con el servidor.';
        }

        if (error.status === 401) {
            return 'La sesión expiró.';
        }

        if (error.status === 403) {
            return 'No tienes permisos administrativos.';
        }

        if (error.status === 404) {
            return 'No se encontró el usuario solicitado.';
        }

        return typeof error.error?.message === 'string'
            ? error.error.message
            : 'Ocurrió un error inesperado.';
    }
}
