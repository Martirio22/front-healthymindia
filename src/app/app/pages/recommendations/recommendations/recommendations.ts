import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

interface RecommendationMock {
    id: number;
    title: string;
    analysis: string;
    recommendation: string;
    modelName: string;
    createdAt: string;
    icon: string;
}

@Component({
    selector: 'app-recommendations',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ProgressSpinnerModule,
        TagModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="flex flex-col gap-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                        Recomendaciones con IA
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Obtén sugerencias personalizadas a partir del progreso de tus hábitos.
                    </p>
                </div>

                <p-button
                    label="Generar recomendación"
                    icon="pi pi-sparkles"
                    [loading]="generating"
                    (onClick)="generateRecommendation()"
                />
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 xl:col-span-8">
                    <div class="card mb-0 h-full">
                        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                            <div class="flex items-start gap-4">
                                <div
                                    class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i class="pi pi-sparkles text-primary text-2xl"></i>
                                </div>

                                <div>
                                    <h2 class="text-2xl font-semibold mt-0 mb-2">
                                        Análisis inteligente de hábitos
                                    </h2>

                                    <p class="text-muted-color m-0">
                                        Resumen basado en tus hábitos y registros recientes.
                                    </p>
                                </div>
                            </div>

                            <p-tag
                                value="Recomendación más reciente"
                                icon="pi pi-star"
                                severity="success"
                            />
                        </div>

                        @if (generating) {
                            <div class="flex flex-col items-center justify-center text-center py-16">
                                <p-progressspinner
                                    strokeWidth="4"
                                    animationDuration=".8s"
                                    styleClass="w-16 h-16"
                                />

                                <h3 class="text-xl font-semibold mt-6 mb-2">
                                    Analizando tus hábitos
                                </h3>

                                <p class="text-muted-color m-0">
                                    Estamos preparando una recomendación personalizada.
                                </p>
                            </div>
                        } @else {
                            <div class="flex flex-col gap-6">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800">
                                        <span class="block text-muted-color text-sm mb-2">
                                            Fecha de generación
                                        </span>

                                        <span class="font-semibold text-surface-900 dark:text-surface-0">
                                            {{ latestRecommendation.createdAt }}
                                        </span>
                                    </div>

                                    <div class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800">
                                        <span class="block text-muted-color text-sm mb-2">
                                            Modelo utilizado
                                        </span>

                                        <span class="font-semibold text-surface-900 dark:text-surface-0">
                                            {{ latestRecommendation.modelName }}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    class="p-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20"
                                >
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 shrink-0"
                                            style="width: 2.75rem; height: 2.75rem"
                                        >
                                            <i class="pi pi-chart-line text-blue-500"></i>
                                        </div>

                                        <div>
                                            <h3 class="text-lg font-semibold mt-0 mb-2">
                                                Hallazgo principal
                                            </h3>

                                            <p class="text-muted-color leading-7 m-0">
                                                {{ latestRecommendation.analysis }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="p-6 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20"
                                >
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 shrink-0"
                                            style="width: 2.75rem; height: 2.75rem"
                                        >
                                            <i class="pi pi-exclamation-circle text-orange-500"></i>
                                        </div>

                                        <div>
                                            <h3 class="text-lg font-semibold mt-0 mb-2">
                                                Hábito que requiere mayor atención
                                            </h3>

                                            <p class="text-muted-color leading-7 m-0">
                                                El ejercicio cardiovascular presenta menor constancia que los demás
                                                hábitos registrados durante los últimos siete días.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class="p-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20"
                                >
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 shrink-0"
                                            style="width: 2.75rem; height: 2.75rem"
                                        >
                                            <i class="pi pi-lightbulb text-green-500"></i>
                                        </div>

                                        <div>
                                            <h3 class="text-lg font-semibold mt-0 mb-2">
                                                Recomendación para los próximos siete días
                                            </h3>

                                            <p class="text-muted-color leading-7 m-0 whitespace-pre-line">
                                                {{ latestRecommendation.recommendation }}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col sm:flex-row sm:justify-end gap-3">
                                    <p-button
                                        label="Ver detalle"
                                        icon="pi pi-eye"
                                        severity="secondary"
                                        [outlined]="true"
                                        [routerLink]="[
                                            '/recommendations',
                                            latestRecommendation.id
                                        ]"
                                    />

                                    <p-button
                                        label="Generar otra recomendación"
                                        icon="pi pi-sparkles"
                                        (onClick)="generateRecommendation()"
                                    />
                                </div>
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
                                <i class="pi pi-chart-bar text-purple-500 text-xl"></i>
                            </div>

                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Datos analizados
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Resumen del contexto utilizado
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4">
                            <div class="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-list-check text-primary"></i>
                                    <span class="text-muted-color">
                                        Hábitos analizados
                                    </span>
                                </div>

                                <span class="text-xl font-semibold">
                                    5
                                </span>
                            </div>

                            <div class="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-calendar text-primary"></i>
                                    <span class="text-muted-color">
                                        Registros analizados
                                    </span>
                                </div>

                                <span class="text-xl font-semibold">
                                    32
                                </span>
                            </div>

                            <div class="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-percentage text-primary"></i>
                                    <span class="text-muted-color">
                                        Cumplimiento promedio
                                    </span>
                                </div>

                                <span class="text-xl font-semibold">
                                    72%
                                </span>
                            </div>

                            <div class="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <div class="flex items-center gap-3">
                                    <i class="pi pi-bolt text-primary"></i>
                                    <span class="text-muted-color">
                                        Racha actual
                                    </span>
                                </div>

                                <span class="text-xl font-semibold">
                                    4 días
                                </span>
                            </div>
                        </div>

                        <div
                            class="mt-6 p-5 rounded-xl border border-surface-200 dark:border-surface-700"
                        >
                            <div class="flex items-start gap-3">
                                <i class="pi pi-info-circle text-primary mt-1"></i>

                                <p class="text-muted-color leading-6 m-0">
                                    Las recomendaciones se generan únicamente con los hábitos y
                                    registros disponibles en tu cuenta.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card mb-0">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div>
                        <h2 class="text-2xl font-semibold m-0">
                            Historial de recomendaciones
                        </h2>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta los análisis generados anteriormente.
                        </p>
                    </div>

                    <p-tag
                        [value]="recommendations.length + ' recomendaciones'"
                        icon="pi pi-history"
                        severity="info"
                    />
                </div>

                <div class="grid grid-cols-12 gap-6">
                    @for (
                        recommendation of recommendations;
                        track recommendation.id
                    ) {
                        <div class="col-span-12 md:col-span-6 xl:col-span-4">
                            <div class="h-full p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col">
                                <div class="flex items-start justify-between gap-4 mb-5">
                                    <div
                                        class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                        style="width: 3.25rem; height: 3.25rem"
                                    >
                                        <i
                                            class="pi text-primary text-xl"
                                            [ngClass]="recommendation.icon"
                                        ></i>
                                    </div>

                                    <p-tag
                                        [value]="recommendation.modelName"
                                        severity="secondary"
                                    />
                                </div>

                                <h3 class="text-xl font-semibold mt-0 mb-2">
                                    {{ recommendation.title }}
                                </h3>

                                <div class="flex items-center gap-2 text-muted-color text-sm mb-5">
                                    <i class="pi pi-calendar"></i>
                                    <span>{{ recommendation.createdAt }}</span>
                                </div>

                                <p class="text-muted-color leading-7 mt-0 mb-6 line-clamp-4">
                                    {{ recommendation.analysis }}
                                </p>

                                <div class="mt-auto">
                                    <p-button
                                        label="Ver detalle"
                                        icon="pi pi-arrow-right"
                                        iconPos="right"
                                        severity="secondary"
                                        [outlined]="true"
                                        styleClass="w-full"
                                        [routerLink]="[
                                            '/recommendations',
                                            recommendation.id
                                        ]"
                                    />
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    `
})
export class Recommendations {
    generating = false;

    latestRecommendation: RecommendationMock = {
        id: 4,
        title: 'Análisis inteligente de hábitos',
        analysis:
            'Mantienes una buena constancia en hidratación, lectura y meditación. Tu cumplimiento general ha mejorado durante los últimos siete días.',
        recommendation:
            '1. Programa tres sesiones cortas de ejercicio durante la semana.\n2. Mantén visible tu botella de agua durante la jornada.\n3. Registra el progreso inmediatamente después de cada actividad.',
        modelName: 'llama-3.3-70b-versatile',
        createdAt: '27 de julio de 2026, 15:30',
        icon: 'pi-sparkles'
    };

    recommendations: RecommendationMock[] = [
        this.latestRecommendation,
        {
            id: 3,
            title: 'Mejora de constancia semanal',
            analysis:
                'La lectura y la hidratación muestran una tendencia estable, mientras que el ejercicio presenta registros intermitentes.',
            recommendation:
                'Reduce temporalmente la meta de ejercicio y aumenta su duración de forma progresiva.',
            modelName: 'llama-3.3-70b-versatile',
            createdAt: '24 de julio de 2026, 09:15',
            icon: 'pi-chart-line'
        },
        {
            id: 2,
            title: 'Organización de hábitos diarios',
            analysis:
                'Los hábitos registrados durante la mañana presentan mayor cumplimiento que los realizados al final del día.',
            recommendation:
                'Reserva un horario fijo para las actividades que normalmente postergas.',
            modelName: 'llama-3.3-70b-versatile',
            createdAt: '20 de julio de 2026, 18:40',
            icon: 'pi-calendar'
        },
        {
            id: 1,
            title: 'Primer análisis de progreso',
            analysis:
                'Tus primeros registros muestran una buena respuesta a metas pequeñas y medibles.',
            recommendation:
                'Mantén las metas actuales durante siete días antes de aumentar su dificultad.',
            modelName: 'llama-3.3-70b-versatile',
            createdAt: '15 de julio de 2026, 11:20',
            icon: 'pi-lightbulb'
        }
    ];

    constructor(
        private readonly messageService: MessageService
    ) {}

    generateRecommendation(): void {
        if (this.generating) {
            return;
        }

        this.generating = true;

        window.setTimeout(() => {
            const newRecommendation: RecommendationMock = {
                id:
                    Math.max(
                        ...this.recommendations.map(
                            recommendation => recommendation.id
                        )
                    ) + 1,
                title: 'Nueva recomendación personalizada',
                analysis:
                    'Tu progreso mantiene una tendencia positiva. La hidratación y la lectura son actualmente tus hábitos más constantes.',
                recommendation:
                    '1. Mantén las metas que ya cumples con frecuencia.\n2. Divide la actividad física en sesiones de quince minutos.\n3. Registra el avance diariamente para conservar la racha.',
                modelName: 'llama-3.3-70b-versatile',
                createdAt: new Intl.DateTimeFormat('es-EC', {
                    dateStyle: 'long',
                    timeStyle: 'short'
                }).format(new Date()),
                icon: 'pi-sparkles'
            };

            this.latestRecommendation = newRecommendation;
            this.recommendations = [
                newRecommendation,
                ...this.recommendations
            ];

            this.generating = false;

            this.messageService.add({
                severity: 'success',
                summary: 'Recomendación generada',
                detail:
                    'El análisis inteligente fue generado correctamente.'
            });
        }, 1800);
    }
}
