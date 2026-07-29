// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//     selector: 'features-widget',
//     standalone: true,
//     imports: [CommonModule],
//     template: ` <div id="features" class="py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20">
//         <div class="grid grid-cols-12 gap-4 justify-center">
//             <div class="col-span-12 text-center mt-20 mb-6">
//                 <div class="text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl">Marvelous Features</div>
//                 <span class="text-muted-color text-2xl">Placerat in egestas erat...</span>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-yellow-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-users text-2xl! text-yellow-700"></i>
//                         </div>
//                         <h5 class="mb-2 text-surface-900 dark:text-surface-0">Easy to Use</h5>
//                         <span class="text-surface-600 dark:text-surface-200">Posuere morbi leo urna molestie.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(172, 180, 223, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-cyan-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-palette text-2xl! text-cyan-700"></i>
//                         </div>
//                         <h5 class="mb-2 text-surface-900 dark:text-surface-0">Fresh Design</h5>
//                         <span class="text-surface-600 dark:text-surface-200">Semper risus in hendrerit.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(246, 158, 188, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-indigo-200" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-map text-2xl! text-indigo-700"></i>
//                         </div>
//                         <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Well Documented</div>
//                         <span class="text-surface-600 dark:text-surface-200">Non arcu risus quis varius quam quisque.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)), linear-gradient(180deg, rgba(253, 228, 165, 0.2), rgba(145, 210, 204, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-slate-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-id-card text-2xl! text-slate-700"></i>
//                         </div>
//                         <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Responsive Layout</div>
//                         <span class="text-surface-600 dark:text-surface-200">Nulla malesuada pellentesque elit.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(145, 226, 237, 0.2), rgba(160, 210, 250, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-orange-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-star text-2xl! text-orange-700"></i>
//                         </div>
//                         <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Clean Code</div>
//                         <span class="text-surface-600 dark:text-surface-200">Condimentum lacinia quis vel eros.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pb-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)), linear-gradient(180deg, rgba(172, 180, 223, 0.2), rgba(212, 162, 221, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-pink-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-moon text-2xl! text-pink-700"></i>
//                         </div>
//                         <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Dark Mode</div>
//                         <span class="text-surface-600 dark:text-surface-200">Convallis tellus id interdum velit laoreet.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)), linear-gradient(180deg, rgba(187, 199, 205, 0.2), rgba(145, 210, 204, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-teal-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-shopping-cart text-2xl! text-teal-700"></i>
//                         </div>
//                         <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Ready to Use</div>
//                         <span class="text-surface-600 dark:text-surface-200">Mauris sit amet massa vitae.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(251, 199, 145, 0.2), rgba(160, 210, 250, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-blue-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-globe text-2xl! text-blue-700"></i>
//                         </div>
//                         <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Modern Practices</div>
//                         <span class="text-surface-600 dark:text-surface-200">Elementum nibh tellus molestie nunc non.</span>
//                     </div>
//                 </div>
//             </div>

//             <div class="col-span-12 md:col-span-12 lg:col-span-4 p-0 lg-4 mt-6 lg:mt-0">
//                 <div style="height: 160px; padding: 2px; border-radius: 10px; background: linear-gradient(90deg, rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)), linear-gradient(180deg, rgba(246, 158, 188, 0.2), rgba(212, 162, 221, 0.2))">
//                     <div class="p-4 bg-surface-0 dark:bg-surface-900 h-full" style="border-radius: 8px">
//                         <div class="flex items-center justify-center bg-purple-200 mb-4" style="width: 3.5rem; height: 3.5rem; border-radius: 10px">
//                             <i class="pi pi-fw pi-eye text-2xl! text-purple-700"></i>
//                         </div>
//                         <div class="mt-6 mb-1 text-surface-900 dark:text-surface-0 text-xl font-semibold">Privacy</div>
//                         <span class="text-surface-600 dark:text-surface-200">Neque egestas congue quisque.</span>
//                     </div>
//                 </div>
//             </div>

//             <div
//                 class="col-span-12 mt-20 mb-20 p-2 md:p-20"
//                 style="border-radius: 20px; background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%)"
//             >
//                 <div class="flex flex-col justify-center items-center text-center px-4 py-4 md:py-0">
//                     <div class="text-gray-900 mb-2 text-3xl font-semibold">Joséphine Miller</div>
//                     <span class="text-gray-600 text-2xl">Peak Interactive</span>
//                     <p class="text-gray-900 sm:line-height-2 md:line-height-4 text-2xl mt-6" style="max-width: 800px">
//                         “Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.”
//                     </p>
//                     <img src="https://primefaces.org/cdn/templates/sakai/landing/peak-logo.svg" class="mt-6" alt="Company logo" />
//                 </div>
//             </div>
//         </div>
//     </div>`
// })
// export class FeaturesWidget {}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface FeatureCard {
    title: string;
    description: string;
    icon: string;
    iconContainerClass: string;
    iconClass: string;
}

@Component({
    selector: 'features-widget',
    standalone: true,
    imports: [
        CommonModule
    ],
    template: `
        <section
            id="features"
            class="py-20 px-6 lg:px-20"
        >
            <div class="max-w-7xl mx-auto">
                <div
                    class="text-center max-w-3xl mx-auto mb-14"
                >
                    <span
                        class="inline-flex items-center gap-2 text-primary font-semibold mb-3"
                    >
                        <i class="pi pi-heart-fill"></i>
                        Tu bienestar en un solo lugar
                    </span>

                    <h2
                        class="text-surface-900 dark:text-surface-0 text-4xl lg:text-5xl font-bold mt-0 mb-5"
                    >
                        Herramientas para construir una mejor versión de ti
                    </h2>

                    <p
                        class="text-muted-color text-lg lg:text-xl leading-8 m-0"
                    >
                        HealthyMindIA te ayuda a crear hábitos, mantener la
                        constancia y comprender tu progreso mediante
                        información clara y recomendaciones personalizadas.
                    </p>
                </div>

                <div
                    class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    @for (
                        feature of features;
                        track feature.title
                    ) {
                        <article
                            class="group h-full rounded-2xl border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >
                            <div
                                class="flex items-center justify-center rounded-2xl mb-6"
                                [ngClass]="
                                    feature.iconContainerClass
                                "
                                style="
                                    width: 4rem;
                                    height: 4rem;
                                "
                            >
                                <i
                                    class="pi text-2xl"
                                    [ngClass]="[
                                        feature.icon,
                                        feature.iconClass
                                    ]"
                                ></i>
                            </div>

                            <h3
                                class="text-surface-900 dark:text-surface-0 text-xl font-semibold mt-0 mb-3"
                            >
                                {{ feature.title }}
                            </h3>

                            <p
                                class="text-muted-color leading-7 m-0"
                            >
                                {{ feature.description }}
                            </p>
                        </article>
                    }
                </div>

                <div
                    class="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-20 items-center rounded-3xl overflow-hidden bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700"
                >
                    <div class="p-8 lg:p-12">
                        <span
                            class="inline-flex items-center gap-2 text-primary font-semibold mb-4"
                        >
                            <i class="pi pi-chart-line"></i>
                            Progreso visible
                        </span>

                        <h2
                            class="text-surface-900 dark:text-surface-0 text-3xl lg:text-4xl font-bold mt-0 mb-5"
                        >
                            Pequeñas acciones que generan grandes resultados
                        </h2>

                        <p
                            class="text-muted-color text-lg leading-8 mb-7"
                        >
                            Registra tus actividades diariamente y observa
                            cómo tu constancia mejora con el tiempo. El sistema
                            transforma tus registros en información útil para
                            ayudarte a tomar mejores decisiones.
                        </p>

                        <div class="flex flex-col gap-4">
                            <div
                                class="flex items-start gap-3"
                            >
                                <i
                                    class="pi pi-check-circle text-primary mt-1"
                                ></i>

                                <div>
                                    <div
                                        class="font-semibold text-surface-900 dark:text-surface-0"
                                    >
                                        Resumen de hábitos
                                    </div>

                                    <div
                                        class="text-muted-color mt-1"
                                    >
                                        Consulta hábitos activos, pendientes y
                                        completados.
                                    </div>
                                </div>
                            </div>

                            <div
                                class="flex items-start gap-3"
                            >
                                <i
                                    class="pi pi-check-circle text-primary mt-1"
                                ></i>

                                <div>
                                    <div
                                        class="font-semibold text-surface-900 dark:text-surface-0"
                                    >
                                        Rachas y cumplimiento
                                    </div>

                                    <div
                                        class="text-muted-color mt-1"
                                    >
                                        Mantén la motivación observando tus
                                        días consecutivos.
                                    </div>
                                </div>
                            </div>

                            <div
                                class="flex items-start gap-3"
                            >
                                <i
                                    class="pi pi-check-circle text-primary mt-1"
                                ></i>

                                <div>
                                    <div
                                        class="font-semibold text-surface-900 dark:text-surface-0"
                                    >
                                        Análisis inteligente
                                    </div>

                                    <div
                                        class="text-muted-color mt-1"
                                    >
                                        Recibe sugerencias basadas en tu
                                        actividad y evolución.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative min-h-[25rem] lg:min-h-[34rem]"
                    >
                        <img
                            src="/images/landing/fondo.jpeg"
                            alt="Bienestar integral con HealthyMindIA"
                            class="absolute inset-0 w-full h-full object-cover"
                        />

                        <div
                            class="absolute inset-0"
                            style="
                                background:
                                    linear-gradient(
                                        90deg,
                                        rgba(255, 255, 255, 0.12),
                                        rgba(16, 185, 129, 0.08)
                                    );
                            "
                        ></div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class FeaturesWidget {
    readonly features: FeatureCard[] = [
        {
            title: 'Gestión de hábitos',
            description:
                'Crea, organiza, edita y consulta tus hábitos según su categoría, frecuencia y objetivo personal.',
            icon: 'pi-list-check',
            iconContainerClass:
                'bg-emerald-100 dark:bg-emerald-400/10',
            iconClass:
                'text-emerald-600'
        },
        {
            title: 'Registro diario',
            description:
                'Registra tu cumplimiento cada día y agrega observaciones sobre tu avance o las dificultades encontradas.',
            icon: 'pi-calendar-check',
            iconContainerClass:
                'bg-cyan-100 dark:bg-cyan-400/10',
            iconClass:
                'text-cyan-600'
        },
        {
            title: 'Estadísticas personales',
            description:
                'Visualiza tu progreso diario, semanal y mensual mediante indicadores y gráficos fáciles de interpretar.',
            icon: 'pi-chart-bar',
            iconContainerClass:
                'bg-blue-100 dark:bg-blue-400/10',
            iconClass:
                'text-blue-600'
        },
        {
            title: 'Recomendaciones con IA',
            description:
                'Obtén recomendaciones personalizadas basadas en tus hábitos, registros, resultados y nivel de constancia.',
            icon: 'pi-sparkles',
            iconContainerClass:
                'bg-purple-100 dark:bg-purple-400/10',
            iconClass:
                'text-purple-600'
        },
        {
            title: 'Seguimiento de rachas',
            description:
                'Mantén la motivación observando tus días consecutivos y celebrando cada avance en tu proceso.',
            icon: 'pi-bolt',
            iconContainerClass:
                'bg-orange-100 dark:bg-orange-400/10',
            iconClass:
                'text-orange-600'
        },
        {
            title: 'Perfil y seguridad',
            description:
                'Administra tu información personal dentro de una experiencia protegida con autenticación y control de sesión.',
            icon: 'pi-shield',
            iconContainerClass:
                'bg-teal-100 dark:bg-teal-400/10',
            iconClass:
                'text-teal-600'
        }
    ];
}
