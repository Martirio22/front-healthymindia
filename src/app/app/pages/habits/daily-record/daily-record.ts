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
    catchError,
    forkJoin,
    Observable,
    of
} from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

import { HabitRecordRequest } from '@/app/core/habits/models/habit-record-request.model';
import { HabitRecordResponse } from '@/app/core/habits/models/habit-record-response.model';
import { HabitResponse } from '@/app/core/habits/models/habit-response.model';
import { TodaySummaryResponse } from '@/app/core/habits/models/today-summary-response.model';
import { UpdateHabitRecordRequest } from '@/app/core/habits/models/update-habit-record-request.model';
import { HabitService } from '@/app/core/habits/services/habit.service';

interface DailyHabitView {
    id: number;
    name: string;
    category: string;
    icon: string;
    goal: number;
    unit: string;
    completedValue: number;
    notes: string;
    saved: boolean;
    dirty: boolean;
    recordId: number | null;
}

@Component({
    selector: 'app-daily-record',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        DatePickerModule,
        InputNumberModule,
        ProgressBarModule,
        SkeletonModule,
        TagModule,
        TextareaModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="flex flex-col gap-6">
            <div
                class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1
                        class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                    >
                        Registro diario
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Registra el progreso de tus hábitos activos de forma rápida.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <p-datepicker
                        [(ngModel)]="selectedDate"
                        [showIcon]="true"
                        [maxDate]="today"
                        dateFormat="dd/mm/yy"
                        placeholder="Selecciona una fecha"
                        styleClass="w-full sm:w-auto"
                        [disabled]="loadingPage || changingDate || savingAll"
                        (onSelect)="changeDate()"
                    />

                    <p-button
                        label="Ver mis hábitos"
                        icon="pi pi-list"
                        severity="secondary"
                        [outlined]="true"
                        routerLink="/habits"
                    />

                    <p-button
                        icon="pi pi-refresh"
                        severity="secondary"
                        [outlined]="true"
                        [loading]="refreshing"
                        [disabled]="loadingPage || changingDate || refreshing"
                        ariaLabel="Actualizar registros"
                        (onClick)="loadDailyRecords(true)"
                    />
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
                                No fue posible cargar el registro diario
                            </div>

                            <p class="text-muted-color mt-2 mb-0">
                                {{ errorMessage }}
                            </p>
                        </div>
                    </div>
                </div>
            }

            @if (loadingPage || changingDate) {
                <div class="grid grid-cols-12 gap-6">
                    @for (item of summarySkeletons; track item) {
                        <div
                            class="col-span-12 sm:col-span-6 xl:col-span-3"
                        >
                            <div class="card mb-0">
                                <p-skeleton
                                    width="8rem"
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

                <div class="grid grid-cols-12 gap-6">
                    @for (item of habitSkeletons; track item) {
                        <div class="col-span-12 xl:col-span-6">
                            <div class="card mb-0">
                                <div class="flex items-center gap-4 mb-6">
                                    <p-skeleton
                                        shape="circle"
                                        size="3.5rem"
                                    />

                                    <div class="flex-1">
                                        <p-skeleton
                                            width="60%"
                                            height="1.3rem"
                                            styleClass="mb-2"
                                        />

                                        <p-skeleton
                                            width="35%"
                                            height="0.8rem"
                                        />
                                    </div>
                                </div>

                                <p-skeleton
                                    width="100%"
                                    height="13rem"
                                />
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Hábitos activos
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ habits.length }}
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                    style="width: 3rem; height: 3rem"
                                >
                                    <i
                                        class="pi pi-list-check text-blue-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Registros guardados
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ savedCount }}
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                    style="width: 3rem; height: 3rem"
                                >
                                    <i
                                        class="pi pi-save text-green-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Metas completadas
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ completedCount }}
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-400/10"
                                    style="width: 3rem; height: 3rem"
                                >
                                    <i
                                        class="pi pi-star-fill text-purple-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Progreso diario
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ dailyProgress }}%
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                    style="width: 3rem; height: 3rem"
                                >
                                    <i
                                        class="pi pi-chart-line text-orange-500 text-xl"
                                    ></i>
                                </div>
                            </div>

                            <p-progressbar
                                [value]="dailyProgress"
                                [showValue]="false"
                                styleClass="h-2"
                            />
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div
                        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                    >
                        <div>
                            <h2 class="text-xl font-semibold m-0">
                                Hábitos del {{ formattedSelectedDate }}
                            </h2>

                            <p class="text-muted-color mt-2 mb-0">
                                Completa el valor realizado y agrega una nota cuando sea necesario.
                            </p>
                        </div>

                        <p-tag
                            [value]="
                                completedCount +
                                ' de ' +
                                habits.length +
                                ' completados'
                            "
                            [severity]="
                                habits.length > 0 &&
                                completedCount === habits.length
                                    ? 'success'
                                    : 'info'
                            "
                            icon="pi pi-chart-pie"
                        />
                    </div>
                </div>

                @if (habits.length === 0) {
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
                                No tienes hábitos activos
                            </h2>

                            <p class="text-muted-color mt-3 mb-6">
                                Crea o activa un hábito para registrar tu progreso diario.
                            </p>

                            <p-button
                                label="Crear hábito"
                                icon="pi pi-plus"
                                routerLink="/habits/new"
                            />
                        </div>
                    </div>
                } @else {
                    <div class="grid grid-cols-12 gap-6">
                        @for (habit of habits; track habit.id) {
                            <div class="col-span-12 xl:col-span-6">
                                <div class="card mb-0 h-full flex flex-col">
                                    <div
                                        class="flex items-start justify-between gap-4 mb-5"
                                    >
                                        <div class="flex items-center gap-4">
                                            <div
                                                class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                                style="width: 3.5rem; height: 3.5rem"
                                            >
                                                <i
                                                    class="pi text-primary text-xl"
                                                    [ngClass]="habit.icon"
                                                ></i>
                                            </div>

                                            <div>
                                                <h2 class="text-xl font-semibold m-0">
                                                    {{ habit.name }}
                                                </h2>

                                                <span
                                                    class="text-muted-color text-sm"
                                                >
                                                    {{ habit.category }}
                                                </span>
                                            </div>
                                        </div>

                                        <p-tag
                                            [value]="
                                                isCompleted(habit)
                                                    ? 'Completado'
                                                    : habit.recordId
                                                      ? habit.dirty
                                                          ? 'Sin guardar'
                                                          : 'Registrado'
                                                      : 'Pendiente'
                                            "
                                            [severity]="
                                                isCompleted(habit) &&
                                                !habit.dirty
                                                    ? 'success'
                                                    : habit.dirty
                                                      ? 'warn'
                                                      : habit.recordId
                                                        ? 'info'
                                                        : 'secondary'
                                            "
                                        />
                                    </div>

                                    <div class="grid grid-cols-2 gap-4 mb-5">
                                        <div
                                            class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                        >
                                            <span
                                                class="block text-muted-color text-sm mb-2"
                                            >
                                                Meta diaria
                                            </span>

                                            <span class="text-lg font-semibold">
                                                {{ habit.goal }} {{ habit.unit }}
                                            </span>
                                        </div>

                                        <div
                                            class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                        >
                                            <span
                                                class="block text-muted-color text-sm mb-2"
                                            >
                                                Valor realizado
                                            </span>

                                            <span class="text-lg font-semibold">
                                                {{ habit.completedValue }}
                                                {{ habit.unit }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="mb-6">
                                        <div
                                            class="flex justify-between items-center mb-2"
                                        >
                                            <span class="text-muted-color">
                                                Cumplimiento
                                            </span>

                                            <span class="font-semibold">
                                                {{ getProgress(habit) }}%
                                            </span>
                                        </div>

                                        <p-progressbar
                                            [value]="getProgress(habit)"
                                            [showValue]="false"
                                            styleClass="h-2"
                                        />
                                    </div>

                                    <div class="flex flex-col gap-5 flex-1">
                                        <div>
                                            <label
                                                [for]="
                                                    'completedValue-' +
                                                    habit.id
                                                "
                                                class="block font-medium mb-2"
                                            >
                                                Cantidad realizada
                                            </label>

                                            <p-inputnumber
                                                [inputId]="
                                                    'completedValue-' +
                                                    habit.id
                                                "
                                                [(ngModel)]="
                                                    habit.completedValue
                                                "
                                                [min]="0"
                                                [showButtons]="true"
                                                buttonLayout="horizontal"
                                                incrementButtonIcon="pi pi-plus"
                                                decrementButtonIcon="pi pi-minus"
                                                styleClass="w-full"
                                                inputStyleClass="w-full text-center"
                                                [suffix]="
                                                    ' ' + habit.unit
                                                "
                                                [disabled]="
                                                    savingHabitId === habit.id ||
                                                    savingAll
                                                "
                                                (ngModelChange)="
                                                    markAsPending(habit)
                                                "
                                            />
                                        </div>

                                        <div>
                                            <div class="flex justify-between mb-2">
                                                <label
                                                    [for]="
                                                        'notes-' + habit.id
                                                    "
                                                    class="font-medium"
                                                >
                                                    Notas
                                                </label>

                                                <span
                                                    class="text-muted-color text-sm"
                                                >
                                                    {{ habit.notes.length }}/300
                                                </span>
                                            </div>

                                            <textarea
                                                pTextarea
                                                [id]="'notes-' + habit.id"
                                                [(ngModel)]="habit.notes"
                                                rows="3"
                                                maxlength="300"
                                                class="w-full resize-none"
                                                placeholder="Agrega una observación opcional..."
                                                [disabled]="
                                                    savingHabitId === habit.id ||
                                                    savingAll
                                                "
                                                (ngModelChange)="
                                                    markAsPending(habit)
                                                "
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div
                                        class="flex flex-col sm:flex-row gap-3 mt-6"
                                    >
                                        <p-button
                                            [label]="
                                                habit.recordId
                                                    ? 'Actualizar registro'
                                                    : 'Guardar registro'
                                            "
                                            [icon]="
                                                habit.recordId
                                                    ? 'pi pi-save'
                                                    : 'pi pi-check'
                                            "
                                            styleClass="w-full"
                                            [loading]="
                                                savingHabitId === habit.id
                                            "
                                            [disabled]="savingAll"
                                            (onClick)="saveRecord(habit)"
                                        />

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
                                    </div>

                                    @if (
                                        habit.saved &&
                                        !habit.dirty
                                    ) {
                                        <div
                                            class="flex items-center gap-3 mt-5 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                                        >
                                            <i
                                                class="pi pi-check-circle text-green-500"
                                            ></i>

                                            <span
                                                class="text-green-700 dark:text-green-300"
                                            >
                                                Registro guardado correctamente.
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                }

                <div class="card mb-0">
                    <div
                        class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
                    >
                        <div class="flex items-start gap-4">
                            <div
                                class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                style="width: 3rem; height: 3rem"
                            >
                                <i
                                    class="pi pi-info-circle text-primary text-xl"
                                ></i>
                            </div>

                            <div>
                                <h3 class="text-lg font-semibold mt-0 mb-2">
                                    Tu avance se calcula automáticamente
                                </h3>

                                <p class="text-muted-color m-0 leading-6">
                                    Una meta se considera completada cuando el
                                    valor realizado es igual o superior a la
                                    meta definida para el hábito.
                                </p>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3">
                            <p-button
                                label="Guardar todos"
                                icon="pi pi-save"
                                [loading]="savingAll"
                                [disabled]="
                                    habits.length === 0 ||
                                    savingHabitId !== null
                                "
                                (onClick)="saveAllRecords()"
                            />

                            <p-button
                                label="Ver estadísticas"
                                icon="pi pi-chart-bar"
                                severity="secondary"
                                [outlined]="true"
                                routerLink="/statistics"
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    `
})
export class DailyRecord implements OnInit {
    private readonly habitService =
        inject(HabitService);

    private readonly messageService =
        inject(MessageService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly today = new Date();

    readonly summarySkeletons = [1, 2, 3, 4];

    readonly habitSkeletons = [1, 2, 3, 4];

    selectedDate = new Date();

    habits: DailyHabitView[] = [];

    loadingPage = false;

    changingDate = false;

    refreshing = false;

    savingHabitId: number | null = null;

    savingAll = false;

    errorMessage = '';

    ngOnInit(): void {
        this.loadDailyRecords(false);
    }

    get savedCount(): number {
        return this.habits.filter(
            habit =>
                habit.recordId !== null &&
                !habit.dirty
        ).length;
    }

    get completedCount(): number {
        return this.habits.filter(
            habit => this.isCompleted(habit)
        ).length;
    }

    get dailyProgress(): number {
        if (this.habits.length === 0) {
            return 0;
        }

        return Math.round(
            this.habits.reduce(
                (total, habit) =>
                    total + this.getProgress(habit),
                0
            ) / this.habits.length
        );
    }

    get formattedSelectedDate(): string {
        return new Intl.DateTimeFormat('es-EC', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(this.selectedDate);
    }

    changeDate(): void {
        this.loadDailyRecords(false, true);
    }

    loadDailyRecords(
        isRefresh = false,
        isDateChange = false
    ): void {
        if (
            this.loadingPage ||
            this.changingDate ||
            this.refreshing
        ) {
            return;
        }

        if (isDateChange) {
            this.changingDate = true;
        } else if (isRefresh) {
            this.refreshing = true;
        } else {
            this.loadingPage = true;
        }

        this.errorMessage = '';

        const date = this.formatApiDate(
            this.selectedDate
        );

        forkJoin({
            habits: this.habitService
                .getMyHabits()
                .pipe(
                    catchError(
                        (
                            error: HttpErrorResponse
                        ) => {
                            console.error(
                                'Error al cargar hábitos:',
                                error
                            );

                            return of(
                                [] as HabitResponse[]
                            );
                        }
                    )
                ),

            summary: this.habitService
                .getSummaryByDate(date)
                .pipe(
                    catchError(
                        (
                            error: HttpErrorResponse
                        ) => {
                            if (error.status !== 404) {
                                console.error(
                                    'Error al cargar resumen:',
                                    error
                                );
                            }

                            return of(
                                this.emptySummary(date)
                            );
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
                    this.habits =
                        this.mapDailyHabits(
                            response.habits,
                            response.summary.records
                        );

                    window.setTimeout(() => {
                        this.loadingPage = false;
                        this.changingDate = false;
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
                        this.loadingPage = false;
                        this.changingDate = false;
                        this.refreshing = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    getProgress(
        habit: DailyHabitView
    ): number {
        if (habit.goal <= 0) {
            return 0;
        }

        return Math.min(
            100,
            Math.round(
                (
                    habit.completedValue /
                    habit.goal
                ) * 100
            )
        );
    }

    isCompleted(
        habit: DailyHabitView
    ): boolean {
        return (
            habit.completedValue >= habit.goal
        );
    }

    markAsPending(
        habit: DailyHabitView
    ): void {
        habit.saved = false;
        habit.dirty = true;
    }

    saveRecord(
        habit: DailyHabitView
    ): void {
        if (
            habit.completedValue === null ||
            habit.completedValue === undefined ||
            habit.completedValue < 0
        ) {
            this.messageService.add({
                severity: 'error',
                summary: 'Valor inválido',
                detail:
                    'La cantidad realizada no puede ser negativa.'
            });

            return;
        }

        if (
            this.savingHabitId !== null ||
            this.savingAll
        ) {
            return;
        }

        this.savingHabitId = habit.id;

        this.getSaveOperation(habit)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: response => {
                    this.applySavedRecord(
                        habit,
                        response
                    );

                    this.savingHabitId = null;

                    this.messageService.add({
                        severity: 'success',
                        summary: habit.recordId
                            ? 'Registro actualizado'
                            : 'Registro guardado',
                        detail:
                            `${habit.name}: ` +
                            `${response.completedValue} ` +
                            `${habit.unit}.`
                    });
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.savingHabitId = null;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible guardar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    saveAllRecords(): void {
        if (
            this.savingAll ||
            this.savingHabitId !== null ||
            this.habits.length === 0
        ) {
            return;
        }

        const pendingHabits =
            this.habits.filter(
                habit =>
                    habit.dirty ||
                    habit.recordId === null
            );

        if (pendingHabits.length === 0) {
            this.messageService.add({
                severity: 'info',
                summary: 'Sin cambios',
                detail:
                    'Todos los registros ya están guardados.'
            });

            return;
        }

        this.savingAll = true;

        const operations =
            pendingHabits.map(habit =>
                this.getSaveOperation(habit)
                    .pipe(
                        catchError(
                            (
                                error: HttpErrorResponse
                            ) => {
                                console.error(
                                    `Error guardando hábito ${habit.id}:`,
                                    error
                                );

                                return of(null);
                            }
                        )
                    )
            );

        forkJoin(operations)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: responses => {
                    let savedRecords = 0;

                    responses.forEach(
                        (response, index) => {
                            if (!response) {
                                return;
                            }

                            this.applySavedRecord(
                                pendingHabits[index],
                                response
                            );

                            savedRecords++;
                        }
                    );

                    this.savingAll = false;

                    if (
                        savedRecords ===
                        pendingHabits.length
                    ) {
                        this.messageService.add({
                            severity: 'success',
                            summary:
                                'Registros guardados',
                            detail:
                                'El progreso diario fue guardado correctamente.'
                        });

                        return;
                    }

                    this.messageService.add({
                        severity: 'warn',
                        summary:
                            'Guardado parcialmente',
                        detail:
                            `${savedRecords} de ` +
                            `${pendingHabits.length} registros fueron guardados.`
                    });
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.savingAll = false;

                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible guardar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    private getSaveOperation(
        habit: DailyHabitView
    ): Observable<HabitRecordResponse> {
        if (habit.recordId !== null) {
            const request:
                UpdateHabitRecordRequest = {
                    completedValue:
                        Number(
                            habit.completedValue
                        ),

                    notes:
                        habit.notes.trim() ||
                        null
                };

            return this.habitService
                .updateRecord(
                    habit.recordId,
                    request
                );
        }

        const request: HabitRecordRequest = {
            recordDate:
                this.formatApiDate(
                    this.selectedDate
                ),

            completedValue:
                Number(
                    habit.completedValue
                ),

            notes:
                habit.notes.trim() ||
                null
        };

        return this.habitService
            .createRecord(
                habit.id,
                request
            );
    }

    private applySavedRecord(
        habit: DailyHabitView,
        response: HabitRecordResponse
    ): void {
        habit.recordId = response.id;
        habit.completedValue =
            response.completedValue;
        habit.notes =
            response.notes ?? '';
        habit.saved = true;
        habit.dirty = false;

        this.habits = [
            ...this.habits
        ];
    }

    private mapDailyHabits(
        habits: HabitResponse[],
        records: HabitRecordResponse[]
    ): DailyHabitView[] {
        const recordsByHabit =
            new Map<
                number,
                HabitRecordResponse
            >();

        records.forEach(record => {
            recordsByHabit.set(
                record.habitId,
                record
            );
        });

        return habits
            .filter(habit => habit.active)
            .map(habit => {
                const record =
                    recordsByHabit.get(
                        habit.id
                    );

                return {
                    id: habit.id,
                    name: habit.name,
                    category:
                        this.getCategoryLabel(
                            habit.category
                        ),
                    icon:
                        this.getCategoryIcon(
                            habit.category
                        ),
                    goal: habit.goal,
                    unit: habit.unit,
                    completedValue:
                        record?.completedValue ??
                        0,
                    notes:
                        record?.notes ??
                        '',
                    saved: Boolean(record),
                    dirty: false,
                    recordId:
                        record?.id ??
                        null
                };
            });
    }

    private emptySummary(
        date: string
    ): TodaySummaryResponse {
        return {
            date,
            totalHabits: 0,
            completedHabits: 0,
            progress: 0,
            records: []
        };
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

        return labels[category] ?? category;
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
            return 'No se encontró el registro solicitado.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
