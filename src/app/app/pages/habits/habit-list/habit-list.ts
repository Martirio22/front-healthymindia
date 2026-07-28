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
import { Router, RouterModule } from '@angular/router';

import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { HabitResponse } from '@/app/core/habits/models/habit-response.model';
import { HabitService } from '@/app/core/habits/services/habit.service';

type HabitStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

@Component({
    selector: 'app-habit-list',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        SelectModule,
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
                class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1
                        class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                    >
                        Mis hábitos
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Administra tus hábitos y consulta su estado actual.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <p-button
                        label="Registro diario"
                        icon="pi pi-check-square"
                        severity="secondary"
                        [outlined]="true"
                        routerLink="/daily-record"
                    />

                    <p-button
                        label="Crear hábito"
                        icon="pi pi-plus"
                        routerLink="/habits/new"
                    />

                    <p-button
                        icon="pi pi-refresh"
                        severity="secondary"
                        [outlined]="true"
                        [loading]="refreshing"
                        [disabled]="loading || refreshing"
                        ariaLabel="Actualizar hábitos"
                        (onClick)="loadHabits(true)"
                    />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 sm:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between">
                            <div>
                                <span
                                    class="block text-muted-color font-medium mb-3"
                                >
                                    Total de hábitos
                                </span>

                                <div class="text-3xl font-semibold">
                                    {{ habits.length }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                style="width: 3.5rem; height: 3.5rem"
                            >
                                <i
                                    class="pi pi-list text-blue-500 text-xl"
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
                                    Hábitos activos
                                </span>

                                <div
                                    class="text-3xl font-semibold text-green-500"
                                >
                                    {{ activeHabitsCount }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                style="width: 3.5rem; height: 3.5rem"
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
                                    Hábitos inactivos
                                </span>

                                <div
                                    class="text-3xl font-semibold text-orange-500"
                                >
                                    {{ inactiveHabitsCount }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                style="width: 3.5rem; height: 3.5rem"
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
                    class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
                >
                    <div>
                        <h2 class="text-xl font-semibold m-0">
                            Lista de hábitos
                        </h2>

                        <p class="text-muted-color mt-2 mb-0">
                            {{ filteredHabits.length }} resultados encontrados
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
                                placeholder="Buscar por nombre o categoría"
                            />
                        </div>

                        <p-select
                            [(ngModel)]="statusFilter"
                            [options]="statusOptions"
                            optionLabel="label"
                            optionValue="value"
                            placeholder="Estado"
                            styleClass="w-full sm:w-48"
                        />
                    </div>
                </div>
            </div>

            @if (errorMessage) {
                <div
                    class="card mb-0 border border-red-200 dark:border-red-800"
                >
                    <div class="flex items-start gap-3">
                        <i
                            class="pi pi-exclamation-circle text-red-500 mt-1"
                        ></i>

                        <div>
                            <div class="font-semibold text-red-500">
                                No fue posible cargar los hábitos
                            </div>

                            <p class="text-muted-color mt-2 mb-0">
                                {{ errorMessage }}
                            </p>
                        </div>
                    </div>
                </div>
            }

            @if (loading) {
                <div class="grid grid-cols-12 gap-6">
                    @for (item of skeletonItems; track item) {
                        <div
                            class="col-span-12 md:col-span-6 xl:col-span-4"
                        >
                            <div class="card mb-0">
                                <div class="flex items-center gap-4 mb-6">
                                    <p-skeleton
                                        shape="circle"
                                        size="3.5rem"
                                    />

                                    <div class="flex-1">
                                        <p-skeleton
                                            width="70%"
                                            height="1.2rem"
                                            styleClass="mb-2"
                                        />

                                        <p-skeleton
                                            width="40%"
                                            height="0.8rem"
                                        />
                                    </div>
                                </div>

                                <p-skeleton
                                    width="100%"
                                    height="8rem"
                                />
                            </div>
                        </div>
                    }
                </div>
            } @else if (filteredHabits.length === 0) {
                <div class="card mb-0">
                    <div
                        class="flex flex-col items-center justify-center text-center py-14"
                    >
                        <div
                            class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 mb-5"
                            style="width: 5rem; height: 5rem"
                        >
                            <i
                                class="pi pi-list-check text-primary text-3xl"
                            ></i>
                        </div>

                        <h2 class="text-2xl font-semibold m-0">
                            No se encontraron hábitos
                        </h2>

                        <p class="text-muted-color mt-3 mb-6">
                            Crea un hábito nuevo o modifica los filtros de búsqueda.
                        </p>

                        <p-button
                            label="Crear mi primer hábito"
                            icon="pi pi-plus"
                            routerLink="/habits/new"
                        />
                    </div>
                </div>
            } @else {
                <div class="grid grid-cols-12 gap-6">
                    @for (habit of filteredHabits; track habit.id) {
                        <div
                            class="col-span-12 md:col-span-6 xl:col-span-4"
                        >
                            <div class="card mb-0 h-full flex flex-col">
                                <div
                                    class="flex items-start justify-between gap-4 mb-6"
                                >
                                    <div class="flex items-center gap-4">
                                        <div
                                            class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                            style="width: 3.5rem; height: 3.5rem"
                                        >
                                            <i
                                                class="pi text-primary text-xl"
                                                [ngClass]="
                                                    getCategoryIcon(
                                                        habit.category
                                                    )
                                                "
                                            ></i>
                                        </div>

                                        <div>
                                            <h2
                                                class="text-xl font-semibold mt-0 mb-1"
                                            >
                                                {{ habit.name }}
                                            </h2>

                                            <span
                                                class="text-muted-color text-sm"
                                            >
                                                {{ getCategoryLabel(habit.category) }}
                                            </span>
                                        </div>
                                    </div>

                                    <p-tag
                                        [value]="
                                            habit.active
                                                ? 'Activo'
                                                : 'Inactivo'
                                        "
                                        [severity]="
                                            habit.active
                                                ? 'success'
                                                : 'danger'
                                        "
                                    />
                                </div>

                                <div class="grid grid-cols-2 gap-4 mb-6">
                                    <div
                                        class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                    >
                                        <span
                                            class="block text-muted-color text-sm mb-2"
                                        >
                                            Meta diaria
                                        </span>

                                        <span class="font-semibold text-lg">
                                            {{ habit.goal }}
                                        </span>
                                    </div>

                                    <div
                                        class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                    >
                                        <span
                                            class="block text-muted-color text-sm mb-2"
                                        >
                                            Unidad
                                        </span>

                                        <span class="font-semibold text-lg">
                                            {{ habit.unit }}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    class="flex items-center gap-3 text-muted-color text-sm mb-6"
                                >
                                    <i class="pi pi-calendar"></i>

                                    <span>
                                        Creado:
                                        {{ habit.createdAt | date: 'dd/MM/yyyy' }}
                                    </span>
                                </div>

                                <div class="flex flex-col gap-3 mt-auto">
                                    <p-button
                                        label="Registrar progreso"
                                        icon="pi pi-check-square"
                                        styleClass="w-full"
                                        routerLink="/daily-record"
                                    />

                                    <div class="grid grid-cols-2 gap-3">
                                        <p-button
                                            label="Historial"
                                            icon="pi pi-history"
                                            severity="secondary"
                                            [outlined]="true"
                                            styleClass="w-full"
                                            [routerLink]="[
                                                '/habits',
                                                habit.id
                                            ]"
                                        />

                                        <p-button
                                            label="Editar"
                                            icon="pi pi-pencil"
                                            severity="secondary"
                                            [outlined]="true"
                                            styleClass="w-full"
                                            routerLink="/habits/new"
                                            [queryParams]="{
                                                edit: habit.id
                                            }"
                                        />
                                    </div>

                                    <div class="grid grid-cols-2 gap-3">
                                        <p-button
                                            [label]="
                                                habit.active
                                                    ? 'Desactivar'
                                                    : 'Activar'
                                            "
                                            [icon]="
                                                habit.active
                                                    ? 'pi pi-ban'
                                                    : 'pi pi-check'
                                            "
                                            [severity]="
                                                habit.active
                                                    ? 'warn'
                                                    : 'success'
                                            "
                                            [outlined]="true"
                                            styleClass="w-full"
                                            [loading]="
                                                changingStatusId === habit.id
                                            "
                                            (onClick)="
                                                confirmStatusChange(habit)
                                            "
                                        />

                                        <p-button
                                            label="Eliminar"
                                            icon="pi pi-trash"
                                            severity="danger"
                                            [outlined]="true"
                                            styleClass="w-full"
                                            [loading]="
                                                deletingHabitId === habit.id
                                            "
                                            (onClick)="
                                                confirmDelete(habit)
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    `
})
export class HabitList implements OnInit {
    private readonly habitService =
        inject(HabitService);

    private readonly confirmationService =
        inject(ConfirmationService);

    private readonly messageService =
        inject(MessageService);

    private readonly router =
        inject(Router);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly skeletonItems = [1, 2, 3, 4, 5, 6];

    readonly statusOptions = [
        {
            label: 'Todos',
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

    habits: HabitResponse[] = [];

    search = '';

    statusFilter: HabitStatusFilter = 'ALL';

    loading = false;

    refreshing = false;

    errorMessage = '';

    changingStatusId: number | null = null;

    deletingHabitId: number | null = null;

    ngOnInit(): void {
        this.loadHabits(false);
    }

    get activeHabitsCount(): number {
        return this.habits.filter(
            habit => habit.active
        ).length;
    }

    get inactiveHabitsCount(): number {
        return this.habits.filter(
            habit => !habit.active
        ).length;
    }

    get filteredHabits(): HabitResponse[] {
        const normalizedSearch = this.search
            .trim()
            .toLowerCase();

        return this.habits.filter(habit => {
            const matchesStatus =
                this.statusFilter === 'ALL' ||
                (
                    this.statusFilter === 'ACTIVE' &&
                    habit.active
                ) ||
                (
                    this.statusFilter === 'INACTIVE' &&
                    !habit.active
                );

            const searchableText = [
                habit.name,
                habit.category,
                habit.unit
            ]
                .join(' ')
                .toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                searchableText.includes(
                    normalizedSearch
                );

            return matchesStatus && matchesSearch;
        });
    }

    loadHabits(isRefresh = false): void {
        if (this.loading || this.refreshing) {
            return;
        }

        if (isRefresh) {
            this.refreshing = true;
        } else {
            this.loading = true;
        }

        this.errorMessage = '';

        this.habitService
            .getMyHabits()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.habits = response;

                    window.setTimeout(() => {
                        this.loading = false;
                        this.refreshing = false;

                        this.changeDetectorRef.detectChanges();
                    }, 0);
                },

                error: (error: HttpErrorResponse) => {
                    this.errorMessage =
                        this.getErrorMessage(error);

                    window.setTimeout(() => {
                        this.loading = false;
                        this.refreshing = false;

                        this.changeDetectorRef.detectChanges();
                    }, 0);
                }
            });
    }

    confirmStatusChange(
        habit: HabitResponse
    ): void {
        const activating = !habit.active;

        this.confirmationService.confirm({
            header: activating
                ? 'Activar hábito'
                : 'Desactivar hábito',

            message: activating
                ? `¿Deseas activar el hábito "${habit.name}"?`
                : `¿Deseas desactivar el hábito "${habit.name}"?`,

            icon: activating
                ? 'pi pi-check-circle'
                : 'pi pi-exclamation-triangle',

            acceptLabel: activating
                ? 'Activar'
                : 'Desactivar',

            rejectLabel: 'Cancelar',

            acceptButtonStyleClass: activating
                ? 'p-button-success'
                : 'p-button-warning',

            accept: () => {
                this.changeStatus(habit);
            }
        });
    }

    confirmDelete(
        habit: HabitResponse
    ): void {
        this.confirmationService.confirm({
            header: 'Eliminar hábito',

            message:
                `¿Estás seguro de eliminar "${habit.name}" y todo su historial?`,

            icon: 'pi pi-exclamation-triangle',

            acceptLabel: 'Eliminar',

            rejectLabel: 'Cancelar',

            acceptButtonStyleClass:
                'p-button-danger',

            accept: () => {
                this.deleteHabit(habit);
            }
        });
    }

    getCategoryLabel(
        category: string
    ): string {
        const labels: Record<string, string> = {
            SALUD: 'Salud',
            EJERCICIO: 'Ejercicio',
            NUTRICION: 'Nutrición',
            LECTURA: 'Lectura',
            PRODUCTIVIDAD: 'Productividad',
            BIENESTAR: 'Bienestar',
            HIDRATACION: 'Hidratación'
        };

        return (
            labels[category] ??
            category
        );
    }

    getCategoryIcon(
        category: string
    ): string {
        const icons: Record<string, string> = {
            SALUD: 'pi-heart',
            EJERCICIO: 'pi-bolt',
            NUTRICION: 'pi-apple',
            LECTURA: 'pi-book',
            PRODUCTIVIDAD: 'pi-briefcase',
            BIENESTAR: 'pi-sun',
            HIDRATACION: 'pi-filter'
        };

        return (
            icons[category] ??
            'pi-check-circle'
        );
    }

    private changeStatus(
        habit: HabitResponse
    ): void {
        this.changingStatusId =
            habit.id;

        this.habitService
            .changeHabitStatus(habit.id)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: response => {
                    const index =
                        this.habits.findIndex(
                            currentHabit =>
                                currentHabit.id ===
                                habit.id
                        );

                    if (index >= 0) {
                        this.habits[index] =
                            response;

                        this.habits = [
                            ...this.habits
                        ];
                    }

                    this.changingStatusId =
                        null;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Estado actualizado',
                        detail: response.active
                            ? 'El hábito fue activado correctamente.'
                            : 'El hábito fue desactivado correctamente.'
                    });
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.changingStatusId =
                        null;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'No fue posible actualizar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    private deleteHabit(
        habit: HabitResponse
    ): void {
        this.deletingHabitId =
            habit.id;

        this.habitService
            .deleteHabit(habit.id)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: () => {
                    this.habits =
                        this.habits.filter(
                            currentHabit =>
                                currentHabit.id !==
                                habit.id
                        );

                    this.deletingHabitId =
                        null;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Hábito eliminado',
                        detail:
                            'El hábito y su historial fueron eliminados correctamente.'
                    });
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.deletingHabitId =
                        null;

                    this.messageService.add({
                        severity: 'error',
                        summary: 'No fue posible eliminar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
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
            return 'No tienes permisos para realizar esta operación.';
        }

        if (error.status === 404) {
            return 'No se encontró el hábito solicitado.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
