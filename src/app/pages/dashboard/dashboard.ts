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

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

interface TodayHabit {
    id: number;
    name: string;
    category: string;
    icon: string;
    goal: string;
    progress: number;
    completed: boolean;
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ChartModule,
        ProgressBarModule,
        TagModule
    ],
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                        Bienvenido a HealthyMindIA
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Revisa tu progreso diario y continúa construyendo hábitos saludables.
                    </p>
                </div>

                <div class="flex flex-wrap gap-3">
                    <p-button
                        label="Registrar progreso"
                        icon="pi pi-check-circle"
                        routerLink="/daily-record"
                    />

                    <p-button
                        label="Generar recomendación"
                        icon="pi pi-sparkles"
                        severity="secondary"
                        [outlined]="true"
                        routerLink="/recommendations"
                    />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Hábitos activos
                                </span>

                                <div class="text-surface-900 dark:text-surface-0 font-medium text-3xl">
                                    {{ dashboard.totalHabits }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-list-check text-blue-500 text-xl"></i>
                            </div>
                        </div>

                        <span class="text-primary font-medium">
                            {{ dashboard.totalHabits }} hábitos
                        </span>

                        <span class="text-muted-color ml-2">
                            en seguimiento
                        </span>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Completados hoy
                                </span>

                                <div class="text-surface-900 dark:text-surface-0 font-medium text-3xl">
                                    {{ dashboard.completedHabits }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 rounded-border"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-check text-green-500 text-xl"></i>
                            </div>
                        </div>

                        <span class="text-green-500 font-medium">
                            {{ dashboard.completedHabits }} de {{ dashboard.totalHabits }}
                        </span>

                        <span class="text-muted-color ml-2">
                            completados
                        </span>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Progreso del día
                                </span>

                                <div class="text-surface-900 dark:text-surface-0 font-medium text-3xl">
                                    {{ dashboard.completion }}%
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-chart-line text-orange-500 text-xl"></i>
                            </div>
                        </div>

                        <p-progressbar
                            [value]="dashboard.completion"
                            [showValue]="false"
                            styleClass="h-2"
                        />

                        <span class="block text-muted-color mt-3">
                            Continúa avanzando
                        </span>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Racha actual
                                </span>

                                <div class="text-surface-900 dark:text-surface-0 font-medium text-3xl">
                                    {{ dashboard.currentStreak }} días
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-bolt text-purple-500 text-xl"></i>
                            </div>
                        </div>

                        <span class="text-purple-500 font-medium">
                            Mejor racha: {{ dashboard.bestStreak }} días
                        </span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-4">
                    <div class="card h-full">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Progreso diario
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Cumplimiento de hábitos
                                </span>
                            </div>

                            <i class="pi pi-chart-pie text-primary text-2xl"></i>
                        </div>

                        <div class="flex flex-col items-center justify-center py-4">
                            <div
                                class="relative flex items-center justify-center rounded-full"
                                [style.background]="progressCircle"
                                style="width: 12rem; height: 12rem"
                            >
                                <div
                                    class="absolute bg-surface-0 dark:bg-surface-900 rounded-full flex flex-col items-center justify-center"
                                    style="width: 9rem; height: 9rem"
                                >
                                    <span class="text-4xl font-semibold text-surface-900 dark:text-surface-0">
                                        {{ dashboard.completion }}%
                                    </span>

                                    <span class="text-muted-color mt-1">
                                        completado
                                    </span>
                                </div>
                            </div>

                            <div class="w-full mt-8">
                                <div class="flex justify-between mb-2">
                                    <span class="text-muted-color">
                                        Hábitos realizados
                                    </span>

                                    <span class="font-medium">
                                        {{ dashboard.completedHabits }}/{{ dashboard.totalHabits }}
                                    </span>
                                </div>

                                <p-progressbar
                                    [value]="dashboard.completion"
                                    [showValue]="false"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-8">
                    <div class="card h-full">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Progreso de los últimos siete días
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Porcentaje diario de cumplimiento
                                </span>
                            </div>

                            <p-tag
                                value="Esta semana"
                                icon="pi pi-calendar"
                                severity="info"
                            />
                        </div>

                        <p-chart
                            type="line"
                            [data]="weeklyChartData"
                            [options]="weeklyChartOptions"
                            height="300px"
                        />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 xl:col-span-8">
                    <div class="card">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Hábitos de hoy
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Registra tu avance antes de finalizar el día
                                </span>
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

                        <div class="flex flex-col gap-4">
                            @for (habit of todayHabits; track habit.id) {
                                <div
                                    class="flex flex-col md:flex-row md:items-center gap-4 p-4 border border-surface-200 dark:border-surface-700 rounded-xl"
                                >
                                    <div
                                        class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                        style="width: 3.5rem; height: 3.5rem"
                                    >
                                        <i
                                            class="pi text-primary text-xl"
                                            [ngClass]="habit.icon"
                                        ></i>
                                    </div>

                                    <div class="flex-1 min-w-0">
                                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                            <div>
                                                <div class="font-semibold text-lg text-surface-900 dark:text-surface-0">
                                                    {{ habit.name }}
                                                </div>

                                                <div class="text-muted-color text-sm mt-1">
                                                    {{ habit.category }} · Meta: {{ habit.goal }}
                                                </div>
                                            </div>

                                            <p-tag
                                                [value]="habit.completed ? 'Completado' : 'Pendiente'"
                                                [severity]="habit.completed ? 'success' : 'warn'"
                                            />
                                        </div>

                                        <div class="flex items-center gap-3 mt-4">
                                            <p-progressbar
                                                class="flex-1"
                                                [value]="habit.progress"
                                                [showValue]="false"
                                                styleClass="h-2"
                                            />

                                            <span class="text-sm font-medium min-w-12 text-right">
                                                {{ habit.progress }}%
                                            </span>
                                        </div>
                                    </div>

                                    <p-button
                                        [label]="habit.completed ? 'Ver registro' : 'Registrar'"
                                        [icon]="habit.completed ? 'pi pi-eye' : 'pi pi-plus'"
                                        [severity]="habit.completed ? 'secondary' : 'primary'"
                                        [outlined]="habit.completed"
                                        routerLink="/daily-record"
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div class="col-span-12 xl:col-span-4">
                    <div class="card h-full">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Recomendación IA
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Sugerencia personalizada
                                </span>
                            </div>

                            <div
                                class="flex items-center justify-center bg-primary-100 dark:bg-primary-400/10 rounded-xl"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-sparkles text-primary text-xl"></i>
                            </div>
                        </div>

                        <div
                            class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                        >
                            <div class="font-semibold text-lg mb-3">
                                Mantén tu racha de hidratación
                            </div>

                            <p class="text-muted-color leading-7 m-0">
                                Has cumplido tu meta de agua durante cuatro días consecutivos.
                                Coloca una botella visible cerca de tu espacio de trabajo para
                                mantener el hábito durante toda la semana.
                            </p>
                        </div>

                        <div class="flex flex-col gap-3 mt-6">
                            <p-button
                                label="Generar nueva recomendación"
                                icon="pi pi-sparkles"
                                styleClass="w-full"
                                routerLink="/recommendations"
                            />

                            <p-button
                                label="Ver historial"
                                icon="pi pi-history"
                                severity="secondary"
                                [outlined]="true"
                                styleClass="w-full"
                                routerLink="/recommendations"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Dashboard {
    dashboard = {
        completion: 60,
        completedHabits: 3,
        totalHabits: 5,
        currentStreak: 4,
        bestStreak: 12
    };

    todayHabits: TodayHabit[] = [
        {
            id: 1,
            name: 'Beber agua',
            category: 'Hidratación',
            icon: 'pi-tint',
            goal: '8 vasos',
            progress: 100,
            completed: true
        },
        {
            id: 2,
            name: 'Leer',
            category: 'Lectura',
            icon: 'pi-book',
            goal: '20 minutos',
            progress: 75,
            completed: false
        },
        {
            id: 3,
            name: 'Ejercicio',
            category: 'Ejercicio',
            icon: 'pi-heart',
            goal: '30 minutos',
            progress: 100,
            completed: true
        },
        {
            id: 4,
            name: 'Meditación',
            category: 'Bienestar',
            icon: 'pi-sun',
            goal: '10 minutos',
            progress: 40,
            completed: false
        }
    ];

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
                data: [40, 60, 80, 60, 100, 80, 60],
                fill: true,
                tension: 0.4,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#10b981'
            }
        ]
    };

    weeklyChartOptions = {
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

    get progressCircle(): string {
        return `conic-gradient(
            var(--primary-color) 0% ${this.dashboard.completion}%,
            var(--surface-200) ${this.dashboard.completion}% 100%
        )`;
    }
}
