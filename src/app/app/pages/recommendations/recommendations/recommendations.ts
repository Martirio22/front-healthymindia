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
    Router,
    RouterModule
} from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

import { AiRecommendationResponse } from '@/app/core/statistics/models/ai-recommendation-response.model';
import { StatisticsService } from '@/app/core/statistics/services/statistics.service';

@Component({
    selector: 'app-recommendations',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        MessageModule,
        ProgressSpinnerModule,
        SkeletonModule,
        TagModule,
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
                        Recomendaciones con IA
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Obtén sugerencias personalizadas a partir del progreso
                        registrado en tus hábitos.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <p-button
                        label="Actualizar historial"
                        icon="pi pi-refresh"
                        severity="secondary"
                        [outlined]="true"
                        [loading]="refreshingHistory"
                        [disabled]="
                            loadingHistory ||
                            generatingRecommendation
                        "
                        (onClick)="loadHistory(true)"
                    />

                    <p-button
                        label="Generar recomendación"
                        icon="pi pi-sparkles"
                        [loading]="generatingRecommendation"
                        [disabled]="loadingHistory"
                        (onClick)="generateRecommendation()"
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

            @if (loadingHistory) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0">
                            <div class="flex items-center gap-4 mb-7">
                                <p-skeleton
                                    shape="circle"
                                    size="3.5rem"
                                />

                                <div class="flex-1">
                                    <p-skeleton
                                        width="45%"
                                        height="1.5rem"
                                        styleClass="mb-3"
                                    />

                                    <p-skeleton
                                        width="65%"
                                        height="0.9rem"
                                    />
                                </div>
                            </div>

                            <p-skeleton
                                width="100%"
                                height="18rem"
                            />
                        </div>
                    </div>

                    <div class="col-span-12 xl:col-span-4">
                        <div class="card mb-0">
                            <p-skeleton
                                width="60%"
                                height="1.5rem"
                                styleClass="mb-6"
                            />

                            @for (item of skeletonItems; track item) {
                                <p-skeleton
                                    width="100%"
                                    height="4.5rem"
                                    styleClass="mb-4"
                                />
                            }
                        </div>
                    </div>
                </div>
            } @else {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0 h-full">
                            <div
                                class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6"
                            >
                                <div class="flex items-start gap-4">
                                    <div
                                        class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                        style="width: 3.5rem; height: 3.5rem"
                                    >
                                        <i
                                            class="pi pi-sparkles text-primary text-2xl"
                                        ></i>
                                    </div>

                                    <div>
                                        <h2
                                            class="text-2xl font-semibold mt-0 mb-2"
                                        >
                                            Análisis inteligente de hábitos
                                        </h2>

                                        <p class="text-muted-color m-0">
                                            Recomendación generada a partir de
                                            tus registros disponibles.
                                        </p>
                                    </div>
                                </div>

                                @if (latestRecommendation) {
                                    <p-tag
                                        value="Más reciente"
                                        icon="pi pi-star"
                                        severity="success"
                                    />
                                }
                            </div>

                            @if (generatingRecommendation) {
                                <div
                                    class="flex flex-col items-center justify-center text-center py-16"
                                >
                                    <p-progressspinner
                                        strokeWidth="4"
                                        animationDuration=".8s"
                                        styleClass="w-16 h-16"
                                    />

                                    <h3
                                        class="text-xl font-semibold mt-6 mb-2"
                                    >
                                        Analizando tus hábitos
                                    </h3>

                                    <p class="text-muted-color m-0 max-w-xl">
                                        El servicio está revisando tus hábitos,
                                        registros y porcentajes para generar
                                        una recomendación personalizada.
                                    </p>
                                </div>
                            } @else if (latestRecommendation) {
                                <div class="flex flex-col gap-6">
                                    <div
                                        class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    >
                                        <div
                                            class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800"
                                        >
                                            <span
                                                class="block text-muted-color text-sm mb-2"
                                            >
                                                Fecha de generación
                                            </span>

                                            <span
                                                class="font-semibold text-surface-900 dark:text-surface-0"
                                            >
                                                {{
                                                    formatDate(
                                                        latestRecommendation.createdAt
                                                    )
                                                }}
                                            </span>
                                        </div>

                                        <div
                                            class="p-5 rounded-xl bg-surface-50 dark:bg-surface-800"
                                        >
                                            <span
                                                class="block text-muted-color text-sm mb-2"
                                            >
                                                Modelo utilizado
                                            </span>

                                            <span
                                                class="font-semibold text-surface-900 dark:text-surface-0"
                                            >
                                                {{
                                                    latestRecommendation.modelName
                                                }}
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
                                                <i
                                                    class="pi pi-chart-line text-blue-500"
                                                ></i>
                                            </div>

                                            <div>
                                                <h3
                                                    class="text-lg font-semibold mt-0 mb-2"
                                                >
                                                    {{
                                                        latestRecommendation.title
                                                    }}
                                                </h3>

                                                <p
                                                    class="text-muted-color leading-7 m-0 whitespace-pre-line"
                                                >
                                                    {{
                                                        latestRecommendation.analysis
                                                    }}
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
                                                <i
                                                    class="pi pi-lightbulb text-green-500"
                                                ></i>
                                            </div>

                                            <div>
                                                <h3
                                                    class="text-lg font-semibold mt-0 mb-2"
                                                >
                                                    Recomendación personalizada
                                                </h3>

                                                <p
                                                    class="text-muted-color leading-7 m-0 whitespace-pre-line"
                                                >
                                                    {{
                                                        latestRecommendation.recommendation
                                                    }}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        class="flex flex-col sm:flex-row sm:justify-end gap-3"
                                    >
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
                                            [loading]="
                                                generatingRecommendation
                                            "
                                            (onClick)="
                                                generateRecommendation()
                                            "
                                        />
                                    </div>
                                </div>
                            } @else {
                                <div
                                    class="flex flex-col items-center justify-center text-center py-16"
                                >
                                    <div
                                        class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 mb-5"
                                        style="width: 5rem; height: 5rem"
                                    >
                                        <i
                                            class="pi pi-sparkles text-primary text-3xl"
                                        ></i>
                                    </div>

                                    <h3
                                        class="text-2xl font-semibold mt-0 mb-3"
                                    >
                                        Aún no tienes recomendaciones
                                    </h3>

                                    <p
                                        class="text-muted-color m-0 mb-6 max-w-xl"
                                    >
                                        Registra el progreso de tus hábitos y
                                        genera tu primer análisis personalizado.
                                    </p>

                                    <p-button
                                        label="Generar recomendación"
                                        icon="pi pi-sparkles"
                                        (onClick)="
                                            generateRecommendation()
                                        "
                                    />
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
                                        class="pi pi-info-circle text-purple-500 text-xl"
                                    ></i>
                                </div>

                                <div>
                                    <h2
                                        class="text-xl font-semibold m-0"
                                    >
                                        Sobre el análisis
                                    </h2>

                                    <span
                                        class="text-muted-color text-sm"
                                    >
                                        Información de la recomendación
                                    </span>
                                </div>
                            </div>

                            <div class="flex flex-col gap-4">
                                <div
                                    class="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <div
                                        class="flex items-center gap-3"
                                    >
                                        <i
                                            class="pi pi-history text-primary"
                                        ></i>

                                        <span class="text-muted-color">
                                            Recomendaciones
                                        </span>
                                    </div>

                                    <span class="text-xl font-semibold">
                                        {{ recommendations.length }}
                                    </span>
                                </div>

                                <div
                                    class="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <div
                                        class="flex items-center gap-3"
                                    >
                                        <i
                                            class="pi pi-microchip text-primary"
                                        ></i>

                                        <span class="text-muted-color">
                                            Modelo reciente
                                        </span>
                                    </div>

                                    <span
                                        class="font-semibold text-right max-w-40 truncate"
                                    >
                                        {{
                                            latestRecommendation?.modelName ??
                                            'Sin información'
                                        }}
                                    </span>
                                </div>

                                <div
                                    class="flex items-center justify-between p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <div
                                        class="flex items-center gap-3"
                                    >
                                        <i
                                            class="pi pi-calendar text-primary"
                                        ></i>

                                        <span class="text-muted-color">
                                            Último análisis
                                        </span>
                                    </div>

                                    <span class="font-semibold text-right">
                                        {{
                                            latestRecommendation
                                                ? formatShortDate(
                                                      latestRecommendation.createdAt
                                                  )
                                                : 'Sin información'
                                        }}
                                    </span>
                                </div>
                            </div>

                            <div
                                class="mt-6 p-5 rounded-xl border border-surface-200 dark:border-surface-700"
                            >
                                <div class="flex items-start gap-3">
                                    <i
                                        class="pi pi-shield text-primary mt-1"
                                    ></i>

                                    <p
                                        class="text-muted-color leading-6 m-0"
                                    >
                                        Las recomendaciones se generan
                                        únicamente con la información disponible
                                        en tu cuenta. No reemplazan asesoramiento
                                        médico o profesional.
                                    </p>
                                </div>
                            </div>

                            <p-button
                                label="Registrar progreso"
                                icon="pi pi-check-circle"
                                severity="secondary"
                                [outlined]="true"
                                styleClass="w-full mt-6"
                                routerLink="/daily-record"
                            />
                        </div>
                    </div>
                </div>

                <div class="card mb-0">
                    <div
                        class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
                    >
                        <div>
                            <h2 class="text-2xl font-semibold m-0">
                                Historial de recomendaciones
                            </h2>

                            <p class="text-muted-color mt-2 mb-0">
                                Consulta los análisis generados anteriormente.
                            </p>
                        </div>

                        <p-tag
                            [value]="
                                recommendations.length +
                                ' recomendaciones'
                            "
                            icon="pi pi-history"
                            severity="info"
                        />
                    </div>

                    @if (recommendations.length === 0) {
                        <div
                            class="flex flex-col items-center justify-center text-center py-12"
                        >
                            <i
                                class="pi pi-history text-primary text-4xl mb-4"
                            ></i>

                            <h3 class="text-xl font-semibold m-0">
                                Historial vacío
                            </h3>

                            <p class="text-muted-color mt-2 mb-0">
                                Las recomendaciones generadas aparecerán aquí.
                            </p>
                        </div>
                    } @else {
                        <div class="grid grid-cols-12 gap-6">
                            @for (
                                recommendation of recommendations;
                                track recommendation.id
                            ) {
                                <div
                                    class="col-span-12 md:col-span-6 xl:col-span-4"
                                >
                                    <div
                                        class="h-full p-6 rounded-xl border border-surface-200 dark:border-surface-700 flex flex-col"
                                    >
                                        <div
                                            class="flex items-start justify-between gap-4 mb-5"
                                        >
                                            <div
                                                class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                                style="width: 3.25rem; height: 3.25rem"
                                            >
                                                <i
                                                    class="pi pi-sparkles text-primary text-xl"
                                                ></i>
                                            </div>

                                            <p-tag
                                                [value]="
                                                    recommendation.modelName
                                                "
                                                severity="secondary"
                                            />
                                        </div>

                                        <h3
                                            class="text-xl font-semibold mt-0 mb-2"
                                        >
                                            {{ recommendation.title }}
                                        </h3>

                                        <div
                                            class="flex items-center gap-2 text-muted-color text-sm mb-5"
                                        >
                                            <i class="pi pi-calendar"></i>

                                            <span>
                                                {{
                                                    formatDate(
                                                        recommendation.createdAt
                                                    )
                                                }}
                                            </span>
                                        </div>

                                        <p
                                            class="text-muted-color leading-7 mt-0 mb-6 line-clamp-4"
                                        >
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
                    }
                </div>
            }
        </div>
    `
})
export class Recommendations implements OnInit {
    private readonly statisticsService =
        inject(StatisticsService);

    private readonly messageService =
        inject(MessageService);

    private readonly router =
        inject(Router);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly skeletonItems = [1, 2, 3];

    recommendations: AiRecommendationResponse[] = [];

    latestRecommendation:
        AiRecommendationResponse | null = null;

    loadingHistory = false;

    refreshingHistory = false;

    generatingRecommendation = false;

    errorMessage = '';

    ngOnInit(): void {
        window.setTimeout(() => {
            this.loadHistory(false);
        }, 0);
    }

    loadHistory(isRefresh = false): void {
        if (
            this.loadingHistory ||
            this.refreshingHistory ||
            this.generatingRecommendation
        ) {
            return;
        }

        if (isRefresh) {
            this.refreshingHistory = true;
        } else {
            this.loadingHistory = true;
        }

        this.errorMessage = '';

        this.statisticsService
            .getRecommendationHistory()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.recommendations = [
                        ...response
                    ].sort(
                        (first, second) =>
                            new Date(
                                second.createdAt
                            ).getTime() -
                            new Date(
                                first.createdAt
                            ).getTime()
                    );

                    this.latestRecommendation =
                        this.recommendations[0] ??
                        null;

                    window.setTimeout(() => {
                        this.loadingHistory = false;
                        this.refreshingHistory = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.errorMessage =
                        this.getErrorMessage(error);

                    this.recommendations = [];
                    this.latestRecommendation = null;

                    window.setTimeout(() => {
                        this.loadingHistory = false;
                        this.refreshingHistory = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                }
            });
    }

    generateRecommendation(): void {
        if (
            this.generatingRecommendation ||
            this.loadingHistory ||
            this.refreshingHistory
        ) {
            return;
        }

        this.generatingRecommendation = true;
        this.errorMessage = '';

        this.statisticsService
            .generateRecommendation()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: response => {
                    this.latestRecommendation =
                        response;

                    this.recommendations = [
                        response,
                        ...this.recommendations.filter(
                            recommendation =>
                                recommendation.id !==
                                response.id
                        )
                    ];

                    window.setTimeout(() => {
                        this.generatingRecommendation =
                            false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'success',
                            summary:
                                'Recomendación generada',
                            detail:
                                'El análisis inteligente fue generado correctamente.'
                        });
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    window.setTimeout(() => {
                        this.generatingRecommendation =
                            false;

                        this.changeDetectorRef
                            .detectChanges();

                        this.messageService.add({
                            severity: 'error',
                            summary:
                                'No fue posible generar',
                            detail:
                                this.getErrorMessage(
                                    error
                                )
                        });
                    }, 0);
                }
            });
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

    formatShortDate(value: string): string {
        const date = new Date(value);

        if (
            Number.isNaN(date.getTime())
        ) {
            return value;
        }

        return new Intl.DateTimeFormat(
            'es-EC',
            {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
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
                'No existen suficientes datos para generar el análisis.'
            );
        }

        if (error.status === 401) {
            return 'La sesión expiró. Inicia sesión nuevamente.';
        }

        if (error.status === 403) {
            return 'No tienes permisos para realizar esta operación.';
        }

        if (error.status === 404) {
            return 'No se encontraron recomendaciones.';
        }

        if (error.status === 502) {
            return 'El servicio de inteligencia artificial no se encuentra disponible.';
        }

        if (error.status === 504) {
            return 'La generación tardó demasiado tiempo. Intenta nuevamente.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
