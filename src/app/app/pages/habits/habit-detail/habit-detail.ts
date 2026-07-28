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
    ActivatedRoute,
    Router,
    RouterModule
} from '@angular/router';

import {
    catchError,
    forkJoin,
    of
} from 'rxjs';

import {
    ConfirmationService,
    MessageService
} from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

import { HabitRecordResponse } from '@/app/core/habits/models/habit-record-response.model';
import { HabitResponse } from '@/app/core/habits/models/habit-response.model';
import { HabitService } from '@/app/core/habits/services/habit.service';

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
        MessageModule,
        ProgressBarModule,
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
                    <p-button
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        [text]="true"
                        [rounded]="true"
                        routerLink="/habits"
                    />

                    <div>
                        <h1
                            class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                        >
                            Detalle del hábito
                        </h1>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta el progreso, historial y estado del hábito seleccionado.
                        </p>
                    </div>
                </div>

                @if (habit && !loadingPage) {
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
                            [queryParams]="{
                                edit: habit.id
                            }"
                        />
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

            @if (loadingPage) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-4">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex flex-col items-center text-center"
                            >
                                <p-skeleton
                                    shape="circle"
                                    size="7rem"
                                    styleClass="mb-5"
                                />

                                <p-skeleton
                                    width="12rem"
                                    height="1.8rem"
                                    styleClass="mb-3"
                                />

                                <p-skeleton
                                    width="7rem"
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
                                            width="5rem"
                                            height="2.5rem"
                                        />
                                    </div>
                                </div>
                            }

                            <div class="col-span-12">
                                <div class="card mb-0">
                                    <p-skeleton
                                        width="13rem"
                                        height="1.5rem"
                                        styleClass="mb-6"
                                    />

                                    <p-skeleton
                                        width="100%"
                                        height="18rem"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    @for (item of tableSkeletons; track item) {
                        <p-skeleton
                            width="100%"
                            height="4rem"
                            styleClass="mb-3"
                        />
                    }
                </div>
            } @else if (habit) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 lg:col-span-4">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex flex-col items-center text-center"
                            >
                                <div
                                    class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 mb-5"
                                    style="width: 7rem; height: 7rem"
                                >
                                    <i
                                        class="pi text-primary text-4xl"
                                        [ngClass]="categoryIcon"
                                    ></i>
                                </div>

                                <h2 class="text-2xl font-semibold m-0">
                                    {{ habit.name }}
                                </h2>

                                <span class="text-muted-color mt-2">
                                    {{ categoryLabel }}
                                </span>

                                <p-tag
                                    styleClass="mt-4"
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
                                    [icon]="
                                        habit.active
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
                                            Meta diaria
                                        </span>

                                        <span class="font-semibold">
                                            {{ habit.goal }}
                                            {{ habit.unit }}
                                        </span>
                                    </div>

                                    <div
                                        class="flex items-center justify-between mb-4"
                                    >
                                        <span class="text-muted-color">
                                            Fecha de creación
                                        </span>

                                        <span class="font-semibold text-right">
                                            {{
                                                formatDisplayDate(
                                                    habit.createdAt
                                                )
                                            }}
                                        </span>
                                    </div>

                                    <div
                                        class="flex items-center justify-between"
                                    >
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
                                        [label]="
                                            habit.active
                                                ? 'Desactivar hábito'
                                                : 'Activar hábito'
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
                                        [loading]="changingStatus"
                                        [disabled]="deletingHabit"
                                        (onClick)="confirmStatusChange()"
                                    />

                                    <p-button
                                        label="Eliminar hábito"
                                        icon="pi pi-trash"
                                        severity="danger"
                                        [outlined]="true"
                                        styleClass="w-full"
                                        [loading]="deletingHabit"
                                        [disabled]="changingStatus"
                                        (onClick)="confirmDeleteHabit()"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 lg:col-span-8">
                        <div class="grid grid-cols-12 gap-6">
                            <div class="col-span-12 sm:col-span-4">
                                <div class="card mb-0 h-full">
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
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
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Registros completados
                                    </span>

                                    <div
                                        class="text-4xl font-semibold text-green-500"
                                    >
                                        {{ completedRecords }}
                                    </div>

                                    <p class="text-muted-color mt-3 mb-0">
                                        De {{ history.length }} registros
                                    </p>
                                </div>
                            </div>

                            <div class="col-span-12 sm:col-span-4">
                                <div class="card mb-0 h-full">
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Cumplimiento general
                                    </span>

                                    <div class="text-4xl font-semibold">
                                        {{ overallPercentage }}%
                                    </div>

                                    <p class="text-muted-color mt-3 mb-0">
                                        Registros con meta cumplida
                                    </p>
                                </div>
                            </div>

                            <div class="col-span-12">
                                <div class="card mb-0">
                                    <div
                                        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                                    >
                                        <div>
                                            <h2
                                                class="text-xl font-semibold m-0"
                                            >
                                                Evolución del hábito
                                            </h2>

                                            <p
                                                class="text-muted-color mt-2 mb-0"
                                            >
                                                Progreso registrado en los últimos siete registros.
                                            </p>
                                        </div>

                                        <p-tag
                                            value="Últimos 7 registros"
                                            icon="pi pi-calendar"
                                            severity="info"
                                        />
                                    </div>

                                    @if (showChart && history.length > 0) {
                                        <p-chart
                                            type="line"
                                            [data]="chartData"
                                            [options]="chartOptions"
                                            height="320px"
                                        />
                                    } @else {
                                        <div
                                            class="flex flex-col items-center justify-center text-center py-14"
                                        >
                                            <i
                                                class="pi pi-chart-line text-primary text-4xl mb-4"
                                            ></i>

                                            <h3
                                                class="text-xl font-semibold m-0"
                                            >
                                                Sin datos para graficar
                                            </h3>

                                            <p
                                                class="text-muted-color mt-2 mb-0"
                                            >
                                                Registra progreso para visualizar la evolución.
                                            </p>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div
                        class="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5 mb-6"
                    >
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
                                    [disabled]="loadingRange"
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
                                    [disabled]="loadingRange"
                                />
                            </div>

                            <div class="flex items-end">
                                <p-button
                                    label="Consultar"
                                    icon="pi pi-search"
                                    styleClass="w-full"
                                    [loading]="loadingRange"
                                    (onClick)="loadHistoryByRange()"
                                />
                            </div>

                            <div class="flex items-end">
                                <p-button
                                    label="Limpiar"
                                    icon="pi pi-filter-slash"
                                    severity="secondary"
                                    [outlined]="true"
                                    styleClass="w-full"
                                    [disabled]="loadingRange"
                                    (onClick)="clearRange()"
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
                                <th class="text-center">
                                    Acciones
                                </th>
                            </tr>
                        </ng-template>

                        <ng-template #body let-record>
                            <tr>
                                <td>
                                    {{
                                        formatRecordDate(
                                            record.recordDate
                                        )
                                    }}
                                </td>

                                <td>
                                    <span class="font-semibold">
                                        {{ record.completedValue }}
                                        {{ habit.unit }}
                                    </span>
                                </td>

                                <td>
                                    {{ habit.goal }}
                                    {{ habit.unit }}
                                </td>

                                <td>
                                    <p-tag
                                        [value]="
                                            record.completed
                                                ? 'Completado'
                                                : 'Pendiente'
                                        "
                                        [severity]="
                                            record.completed
                                                ? 'success'
                                                : 'warn'
                                        "
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
                                            pTooltip="Editar avance"
                                        />

                                        <p-button
                                            icon="pi pi-trash"
                                            severity="danger"
                                            [rounded]="true"
                                            [outlined]="true"
                                            [loading]="
                                                deletingRecordId === record.id
                                            "
                                            [disabled]="
                                                deletingRecordId !== null
                                            "
                                            pTooltip="Eliminar registro"
                                            (onClick)="
                                                confirmDeleteRecord(record)
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
                                            class="pi pi-history text-primary text-4xl mb-4"
                                        ></i>

                                        <h3
                                            class="text-xl font-semibold m-0"
                                        >
                                            No existen registros
                                        </h3>

                                        <p
                                            class="text-muted-color mt-2 mb-0"
                                        >
                                            Cambia el rango o registra progreso.
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
export class HabitDetail implements OnInit {
    private readonly route =
        inject(ActivatedRoute);

    private readonly router =
        inject(Router);

    private readonly habitService =
        inject(HabitService);

    private readonly confirmationService =
        inject(ConfirmationService);

    private readonly messageService =
        inject(MessageService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly today = new Date();

    readonly summarySkeletons = [1, 2, 3];

    readonly tableSkeletons = [1, 2, 3, 4, 5];

    habitId: number | null = null;

    habit: HabitResponse | null = null;

    history: HabitRecordResponse[] = [];

    filteredHistory: HabitRecordResponse[] = [];

    todayRecord: HabitRecordResponse | null = null;

    startDate = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        this.today.getDate() - 30
    );

    endDate = new Date();

    loadingPage = false;

    loadingRange = false;

    changingStatus = false;

    deletingHabit = false;

    deletingRecordId: number | null = null;

    showChart = false;

    dateError = false;

    errorMessage = '';

    chartData: object = {};

    readonly chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
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

    constructor() {
        const idValue =
            this.route.snapshot.paramMap.get('id');

        const parsedId = Number(idValue);

        if (
            idValue &&
            Number.isInteger(parsedId) &&
            parsedId > 0
        ) {
            this.habitId = parsedId;
            this.loadingPage = true;
        }
    }

    ngOnInit(): void {
        if (!this.habitId) {
            this.errorMessage =
                'El identificador del hábito no es válido.';

            return;
        }

        this.loadHabitDetail(this.habitId);
    }

    get categoryLabel(): string {
        return this.getCategoryLabel(
            this.habit?.category ?? ''
        );
    }

    get categoryIcon(): string {
        return this.getCategoryIcon(
            this.habit?.category ?? ''
        );
    }

    get todayProgress(): number {
        if (
            !this.todayRecord ||
            !this.habit ||
            this.habit.goal <= 0
        ) {
            return 0;
        }

        return Math.min(
            100,
            Math.round(
                (
                    this.todayRecord.completedValue /
                    this.habit.goal
                ) * 100
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
            (
                this.completedRecords /
                this.history.length
            ) * 100
        );
    }

    loadHistoryByRange(): void {
        if (
            !this.habitId ||
            this.loadingRange
        ) {
            return;
        }

        this.dateError =
            this.startDate > this.endDate;

        if (this.dateError) {
            return;
        }

        this.loadingRange = true;

        this.habitService
            .getHabitHistoryByRange(
                this.habitId,
                this.formatApiDate(
                    this.startDate
                ),
                this.formatApiDate(
                    this.endDate
                )
            )
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: response => {
                    this.filteredHistory = [
                        ...response
                    ].sort(
                        (first, second) =>
                            second.recordDate.localeCompare(
                                first.recordDate
                            )
                    );

                    window.setTimeout(() => {
                        this.loadingRange = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.loadingRange = false;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible consultar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    clearRange(): void {
        this.startDate = new Date(
            this.today.getFullYear(),
            this.today.getMonth(),
            this.today.getDate() - 30
        );

        this.endDate = new Date();

        this.dateError = false;

        this.filteredHistory = [
            ...this.history
        ];
    }

    confirmStatusChange(): void {
        if (!this.habit) {
            return;
        }

        const activating =
            !this.habit.active;

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
                this.changeHabitStatus();
            }
        });
    }

    confirmDeleteHabit(): void {
        if (!this.habit) {
            return;
        }

        this.confirmationService.confirm({
            header: 'Eliminar hábito',

            message:
                'Esta acción también eliminará sus registros asociados. ¿Deseas continuar?',

            icon: 'pi pi-exclamation-triangle',

            acceptLabel: 'Eliminar',

            rejectLabel: 'Cancelar',

            acceptButtonStyleClass:
                'p-button-danger',

            accept: () => {
                this.deleteHabit();
            }
        });
    }

    confirmDeleteRecord(
        record: HabitRecordResponse
    ): void {
        this.confirmationService.confirm({
            header: 'Eliminar registro',

            message:
                `¿Deseas eliminar el registro del ${this.formatRecordDate(record.recordDate)}?`,

            icon: 'pi pi-exclamation-triangle',

            acceptLabel: 'Eliminar',

            rejectLabel: 'Cancelar',

            acceptButtonStyleClass:
                'p-button-danger',

            accept: () => {
                this.deleteRecord(record);
            }
        });
    }

    formatDisplayDate(value: string): string {
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

    formatRecordDate(value: string): string {
        const parts = value.split('-');

        if (parts.length !== 3) {
            return value;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    private loadHabitDetail(id: number): void {
        forkJoin({
            habit:
                this.habitService.getHabitById(id),

            history:
                this.habitService
                    .getHabitHistory(id)
                    .pipe(
                        catchError(
                            (
                                error: HttpErrorResponse
                            ) => {
                                if (error.status !== 404) {
                                    console.error(
                                        'Error cargando historial:',
                                        error
                                    );
                                }

                                return of(
                                    [] as HabitRecordResponse[]
                                );
                            }
                        )
                    ),

            todayRecord:
                this.habitService
                    .getTodayRecord(id)
                    .pipe(
                        catchError(
                            (
                                error: HttpErrorResponse
                            ) => {
                                if (error.status !== 404) {
                                    console.error(
                                        'Error cargando registro de hoy:',
                                        error
                                    );
                                }

                                return of(null);
                            }
                        )
                    )
        })
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: response => {
                    this.habit = response.habit;

                    this.history = [
                        ...response.history
                    ].sort(
                        (first, second) =>
                            second.recordDate.localeCompare(
                                first.recordDate
                            )
                    );

                    this.filteredHistory = [
                        ...this.history
                    ];

                    this.todayRecord =
                        response.todayRecord;

                    this.buildChart();

                    window.setTimeout(() => {
                        this.loadingPage = false;

                        this.changeDetectorRef
                            .detectChanges();

                        window.requestAnimationFrame(
                            () => {
                                this.showChart =
                                    this.history.length >
                                    0;

                                this.changeDetectorRef
                                    .detectChanges();
                            }
                        );
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.habit = null;

                    this.errorMessage =
                        this.getErrorMessage(error);

                    window.setTimeout(() => {
                        this.loadingPage = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    private buildChart(): void {
        if (!this.habit) {
            this.chartData = {};
            return;
        }

        const records = [
            ...this.history
        ]
            .sort(
                (first, second) =>
                    first.recordDate.localeCompare(
                        second.recordDate
                    )
            )
            .slice(-7);

        this.chartData = {
            labels: records.map(record =>
                this.formatChartDate(
                    record.recordDate
                )
            ),

            datasets: [
                {
                    label:
                        `Valor realizado (${this.habit.unit})`,

                    data: records.map(
                        record =>
                            record.completedValue
                    ),

                    fill: true,

                    tension: 0.4
                },
                {
                    label:
                        `Meta (${this.habit.unit})`,

                    data: records.map(
                        () => this.habit?.goal ?? 0
                    ),

                    borderDash: [6, 6],

                    pointRadius: 0,

                    fill: false
                }
            ]
        };
    }

    private changeHabitStatus(): void {
        if (
            !this.habit ||
            this.changingStatus
        ) {
            return;
        }

        this.changingStatus = true;

        this.habitService
            .changeHabitStatus(this.habit.id)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: response => {
                    this.habit = response;

                    window.setTimeout(() => {
                        this.changingStatus = false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'success',
                            summary:
                                'Estado actualizado',
                            detail:
                                response.active
                                    ? 'El hábito fue activado correctamente.'
                                    : 'El hábito fue desactivado correctamente.'
                        });
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.changingStatus = false;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible actualizar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    private deleteHabit(): void {
        if (
            !this.habit ||
            this.deletingHabit
        ) {
            return;
        }

        this.deletingHabit = true;

        this.habitService
            .deleteHabit(this.habit.id)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Hábito eliminado',
                        detail:
                            'El hábito fue eliminado correctamente.'
                    });

                    window.setTimeout(() => {
                        void this.router.navigate([
                            '/habits'
                        ]);
                    }, 700);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.deletingHabit = false;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible eliminar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    private deleteRecord(
        record: HabitRecordResponse
    ): void {
        if (
            this.deletingRecordId !== null
        ) {
            return;
        }

        this.deletingRecordId = record.id;

        this.habitService
            .deleteRecord(record.id)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: () => {
                    this.history =
                        this.history.filter(
                            item =>
                                item.id !== record.id
                        );

                    this.filteredHistory =
                        this.filteredHistory.filter(
                            item =>
                                item.id !== record.id
                        );

                    if (
                        this.todayRecord?.id ===
                        record.id
                    ) {
                        this.todayRecord = null;
                    }

                    this.buildChart();

                    window.setTimeout(() => {
                        this.deletingRecordId =
                            null;

                        this.showChart = false;

                        this.changeDetectorRef
                            .detectChanges();

                        window.requestAnimationFrame(
                            () => {
                                this.showChart =
                                    this.history.length >
                                    0;

                                this.changeDetectorRef
                                    .detectChanges();
                            }
                        );

                        this.messageService.add({
                            severity: 'success',
                            summary:
                                'Registro eliminado',
                            detail:
                                'El registro fue eliminado correctamente.'
                        });
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.deletingRecordId =
                        null;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible eliminar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    private getCategoryLabel(
        category: string
    ): string {
        const labels:
            Record<string, string> = {
                SALUD: 'Salud',
                EJERCICIO: 'Ejercicio',
                NUTRICION: 'Nutrición',
                LECTURA: 'Lectura',
                PRODUCTIVIDAD:
                    'Productividad',
                BIENESTAR: 'Bienestar',
                HIDRATACION: 'Hidratación'
            };

        return (
            labels[category] ??
            category
        );
    }

    private getCategoryIcon(
        category: string
    ): string {
        const icons:
            Record<string, string> = {
                SALUD: 'pi-heart',
                EJERCICIO: 'pi-bolt',
                NUTRICION: 'pi-apple',
                LECTURA: 'pi-book',
                PRODUCTIVIDAD:
                    'pi-briefcase',
                BIENESTAR: 'pi-sun',
                HIDRATACION: 'pi-filter'
            };

        return (
            icons[category] ??
            'pi-check-circle'
        );
    }

    private formatApiDate(
        date: Date
    ): string {
        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, '0');

        const day =
            String(
                date.getDate()
            ).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private formatChartDate(
        value: string
    ): string {
        const parts = value.split('-');

        if (parts.length !== 3) {
            return value;
        }

        const date = new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );

        return new Intl.DateTimeFormat(
            'es-EC',
            {
                day: '2-digit',
                month: 'short'
            }
        ).format(date);
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
                'Los parámetros enviados no son válidos.'
            );
        }

        if (error.status === 401) {
            return 'La sesión expiró. Inicia sesión nuevamente.';
        }

        if (error.status === 403) {
            return 'No tienes permisos para realizar esta operación.';
        }

        if (error.status === 404) {
            return 'No se encontró el hábito o registro solicitado.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
