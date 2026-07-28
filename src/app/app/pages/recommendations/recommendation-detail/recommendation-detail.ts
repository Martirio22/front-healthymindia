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
import {
    ActivatedRoute,
    Router,
    RouterModule
} from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';

import { AiRecommendationResponse } from '@/app/core/statistics/models/ai-recommendation-response.model';
import { StatisticsService } from '@/app/core/statistics/services/statistics.service';

@Component({
    selector: 'app-recommendation-detail',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        MessageModule,
        SkeletonModule,
        TagModule
    ],
    template: `
        <div class="flex flex-col gap-6">
            <div
                class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
                <div class="flex items-center gap-4">
                    <p-button
                        icon="pi pi-arrow-left"
                        severity="secondary"
                        [text]="true"
                        [rounded]="true"
                        routerLink="/recommendations"
                    />

                    <div>
                        <h1
                            class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                        >
                            Detalle de recomendación
                        </h1>

                        <p class="text-muted-color mt-2 mb-0">
                            Consulta el análisis completo generado por la
                            inteligencia artificial.
                        </p>
                    </div>
                </div>

                @if (recommendation) {
                    <p-tag
                        value="Análisis completado"
                        icon="pi pi-check-circle"
                        severity="success"
                    />
                }
            </div>

            @if (errorMessage) {
                <p-message
                    severity="error"
                    [text]="errorMessage"
                    styleClass="w-full"
                />

                <div class="card mb-0">
                    <div
                        class="flex flex-col items-center justify-center text-center py-12"
                    >
                        <i
                            class="pi pi-exclamation-circle text-red-500 text-4xl mb-4"
                        ></i>

                        <h2 class="text-2xl font-semibold m-0">
                            No fue posible mostrar la recomendación
                        </h2>

                        <p class="text-muted-color mt-3 mb-6">
                            Regresa al historial e intenta seleccionar otro
                            análisis.
                        </p>

                        <p-button
                            label="Volver al historial"
                            icon="pi pi-arrow-left"
                            routerLink="/recommendations"
                        />
                    </div>
                </div>
            } @else if (loading) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0">
                            <div class="flex items-center gap-4 mb-8">
                                <p-skeleton
                                    shape="circle"
                                    size="4rem"
                                />

                                <div class="flex-1">
                                    <p-skeleton
                                        width="60%"
                                        height="1.7rem"
                                        styleClass="mb-3"
                                    />

                                    <p-skeleton
                                        width="45%"
                                        height="0.9rem"
                                    />
                                </div>
                            </div>

                            @for (item of skeletonSections; track item) {
                                <p-skeleton
                                    width="100%"
                                    height="10rem"
                                    styleClass="mb-6"
                                />
                            }
                        </div>
                    </div>

                    <div class="col-span-12 xl:col-span-4">
                        <div class="card mb-0">
                            <p-skeleton
                                width="65%"
                                height="1.5rem"
                                styleClass="mb-6"
                            />

                            @for (item of skeletonSidebar; track item) {
                                <p-skeleton
                                    width="100%"
                                    height="4rem"
                                    styleClass="mb-4"
                                />
                            }
                        </div>
                    </div>
                </div>
            } @else if (recommendation) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0">
                            <div
                                class="flex flex-col md:flex-row md:items-start md:justify-between gap-5 mb-8"
                            >
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                        style="width: 4rem; height: 4rem"
                                    >
                                        <i
                                            class="pi pi-sparkles text-primary text-2xl"
                                        ></i>
                                    </div>

                                    <div>
                                        <h2
                                            class="text-2xl font-semibold mt-0 mb-2"
                                        >
                                            {{ recommendation.title }}
                                        </h2>

                                        <div
                                            class="flex flex-wrap items-center gap-4 text-muted-color"
                                        >
                                            <span
                                                class="flex items-center gap-2"
                                            >
                                                <i
                                                    class="pi pi-calendar"
                                                ></i>

                                                {{
                                                    formatDate(
                                                        recommendation.createdAt
                                                    )
                                                }}
                                            </span>

                                            <span
                                                class="flex items-center gap-2"
                                            >
                                                <i
                                                    class="pi pi-microchip"
                                                ></i>

                                                {{
                                                    recommendation.modelName
                                                }}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <p-tag
                                    [value]="
                                        'ID #' + recommendation.id
                                    "
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
                                            <i
                                                class="pi pi-chart-line text-blue-500 text-xl"
                                            ></i>
                                        </div>

                                        <div>
                                            <h3
                                                class="text-xl font-semibold mt-0 mb-3"
                                            >
                                                Análisis de hábitos
                                            </h3>

                                            <p
                                                class="text-muted-color leading-7 m-0 whitespace-pre-line"
                                            >
                                                {{
                                                    recommendation.analysis
                                                }}
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
                                            <i
                                                class="pi pi-lightbulb text-green-500 text-xl"
                                            ></i>
                                        </div>

                                        <div class="w-full">
                                            <h3
                                                class="text-xl font-semibold mt-0 mb-4"
                                            >
                                                Recomendación personalizada
                                            </h3>

                                            <p
                                                class="text-muted-color leading-7 m-0 whitespace-pre-line"
                                            >
                                                {{
                                                    recommendation.recommendation
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section
                                    class="p-6 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
                                >
                                    <div class="flex items-start gap-4">
                                        <div
                                            class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                            style="width: 3rem; height: 3rem"
                                        >
                                            <i
                                                class="pi pi-info-circle text-primary text-xl"
                                            ></i>
                                        </div>

                                        <div>
                                            <h3
                                                class="text-lg font-semibold mt-0 mb-2"
                                            >
                                                ¿Qué hacer después?
                                            </h3>

                                            <p
                                                class="text-muted-color leading-7 m-0"
                                            >
                                                Aplica las recomendaciones
                                                durante los próximos días y
                                                registra el avance de cada hábito.
                                                Luego podrás generar un nuevo
                                                análisis con información
                                                actualizada.
                                            </p>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div
                                class="flex flex-col sm:flex-row sm:justify-end gap-3 mt-8"
                            >
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
                            <h2
                                class="text-xl font-semibold mt-0 mb-6"
                            >
                                Información del análisis
                            </h2>

                            <div class="flex flex-col gap-4">
                                <div
                                    class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Identificador
                                    </span>

                                    <span class="text-xl font-semibold">
                                        #{{ recommendation.id }}
                                    </span>
                                </div>

                                <div
                                    class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Modelo utilizado
                                    </span>

                                    <span class="font-semibold">
                                        {{ recommendation.modelName }}
                                    </span>
                                </div>

                                <div
                                    class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Fecha de generación
                                    </span>

                                    <span class="font-semibold">
                                        {{
                                            formatDate(
                                                recommendation.createdAt
                                            )
                                        }}
                                    </span>
                                </div>

                                <div
                                    class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Estado
                                    </span>

                                    <p-tag
                                        value="Completado"
                                        severity="success"
                                        icon="pi pi-check-circle"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="card mb-0">
                            <div class="flex items-start gap-3">
                                <i
                                    class="pi pi-shield text-primary text-xl mt-1"
                                ></i>

                                <div>
                                    <h3
                                        class="text-lg font-semibold mt-0 mb-2"
                                    >
                                        Recomendación informativa
                                    </h3>

                                    <p
                                        class="text-muted-color leading-6 m-0"
                                    >
                                        Este contenido se genera con base en
                                        los registros disponibles y no reemplaza
                                        asesoramiento médico o profesional.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    `
})
export class RecommendationDetail implements OnInit {
    private readonly route =
        inject(ActivatedRoute);

    private readonly router =
        inject(Router);

    private readonly statisticsService =
        inject(StatisticsService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly skeletonSections = [1, 2];

    readonly skeletonSidebar = [1, 2, 3, 4];

    recommendationId: number | null = null;

    recommendation:
        AiRecommendationResponse | null = null;

    loading = false;

    errorMessage = '';

    constructor() {
        const idValue =
            this.route.snapshot.paramMap.get('id');

        const parsedId = Number(idValue);

        if (
            idValue &&
            Number.isInteger(parsedId) &&
            parsedId > 0
        ) {
            this.recommendationId = parsedId;
            this.loading = true;
        }
    }

    ngOnInit(): void {
        if (!this.recommendationId) {
            this.errorMessage =
                'El identificador de la recomendación no es válido.';

            return;
        }

        this.loadRecommendation(
            this.recommendationId
        );
    }

    formatDate(value: string): string {
        const date = new Date(value);

        if (
            Number.isNaN(date.getTime())
        ) {
            return value;
        }

        return new Intl.DateTimeFormat(
            'es-EC',
            {
                dateStyle: 'long',
                timeStyle: 'short'
            }
        ).format(date);
    }

    private loadRecommendation(
        id: number
    ): void {
        this.statisticsService
            .getRecommendationById(id)
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.recommendation = response;

                    window.setTimeout(() => {
                        this.loading = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.errorMessage =
                        this.getErrorMessage(error);

                    this.recommendation = null;

                    window.setTimeout(() => {
                        this.loading = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
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
            return 'No tienes permisos para consultar esta recomendación.';
        }

        if (error.status === 404) {
            return 'No se encontró la recomendación solicitada.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'No fue posible cargar la recomendación.';
    }
}
