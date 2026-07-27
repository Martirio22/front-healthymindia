import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ConfirmDialogModule,
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
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
                            Detalle del usuario
                        </h1>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta la información y administra el estado de la cuenta.
                        </p>
                    </div>
                </div>

                <p-button
                    [label]="user.status === 'ACTIVE' ? 'Desactivar cuenta' : 'Activar cuenta'"
                    [icon]="user.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-check-circle'"
                    [severity]="user.status === 'ACTIVE' ? 'danger' : 'success'"
                    [outlined]="true"
                    (onClick)="confirmStatusChange()"
                />
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
                                {{ user.firstName }} {{ user.lastName }}
                            </h2>

                            <span class="text-muted-color mt-2">
                                &#64;{{ user.username }}
                            </span>

                            <p-tag
                                class="mt-4"
                                [value]="user.status === 'ACTIVE' ? 'Cuenta activa' : 'Cuenta inactiva'"
                                [severity]="user.status === 'ACTIVE' ? 'success' : 'danger'"
                                [icon]="user.status === 'ACTIVE' ? 'pi pi-check-circle' : 'pi pi-ban'"
                            />

                            <div class="w-full border-t border-surface-200 dark:border-surface-700 mt-7 pt-6">
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-muted-color">
                                        Identificador
                                    </span>

                                    <span class="font-semibold">
                                        #{{ user.id }}
                                    </span>
                                </div>

                                <div class="flex items-center justify-between">
                                    <span class="text-muted-color">
                                        Fecha de registro
                                    </span>

                                    <span class="font-semibold">
                                        {{ user.registrationDate }}
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
                                <i class="pi pi-id-card text-primary text-xl"></i>
                            </div>

                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Información de la cuenta
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Datos registrados en el sistema
                                </span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Nombre
                                </span>

                                <span class="text-lg font-semibold">
                                    {{ user.firstName }}
                                </span>
                            </div>

                            <div class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Apellido
                                </span>

                                <span class="text-lg font-semibold">
                                    {{ user.lastName }}
                                </span>
                            </div>

                            <div class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Nombre de usuario
                                </span>

                                <span class="text-lg font-semibold">
                                    {{ user.username }}
                                </span>
                            </div>

                            <div class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Correo electrónico
                                </span>

                                <span class="text-lg font-semibold break-all">
                                    {{ user.email }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mt-7 p-5 rounded-xl border"
                            [class.border-green-200]="user.status === 'ACTIVE'"
                            [class.bg-green-50]="user.status === 'ACTIVE'"
                            [class.dark:bg-green-950/20]="user.status === 'ACTIVE'"
                            [class.border-red-200]="user.status === 'INACTIVE'"
                            [class.bg-red-50]="user.status === 'INACTIVE'"
                            [class.dark:bg-red-950/20]="user.status === 'INACTIVE'"
                        >
                            <div class="flex items-start gap-4">
                                <i
                                    class="pi text-2xl mt-1"
                                    [class.pi-check-circle]="user.status === 'ACTIVE'"
                                    [class.text-green-500]="user.status === 'ACTIVE'"
                                    [class.pi-ban]="user.status === 'INACTIVE'"
                                    [class.text-red-500]="user.status === 'INACTIVE'"
                                ></i>

                                <div>
                                    <h3 class="text-lg font-semibold mt-0 mb-2">
                                        {{ user.status === 'ACTIVE' ? 'Usuario activo' : 'Usuario inactivo' }}
                                    </h3>

                                    <p class="text-muted-color m-0 leading-6">
                                        {{
                                            user.status === 'ACTIVE'
                                                ? 'La cuenta puede iniciar sesión y utilizar las funcionalidades permitidas.'
                                                : 'La cuenta se encuentra desactivada administrativamente.'
                                        }}
                                    </p>
                                </div>
                            </div>

                            <p-button
                                [label]="user.status === 'ACTIVE' ? 'Desactivar' : 'Activar'"
                                [icon]="user.status === 'ACTIVE' ? 'pi pi-ban' : 'pi pi-check'"
                                [severity]="user.status === 'ACTIVE' ? 'danger' : 'success'"
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
                        <i class="pi pi-shield text-orange-500 text-xl"></i>
                    </div>

                    <div>
                        <h2 class="text-xl font-semibold mt-0 mb-2">
                            Acción administrativa
                        </h2>

                        <p class="text-muted-color leading-6 m-0">
                            El cambio de estado afecta el acceso del usuario. Esta operación no elimina su perfil ni su información registrada.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class UserDetail {
    userId = 1;

    user = {
        id: 1,
        username: 'juan.perez',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@email.com',
        registrationDate: '15 de julio de 2026',
        status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
    };

    constructor(
        private readonly route: ActivatedRoute,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService
    ) {
        const id = Number(
            this.route.snapshot.paramMap.get('id')
        );

        if (!Number.isNaN(id) && id > 0) {
            this.userId = id;
            this.user.id = id;
        }
    }

    get initials(): string {
        return (
            this.user.firstName.charAt(0) +
            this.user.lastName.charAt(0)
        ).toUpperCase();
    }

    confirmStatusChange(): void {
        const activating =
            this.user.status === 'INACTIVE';

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
                this.user.status = activating
                    ? 'ACTIVE'
                    : 'INACTIVE';

                this.messageService.add({
                    severity: 'success',
                    summary: 'Estado actualizado',
                    detail: activating
                        ? 'La cuenta fue activada correctamente.'
                        : 'La cuenta fue desactivada correctamente.'
                });
            }
        });
    }
}
