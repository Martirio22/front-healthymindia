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
    catchError,
    forkJoin,
    of
} from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';

import { HabitRecordResponse } from '@/app/core/habits/models/habit-record-response.model';
import { HabitResponse } from '@/app/core/habits/models/habit-response.model';
import { HabitService } from '@/app/core/habits/services/habit.service';

import { DailyStatisticsResponse } from '@/app/core/statistics/models/daily-statistics-response.model';
import { MonthlyStatisticsResponse } from '@/app/core/statistics/models/monthly-statistics-response.model';
import { RangeStatisticsResponse } from '@/app/core/statistics/models/range-statistics-response.model';
import { WeekDay } from '@/app/core/statistics/models/week-day.enum';
import { WeeklyStatisticsResponse } from '@/app/core/statistics/models/weekly-statistics-response.model';
import { StatisticsService } from '@/app/core/statistics/services/statistics.service';

interface StatisticsRecordView {
    id: number;
    habitId: number;
    date: string;
    habit: string;
    category: string;
    completedValue: string;
    goal: string;
    completed: boolean;
    notes: string;
}

interface WeekDayView {
    key: WeekDay;
    label: string;
    shortLabel: string;
    completed: boolean;
}

@Component({
    selector: 'app-statistics',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        ChartModule,
        DatePickerModule,
        MessageModule,
        ProgressBarModule,
        SkeletonModule,
        TableModule,
        TabsModule,
        TagModule
    ],
    template: `
        <div class="flex flex-col gap-6">
            <div
                class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
            >
                <div>
                    <h1
                        class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                    >
                        Estadísticas
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Analiza tu cumplimiento diario, semanal, mensual y por período.
                    </p>
                </div>

                <p-button
                    label="Actualizar"
                    icon="pi pi-refresh"
                    severity="secondary"
                    [outlined]="true"
                    [loading]="refreshingAll"
                    [disabled]="isAnySectionLoading"
                    (onClick)="refreshAll()"
                />
            </div>

            @if (generalError) {
                <p-message
                    severity="error"
                    [text]="generalError"
                    styleClass="w-full"
                />
            }

            <p-tabs value="daily">
                <p-tablist>
                    <p-tab value="daily">
                        <i class="pi pi-calendar mr-2"></i>
                        Diaria
                    </p-tab>

                    <p-tab value="weekly">
                        <i class="pi pi-chart-bar mr-2"></i>
                        Semanal
                    </p-tab>

                    <p-tab value="monthly">
                        <i class="pi pi-chart-pie mr-2"></i>
                        Mensual
                    </p-tab>

                    <p-tab value="range">
                        <i class="pi pi-calendar-clock mr-2"></i>
                        Por rango
                    </p-tab>
                </p-tablist>

                <p-tabpanels>
                    <!-- DIARIA -->
                    <p-tabpanel value="daily">
                        <div class="flex flex-col gap-6 pt-5">
                            <div class="card mb-0">
                                <div
                                    class="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                                >
                                    <div>
                                        <h2 class="text-xl font-semibold mt-0 mb-2">
                                            Resumen diario
                                        </h2>

                                        <p class="text-muted-color m-0">
                                            Consulta el cumplimiento de una fecha específica.
                                        </p>
                                    </div>

                                    <div class="flex flex-col sm:flex-row gap-3">
                                        <p-datepicker
                                            [(ngModel)]="dailyDate"
                                            [showIcon]="true"
                                            [maxDate]="today"
                                            dateFormat="dd/mm/yy"
                                            [disabled]="loadingDaily"
                                        />

                                        <p-button
                                            label="Consultar"
                                            icon="pi pi-search"
                                            [loading]="loadingDaily"
                                            (onClick)="loadDailyStatistics()"
                                        />
                                    </div>
                                </div>
                            </div>

                            @if (dailyError) {
                                <p-message
                                    severity="error"
                                    [text]="dailyError"
                                    styleClass="w-full"
                                />
                            }

                            @if (loadingDaily) {
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
                                                    width="5rem"
                                                    height="2.5rem"
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            } @else {
                                <div class="grid grid-cols-12 gap-6">
                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Fecha consultada
                                            </span>

                                            <div class="text-xl font-semibold">
                                                {{ formattedDailyDate }}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Hábitos activos
                                            </span>

                                            <div class="text-4xl font-semibold">
                                                {{ dailyStatistics.totalHabits }}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Completados
                                            </span>

                                            <div
                                                class="text-4xl font-semibold text-green-500"
                                            >
                                                {{ dailyStatistics.completedHabits }}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Cumplimiento
                                            </span>

                                            <div class="text-4xl font-semibold mb-4">
                                                {{
                                                    dailyStatistics.completionPercentage
                                                        | number: '1.0-1'
                                                }}%
                                            </div>

                                            <p-progressbar
                                                [value]="
                                                    dailyStatistics.completionPercentage
                                                "
                                                [showValue]="false"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-12 gap-6">
                                    <div class="col-span-12 lg:col-span-4">
                                        <div class="card mb-0 h-full">
                                            <h2
                                                class="text-xl font-semibold mt-0 mb-2"
                                            >
                                                Cumplimiento diario
                                            </h2>

                                            <p class="text-muted-color mt-0 mb-6">
                                                Distribución de hábitos completados y pendientes.
                                            </p>

                                            @if (showDailyChart) {
                                                <p-chart
                                                    type="doughnut"
                                                    [data]="dailyChartData"
                                                    [options]="doughnutOptions"
                                                    height="300px"
                                                />
                                            }
                                        </div>
                                    </div>

                                    <div class="col-span-12 lg:col-span-8">
                                        <div class="card mb-0 h-full">
                                            <div
                                                class="flex items-center justify-between mb-6"
                                            >
                                                <div>
                                                    <h2
                                                        class="text-xl font-semibold m-0"
                                                    >
                                                        Registros del día
                                                    </h2>

                                                    <span
                                                        class="text-muted-color text-sm"
                                                    >
                                                        Resultado individual por hábito
                                                    </span>
                                                </div>

                                                <p-tag
                                                    [value]="
                                                        dailyRecords.length +
                                                        ' registros'
                                                    "
                                                    severity="info"
                                                />
                                            </div>

                                            <p-table
                                                [value]="dailyRecords"
                                                [rowHover]="true"
                                                responsiveLayout="scroll"
                                            >
                                                <ng-template #header>
                                                    <tr>
                                                        <th>Hábito</th>
                                                        <th>Categoría</th>
                                                        <th>Realizado</th>
                                                        <th>Meta</th>
                                                        <th>Estado</th>
                                                    </tr>
                                                </ng-template>

                                                <ng-template #body let-record>
                                                    <tr>
                                                        <td>
                                                            <span class="font-medium">
                                                                {{ record.habit }}
                                                            </span>
                                                        </td>

                                                        <td>{{ record.category }}</td>

                                                        <td>
                                                            {{ record.completedValue }}
                                                        </td>

                                                        <td>{{ record.goal }}</td>

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
                                                    </tr>
                                                </ng-template>

                                                <ng-template #emptymessage>
                                                    <tr>
                                                        <td colspan="5">
                                                            <div
                                                                class="text-center py-10 text-muted-color"
                                                            >
                                                                No existen registros para esta fecha.
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </ng-template>
                                            </p-table>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </p-tabpanel>

                    <!-- SEMANAL -->
                    <p-tabpanel value="weekly">
                        <div class="flex flex-col gap-6 pt-5">
                            @if (weeklyError) {
                                <p-message
                                    severity="error"
                                    [text]="weeklyError"
                                    styleClass="w-full"
                                />
                            }

                            @if (loadingWeekly) {
                                <div class="grid grid-cols-12 gap-6">
                                    @for (item of summarySkeletons; track item) {
                                        <div class="col-span-12 md:col-span-4">
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
                                </div>
                            } @else {
                                <div class="grid grid-cols-12 gap-6">
                                    <div class="col-span-12 md:col-span-4">
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Promedio semanal
                                            </span>

                                            <div class="text-4xl font-semibold mb-4">
                                                {{
                                                    weeklyStatistics.averageCompletionRate
                                                        | number: '1.0-1'
                                                }}%
                                            </div>

                                            <p-progressbar
                                                [value]="
                                                    weeklyStatistics.averageCompletionRate
                                                "
                                                [showValue]="false"
                                            />
                                        </div>
                                    </div>

                                    <div class="col-span-12 md:col-span-4">
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Días cumplidos
                                            </span>

                                            <div class="text-4xl font-semibold">
                                                {{ completedWeekDays }}/7
                                            </div>

                                            <div class="flex gap-2 mt-5 flex-wrap">
                                                @for (
                                                    day of weekDays;
                                                    track day.key
                                                ) {
                                                    <div
                                                        class="flex items-center justify-center rounded-full font-medium text-sm"
                                                        [class.bg-green-500]="
                                                            day.completed
                                                        "
                                                        [class.text-white]="
                                                            day.completed
                                                        "
                                                        [class.bg-surface-200]="
                                                            !day.completed
                                                        "
                                                        [class.dark:bg-surface-700]="
                                                            !day.completed
                                                        "
                                                        style="width: 2.25rem; height: 2.25rem"
                                                    >
                                                        {{ day.shortLabel }}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-span-12 md:col-span-4">
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Estado semanal
                                            </span>

                                            <div
                                                class="flex items-center gap-3 mt-4"
                                            >
                                                <div
                                                    class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10"
                                                    style="width: 4rem; height: 4rem"
                                                >
                                                    <i
                                                        class="pi text-primary text-2xl"
                                                        [ngClass]="weeklyStatusIcon"
                                                    ></i>
                                                </div>

                                                <div>
                                                    <div
                                                        class="text-xl font-semibold"
                                                    >
                                                        {{ weeklyStatusLabel }}
                                                    </div>

                                                    <span class="text-muted-color">
                                                        {{ weeklyStatusMessage }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card mb-0">
                                    <h2 class="text-xl font-semibold mt-0 mb-2">
                                        Cumplimiento semanal
                                    </h2>

                                    <p class="text-muted-color mt-0 mb-6">
                                        Estado registrado de lunes a domingo.
                                    </p>

                                    @if (showWeeklyChart) {
                                        <p-chart
                                            type="bar"
                                            [data]="weeklyChartData"
                                            [options]="percentageChartOptions"
                                            height="350px"
                                        />
                                    }
                                </div>

                                <div class="card mb-0">
                                    <h2 class="text-xl font-semibold mt-0 mb-6">
                                        Estado por día
                                    </h2>

                                    <div
                                        class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4"
                                    >
                                        @for (day of weekDays; track day.key) {
                                            <div
                                                class="flex flex-col items-center text-center p-5 rounded-xl border"
                                                [class.border-green-300]="
                                                    day.completed
                                                "
                                                [class.bg-green-50]="
                                                    day.completed
                                                "
                                                [class.dark:bg-green-950/20]="
                                                    day.completed
                                                "
                                                [class.border-surface-200]="
                                                    !day.completed
                                                "
                                                [class.dark:border-surface-700]="
                                                    !day.completed
                                                "
                                            >
                                                <div
                                                    class="flex items-center justify-center rounded-full mb-3"
                                                    [class.bg-green-500]="
                                                        day.completed
                                                    "
                                                    [class.bg-surface-200]="
                                                        !day.completed
                                                    "
                                                    [class.dark:bg-surface-700]="
                                                        !day.completed
                                                    "
                                                    style="width: 3rem; height: 3rem"
                                                >
                                                    <i
                                                        class="pi"
                                                        [class.pi-check]="
                                                            day.completed
                                                        "
                                                        [class.pi-minus]="
                                                            !day.completed
                                                        "
                                                        [class.text-white]="
                                                            day.completed
                                                        "
                                                    ></i>
                                                </div>

                                                <span class="font-semibold">
                                                    {{ day.label }}
                                                </span>

                                                <span
                                                    class="text-sm mt-1"
                                                    [class.text-green-500]="
                                                        day.completed
                                                    "
                                                    [class.text-muted-color]="
                                                        !day.completed
                                                    "
                                                >
                                                    {{
                                                        day.completed
                                                            ? 'Cumplido'
                                                            : 'Sin completar'
                                                    }}
                                                </span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            }
                        </div>
                    </p-tabpanel>

                    <!-- MENSUAL -->
                    <p-tabpanel value="monthly">
                        <div class="flex flex-col gap-6 pt-5">
                            @if (monthlyError) {
                                <p-message
                                    severity="error"
                                    [text]="monthlyError"
                                    styleClass="w-full"
                                />
                            }

                            @if (loadingMonthly) {
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
                                                    width="5rem"
                                                    height="2.5rem"
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            } @else {
                                <div class="grid grid-cols-12 gap-6">
                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Mes analizado
                                            </span>

                                            <div class="text-2xl font-semibold">
                                                {{ currentMonthLabel }}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Total de registros
                                            </span>

                                            <div class="text-4xl font-semibold">
                                                {{ monthlyStatistics.totalRecords }}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Completados
                                            </span>

                                            <div
                                                class="text-4xl font-semibold text-green-500"
                                            >
                                                {{
                                                    monthlyStatistics.completedRecords
                                                }}
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                                    >
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Eficiencia mensual
                                            </span>

                                            <div class="text-4xl font-semibold mb-4">
                                                {{
                                                    monthlyStatistics.monthlyEfficiency
                                                        | number: '1.0-1'
                                                }}%
                                            </div>

                                            <p-progressbar
                                                [value]="
                                                    monthlyStatistics.monthlyEfficiency
                                                "
                                                [showValue]="false"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-12 gap-6">
                                    <div class="col-span-12 lg:col-span-5">
                                        <div class="card mb-0 h-full">
                                            <h2
                                                class="text-xl font-semibold mt-0 mb-2"
                                            >
                                                Distribución mensual
                                            </h2>

                                            <p class="text-muted-color mt-0 mb-6">
                                                Registros completados y pendientes.
                                            </p>

                                            @if (showMonthlyChart) {
                                                <p-chart
                                                    type="doughnut"
                                                    [data]="monthlyChartData"
                                                    [options]="doughnutOptions"
                                                    height="320px"
                                                />
                                            }
                                        </div>
                                    </div>

                                    <div class="col-span-12 lg:col-span-7">
                                        <div class="card mb-0 h-full">
                                            <h2
                                                class="text-xl font-semibold mt-0 mb-5"
                                            >
                                                Interpretación del período
                                            </h2>

                                            <div
                                                class="p-5 rounded-xl bg-primary-50 dark:bg-primary-950/20"
                                            >
                                                <div class="flex items-start gap-4">
                                                    <i
                                                        class="pi pi-lightbulb text-primary text-xl mt-1"
                                                    ></i>

                                                    <div>
                                                        <h3
                                                            class="font-semibold mt-0 mb-2"
                                                        >
                                                            {{ monthlyStatusLabel }}
                                                        </h3>

                                                        <p
                                                            class="text-muted-color leading-7 m-0"
                                                        >
                                                            {{ monthlyStatusMessage }}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </p-tabpanel>

                    <!-- POR RANGO -->
                    <p-tabpanel value="range">
                        <div class="flex flex-col gap-6 pt-5">
                            <div class="card mb-0">
                                <div
                                    class="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5"
                                >
                                    <div>
                                        <h2 class="text-xl font-semibold mt-0 mb-2">
                                            Estadísticas por rango
                                        </h2>

                                        <p class="text-muted-color m-0">
                                            Selecciona una fecha inicial y final.
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
                                                [loading]="loadingRange"
                                                (onClick)="loadRangeStatistics()"
                                            />
                                        </div>
                                    </div>
                                </div>

                                @if (rangeDateError) {
                                    <small class="block text-red-500 mt-4">
                                        La fecha inicial no puede ser posterior a la fecha final.
                                    </small>
                                }
                            </div>

                            @if (rangeError) {
                                <p-message
                                    severity="error"
                                    [text]="rangeError"
                                    styleClass="w-full"
                                />
                            }

                            @if (!loadingRange) {
                                <div class="grid grid-cols-12 gap-6">
                                    <div class="col-span-12 sm:col-span-4">
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Total de registros
                                            </span>

                                            <div class="text-4xl font-semibold">
                                                {{ rangeStatistics.totalRecords }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-span-12 sm:col-span-4">
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Completados
                                            </span>

                                            <div
                                                class="text-4xl font-semibold text-green-500"
                                            >
                                                {{
                                                    rangeStatistics.completedRecords
                                                }}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-span-12 sm:col-span-4">
                                        <div class="card mb-0 h-full">
                                            <span
                                                class="block text-muted-color font-medium mb-3"
                                            >
                                                Porcentaje global
                                            </span>

                                            <div class="text-4xl font-semibold mb-4">
                                                {{
                                                    rangeStatistics.overallPercentage
                                                        | number: '1.0-1'
                                                }}%
                                            </div>

                                            <p-progressbar
                                                [value]="
                                                    rangeStatistics.overallPercentage
                                                "
                                                [showValue]="false"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div class="card mb-0">
                                    <div class="mb-6">
                                        <h2 class="text-xl font-semibold m-0">
                                            Historial del período
                                        </h2>

                                        <span class="text-muted-color text-sm">
                                            Del {{ formattedStartDate }} al
                                            {{ formattedEndDate }}
                                        </span>
                                    </div>

                                    <p-table
                                        [value]="rangeRecords"
                                        [paginator]="true"
                                        [rows]="5"
                                        [rowsPerPageOptions]="[5, 10, 20]"
                                        [rowHover]="true"
                                        responsiveLayout="scroll"
                                    >
                                        <ng-template #header>
                                            <tr>
                                                <th>Fecha</th>
                                                <th>Hábito</th>
                                                <th>Categoría</th>
                                                <th>Realizado</th>
                                                <th>Meta</th>
                                                <th>Estado</th>
                                            </tr>
                                        </ng-template>

                                        <ng-template #body let-record>
                                            <tr>
                                                <td>{{ record.date }}</td>

                                                <td>
                                                    <span class="font-medium">
                                                        {{ record.habit }}
                                                    </span>
                                                </td>

                                                <td>{{ record.category }}</td>

                                                <td>
                                                    {{ record.completedValue }}
                                                </td>

                                                <td>{{ record.goal }}</td>

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
                                            </tr>
                                        </ng-template>

                                        <ng-template #emptymessage>
                                            <tr>
                                                <td colspan="6">
                                                    <div
                                                        class="text-center py-10 text-muted-color"
                                                    >
                                                        No existen registros en este período.
                                                    </div>
                                                </td>
                                            </tr>
                                        </ng-template>
                                    </p-table>
                                </div>
                            }
                        </div>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `
})
export class Statistics implements OnInit {
    private readonly statisticsService =
        inject(StatisticsService);

    private readonly habitService =
        inject(HabitService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly today = new Date();

    readonly summarySkeletons = [1, 2, 3, 4];

    readonly weekDayConfiguration = [
        {
            key: WeekDay.Monday,
            label: 'Lunes',
            shortLabel: 'L'
        },
        {
            key: WeekDay.Tuesday,
            label: 'Martes',
            shortLabel: 'M'
        },
        {
            key: WeekDay.Wednesday,
            label: 'Miércoles',
            shortLabel: 'X'
        },
        {
            key: WeekDay.Thursday,
            label: 'Jueves',
            shortLabel: 'J'
        },
        {
            key: WeekDay.Friday,
            label: 'Viernes',
            shortLabel: 'V'
        },
        {
            key: WeekDay.Saturday,
            label: 'Sábado',
            shortLabel: 'S'
        },
        {
            key: WeekDay.Sunday,
            label: 'Domingo',
            shortLabel: 'D'
        }
    ];

    dailyDate = new Date();

    startDate = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        1
    );

    endDate = new Date();

    habits: HabitResponse[] = [];

    dailyStatistics: DailyStatisticsResponse =
        this.emptyDailyStatistics();

    weeklyStatistics: WeeklyStatisticsResponse =
        this.emptyWeeklyStatistics();

    monthlyStatistics: MonthlyStatisticsResponse =
        this.emptyMonthlyStatistics();

    rangeStatistics: RangeStatisticsResponse =
        this.emptyRangeStatistics();

    dailyRecords: StatisticsRecordView[] = [];

    rangeRecords: StatisticsRecordView[] = [];

    weekDays: WeekDayView[] = [];

    loadingDaily = false;
    loadingWeekly = false;
    loadingMonthly = false;
    loadingRange = false;
    refreshingAll = false;

    showDailyChart = false;
    showWeeklyChart = false;
    showMonthlyChart = false;

    generalError = '';
    dailyError = '';
    weeklyError = '';
    monthlyError = '';
    rangeError = '';
    rangeDateError = false;

    dailyChartData: object = {};
    weeklyChartData: object = {};
    monthlyChartData: object = {};

    readonly doughnutOptions = {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        cutout: '68%',
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    readonly percentageChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: (
                        value: string | number
                    ) => `${value}%`
                }
            }
        }
    };

    ngOnInit(): void {
        window.setTimeout(() => {
            this.loadInitialData();
        }, 0);
    }

    get isAnySectionLoading(): boolean {
        return (
            this.loadingDaily ||
            this.loadingWeekly ||
            this.loadingMonthly ||
            this.loadingRange ||
            this.refreshingAll
        );
    }

    get completedWeekDays(): number {
        return this.weekDays.filter(
            day => day.completed
        ).length;
    }

    get formattedDailyDate(): string {
        return this.formatDisplayDate(
            this.dailyDate
        );
    }

    get formattedStartDate(): string {
        return this.formatDisplayDate(
            this.startDate
        );
    }

    get formattedEndDate(): string {
        return this.formatDisplayDate(
            this.endDate
        );
    }

    get currentMonthLabel(): string {
        return new Intl.DateTimeFormat(
            'es-EC',
            {
                month: 'long',
                year: 'numeric'
            }
        ).format(this.today);
    }

    get weeklyStatusLabel(): string {
        const rate =
            this.weeklyStatistics
                .averageCompletionRate;

        if (rate >= 85) {
            return 'Excelente constancia';
        }

        if (rate >= 60) {
            return 'Buen progreso';
        }

        if (rate > 0) {
            return 'Puedes mejorar';
        }

        return 'Sin progreso registrado';
    }

    get weeklyStatusMessage(): string {
        const rate =
            this.weeklyStatistics
                .averageCompletionRate;

        if (rate >= 85) {
            return 'Mantén el ritmo durante los próximos días.';
        }

        if (rate >= 60) {
            return 'Continúa registrando tus avances diariamente.';
        }

        if (rate > 0) {
            return 'Intenta completar al menos un hábito cada día.';
        }

        return 'Comienza registrando el progreso de tus hábitos.';
    }

    get weeklyStatusIcon(): string {
        return this.weeklyStatistics
            .averageCompletionRate >= 60
            ? 'pi-thumbs-up'
            : 'pi-chart-line';
    }

    get monthlyStatusLabel(): string {
        const efficiency =
            this.monthlyStatistics
                .monthlyEfficiency;

        if (efficiency >= 85) {
            return 'Excelente desempeño mensual';
        }

        if (efficiency >= 60) {
            return 'Buen desempeño mensual';
        }

        return 'Hay oportunidades de mejora';
    }

    get monthlyStatusMessage(): string {
        const efficiency =
            this.monthlyStatistics
                .monthlyEfficiency;

        if (efficiency >= 85) {
            return 'Has mantenido un nivel alto de cumplimiento durante el mes.';
        }

        if (efficiency >= 60) {
            return 'Tu constancia es positiva. Sigue registrando el avance diariamente.';
        }

        return 'Revisa tus metas y considera reducir temporalmente su dificultad.';
    }

    refreshAll(): void {
        if (this.isAnySectionLoading) {
            return;
        }

        this.refreshingAll = true;
        this.loadInitialData(true);
    }

    loadDailyStatistics(): void {
        if (this.loadingDaily) {
            return;
        }

        this.loadingDaily = true;
        this.dailyError = '';
        this.showDailyChart = false;

        this.statisticsService
            .getDailyStatistics(
                this.formatApiDate(this.dailyDate)
            )
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.applyDailyResponse(response);
                    this.finishDailyLoading();
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.dailyError =
                        this.getErrorMessage(error);

                    this.dailyStatistics =
                        this.emptyDailyStatistics();

                    this.dailyRecords = [];

                    this.finishDailyLoading();
                }
            });
    }

    loadWeeklyStatistics(): void {
        if (this.loadingWeekly) {
            return;
        }

        this.loadingWeekly = true;
        this.weeklyError = '';
        this.showWeeklyChart = false;

        this.statisticsService
            .getWeeklyStatistics()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.applyWeeklyResponse(response);
                    this.finishWeeklyLoading();
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.weeklyError =
                        this.getErrorMessage(error);

                    this.weeklyStatistics =
                        this.emptyWeeklyStatistics();

                    this.buildWeekDays(
                        this.weeklyStatistics.dailyStatus
                    );

                    this.finishWeeklyLoading();
                }
            });
    }

    loadMonthlyStatistics(): void {
        if (this.loadingMonthly) {
            return;
        }

        this.loadingMonthly = true;
        this.monthlyError = '';
        this.showMonthlyChart = false;

        this.statisticsService
            .getMonthlyStatistics()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.applyMonthlyResponse(response);
                    this.finishMonthlyLoading();
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.monthlyError =
                        this.getErrorMessage(error);

                    this.monthlyStatistics =
                        this.emptyMonthlyStatistics();

                    this.finishMonthlyLoading();
                }
            });
    }

    loadRangeStatistics(): void {
        this.rangeDateError =
            this.startDate > this.endDate;

        if (
            this.rangeDateError ||
            this.loadingRange
        ) {
            return;
        }

        this.loadingRange = true;
        this.rangeError = '';

        this.statisticsService
            .getStatisticsByRange(
                this.formatApiDate(
                    this.startDate
                ),
                this.formatApiDate(
                    this.endDate
                )
            )
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.rangeStatistics =
                        response;

                    this.rangeRecords =
                        this.mapRecords(
                            response.records
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
                    this.rangeError =
                        this.getErrorMessage(error);

                    this.rangeStatistics =
                        this.emptyRangeStatistics();

                    this.rangeRecords = [];

                    window.setTimeout(() => {
                        this.loadingRange = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    private loadInitialData(
        fromRefresh = false
    ): void {
        this.generalError = '';

        forkJoin({
            habits: this.habitService
                .getMyHabits()
                .pipe(
                    catchError(
                        (
                            error: HttpErrorResponse
                        ) => {
                            console.error(
                                'Error cargando hábitos:',
                                error
                            );

                            return of(
                                [] as HabitResponse[]
                            );
                        }
                    )
                ),

            daily: this.statisticsService
                .getDailyStatistics(
                    this.formatApiDate(
                        this.dailyDate
                    )
                )
                .pipe(
                    catchError(() =>
                        of(
                            this.emptyDailyStatistics()
                        )
                    )
                ),

            weekly: this.statisticsService
                .getWeeklyStatistics()
                .pipe(
                    catchError(() =>
                        of(
                            this.emptyWeeklyStatistics()
                        )
                    )
                ),

            monthly: this.statisticsService
                .getMonthlyStatistics()
                .pipe(
                    catchError(() =>
                        of(
                            this.emptyMonthlyStatistics()
                        )
                    )
                ),

            range: this.statisticsService
                .getStatisticsByRange(
                    this.formatApiDate(
                        this.startDate
                    ),
                    this.formatApiDate(
                        this.endDate
                    )
                )
                .pipe(
                    catchError(() =>
                        of(
                            this.emptyRangeStatistics()
                        )
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
                        response.habits;

                    this.applyDailyResponse(
                        response.daily
                    );

                    this.applyWeeklyResponse(
                        response.weekly
                    );

                    this.applyMonthlyResponse(
                        response.monthly
                    );

                    this.rangeStatistics =
                        response.range;

                    this.rangeRecords =
                        this.mapRecords(
                            response.range.records
                        );

                    window.setTimeout(() => {
                        this.refreshingAll = false;

                        this.changeDetectorRef
                            .detectChanges();

                        window.requestAnimationFrame(
                            () => {
                                this.showDailyChart = true;
                                this.showWeeklyChart = true;
                                this.showMonthlyChart = true;

                                this.changeDetectorRef
                                    .detectChanges();
                            }
                        );
                    }, 0);
                },

                error: () => {
                    this.generalError =
                        'No fue posible cargar las estadísticas.';

                    window.setTimeout(() => {
                        this.refreshingAll = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    private applyDailyResponse(
        response: DailyStatisticsResponse
    ): void {
        this.dailyStatistics = response;

        this.dailyRecords =
            this.mapRecords(response.records);

        const pending = Math.max(
            0,
            response.totalHabits -
                response.completedHabits
        );

        this.dailyChartData = {
            labels: [
                'Completados',
                'Pendientes'
            ],
            datasets: [
                {
                    data: [
                        response.completedHabits,
                        pending
                    ],
                    backgroundColor: [
                        '#22c55e',
                        '#d1d5db'
                    ],
                    borderWidth: 0
                }
            ]
        };
    }

    private applyWeeklyResponse(
        response: WeeklyStatisticsResponse
    ): void {
        this.weeklyStatistics = response;

        this.buildWeekDays(
            response.dailyStatus
        );

        this.weeklyChartData = {
            labels: this.weekDays.map(
                day => day.label
            ),
            datasets: [
                {
                    label: 'Cumplimiento',
                    data: this.weekDays.map(
                        day =>
                            day.completed
                                ? 100
                                : 0
                    ),
                    backgroundColor:
                        '#10b981',
                    borderRadius: 8
                }
            ]
        };
    }

    private applyMonthlyResponse(
        response: MonthlyStatisticsResponse
    ): void {
        this.monthlyStatistics = response;

        const pendingRecords = Math.max(
            0,
            response.totalRecords -
                response.completedRecords
        );

        this.monthlyChartData = {
            labels: [
                'Completados',
                'Pendientes'
            ],
            datasets: [
                {
                    data: [
                        response.completedRecords,
                        pendingRecords
                    ],
                    backgroundColor: [
                        '#22c55e',
                        '#f59e0b'
                    ],
                    borderWidth: 0
                }
            ]
        };
    }

    private buildWeekDays(
        dailyStatus:
            Record<WeekDay, boolean>
    ): void {
        this.weekDays =
            this.weekDayConfiguration.map(
                day => ({
                    key: day.key,
                    label: day.label,
                    shortLabel:
                        day.shortLabel,
                    completed:
                        dailyStatus[day.key] ??
                        false
                })
            );
    }

    private mapRecords(
        records: HabitRecordResponse[]
    ): StatisticsRecordView[] {
        const habitsById =
            new Map<number, HabitResponse>();

        this.habits.forEach(habit => {
            habitsById.set(
                habit.id,
                habit
            );
        });

        return records.map(record => {
            const habit =
                habitsById.get(
                    record.habitId
                );

            return {
                id: record.id,
                habitId: record.habitId,
                date:
                    this.formatRecordDate(
                        record.recordDate
                    ),
                habit:
                    habit?.name ??
                    `Hábito #${record.habitId}`,
                category:
                    this.getCategoryLabel(
                        habit?.category ??
                        ''
                    ),
                completedValue:
                    habit
                        ? `${record.completedValue} ${habit.unit}`
                        : String(
                            record.completedValue
                        ),
                goal:
                    habit
                        ? `${habit.goal} ${habit.unit}`
                        : 'Sin información',
                completed:
                    record.completed,
                notes:
                    record.notes ?? ''
            };
        });
    }

    private finishDailyLoading(): void {
        window.setTimeout(() => {
            this.loadingDaily = false;

            this.changeDetectorRef
                .detectChanges();

            window.requestAnimationFrame(() => {
                this.showDailyChart = true;

                this.changeDetectorRef
                    .detectChanges();
            });
        }, 0);
    }

    private finishWeeklyLoading(): void {
        window.setTimeout(() => {
            this.loadingWeekly = false;

            this.changeDetectorRef
                .detectChanges();

            window.requestAnimationFrame(() => {
                this.showWeeklyChart = true;

                this.changeDetectorRef
                    .detectChanges();
            });
        }, 0);
    }

    private finishMonthlyLoading(): void {
        window.setTimeout(() => {
            this.loadingMonthly = false;

            this.changeDetectorRef
                .detectChanges();

            window.requestAnimationFrame(() => {
                this.showMonthlyChart = true;

                this.changeDetectorRef
                    .detectChanges();
            });
        }, 0);
    }

    private emptyDailyStatistics():
        DailyStatisticsResponse {
        return {
            date:
                this.formatApiDate(
                    this.dailyDate
                ),
            totalHabits: 0,
            completedHabits: 0,
            completionPercentage: 0,
            records: []
        };
    }

    private emptyWeeklyStatistics():
        WeeklyStatisticsResponse {
        return {
            userId: '',
            averageCompletionRate: 0,
            dailyStatus: {
                [WeekDay.Monday]: false,
                [WeekDay.Tuesday]: false,
                [WeekDay.Wednesday]: false,
                [WeekDay.Thursday]: false,
                [WeekDay.Friday]: false,
                [WeekDay.Saturday]: false,
                [WeekDay.Sunday]: false
            }
        };
    }

    private emptyMonthlyStatistics():
        MonthlyStatisticsResponse {
        return {
            userId: '',
            totalRecords: 0,
            completedRecords: 0,
            monthlyEfficiency: 0
        };
    }

    private emptyRangeStatistics():
        RangeStatisticsResponse {
        return {
            startDate:
                this.formatApiDate(
                    this.startDate
                ),
            endDate:
                this.formatApiDate(
                    this.endDate
                ),
            totalRecords: 0,
            completedRecords: 0,
            overallPercentage: 0,
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
                HIDRATACION:
                    'Hidratación'
            };

        return (
            labels[category] ??
            category ??
            'Sin categoría'
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

    private formatDisplayDate(
        date: Date
    ): string {
        return new Intl.DateTimeFormat(
            'es-EC',
            {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            }
        ).format(date);
    }

    private formatRecordDate(
        value: string
    ): string {
        const parts = value.split('-');

        if (parts.length !== 3) {
            return value;
        }

        return `${parts[2]}/${parts[1]}/${parts[0]}`;
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
            return 'No tienes permisos para consultar estas estadísticas.';
        }

        if (error.status === 404) {
            return 'No se encontraron estadísticas para el período seleccionado.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
