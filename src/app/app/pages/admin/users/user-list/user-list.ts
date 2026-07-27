import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

interface AdminUserMock {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    registrationDate: string;
    status: 'ACTIVE' | 'INACTIVE';
}

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
        SelectModule,
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
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <div class="flex items-center gap-3 mb-2">
                        <div
                            class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                            style="width: 3.5rem; height: 3.5rem"
                        >
                            <i class="pi pi-shield text-primary text-xl"></i>
                        </div>

                        <div>
                            <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                                Administración de usuarios
                            </h1>

                            <p class="text-muted-color mt-2 mb-0">
                                Consulta, supervisa y administra las cuentas registradas.
                            </p>
                        </div>
                    </div>
                </div>

                <p-button
                    label="Crear usuario"
                    icon="pi pi-user-plus"
                    routerLink="/admin/users/new"
                />
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 sm:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
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
                                <i class="pi pi-users text-blue-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Usuarios activos
                                </span>

                                <div class="text-3xl font-semibold text-green-500">
                                    {{ activeUsers }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-check-circle text-green-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Usuarios inactivos
                                </span>

                                <div class="text-3xl font-semibold text-orange-500">
                                    {{ inactiveUsers }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-ban text-orange-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-0">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
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
                            placeholder="Filtrar por estado"
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
                            <th class="text-center">Acciones</th>
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
                                {{ user.firstName }} {{ user.lastName }}
                            </td>

                            <td>
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-envelope text-muted-color"></i>
                                    {{ user.email }}
                                </div>
                            </td>

                            <td>{{ user.registrationDate }}</td>

                            <td>
                                <p-tag
                                    [value]="user.status === 'ACTIVE' ? 'Activo' : 'Inactivo'"
                                    [severity]="user.status === 'ACTIVE' ? 'success' : 'danger'"
                                    [icon]="user.status === 'ACTIVE' ? 'pi pi-check-circle' : 'pi pi-ban'"
                                />
                            </td>

                            <td>
                                <div class="flex justify-center gap-2">
                                    <p-button
                                        icon="pi pi-eye"
                                        severity="secondary"
                                        [rounded]="true"
                                        [outlined]="true"
                                        [routerLink]="['/admin/users', user.id]"
                                        pTooltip="Ver detalle"
                                    />

                                    <p-button
                                        [icon]="user.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-check'"
                                        [severity]="user.status === 'ACTIVE' ? 'warn' : 'success'"
                                        [rounded]="true"
                                        [outlined]="true"
                                        (onClick)="confirmStatusChange(user)"
                                    />
                                </div>
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="6">
                                <div class="flex flex-col items-center justify-center text-center py-12">
                                    <i class="pi pi-users text-primary text-4xl mb-4"></i>

                                    <h3 class="text-xl font-semibold m-0">
                                        No se encontraron usuarios
                                    </h3>

                                    <p class="text-muted-color mt-2 mb-0">
                                        Cambia los filtros o registra una nueva cuenta.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </ng-template>
                </p-table>
            </div>
        </div>
    `
})
export class UserList {
    search = '';
    statusFilter: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';

    statusOptions = [
        { label: 'Todos los estados', value: 'ALL' },
        { label: 'Activos', value: 'ACTIVE' },
        { label: 'Inactivos', value: 'INACTIVE' }
    ];

    users: AdminUserMock[] = [
        {
            id: 1,
            username: 'juan.perez',
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@email.com',
            registrationDate: '15/07/2026',
            status: 'ACTIVE'
        },
        {
            id: 2,
            username: 'maria.lopez',
            firstName: 'María',
            lastName: 'López',
            email: 'maria.lopez@email.com',
            registrationDate: '17/07/2026',
            status: 'ACTIVE'
        },
        {
            id: 3,
            username: 'carlos.mora',
            firstName: 'Carlos',
            lastName: 'Mora',
            email: 'carlos.mora@email.com',
            registrationDate: '19/07/2026',
            status: 'INACTIVE'
        },
        {
            id: 4,
            username: 'ana.torres',
            firstName: 'Ana',
            lastName: 'Torres',
            email: 'ana.torres@email.com',
            registrationDate: '21/07/2026',
            status: 'ACTIVE'
        },
        {
            id: 5,
            username: 'luis.gomez',
            firstName: 'Luis',
            lastName: 'Gómez',
            email: 'luis.gomez@email.com',
            registrationDate: '23/07/2026',
            status: 'INACTIVE'
        },
        {
            id: 6,
            username: 'sofia.vargas',
            firstName: 'Sofía',
            lastName: 'Vargas',
            email: 'sofia.vargas@email.com',
            registrationDate: '25/07/2026',
            status: 'ACTIVE'
        }
    ];

    constructor(
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService
    ) {}

    get activeUsers(): number {
        return this.users.filter(
            user => user.status === 'ACTIVE'
        ).length;
    }

    get inactiveUsers(): number {
        return this.users.filter(
            user => user.status === 'INACTIVE'
        ).length;
    }

    get filteredUsers(): AdminUserMock[] {
        const normalizedSearch = this.search
            .trim()
            .toLowerCase();

        return this.users.filter(user => {
            const matchesStatus =
                this.statusFilter === 'ALL' ||
                user.status === this.statusFilter;

            const searchableText = [
                user.username,
                user.firstName,
                user.lastName,
                user.email
            ]
                .join(' ')
                .toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                searchableText.includes(normalizedSearch);

            return matchesStatus && matchesSearch;
        });
    }

    getInitials(user: AdminUserMock): string {
        return (
            user.firstName.charAt(0) +
            user.lastName.charAt(0)
        ).toUpperCase();
    }

    confirmStatusChange(user: AdminUserMock): void {
        const activating = user.status === 'INACTIVE';

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
                user.status = activating
                    ? 'ACTIVE'
                    : 'INACTIVE';

                this.messageService.add({
                    severity: 'success',
                    summary: 'Estado actualizado',
                    detail: activating
                        ? 'El usuario fue activado correctamente.'
                        : 'El usuario fue desactivado correctamente.'
                });
            }
        });
    }
}
