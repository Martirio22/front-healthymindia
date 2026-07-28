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
import { RouterModule } from '@angular/router';

import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { UserResponse } from '@/app/core/users/models/user-response.model';
import { UserStatus } from '@/app/core/users/models/user-status.enum';
import { UserService } from '@/app/core/users/services/user.service';

type UserStatusFilter =
    | 'ALL'
    | 'ACTIVE'
    | 'INACTIVE';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        MessageModule,
        SelectModule,
        SkeletonModule,
        TableModule,
        TagModule,
        ToastModule,
        TooltipModule
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
                class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div class="flex items-center gap-4">
                    <div
                        class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                        style="width: 3.5rem; height: 3.5rem"
                    >
                        <i
                            class="pi pi-shield text-primary text-xl"
                        ></i>
                    </div>

                    <div>
                        <h1
                            class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                        >
                            Administración de usuarios
                        </h1>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta, supervisa y administra las cuentas registradas.
                        </p>
                    </div>
                </div>

                <div class="flex gap-3">
                    <p-button
                        icon="pi pi-refresh"
                        severity="secondary"
                        [outlined]="true"
                        [loading]="refreshing"
                        [disabled]="loadingUsers || refreshing"
                        ariaLabel="Actualizar usuarios"
                        (onClick)="loadUsers(true)"
                    />

                    <p-button
                        label="Crear usuario"
                        icon="pi pi-user-plus"
                        routerLink="/admin/users/new"
                    />
                </div>
            </div>

            @if (errorMessage) {
                <p-message
                    severity="error"
                    [text]="errorMessage"
                    styleClass="w-full"
                />
            }

            @if (loadingUsers) {
                <div class="grid grid-cols-12 gap-6">
                    @for (item of summarySkeletons; track item) {
                        <div class="col-span-12 sm:col-span-4">
                            <div class="card mb-0">
                                <p-skeleton
                                    width="9rem"
                                    height="1rem"
                                    styleClass="mb-4"
                                />

                                <p-skeleton
                                    width="4rem"
                                    height="2.5rem"
                                />
                            </div>
                        </div>
                    }
                </div>

                <div class="card mb-0">
                    <p-skeleton
                        width="14rem"
                        height="1.5rem"
                        styleClass="mb-6"
                    />

                    @for (item of rowSkeletons; track item) {
                        <p-skeleton
                            width="100%"
                            height="4rem"
                            styleClass="mb-3"
                        />
                    }
                </div>
            } @else {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 sm:col-span-4">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Total de usuarios
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ users.length }}
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                    style="width: 3rem; height: 3rem"
                                >
                                    <i
                                        class="pi pi-users text-blue-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-4">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Usuarios activos
                                    </span>

                                    <div
                                        class="text-3xl font-semibold text-green-500"
                                    >
                                        {{ activeUsers }}
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                    style="width: 3rem; height: 3rem"
                                >
                                    <i
                                        class="pi pi-check-circle text-green-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-4">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Usuarios inactivos
                                    </span>

                                    <div
                                        class="text-3xl font-semibold text-orange-500"
                                    >
                                        {{ inactiveUsers }}
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                    style="width: 3rem; height: 3rem"
                                >
                                    <i
                                        class="pi pi-ban text-orange-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div
                        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6"
                    >
                        <div>
                            <h2 class="text-xl font-semibold m-0">
                                Lista de usuarios
                            </h2>

                            <p class="text-muted-color mt-2 mb-0">
                                {{ filteredUsers.length }} cuentas encontradas
                            </p>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3">
                            <div class="relative">
                                <i
                                    class="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-muted-color"
                                ></i>

                                <input
                                    pInputText
                                    [(ngModel)]="search"
                                    class="w-full sm:w-80 pl-10"
                                    placeholder="Buscar usuario, nombre o correo"
                                />
                            </div>

                            <p-select
                                [(ngModel)]="statusFilter"
                                [options]="statusOptions"
                                optionLabel="label"
                                optionValue="value"
                                styleClass="w-full sm:w-52"
                            />
                        </div>
                    </div>

                    <p-table
                        [value]="filteredUsers"
                        [paginator]="true"
                        [rows]="5"
                        [rowsPerPageOptions]="[5, 10, 20]"
                        [rowHover]="true"
                        responsiveLayout="scroll"
                    >
                        <ng-template #header>
                            <tr>
                                <th>Usuario</th>
                                <th>Nombre completo</th>
                                <th>Correo</th>
                                <th>Fecha de creación</th>
                                <th>Estado</th>
                                <th class="text-center">
                                    Acciones
                                </th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-user>
                            <tr>
                                <td>
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 text-primary font-semibold"
                                            style="width: 2.75rem; height: 2.75rem"
                                        >
                                            {{ getInitials(user) }}
                                        </div>

                                        <div>
                                            <div class="font-semibold">
                                                {{ user.username }}
                                            </div>

                                            <small class="text-muted-color">
                                                ID #{{ user.id }}
                                            </small>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    {{ user.firstName }}
                                    {{ user.lastName }}
                                </td>

                                <td>
                                    <div class="flex items-center gap-2">
                                        <i
                                            class="pi pi-envelope text-muted-color"
                                        ></i>

                                        {{ user.email }}
                                    </div>
                                </td>

                                <td>
                                    {{
                                        formatDate(
                                            user.registrationDate
                                        )
                                    }}
                                </td>

                                <td>
                                    <p-tag
                                        [value]="
                                            isActive(user)
                                                ? 'Activo'
                                                : 'Inactivo'
                                        "
                                        [severity]="
                                            isActive(user)
                                                ? 'success'
                                                : 'danger'
                                        "
                                        [icon]="
                                            isActive(user)
                                                ? 'pi pi-check-circle'
                                                : 'pi pi-ban'
                                        "
                                    />
                                </td>

                                <td>
                                    <div class="flex justify-center gap-2">
                                        <p-button
                                            icon="pi pi-eye"
                                            severity="secondary"
                                            [rounded]="true"
                                            [outlined]="true"
                                            [routerLink]="[
                                                '/admin/users',
                                                user.id
                                            ]"
                                            pTooltip="Ver detalle"
                                        />

                                        <p-button
                                            [icon]="
                                                isActive(user)
                                                    ? 'pi pi-ban'
                                                    : 'pi pi-check'
                                            "
                                            [severity]="
                                                isActive(user)
                                                    ? 'warn'
                                                    : 'success'
                                            "
                                            [rounded]="true"
                                            [outlined]="true"
                                            [loading]="
                                                changingStatusId === user.id
                                            "
                                            [disabled]="
                                                changingStatusId !== null
                                            "
                                            [pTooltip]="
                                                isActive(user)
                                                    ? 'Desactivar'
                                                    : 'Activar'
                                            "
                                            (onClick)="
                                                confirmStatusChange(user)
                                            "
                                        />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>

                        <ng-template #emptymessage>
                            <tr>
                                <td colspan="6">
                                    <div
                                        class="flex flex-col items-center justify-center text-center py-12"
                                    >
                                        <i
                                            class="pi pi-users text-primary text-4xl mb-4"
                                        ></i>

                                        <h3
                                            class="text-xl font-semibold m-0"
                                        >
                                            No se encontraron usuarios
                                        </h3>

                                        <p
                                            class="text-muted-color mt-2 mb-0"
                                        >
                                            Cambia los filtros o registra una nueva cuenta.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
                </div>
            }
        </div>
    `
})
export class UserList implements OnInit {
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

    readonly summarySkeletons = [1, 2, 3];
    readonly rowSkeletons = [1, 2, 3, 4, 5];

    readonly statusOptions = [
        {
            label: 'Todos los estados',
            value: 'ALL'
        },
        {
            label: 'Activos',
            value: 'ACTIVE'
        },
        {
            label: 'Inactivos',
            value: 'INACTIVE'
        }
    ];

    users: UserResponse[] = [];

    search = '';

    statusFilter: UserStatusFilter = 'ALL';

    loadingUsers = false;

    refreshing = false;

    changingStatusId: number | null = null;

    errorMessage = '';

    ngOnInit(): void {
        window.setTimeout(() => {
            this.loadUsers(false);
        }, 0);
    }

    get activeUsers(): number {
        return this.users.filter(
            user => this.isActive(user)
        ).length;
    }

    get inactiveUsers(): number {
        return this.users.filter(
            user => !this.isActive(user)
        ).length;
    }

    get filteredUsers(): UserResponse[] {
        const query = this.search
            .trim()
            .toLowerCase();

        return this.users.filter(user => {
            const matchesStatus =
                this.statusFilter === 'ALL' ||
                (
                    this.statusFilter === 'ACTIVE' &&
                    this.isActive(user)
                ) ||
                (
                    this.statusFilter === 'INACTIVE' &&
                    !this.isActive(user)
                );

            const searchableText = [
                user.username,
                user.firstName,
                user.lastName,
                user.email
            ]
                .join(' ')
                .toLowerCase();

            return (
                matchesStatus &&
                (
                    !query ||
                    searchableText.includes(query)
                )
            );
        });
    }

    loadUsers(isRefresh = false): void {
        if (
            this.loadingUsers ||
            this.refreshing
        ) {
            return;
        }

        if (isRefresh) {
            this.refreshing = true;
        } else {
            this.loadingUsers = true;
        }

        this.errorMessage = '';

        this.userService
            .getAllUsers()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.users = response;

                    window.setTimeout(() => {
                        this.loadingUsers = false;
                        this.refreshing = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.errorMessage =
                        this.getErrorMessage(error);

                    window.setTimeout(() => {
                        this.loadingUsers = false;
                        this.refreshing = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    isActive(user: UserResponse): boolean {
        return user.status === UserStatus.Active;
    }

    getInitials(user: UserResponse): string {
        return (
            user.firstName.charAt(0) +
            user.lastName.charAt(0)
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
                month: '2-digit',
                year: 'numeric'
            }
        ).format(date);
    }

    confirmStatusChange(
        user: UserResponse
    ): void {
        const activating = !this.isActive(user);

        this.confirmationService.confirm({
            header: activating
                ? 'Activar usuario'
                : 'Desactivar usuario',

            message: activating
                ? `¿Deseas activar la cuenta de ${user.firstName} ${user.lastName}?`
                : `¿Deseas desactivar la cuenta de ${user.firstName} ${user.lastName}?`,

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
                this.changeStatus(user);
            }
        });
    }

    private changeStatus(
        user: UserResponse
    ): void {
        this.changingStatusId = user.id;

        this.userService
            .changeUserStatus(user.id)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    const index =
                        this.users.findIndex(
                            item => item.id === user.id
                        );

                    if (index >= 0) {
                        this.users[index] = response;
                        this.users = [...this.users];
                    }

                    this.changingStatusId = null;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Estado actualizado',
                        detail: this.isActive(response)
                            ? 'El usuario fue activado correctamente.'
                            : 'El usuario fue desactivado correctamente.'
                    });
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.changingStatusId = null;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible actualizar',
                        detail:
                            this.getErrorMessage(error)
                    });
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
            return 'La sesión expiró. Inicia sesión nuevamente.';
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
