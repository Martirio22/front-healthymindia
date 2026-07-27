import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';

interface DailyRecordMock {
    habit: string;
    category: string;
    goal: string;
    completedValue: string;
    completed: boolean;
}

interface RangeRecordMock {
    date: string;
    habit: string;
    category: string;
    completedValue: string;
    goal: string;
    completed: boolean;
}

interface WeekDayMock {
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
        ProgressBarModule,
        TableModule,
        TabsModule,
        TagModule
    ],
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                        Estadísticas
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Analiza tu cumplimiento diario, semanal y mensual.
                    </p>
                </div>

                <div class="flex items-center gap-3">
                    <p-tag
                        value="Datos actualizados"
                        icon="pi pi-check-circle"
                        severity="success"
                    />

                    <p-button
                        label="Actualizar"
                        icon="pi pi-refresh"
                        severity="secondary"
                        [outlined]="true"
                        (onClick)="refreshStatistics()"
                    />
                </div>
            </div>

            <p-tabs value="daily">
                <p-tablist>
                    <p-tab value="daily">
                        <i class="pi pi-calendar-day mr-2"></i>
                        Diaria
                    </p-tab>

                    <p-tab value="weekly">
                        <i class="pi pi-calendar mr-2"></i>
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
                    <p-tabpanel value="daily">
                        <div class="flex flex-col gap-6 pt-4">
                            <div class="card mb-0">
                                <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
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
                                            placeholder="Selecciona una fecha"
                                        />

                                        <p-button
                                            label="Consultar"
                                            icon="pi pi-search"
                                            (onClick)="consultDaily()"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-12 gap-6">
                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <div class="flex justify-between">
                                            <div>
                                                <span class="block text-muted-color font-medium mb-3">
                                                    Fecha consultada
                                                </span>

                                                <div class="text-xl font-semibold">
                                                    {{ formattedDailyDate }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                                style="width: 3rem; height: 3rem"
                                            >
                                                <i class="pi pi-calendar text-blue-500 text-xl"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <div class="flex justify-between">
                                            <div>
                                                <span class="block text-muted-color font-medium mb-3">
                                                    Hábitos activos
                                                </span>

                                                <div class="text-3xl font-semibold">
                                                    {{ dailyStatistics.totalHabits }}
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-400/10"
                                                style="width: 3rem; height: 3rem"
                                            >
                                                <i class="pi pi-list-check text-purple-500 text-xl"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <div class="flex justify-between">
                                            <div>
                                                <span class="block text-muted-color font-medium mb-3">
                                                    Hábitos completados
                                                </span>

                                                <div class="text-3xl font-semibold">
                                                    {{ dailyStatistics.completedHabits }}
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

                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <div class="flex justify-between mb-4">
                                            <div>
                                                <span class="block text-muted-color font-medium mb-3">
                                                    Cumplimiento
                                                </span>

                                                <div class="text-3xl font-semibold">
                                                    {{ dailyStatistics.percentage }}%
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                                style="width: 3rem; height: 3rem"
                                            >
                                                <i class="pi pi-chart-line text-orange-500 text-xl"></i>
                                            </div>
                                        </div>

                                        <p-progressbar
                                            [value]="dailyStatistics.percentage"
                                            [showValue]="false"
                                            styleClass="h-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-12 gap-6">
                                <div class="col-span-12 lg:col-span-4">
                                    <div class="card h-full mb-0">
                                        <h2 class="text-xl font-semibold mt-0 mb-2">
                                            Cumplimiento diario
                                        </h2>

                                        <p class="text-muted-color mt-0 mb-6">
                                            Distribución de metas completadas.
                                        </p>

                                        <p-chart
                                            type="doughnut"
                                            [data]="dailyChartData"
                                            [options]="doughnutOptions"
                                            height="300px"
                                        />

                                        <div class="flex justify-center gap-6 mt-5">
                                            <div class="flex items-center gap-2">
                                                <span
                                                    class="block rounded-full bg-green-500"
                                                    style="width: 0.75rem; height: 0.75rem"
                                                ></span>

                                                <span class="text-muted-color">
                                                    Completados
                                                </span>
                                            </div>

                                            <div class="flex items-center gap-2">
                                                <span
                                                    class="block rounded-full bg-surface-300"
                                                    style="width: 0.75rem; height: 0.75rem"
                                                ></span>

                                                <span class="text-muted-color">
                                                    Pendientes
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 lg:col-span-8">
                                    <div class="card h-full mb-0">
                                        <div class="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 class="text-xl font-semibold m-0">
                                                    Registros del día
                                                </h2>

                                                <span class="text-muted-color text-sm">
                                                    Resultado individual por hábito
                                                </span>
                                            </div>

                                            <p-tag
                                                [value]="dailyRecords.length + ' registros'"
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

                                                    <td>
                                                        {{ record.category }}
                                                    </td>

                                                    <td>
                                                        {{ record.completedValue }}
                                                    </td>

                                                    <td>
                                                        {{ record.goal }}
                                                    </td>

                                                    <td>
                                                        <p-tag
                                                            [value]="record.completed ? 'Completado' : 'Pendiente'"
                                                            [severity]="record.completed ? 'success' : 'warn'"
                                                        />
                                                    </td>
                                                </tr>
                                            </ng-template>
                                        </p-table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </p-tabpanel>

                    <p-tabpanel value="weekly">
                        <div class="flex flex-col gap-6 pt-4">
                            <div class="grid grid-cols-12 gap-6">
                                <div class="col-span-12 md:col-span-4">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Promedio semanal
                                        </span>

                                        <div class="text-4xl font-semibold mb-4">
                                            {{ weeklyStatistics.averageCompletionRate }}%
                                        </div>

                                        <p-progressbar
                                            [value]="weeklyStatistics.averageCompletionRate"
                                            [showValue]="false"
                                        />

                                        <p class="text-muted-color mb-0 mt-4">
                                            Cumplimiento promedio de los registros creados durante esta semana.
                                        </p>
                                    </div>
                                </div>

                                <div class="col-span-12 md:col-span-4">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Días con progreso
                                        </span>

                                        <div class="text-4xl font-semibold">
                                            {{ completedWeekDays }}/7
                                        </div>

                                        <div class="flex gap-2 mt-5">
                                            @for (day of weekDays; track day.shortLabel) {
                                                <div
                                                    class="flex items-center justify-center rounded-full font-medium text-sm"
                                                    [class.bg-green-500]="day.completed"
                                                    [class.text-white]="day.completed"
                                                    [class.bg-surface-200]="!day.completed"
                                                    [class.dark:bg-surface-700]="!day.completed"
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
                                        <span class="block text-muted-color font-medium mb-3">
                                            Estado de la semana
                                        </span>

                                        <div class="flex items-center gap-3 mt-4">
                                            <div
                                                class="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-400/10"
                                                style="width: 4rem; height: 4rem"
                                            >
                                                <i class="pi pi-thumbs-up text-green-500 text-2xl"></i>
                                            </div>

                                            <div>
                                                <div class="text-xl font-semibold">
                                                    Buen progreso
                                                </div>

                                                <span class="text-muted-color">
                                                    Mantén la constancia
                                                </span>
                                            </div>
                                        </div>

                                        <p class="text-muted-color leading-6 mt-5 mb-0">
                                            Has registrado progreso en la mayoría de los días de esta semana.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="card mb-0">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <div>
                                        <h2 class="text-xl font-semibold m-0">
                                            Cumplimiento semanal
                                        </h2>

                                        <span class="text-muted-color text-sm">
                                            Progreso registrado de lunes a domingo
                                        </span>
                                    </div>

                                    <p-tag
                                        value="Semana actual"
                                        icon="pi pi-calendar"
                                        severity="info"
                                    />
                                </div>

                                <p-chart
                                    type="bar"
                                    [data]="weeklyChartData"
                                    [options]="percentageChartOptions"
                                    height="350px"
                                />
                            </div>

                            <div class="card mb-0">
                                <h2 class="text-xl font-semibold mt-0 mb-6">
                                    Estado por día
                                </h2>

                                <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
                                    @for (day of weekDays; track day.label) {
                                        <div
                                            class="flex flex-col items-center text-center p-5 rounded-xl border"
                                            [class.border-green-300]="day.completed"
                                            [class.bg-green-50]="day.completed"
                                            [class.dark:bg-green-950/20]="day.completed"
                                            [class.border-surface-200]="!day.completed"
                                            [class.dark:border-surface-700]="!day.completed"
                                        >
                                            <div
                                                class="flex items-center justify-center rounded-full mb-3"
                                                [class.bg-green-500]="day.completed"
                                                [class.bg-surface-200]="!day.completed"
                                                [class.dark:bg-surface-700]="!day.completed"
                                                style="width: 3rem; height: 3rem"
                                            >
                                                <i
                                                    class="pi"
                                                    [class.pi-check]="day.completed"
                                                    [class.pi-minus]="!day.completed"
                                                    [class.text-white]="day.completed"
                                                    [class.text-muted-color]="!day.completed"
                                                ></i>
                                            </div>

                                            <span class="font-semibold">
                                                {{ day.label }}
                                            </span>

                                            <span
                                                class="text-sm mt-1"
                                                [class.text-green-500]="day.completed"
                                                [class.text-muted-color]="!day.completed"
                                            >
                                                {{ day.completed ? 'Cumplido' : 'Sin completar' }}
                                            </span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </p-tabpanel>

                    <p-tabpanel value="monthly">
                        <div class="flex flex-col gap-6 pt-4">
                            <div class="grid grid-cols-12 gap-6">
                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Mes analizado
                                        </span>

                                        <div class="text-2xl font-semibold">
                                            Julio 2026
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Total de registros
                                        </span>

                                        <div class="text-4xl font-semibold">
                                            {{ monthlyStatistics.totalRecords }}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Registros completados
                                        </span>

                                        <div class="text-4xl font-semibold text-green-500">
                                            {{ monthlyStatistics.completedRecords }}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Eficiencia mensual
                                        </span>

                                        <div class="text-4xl font-semibold mb-4">
                                            {{ monthlyStatistics.monthlyEfficiency }}%
                                        </div>

                                        <p-progressbar
                                            [value]="monthlyStatistics.monthlyEfficiency"
                                            [showValue]="false"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-12 gap-6">
                                <div class="col-span-12 lg:col-span-8">
                                    <div class="card mb-0 h-full">
                                        <h2 class="text-xl font-semibold mt-0 mb-2">
                                            Evolución mensual
                                        </h2>

                                        <p class="text-muted-color mt-0 mb-6">
                                            Cumplimiento promedio por semana.
                                        </p>

                                        <p-chart
                                            type="bar"
                                            [data]="monthlyChartData"
                                            [options]="percentageChartOptions"
                                            height="350px"
                                        />
                                    </div>
                                </div>

                                <div class="col-span-12 lg:col-span-4">
                                    <div class="card mb-0 h-full">
                                        <h2 class="text-xl font-semibold mt-0 mb-2">
                                            Distribución del mes
                                        </h2>

                                        <p class="text-muted-color mt-0 mb-6">
                                            Registros completados y pendientes.
                                        </p>

                                        <p-chart
                                            type="doughnut"
                                            [data]="monthlyDoughnutData"
                                            [options]="doughnutOptions"
                                            height="300px"
                                        />

                                        <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800 mt-5">
                                            <div class="flex items-start gap-3">
                                                <i class="pi pi-lightbulb text-primary mt-1"></i>

                                                <p class="text-muted-color m-0 leading-6">
                                                    Tu cumplimiento aumentó 8% con respecto al mes anterior.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </p-tabpanel>

                    <p-tabpanel value="range">
                        <div class="flex flex-col gap-6 pt-4">
                            <div class="card mb-0">
                                <div class="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5">
                                    <div>
                                        <h2 class="text-xl font-semibold mt-0 mb-2">
                                            Estadísticas por rango
                                        </h2>

                                        <p class="text-muted-color m-0">
                                            Selecciona una fecha inicial y final para generar el reporte.
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
                                                (onClick)="consultRange()"
                                            />
                                        </div>
                                    </div>
                                </div>

                                @if (rangeError) {
                                    <small class="block text-red-500 mt-4">
                                        La fecha inicial no puede ser posterior a la fecha final.
                                    </small>
                                }
                            </div>

                            <div class="grid grid-cols-12 gap-6">
                                <div class="col-span-12 sm:col-span-4">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Total de registros
                                        </span>

                                        <div class="text-4xl font-semibold">
                                            {{ rangeStatistics.totalRecords }}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 sm:col-span-4">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Completados
                                        </span>

                                        <div class="text-4xl font-semibold text-green-500">
                                            {{ rangeStatistics.completedRecords }}
                                        </div>
                                    </div>
                                </div>

                                <div class="col-span-12 sm:col-span-4">
                                    <div class="card mb-0 h-full">
                                        <span class="block text-muted-color font-medium mb-3">
                                            Porcentaje global
                                        </span>

                                        <div class="text-4xl font-semibold mb-4">
                                            {{ rangeStatistics.overallPercentage }}%
                                        </div>

                                        <p-progressbar
                                            [value]="rangeStatistics.overallPercentage"
                                            [showValue]="false"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="card mb-0">
                                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                                    <div>
                                        <h2 class="text-xl font-semibold m-0">
                                            Historial del período
                                        </h2>

                                        <span class="text-muted-color text-sm">
                                            Del {{ formattedStartDate }} al {{ formattedEndDate }}
                                        </span>
                                    </div>

                                    <p-button
                                        label="Exportar"
                                        icon="pi pi-download"
                                        severity="secondary"
                                        [outlined]="true"
                                    />
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

                                            <td>{{ record.completedValue }}</td>

                                            <td>{{ record.goal }}</td>

                                            <td>
                                                <p-tag
                                                    [value]="record.completed ? 'Completado' : 'Pendiente'"
                                                    [severity]="record.completed ? 'success' : 'warn'"
                                                />
                                            </td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        </div>
                    </p-tabpanel>
                </p-tabpanels>
            </p-tabs>
        </div>
    `
})
export class Statistics {
    readonly today = new Date();

    dailyDate = new Date();
    startDate = new Date(2026, 6, 1);
    endDate = new Date(2026, 6, 27);

    rangeError = false;

    dailyStatistics = {
        totalHabits: 5,
        completedHabits: 3,
        percentage: 60
    };

    weeklyStatistics = {
        averageCompletionRate: 71.43
    };

    monthlyStatistics = {
        totalRecords: 86,
        completedRecords: 63,
        monthlyEfficiency: 73.26
    };

    rangeStatistics = {
        totalRecords: 72,
        completedRecords: 52,
        overallPercentage: 72.22
    };

    dailyRecords: DailyRecordMock[] = [
        {
            habit: 'Beber agua',
            category: 'Hidratación',
            goal: '8 vasos',
            completedValue: '8 vasos',
            completed: true
        },
        {
            habit: 'Leer diariamente',
            category: 'Lectura',
            goal: '30 minutos',
            completedValue: '30 minutos',
            completed: true
        },
        {
            habit: 'Ejercicio cardiovascular',
            category: 'Ejercicio',
            goal: '45 minutos',
            completedValue: '25 minutos',
            completed: false
        },
        {
            habit: 'Meditación',
            category: 'Bienestar',
            goal: '15 minutos',
            completedValue: '15 minutos',
            completed: true
        },
        {
            habit: 'Consumir frutas',
            category: 'Nutrición',
            goal: '3 porciones',
            completedValue: '1 porción',
            completed: false
        }
    ];

    weekDays: WeekDayMock[] = [
        { label: 'Lunes', shortLabel: 'L', completed: true },
        { label: 'Martes', shortLabel: 'M', completed: true },
        { label: 'Miércoles', shortLabel: 'X', completed: false },
        { label: 'Jueves', shortLabel: 'J', completed: true },
        { label: 'Viernes', shortLabel: 'V', completed: true },
        { label: 'Sábado', shortLabel: 'S', completed: false },
        { label: 'Domingo', shortLabel: 'D', completed: true }
    ];

    rangeRecords: RangeRecordMock[] = [
        {
            date: '27/07/2026',
            habit: 'Beber agua',
            category: 'Hidratación',
            completedValue: '8 vasos',
            goal: '8 vasos',
            completed: true
        },
        {
            date: '27/07/2026',
            habit: 'Leer diariamente',
            category: 'Lectura',
            completedValue: '25 minutos',
            goal: '30 minutos',
            completed: false
        },
        {
            date: '26/07/2026',
            habit: 'Ejercicio cardiovascular',
            category: 'Ejercicio',
            completedValue: '45 minutos',
            goal: '45 minutos',
            completed: true
        },
        {
            date: '26/07/2026',
            habit: 'Meditación',
            category: 'Bienestar',
            completedValue: '15 minutos',
            goal: '15 minutos',
            completed: true
        },
        {
            date: '25/07/2026',
            habit: 'Consumir frutas',
            category: 'Nutrición',
            completedValue: '2 porciones',
            goal: '3 porciones',
            completed: false
        },
        {
            date: '24/07/2026',
            habit: 'Planificar el día',
            category: 'Productividad',
            completedValue: '1 plan',
            goal: '1 plan',
            completed: true
        }
    ];

    dailyChartData = {
        labels: ['Completados', 'Pendientes'],
        datasets: [
            {
                data: [3, 2],
                backgroundColor: ['#22c55e', '#d1d5db'],
                borderWidth: 0
            }
        ]
    };

    weeklyChartData = {
        labels: [
            'Lunes',
            'Martes',
            'Miércoles',
            'Jueves',
            'Viernes',
            'Sábado',
            'Domingo'
        ],
        datasets: [
            {
                label: 'Cumplimiento',
                data: [80, 60, 40, 100, 80, 60, 80],
                backgroundColor: '#10b981',
                borderRadius: 8
            }
        ]
    };

    monthlyChartData = {
        labels: [
            'Semana 1',
            'Semana 2',
            'Semana 3',
            'Semana 4'
        ],
        datasets: [
            {
                label: 'Cumplimiento',
                data: [62, 70, 76, 84],
                backgroundColor: '#6366f1',
                borderRadius: 8
            }
        ]
    };

    monthlyDoughnutData = {
        labels: ['Completados', 'Pendientes'],
        datasets: [
            {
                data: [63, 23],
                backgroundColor: ['#22c55e', '#f59e0b'],
                borderWidth: 0
            }
        ]
    };

    doughnutOptions = {
        maintainAspectRatio: false,
        responsive: true,
        cutout: '68%',
        plugins: {
            legend: {
                display: false
            }
        }
    };

    percentageChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context: { raw: number }) =>
                        `${context.raw}% de cumplimiento`
                }
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
                    callback: (value: number) => `${value}%`
                }
            }
        }
    };

    get completedWeekDays(): number {
        return this.weekDays.filter(day => day.completed).length;
    }

    get formattedDailyDate(): string {
        return this.formatDate(this.dailyDate);
    }

    get formattedStartDate(): string {
        return this.formatDate(this.startDate);
    }

    get formattedEndDate(): string {
        return this.formatDate(this.endDate);
    }

    consultDaily(): void {
        this.dailyStatistics = {
            totalHabits: 5,
            completedHabits: 3,
            percentage: 60
        };
    }

    consultRange(): void {
        this.rangeError = this.startDate > this.endDate;

        if (this.rangeError) {
            return;
        }

        this.rangeStatistics = {
            totalRecords: 72,
            completedRecords: 52,
            overallPercentage: 72.22
        };
    }

    refreshStatistics(): void {
        this.dailyStatistics = {
            ...this.dailyStatistics
        };

        this.weeklyStatistics = {
            ...this.weeklyStatistics
        };

        this.monthlyStatistics = {
            ...this.monthlyStatistics
        };
    }

    private formatDate(date: Date): string {
        return new Intl.DateTimeFormat('es-EC', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(date);
    }
}
