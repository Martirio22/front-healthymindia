import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-recommendation-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        TagModule
    ],
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div class="flex items-center gap-4">
                    <p-button
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        [text]="true"
                        [rounded]="true"
                        routerLink="/recommendations"
                    />

                    <div>
                        <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                            Detalle de recomendación
                        </h1>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta el análisis completo generado por la inteligencia artificial.
                        </p>
                    </div>
                </div>

                <p-tag
                    value="Análisis completado"
                    icon="pi pi-check-circle"
                    severity="success"
                />
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 xl:col-span-8">
                    <div class="card mb-0">
                        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8">
                            <div class="flex items-start gap-4">
                                <div
                                    class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                    style="width: 4rem; height: 4rem"
                                >
                                    <i class="pi pi-sparkles text-primary text-2xl"></i>
                                </div>

                                <div>
                                    <h2 class="text-2xl font-semibold mt-0 mb-2">
                                        {{ recommendation.title }}
                                    </h2>

                                    <div class="flex flex-wrap items-center gap-4 text-muted-color">
                                        <span class="flex items-center gap-2">
                                            <i class="pi pi-calendar"></i>
                                            {{ recommendation.createdAt }}
                                        </span>

                                        <span class="flex items-center gap-2">
                                            <i class="pi pi-microchip-ai"></i>
                                            {{ recommendation.modelName }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p-tag
                                [value]="'ID #' + recommendationId"
                                severity="secondary"
                            />
                        </div>

                        <div class="flex flex-col gap-6">
                            <section
                                class="p-6 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20"
                            >
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 shrink-0"
                                        style="width: 3rem; height: 3rem"
                                    >
                                        <i class="pi pi-chart-line text-blue-500 text-xl"></i>
                                    </div>

                                    <div>
                                        <h3 class="text-xl font-semibold mt-0 mb-3">
                                            Hallazgo principal
                                        </h3>

                                        <p class="text-muted-color leading-7 m-0">
                                            {{ recommendation.analysis }}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section
                                class="p-6 rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/20"
                            >
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 shrink-0"
                                        style="width: 3rem; height: 3rem"
                                    >
                                        <i class="pi pi-exclamation-triangle text-orange-500 text-xl"></i>
                                    </div>

                                    <div>
                                        <h3 class="text-xl font-semibold mt-0 mb-3">
                                            Hábito con menor rendimiento
                                        </h3>

                                        <p class="text-muted-color leading-7 m-0">
                                            El hábito de ejercicio cardiovascular tiene un cumplimiento
                                            aproximado del 42%. La principal dificultad identificada es la
                                            falta de un horario constante para realizar la actividad.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <section
                                class="p-6 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/20"
                            >
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 shrink-0"
                                        style="width: 3rem; height: 3rem"
                                    >
                                        <i class="pi pi-lightbulb text-green-500 text-xl"></i>
                                    </div>

                                    <div class="w-full">
                                        <h3 class="text-xl font-semibold mt-0 mb-4">
                                            Plan recomendado para siete días
                                        </h3>

                                        <div class="flex flex-col gap-4">
                                            @for (
                                                step of recommendation.steps;
                                                track step.number
                                            ) {
                                                <div class="flex items-start gap-4">
                                                    <div
                                                        class="flex items-center justify-center rounded-full bg-green-500 text-white font-semibold shrink-0"
                                                        style="width: 2rem; height: 2rem"
                                                    >
                                                        {{ step.number }}
                                                    </div>

                                                    <div>
                                                        <h4 class="font-semibold mt-1 mb-1">
                                                            {{ step.title }}
                                                        </h4>

                                                        <p class="text-muted-color leading-6 m-0">
                                                            {{ step.description }}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div class="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8">
                            <p-button
                                label="Volver al historial"
                                icon="pi pi-history"
                                severity="secondary"
                                [outlined]="true"
                                routerLink="/recommendations"
                            />

                            <p-button
                                label="Registrar progreso"
                                icon="pi pi-check-circle"
                                routerLink="/daily-record"
                            />
                        </div>
                    </div>
                </div>

                <div class="col-span-12 xl:col-span-4">
                    <div class="card mb-0">
                        <h2 class="text-xl font-semibold mt-0 mb-6">
                            Resumen analizado
                        </h2>

                        <div class="flex flex-col gap-4">
                            <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Hábitos incluidos
                                </span>

                                <span class="text-2xl font-semibold">
                                    5
                                </span>
                            </div>

                            <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Registros analizados
                                </span>

                                <span class="text-2xl font-semibold">
                                    32
                                </span>
                            </div>

                            <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Cumplimiento promedio
                                </span>

                                <span class="text-2xl font-semibold">
                                    72%
                                </span>
                            </div>

                            <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                <span class="block text-muted-color text-sm mb-2">
                                    Mejor hábito
                                </span>

                                <span class="text-lg font-semibold">
                                    Beber agua
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card mb-0">
                        <div class="flex items-start gap-3">
                            <i class="pi pi-shield text-primary text-xl mt-1"></i>

                            <div>
                                <h3 class="text-lg font-semibold mt-0 mb-2">
                                    Recomendación informativa
                                </h3>

                                <p class="text-muted-color leading-6 m-0">
                                    Este contenido se genera con base en los registros disponibles
                                    y no reemplaza asesoramiento médico o profesional.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class RecommendationDetail {
    recommendationId = 1;

    recommendation = {
        title: 'Análisis inteligente de hábitos',
        analysis:
            'Mantienes una buena constancia en hidratación, lectura y meditación. Durante los últimos siete días alcanzaste un cumplimiento general del 72%, mostrando una mejora frente al período anterior.',
        modelName: 'llama-3.3-70b-versatile',
        createdAt: '27 de julio de 2026, 15:30',
        steps: [
            {
                number: 1,
                title: 'Agenda tres sesiones breves',
                description:
                    'Reserva lunes, miércoles y viernes para realizar quince minutos de ejercicio cardiovascular.'
            },
            {
                number: 2,
                title: 'Prepara el entorno',
                description:
                    'Deja lista la ropa deportiva antes del horario planificado para reducir obstáculos.'
            },
            {
                number: 3,
                title: 'Registra el avance inmediatamente',
                description:
                    'Guarda el progreso al finalizar cada sesión para mantener actualizado tu historial.'
            },
            {
                number: 4,
                title: 'Evalúa al séptimo día',
                description:
                    'Revisa el porcentaje de cumplimiento y aumenta la meta solo cuando mantengas constancia.'
            }
        ]
    };

    constructor(
        private readonly route: ActivatedRoute
    ) {
        const id = Number(
            this.route.snapshot.paramMap.get('id')
        );

        if (!Number.isNaN(id) && id > 0) {
            this.recommendationId = id;
        }
    }
}
