// import { Component } from '@angular/core';
// import { NotificationsWidget } from './components/notificationswidget';
// import { StatsWidget } from './components/statswidget';
// import { RecentSalesWidget } from './components/recentsaleswidget';
// import { BestSellingWidget } from './components/bestsellingwidget';
// import { RevenueStreamWidget } from './components/revenuestreamwidget';

// @Component({
//     selector: 'app-dashboard',
//     imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
//     template: `
//         <div class="grid grid-cols-12 gap-8">
//             <app-stats-widget class="contents" />
//             <div class="col-span-12 xl:col-span-6">
//                 <app-recent-sales-widget />
//                 <app-best-selling-widget />
//             </div>
//             <div class="col-span-12 xl:col-span-6">
//                 <app-revenue-stream-widget />
//                 <app-notifications-widget />
//             </div>
//         </div>
//     `
// })
// export class Dashboard {}

import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    OnInit
} from '@angular/core';
import {
    takeUntilDestroyed
} from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';

import {
    catchError,
    forkJoin,
    of
} from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { HabitResponse } from '@/app/core/habits/models/habit-response.model';
import { HabitService } from '@/app/core/habits/services/habit.service';

import { DashboardResponse } from '@/app/core/statistics/models/dashboard-response.model';
import { WeeklyStatisticsResponse } from '@/app/core/statistics/models/weekly-statistics-response.model';
import { StatisticsService } from '@/app/core/statistics/services/statistics.service';

interface DashboardHabitView {
    id: number;
    name: string;
    category: string;
    goal: number;
    unit: string;
    active: boolean;
    icon: string;
}

interface WeeklyPointView {
    label: string;
    percentage: number;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ChartModule,
        MessageModule,
        ProgressBarModule,
        SkeletonModule,
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
                        Dashboard principal
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Visualiza el progreso general de tus hábitos y continúa
                        construyendo una rutina saludable.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <p-button
                        label="Registrar progreso"
                        icon="pi pi-check-square"
                        routerLink="/daily-record"
                    />

                    <p-button
                        label="Recomendación IA"
                        icon="pi pi-sparkles"
                        severity="secondary"
                        [outlined]="true"
                        routerLink="/recommendations"
                    />

                    <p-button
                        icon="pi pi-refresh"
                        severity="secondary"
                        [outlined]="true"
                        [loading]="loading"
                        ariaLabel="Actualizar dashboard"
                        (onClick)="loadDashboard()"
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

            @if (loading) {
                <div class="grid grid-cols-12 gap-6">
                    @for (card of skeletonCards; track card) {
                        <div
                            class="col-span-12 sm:col-span-6 xl:col-span-3"
                        >
                            <div class="card mb-0 h-full">
                                <p-skeleton
                                    width="9rem"
                                    height="1rem"
                                    styleClass="mb-4"
                                />

                                <p-skeleton
                                    width="5rem"
                                    height="2.5rem"
                                    styleClass="mb-3"
                                />

                                <p-skeleton
                                    width="7rem"
                                    height="0.8rem"
                                />
                            </div>
                        </div>
                    }
                </div>

                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0">
                            <p-skeleton
                                width="15rem"
                                height="1.5rem"
                                styleClass="mb-6"
                            />

                            <p-skeleton
                                width="100%"
                                height="21rem"
                            />
                        </div>
                    </div>

                    <div class="col-span-12 xl:col-span-4">
                        <div class="card mb-0">
                            <p-skeleton
                                width="11rem"
                                height="1.5rem"
                                styleClass="mb-6"
                            />

                            <p-skeleton
                                width="100%"
                                height="21rem"
                            />
                        </div>
                    </div>
                </div>
            } @else {
                <div class="grid grid-cols-12 gap-6">
                    <div
                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                    >
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Hábitos activos
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ totalHabits }}
                                    </div>

                                    <span class="text-muted-color text-sm">
                                        En seguimiento
                                    </span>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-list-check text-blue-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                    >
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Completados hoy
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ completedHabits }}
                                    </div>

                                    <span class="text-muted-color text-sm">
                                        De {{ totalHabits }} hábitos
                                    </span>
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

                    <div
                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                    >
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between mb-4">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Progreso del día
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ completion | number: '1.0-1' }}%
                                    </div>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-chart-line text-purple-500 text-xl"
                                    ></i>
                                </div>
                            </div>

                            <p-progressbar
                                [value]="completion"
                                [showValue]="false"
                                styleClass="h-2"
                            />
                        </div>
                    </div>

                    <div
                        class="col-span-12 sm:col-span-6 xl:col-span-3"
                    >
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between">
                                <div>
                                    <span
                                        class="block text-muted-color font-medium mb-3"
                                    >
                                        Racha actual
                                    </span>

                                    <div class="text-3xl font-semibold">
                                        {{ currentStreak }}
                                        <span class="text-lg">
                                            días
                                        </span>
                                    </div>

                                    <span class="text-muted-color text-sm">
                                        Mejor racha:
                                        {{ bestStreak }} días
                                    </span>
                                </div>

                                <div
                                    class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-bolt text-orange-500 text-xl"
                                    ></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                            >
                                <div>
                                    <h2 class="text-xl font-semibold m-0">
                                        Progreso de los últimos siete días
                                    </h2>

                                    <p class="text-muted-color mt-2 mb-0">
                                        Evolución diaria del porcentaje de
                                        cumplimiento.
                                    </p>
                                </div>

                                <p-tag
                                    [value]="
                                        weeklyAverage.toFixed(1) +
                                        '% promedio'
                                    "
                                    icon="pi pi-chart-line"
                                    severity="info"
                                />
                            </div>

                            @if (
                                !loading &&
                                showWeeklyChart &&
                                weeklyPoints.length > 0
                            ) {
                                <p-chart
                                    type="line"
                                    [data]="weeklyChartData"
                                    [options]="weeklyChartOptions"
                                    height="350px"
                                />
                            } @else if (
                                !loading &&
                                weeklyPoints.length === 0
                            ) {
                                <div
                                    class="flex flex-col items-center justify-center text-center py-16"
                                >
                                    <i
                                        class="pi pi-chart-line text-primary text-4xl mb-4"
                                    ></i>

                                    <h3 class="text-xl font-semibold m-0">
                                        No existen datos semanales
                                    </h3>

                                    <p class="text-muted-color mt-2 mb-0">
                                        Registra progreso para visualizar tu evolución.
                                    </p>
                                </div>
                            } @else {
                                <div
                                    class="flex flex-col items-center justify-center text-center py-16"
                                >
                                    <i
                                        class="pi pi-chart-line text-primary text-4xl mb-4"
                                    ></i>

                                    <h3 class="text-xl font-semibold m-0">
                                        No existen datos semanales
                                    </h3>

                                    <p class="text-muted-color mt-2 mb-0">
                                        Registra progreso para visualizar tu
                                        evolución.
                                    </p>
                                </div>
                            }
                        </div>
                    </div>

                    <div class="col-span-12 xl:col-span-4">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center justify-between mb-6">
                                <div>
                                    <h2 class="text-xl font-semibold m-0">
                                        Cumplimiento de hoy
                                    </h2>

                                    <span class="text-muted-color text-sm">
                                        Resumen general
                                    </span>
                                </div>

                                <p-tag
                                    [value]="completionStatus"
                                    [severity]="completionSeverity"
                                />
                            </div>

                            <div
                                class="flex items-center justify-center py-5"
                            >
                                <div
                                    class="relative flex items-center justify-center rounded-full"
                                    [style.background]="progressCircleBackground"
                                    style="width: 13rem; height: 13rem"
                                >
                                    <div
                                        class="flex flex-col items-center justify-center rounded-full bg-surface-0 dark:bg-surface-900"
                                        style="width: 10rem; height: 10rem"
                                    >
                                        <span class="text-4xl font-semibold">
                                            {{
                                                completion
                                                    | number: '1.0-0'
                                            }}%
                                        </span>

                                        <span
                                            class="text-muted-color text-sm mt-2"
                                        >
                                            Completado
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mt-5">
                                <div
                                    class="p-4 rounded-xl bg-green-50 dark:bg-green-950/20 text-center"
                                >
                                    <span
                                        class="block text-2xl font-semibold text-green-500"
                                    >
                                        {{ completedHabits }}
                                    </span>

                                    <span class="text-muted-color text-sm">
                                        Completados
                                    </span>
                                </div>

                                <div
                                    class="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-center"
                                >
                                    <span
                                        class="block text-2xl font-semibold text-orange-500"
                                    >
                                        {{ pendingHabits }}
                                    </span>

                                    <span class="text-muted-color text-sm">
                                        Pendientes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0">
                            <div
                                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                            >
                                <div>
                                    <h2 class="text-xl font-semibold m-0">
                                        Hábitos activos
                                    </h2>

                                    <p class="text-muted-color mt-2 mb-0">
                                        Consulta rápidamente tus hábitos en
                                        seguimiento.
                                    </p>
                                </div>

                                <p-button
                                    label="Ver todos"
                                    icon="pi pi-arrow-right"
                                    iconPos="right"
                                    severity="secondary"
                                    [text]="true"
                                    routerLink="/habits"
                                />
                            </div>

                            @if (activeHabits.length === 0) {
                                <div
                                    class="flex flex-col items-center justify-center text-center py-12"
                                >
                                    <div
                                        class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 mb-4"
                                        style="width: 4rem; height: 4rem"
                                    >
                                        <i
                                            class="pi pi-list-check text-primary text-2xl"
                                        ></i>
                                    </div>

                                    <h3 class="text-xl font-semibold m-0">
                                        Aún no tienes hábitos activos
                                    </h3>

                                    <p class="text-muted-color mt-2 mb-5">
                                        Crea tu primer hábito para comenzar el
                                        seguimiento.
                                    </p>

                                    <p-button
                                        label="Crear hábito"
                                        icon="pi pi-plus"
                                        routerLink="/habits/new"
                                    />
                                </div>
                            } @else {
                                <div class="flex flex-col gap-3">
                                    @for (
                                        habit of activeHabits;
                                        track habit.id
                                    ) {
                                        <div
                                            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border border-surface-200 dark:border-surface-700"
                                        >
                                            <div
                                                class="flex items-center gap-4"
                                            >
                                                <div
                                                    class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                                    style="width: 3rem; height: 3rem"
                                                >
                                                    <i
                                                        class="pi text-primary text-lg"
                                                        [ngClass]="habit.icon"
                                                    ></i>
                                                </div>

                                                <div>
                                                    <div class="font-semibold">
                                                        {{ habit.name }}
                                                    </div>

                                                    <span
                                                        class="text-muted-color text-sm"
                                                    >
                                                        Meta:
                                                        {{ habit.goal }}
                                                        {{ habit.unit }}
                                                    </span>
                                                </div>
                                            </div>

                                            <div
                                                class="flex items-center gap-3"
                                            >
                                                <p-tag
                                                    [value]="habit.category"
                                                    severity="secondary"
                                                />

                                                <p-button
                                                    icon="pi pi-arrow-right"
                                                    [rounded]="true"
                                                    [outlined]="true"
                                                    [routerLink]="[
                                                        '/habits',
                                                        habit.id
                                                    ]"
                                                    ariaLabel="Ver detalle del hábito"
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    </div>

                    <div class="col-span-12 xl:col-span-4">
                        <div class="card mb-0 h-full">
                            <div class="flex items-center gap-4 mb-6">
                                <div
                                    class="flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-sparkles text-purple-500 text-xl"
                                    ></i>
                                </div>

                                <div>
                                    <h2 class="text-xl font-semibold m-0">
                                        Recomendación inteligente
                                    </h2>

                                    <span class="text-muted-color text-sm">
                                        Mejora tu constancia
                                    </span>
                                </div>
                            </div>

                            <div
                                class="p-5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/20"
                            >
                                <p
                                    class="text-muted-color leading-7 mt-0 mb-5"
                                >
                                    Analiza tus hábitos recientes y obtén una
                                    recomendación personalizada para mejorar tu
                                    progreso durante los próximos siete días.
                                </p>

                                <p-button
                                    label="Generar recomendación"
                                    icon="pi pi-sparkles"
                                    styleClass="w-full"
                                    routerLink="/recommendations"
                                />
                            </div>

                            <div
                                class="flex items-start gap-3 mt-6 p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                            >
                                <i
                                    class="pi pi-info-circle text-primary mt-1"
                                ></i>

                                <p
                                    class="text-muted-color text-sm leading-6 m-0"
                                >
                                    Para obtener un mejor análisis, registra
                                    diariamente el progreso de tus hábitos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    `
})
export class Dashboard implements OnInit {
    private readonly statisticsService =
        inject(StatisticsService);

    private readonly habitService =
        inject(HabitService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly skeletonCards = [1, 2, 3, 4];

    showWeeklyChart = false;

    loading = true;
    errorMessage = '';

    dashboard: DashboardResponse | null = null;

    weeklyStatistics: WeeklyStatisticsResponse | null =
        null;

    activeHabits: DashboardHabitView[] = [];

    weeklyPoints: WeeklyPointView[] = [];

    weeklyChartData: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            fill: boolean;
            tension: number;
            borderColor: string;
            backgroundColor: string;
            pointBackgroundColor: string;
            pointRadius: number;
            pointHoverRadius: number;
        }[];
    } = {
            labels: [],
            datasets: []
        };

    readonly weeklyChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        animation: false,

        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (
                        context: {
                            raw: unknown;
                        }
                    ) => {
                        const value = Number(
                            context.raw ?? 0
                        );

                        return `${value}% de cumplimiento`;
                    }
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
                    callback: (
                        value: string | number
                    ) => `${value}%`
                }
            }
        }
    };

    ngOnInit(): void {
        this.loadDashboard();
    }

    get completion(): number {
        return this.getNumberProperty(
            this.dashboard,
            [
                'completion',
                'completionPercentage',
                'percentage'
            ]
        );
    }

    get completedHabits(): number {
        return this.getNumberProperty(
            this.dashboard,
            [
                'completedHabits',
                'completed'
            ]
        );
    }

    get totalHabits(): number {
        return this.getNumberProperty(
            this.dashboard,
            [
                'totalHabits',
                'activeHabits',
                'total'
            ]
        );
    }

    get currentStreak(): number {
        return this.getNumberProperty(
            this.dashboard,
            [
                'currentStreak',
                'streak'
            ]
        );
    }

    get bestStreak(): number {
        return this.getNumberProperty(
            this.dashboard,
            [
                'bestStreak',
                'maximumStreak'
            ]
        );
    }

    get pendingHabits(): number {
        return Math.max(
            0,
            this.totalHabits -
            this.completedHabits
        );
    }

    get weeklyAverage(): number {
        if (this.weeklyPoints.length === 0) {
            return 0;
        }

        return (
            this.weeklyPoints.reduce(
                (total, point) =>
                    total + point.percentage,
                0
            ) / this.weeklyPoints.length
        );
    }

    get completionStatus():
        | 'Excelente'
        | 'Buen progreso'
        | 'En progreso'
        | 'Comienza hoy' {
        if (this.completion >= 90) {
            return 'Excelente';
        }

        if (this.completion >= 70) {
            return 'Buen progreso';
        }

        if (this.completion > 0) {
            return 'En progreso';
        }

        return 'Comienza hoy';
    }

    get completionSeverity():
        | 'success'
        | 'info'
        | 'warn'
        | 'secondary' {
        if (this.completion >= 90) {
            return 'success';
        }

        if (this.completion >= 70) {
            return 'info';
        }

        if (this.completion > 0) {
            return 'warn';
        }

        return 'secondary';
    }

    get progressCircleBackground(): string {
        const percentage = Math.min(
            100,
            Math.max(0, this.completion)
        );

        return `conic-gradient(
            var(--primary-color) 0% ${percentage}%,
            var(--surface-200) ${percentage}% 100%
        )`;
    }

    loadDashboard(): void {
        this.loading = true;
        this.showWeeklyChart = false;
        this.errorMessage = '';

        forkJoin({
            dashboard: this.statisticsService
                .getDashboard()
                .pipe(
                    catchError(
                        (error: HttpErrorResponse) => {
                            console.error(
                                'Error al cargar dashboard:',
                                error
                            );

                            return of(null);
                        }
                    )
                ),

            weekly: this.statisticsService
                .getWeeklyStatistics()
                .pipe(
                    catchError(
                        (error: HttpErrorResponse) => {
                            console.error(
                                'Error al cargar estadísticas semanales:',
                                error
                            );

                            return of(null);
                        }
                    )
                ),

            habits: this.habitService
                .getMyHabits()
                .pipe(
                    catchError(
                        (error: HttpErrorResponse) => {
                            console.error(
                                'Error al cargar hábitos:',
                                error
                            );

                            return of([] as HabitResponse[]);
                        }
                    )
                )
        })
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.dashboard =
                        response.dashboard;

                    this.weeklyStatistics =
                        response.weekly;

                    this.activeHabits =
                        response.habits
                            .filter(habit =>
                                this.isHabitActive(habit)
                            )
                            .slice(0, 5)
                            .map(habit =>
                                this.mapHabit(habit)
                            );

                    if (response.weekly) {
                        this.buildWeeklyChart(
                            response.weekly
                        );
                    } else {
                        this.weeklyPoints = [];

                        this.weeklyChartData = {
                            labels: [],
                            datasets: []
                        };
                    }

                    const unavailableSections: string[] = [];

                    if (!response.dashboard) {
                        unavailableSections.push(
                            'resumen general'
                        );
                    }

                    if (!response.weekly) {
                        unavailableSections.push(
                            'estadísticas semanales'
                        );
                    }

                    if (unavailableSections.length > 0) {
                        this.errorMessage =
                            `No fue posible cargar: ${unavailableSections.join(', ')}.`;
                    }

                    window.setTimeout(() => {
                        this.loading = false;

                        this.changeDetectorRef.detectChanges();

                        window.requestAnimationFrame(() => {
                            this.showWeeklyChart =
                                this.weeklyPoints.length > 0;

                            this.changeDetectorRef.detectChanges();
                        });
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    console.error(
                        'Error inesperado del dashboard:',
                        error
                    );

                    this.errorMessage =
                        'No fue posible cargar la información del dashboard.';

                    window.setTimeout(() => {
                        this.loading = false;
                        this.showWeeklyChart = false;

                        this.changeDetectorRef.detectChanges();
                    }, 0);
                }
            });
    }

    private buildWeeklyChart(
        weekly: WeeklyStatisticsResponse
    ): void {
        const record = this.toRecord(weekly);

        const possibleCollections = [
            record['days'],
            record['dailyStatistics'],
            record['weekDays'],
            record['statistics'],
            record['records']
        ];

        const collection =
            possibleCollections.find(
                value => Array.isArray(value)
            );

        if (!Array.isArray(collection)) {
            this.weeklyPoints = [];
            this.weeklyChartData = {
                labels: [],
                datasets: []
            };

            return;
        }

        this.weeklyPoints = collection.map(
            (item, index) => {
                const itemRecord =
                    this.toRecord(item);

                const dayValue =
                    this.getStringFromRecord(
                        itemRecord,
                        [
                            'dayOfWeek',
                            'day',
                            'name',
                            'label',
                            'date'
                        ]
                    );

                const percentage =
                    this.getNumberFromRecord(
                        itemRecord,
                        [
                            'percentage',
                            'completion',
                            'completionPercentage',
                            'rate',
                            'value'
                        ]
                    );

                return {
                    label:
                        this.translateDay(dayValue) ||
                        `Día ${index + 1}`,

                    percentage
                };
            }
        );

        this.weeklyChartData = {
            labels: this.weeklyPoints.map(
                point => point.label
            ),
            datasets: [
                {
                    label: 'Cumplimiento',
                    data: this.weeklyPoints.map(
                        point => point.percentage
                    ),
                    fill: true,
                    tension: 0.4,
                    borderColor: '#10b981',
                    backgroundColor:
                        'rgba(16, 185, 129, 0.15)',
                    pointBackgroundColor:
                        '#10b981',
                    pointRadius: 4,
                    pointHoverRadius: 6
                }
            ]
        };
    }

    private isHabitActive(
        habit: HabitResponse
    ): boolean {
        const record = this.toRecord(habit);

        const activeValue =
            record['active'] ??
            record['isActive'] ??
            record['status'];

        if (typeof activeValue === 'boolean') {
            return activeValue;
        }

        const status = String(
            activeValue ?? ''
        ).toUpperCase();

        return (
            status === 'ACTIVE' ||
            status === 'ACTIVO' ||
            status === 'TRUE'
        );
    }

    private mapHabit(
        habit: HabitResponse
    ): DashboardHabitView {
        const record = this.toRecord(habit);

        const id = this.getNumberFromRecord(
            record,
            ['id', 'habitId']
        );

        const name = this.getStringFromRecord(
            record,
            ['name', 'habitName', 'title']
        );

        const category =
            this.getStringFromRecord(
                record,
                ['category']
            ) || 'SIN CATEGORÍA';

        const goal = this.getNumberFromRecord(
            record,
            ['goal', 'target', 'targetValue']
        );

        const unit =
            this.getStringFromRecord(
                record,
                ['unit', 'measurementUnit']
            ) || 'unidades';

        return {
            id,
            name: name || 'Hábito',
            category,
            goal,
            unit,
            active: this.isHabitActive(habit),
            icon: this.getCategoryIcon(category)
        };
    }

    private getCategoryIcon(
        category: string
    ): string {
        const normalizedCategory = category
            .normalize('NFD')
            .replace(
                /[\u0300-\u036f]/g,
                ''
            )
            .toUpperCase();

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
            icons[normalizedCategory] ??
            'pi-check-circle'
        );
    }

    private translateDay(
        value: string
    ): string {
        const normalizedValue = value
            .trim()
            .toUpperCase();

        const days: Record<string, string> = {
            MONDAY: 'Lun',
            LUNES: 'Lun',

            TUESDAY: 'Mar',
            MARTES: 'Mar',

            WEDNESDAY: 'Mié',
            MIERCOLES: 'Mié',
            MIÉRCOLES: 'Mié',

            THURSDAY: 'Jue',
            JUEVES: 'Jue',

            FRIDAY: 'Vie',
            VIERNES: 'Vie',

            SATURDAY: 'Sáb',
            SABADO: 'Sáb',
            SÁBADO: 'Sáb',

            SUNDAY: 'Dom',
            DOMINGO: 'Dom'
        };

        return (
            days[normalizedValue] ||
            value
        );
    }

    private getNumberProperty(
        source: unknown,
        keys: string[]
    ): number {
        return this.getNumberFromRecord(
            this.toRecord(source),
            keys
        );
    }

    private getNumberFromRecord(
        record: Record<string, unknown>,
        keys: string[]
    ): number {
        for (const key of keys) {
            const value = record[key];

            if (
                typeof value === 'number' &&
                Number.isFinite(value)
            ) {
                return value;
            }

            if (
                typeof value === 'string' &&
                value.trim() !== ''
            ) {
                const parsedValue = Number(value);

                if (Number.isFinite(parsedValue)) {
                    return parsedValue;
                }
            }
        }

        return 0;
    }

    private getStringFromRecord(
        record: Record<string, unknown>,
        keys: string[]
    ): string {
        for (const key of keys) {
            const value = record[key];

            if (
                typeof value === 'string' &&
                value.trim()
            ) {
                return value.trim();
            }
        }

        return '';
    }

    private toRecord(
        value: unknown
    ): Record<string, unknown> {
        if (
            typeof value === 'object' &&
            value !== null
        ) {
            return value as Record<
                string,
                unknown
            >;
        }

        return {};
    }

    private extractErrorMessage(
        error: HttpErrorResponse
    ): string {
        const errorBody = this.toRecord(
            error.error
        );

        const message =
            errorBody['message'];

        return typeof message === 'string'
            ? message
            : 'No fue posible cargar la información del dashboard.';
    }
}
