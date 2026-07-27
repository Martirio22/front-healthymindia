import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

interface HabitHistoryMock {
    id: number;
    recordDate: string;
    completedValue: number;
    completed: boolean;
    notes: string;
}

@Component({
    selector: 'app-habit-detail',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        ChartModule,
        ConfirmDialogModule,
        DatePickerModule,
        ProgressBarModule,
        TableModule,
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
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div class="flex items-center gap-4">
                    <p-button
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        [text]="true"
                        [rounded]="true"
                        routerLink="/habits"
                    />

                    <div>
                        <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                            Detalle del hábito
                        </h1>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta el progreso, historial y estado del hábito seleccionado.
                        </p>
                    </div>
                </div>

                <div class="flex flex-wrap gap-3">
                    <p-button
                        label="Registrar progreso"
                        icon="pi pi-check-circle"
                        routerLink="/daily-record"
                    />

                    <p-button
                        label="Editar"
                        icon="pi pi-pencil"
                        severity="secondary"
                        [outlined]="true"
                        routerLink="/habits/new"
                        [queryParams]="{ edit: habit.id }"
                    />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-4">
                    <div class="card mb-0 h-full">
                        <div class="flex flex-col items-center text-center">
                            <div
                                class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 mb-5"
                                style="width: 7rem; height: 7rem"
                            >
                                <i
                                    class="pi text-primary text-4xl"
                                    [ngClass]="habit.icon"
                                ></i>
                            </div>

                            <h2 class="text-2xl font-semibold m-0">
                                {{ habit.name }}
                            </h2>

                            <span class="text-muted-color mt-2">
                                {{ habit.category }}
                            </span>

                            <p-tag
                                class="mt-4"
                                [value]="habit.active ? 'Activo' : 'Inactivo'"
                                [severity]="habit.active ? 'success' : 'danger'"
                                [icon]="habit.active ? 'pi pi-check-circle' : 'pi pi-ban'"
                            />

                            <div class="w-full border-t border-surface-200 dark:border-surface-700 mt-7 pt-6">
                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-muted-color">
                                        Meta diaria
                                    </span>

                                    <span class="font-semibold">
                                        {{ habit.goal }} {{ habit.unit }}
                                    </span>
                                </div>

                                <div class="flex items-center justify-between mb-4">
                                    <span class="text-muted-color">
                                        Fecha de creación
                                    </span>

                                    <span class="font-semibold">
                                        {{ habit.createdAt }}
                                    </span>
                                </div>

                                <div class="flex items-center justify-between">
                                    <span class="text-muted-color">
                                        Identificador
                                    </span>

                                    <span class="font-semibold">
                                        #{{ habit.id }}
                                    </span>
                                </div>
                            </div>

                            <div class="w-full mt-7 flex flex-col gap-3">
                                <p-button
                                    [label]="habit.active ? 'Desactivar hábito' : 'Activar hábito'"
                                    [icon]="habit.active ? 'pi pi-ban' : 'pi pi-check'"
                                    [severity]="habit.active ? 'warn' : 'success'"
                                    [outlined]="true"
                                    styleClass="w-full"
                                    (onClick)="confirmStatusChange()"
                                />

                                <p-button
                                    label="Eliminar hábito"
                                    icon="pi pi-trash"
                                    severity="danger"
                                    [outlined]="true"
                                    styleClass="w-full"
                                    (onClick)="confirmDelete()"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-8">
                    <div class="grid grid-cols-12 gap-6">
                        <div class="col-span-12 sm:col-span-4">
                            <div class="card mb-0 h-full">
                                <span class="block text-muted-color font-medium mb-3">
                                    Progreso de hoy
                                </span>

                                <div class="text-4xl font-semibold mb-4">
                                    {{ todayProgress }}%
                                </div>

                                <p-progressbar
                                    [value]="todayProgress"
                                    [showValue]="false"
                                />
                            </div>
                        </div>

                        <div class="col-span-12 sm:col-span-4">
                            <div class="card mb-0 h-full">
                                <span class="block text-muted-color font-medium mb-3">
                                    Registros completados
                                </span>

                                <div class="text-4xl font-semibold text-green-500">
                                    {{ completedRecords }}
                                </div>

                                <p class="text-muted-color mt-3 mb-0">
                                    De {{ history.length }} registros
                                </p>
                            </div>
                        </div>

                        <div class="col-span-12 sm:col-span-4">
                            <div class="card mb-0 h-full">
                                <span class="block text-muted-color font-medium mb-3">
                                    Cumplimiento general
                                </span>

                                <div class="text-4xl font-semibold">
                                    {{ overallPercentage }}%
                                </div>

                                <p class="text-muted-color mt-3 mb-0">
                                    Promedio histórico
                                </p>
                            </div>
                        </div>

                        <div class="col-span-12">
                            <div class="card mb-0">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <div>
                                        <h2 class="text-xl font-semibold m-0">
                                            Evolución del hábito
                                        </h2>

                                        <p class="text-muted-color mt-2 mb-0">
                                            Progreso registrado en los últimos siete días.
                                        </p>
                                    </div>

                                    <p-tag
                                        value="Últimos 7 días"
                                        icon="pi pi-calendar"
                                        severity="info"
                                    />
                                </div>

                                <p-chart
                                    type="line"
                                    [data]="chartData"
                                    [options]="chartOptions"
                                    height="320px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-0">
                <div class="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5 mb-6">
                    <div>
                        <h2 class="text-2xl font-semibold m-0">
                            Historial de registros
                        </h2>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta el progreso registrado por fecha.
                        </p>
                    </div>

                    <div class="flex flex-col md:flex-row gap-4">
                        <div>
                            <label class="block font-medium mb-2">
                                Fecha inicial
                            </label>

                            <p-datepicker
                                [(ngModel)]="startDate"
                                [showIcon]="true"
                                [maxDate]="today"
                                dateFormat="dd/mm/yy"
                            />
                        </div>

                        <div>
                            <label class="block font-medium mb-2">
                                Fecha final
                            </label>

                            <p-datepicker
                                [(ngModel)]="endDate"
                                [showIcon]="true"
                                [maxDate]="today"
                                dateFormat="dd/mm/yy"
                            />
                        </div>

                        <div class="flex items-end">
                            <p-button
                                label="Consultar"
                                icon="pi pi-search"
                                styleClass="w-full"
                                (onClick)="filterHistory()"
                            />
                        </div>
                    </div>
                </div>

                @if (dateError) {
                    <small class="block text-red-500 mb-4">
                        La fecha inicial no puede ser posterior a la fecha final.
                    </small>
                }

                <p-table
                    [value]="filteredHistory"
                    [paginator]="true"
                    [rows]="5"
                    [rowsPerPageOptions]="[5, 10, 20]"
                    [rowHover]="true"
                    responsiveLayout="scroll"
                >
                    <ng-template #header>
                        <tr>
                            <th>Fecha</th>
                            <th>Valor realizado</th>
                            <th>Meta</th>
                            <th>Estado</th>
                            <th>Notas</th>
                            <th class="text-center">Acciones</th>
                        </tr>
                    </ng-template>

                    <ng-template #body let-record>
                        <tr>
                            <td>{{ record.recordDate }}</td>

                            <td>
                                <span class="font-semibold">
                                    {{ record.completedValue }}
                                    {{ habit.unit }}
                                </span>
                            </td>

                            <td>
                                {{ habit.goal }} {{ habit.unit }}
                            </td>

                            <td>
                                <p-tag
                                    [value]="record.completed ? 'Completado' : 'Pendiente'"
                                    [severity]="record.completed ? 'success' : 'warn'"
                                />
                            </td>

                            <td>
                                {{ record.notes || 'Sin notas' }}
                            </td>

                            <td>
                                <div class="flex justify-center gap-2">
                                    <p-button
                                        icon="pi pi-pencil"
                                        severity="secondary"
                                        [rounded]="true"
                                        [outlined]="true"
                                        routerLink="/daily-record"
                                    />

                                    <p-button
                                        icon="pi pi-trash"
                                        severity="danger"
                                        [rounded]="true"
                                        [outlined]="true"
                                        (onClick)="deleteRecord(record)"
                                    />
                                </div>
                            </td>
                        </tr>
                    </ng-template>

                    <ng-template #emptymessage>
                        <tr>
                            <td colspan="6">
                                <div class="flex flex-col items-center justify-center text-center py-12">
                                    <i class="pi pi-history text-primary text-4xl mb-4"></i>

                                    <h3 class="text-xl font-semibold m-0">
                                        No existen registros en este período
                                    </h3>

                                    <p class="text-muted-color mt-2 mb-0">
                                        Cambia el rango de fechas o registra progreso.
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
export class HabitDetail {
    readonly today = new Date();

    habitId = 1;

    startDate = new Date(2026, 6, 21);
    endDate = new Date(2026, 6, 27);

    dateError = false;

    habit = {
        id: 1,
        name: 'Beber agua',
        category: 'HIDRATACIÓN',
        goal: 8,
        unit: 'vasos',
        active: true,
        createdAt: '15 de julio de 2026',
        icon: 'pi-tint'
    };

    history: HabitHistoryMock[] = [
        {
            id: 101,
            recordDate: '27/07/2026',
            completedValue: 8,
            completed: true,
            notes: 'Meta cumplida durante la tarde.'
        },
        {
            id: 102,
            recordDate: '26/07/2026',
            completedValue: 7,
            completed: false,
            notes: 'Faltó un vaso.'
        },
        {
            id: 103,
            recordDate: '25/07/2026',
            completedValue: 8,
            completed: true,
            notes: 'Buen seguimiento.'
        },
        {
            id: 104,
            recordDate: '24/07/2026',
            completedValue: 6,
            completed: false,
            notes: 'Tomé menos agua por la mañana.'
        },
        {
            id: 105,
            recordDate: '23/07/2026',
            completedValue: 9,
            completed: true,
            notes: 'Meta superada.'
        },
        {
            id: 106,
            recordDate: '22/07/2026',
            completedValue: 8,
            completed: true,
            notes: ''
        },
        {
            id: 107,
            recordDate: '21/07/2026',
            completedValue: 5,
            completed: false,
            notes: 'Día con poco seguimiento.'
        }
    ];

    filteredHistory: HabitHistoryMock[] = [...this.history];

    chartData = {
        labels: [
            '21 Jul',
            '22 Jul',
            '23 Jul',
            '24 Jul',
            '25 Jul',
            '26 Jul',
            '27 Jul'
        ],
        datasets: [
            {
                label: 'Valor realizado',
                data: [5, 8, 9, 6, 8, 7, 8],
                fill: true,
                tension: 0.4,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                pointBackgroundColor: '#10b981'
            },
            {
                label: 'Meta',
                data: [8, 8, 8, 8, 8, 8, 8],
                borderDash: [6, 6],
                borderColor: '#f59e0b',
                pointRadius: 0,
                fill: false
            }
        ]
    };

    chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true
            }
        }
    };

    constructor(
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly confirmationService: ConfirmationService,
        private readonly messageService: MessageService
    ) {
        const id = Number(
            this.route.snapshot.paramMap.get('id')
        );

        if (!Number.isNaN(id) && id > 0) {
            this.habitId = id;
            this.habit.id = id;
        }
    }

    get todayProgress(): number {
        const todayRecord = this.history[0];

        if (!todayRecord || this.habit.goal <= 0) {
            return 0;
        }

        return Math.min(
            100,
            Math.round(
                (todayRecord.completedValue / this.habit.goal) * 100
            )
        );
    }

    get completedRecords(): number {
        return this.history.filter(
            record => record.completed
        ).length;
    }

    get overallPercentage(): number {
        if (this.history.length === 0) {
            return 0;
        }

        return Math.round(
            this.completedRecords * 100 / this.history.length
        );
    }

    filterHistory(): void {
        this.dateError = this.startDate > this.endDate;

        if (this.dateError) {
            return;
        }

        this.filteredHistory = [...this.history];
    }

    confirmStatusChange(): void {
        const activating = !this.habit.active;

        this.confirmationService.confirm({
            header: activating
                ? 'Activar hábito'
                : 'Desactivar hábito',
            message: activating
                ? '¿Deseas activar nuevamente este hábito?'
                : '¿Deseas desactivar este hábito?',
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
                this.habit.active = activating;

                this.messageService.add({
                    severity: 'success',
                    summary: 'Estado actualizado',
                    detail: activating
                        ? 'El hábito fue activado correctamente.'
                        : 'El hábito fue desactivado correctamente.'
                });
            }
        });
    }

    confirmDelete(): void {
        this.confirmationService.confirm({
            header: 'Eliminar hábito',
            message:
                'Esta acción también eliminará los registros asociados. ¿Deseas continuar?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Hábito eliminado',
                    detail: 'El hábito fue eliminado correctamente.'
                });

                window.setTimeout(() => {
                    void this.router.navigate(['/habits']);
                }, 700);
            }
        });
    }

    deleteRecord(record: HabitHistoryMock): void {
        this.confirmationService.confirm({
            header: 'Eliminar registro',
            message:
                `¿Deseas eliminar el registro del ${record.recordDate}?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.history = this.history.filter(
                    currentRecord => currentRecord.id !== record.id
                );

                this.filteredHistory =
                    this.filteredHistory.filter(
                        currentRecord =>
                            currentRecord.id !== record.id
                    );

                this.messageService.add({
                    severity: 'success',
                    summary: 'Registro eliminado',
                    detail: 'El registro fue eliminado correctamente.'
                });
            }
        });
    }
}
