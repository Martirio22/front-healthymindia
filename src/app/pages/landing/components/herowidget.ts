// import { Component } from '@angular/core';
// import { ButtonModule } from 'primeng/button';
// import { RippleModule } from 'primeng/ripple';

// @Component({
//     selector: 'hero-widget',
//     imports: [ButtonModule, RippleModule],
//     template: `
//         <div
//             id="hero"
//             class="flex flex-col pt-6 px-6 lg:px-20 overflow-hidden"
//             style="background: linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, rgb(238, 239, 175) 0%, rgb(195, 227, 250) 100%); clip-path: ellipse(150% 87% at 93% 13%)"
//         >
//             <div class="mx-6 md:mx-20 mt-0 md:mt-6">
//                 <h1 class="text-6xl font-bold text-gray-900 leading-tight dark:!text-gray-700"><span class="font-light block">Eu sem integer</span>eget magna fermentum</h1>
//                 <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-700 dark:text-gray-700">Sed blandit libero volutpat sed cras. Fames ac turpis egestas integer. Placerat in egestas erat...</p>
//                 <button pButton pRipple [rounded]="true" type="button" label="Get Started" class="text-xl! mt-8 px-4!"></button>
//             </div>
//             <div class="flex justify-center md:justify-end">
//                 <img src="https://primefaces.org/cdn/templates/sakai/landing/screen-1.png" alt="Hero Image" class="w-9/12 md:w-auto" />
//             </div>
//         </div>
//     `
// })
// export class HeroWidget {}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
    selector: 'hero-widget',
    standalone: true,
    imports: [
        RouterModule,
        ButtonModule,
        RippleModule
    ],
    template: `
        <section
            id="hero"
            class="relative min-h-[42rem] lg:min-h-[46rem] flex items-center overflow-hidden rounded-3xl mx-4 lg:mx-10"
        >
            <img
                src="/images/landing/fondo.jpeg"
                alt="HealthyMindIA, tu camino hacia el bienestar integral"
                class="absolute inset-0 w-full h-full object-cover"
            />

            <div
                class="absolute inset-0"
                style="
                    background:
                        linear-gradient(
                            90deg,
                            rgba(255, 255, 255, 0.97) 0%,
                            rgba(255, 255, 255, 0.88) 40%,
                            rgba(255, 255, 255, 0.25) 75%,
                            rgba(255, 255, 255, 0.05) 100%
                        );
                "
            ></div>

            <div
                class="relative z-10 w-full px-6 py-16 md:px-12 lg:px-20"
            >
                <div class="max-w-2xl">
                    <img
                        src="/images/landing/logo.png"
                        alt="Logo HealthyMindIA"
                        class="w-56 sm:w-72 mb-8"
                    />

                    <span
                        class="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-primary-50 text-primary font-medium"
                    >
                        <i class="pi pi-sparkles"></i>
                        Bienestar impulsado por inteligencia artificial
                    </span>

                    <h1
                        class="text-surface-900 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mt-0 mb-6"
                    >
                        Construye hábitos saludables y transforma tu bienestar
                    </h1>

                    <p
                        class="text-surface-700 text-lg sm:text-xl leading-8 mt-0 mb-8 max-w-xl"
                    >
                        Organiza tus hábitos, registra tu progreso diario,
                        analiza tus estadísticas y recibe recomendaciones
                        personalizadas con inteligencia artificial.
                    </p>

                    <div
                        class="flex flex-col sm:flex-row gap-3"
                    >
                        <button
                            pButton
                            pRipple
                            type="button"
                            label="Crear mi cuenta"
                            icon="pi pi-user-plus"
                            routerLink="/auth/register"
                            [rounded]="true"
                            class="text-lg px-5"
                        ></button>

                        <button
                            pButton
                            pRipple
                            type="button"
                            label="Iniciar sesión"
                            icon="pi pi-sign-in"
                            routerLink="/auth/login"
                            severity="secondary"
                            [outlined]="true"
                            [rounded]="true"
                            class="text-lg px-5"
                        ></button>
                    </div>

                    <div
                        class="flex flex-wrap gap-x-6 gap-y-3 mt-8 text-surface-700"
                    >
                        <div class="flex items-center gap-2">
                            <i
                                class="pi pi-check-circle text-primary"
                            ></i>
                            <span>Seguimiento diario</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <i
                                class="pi pi-check-circle text-primary"
                            ></i>
                            <span>Estadísticas personales</span>
                        </div>

                        <div class="flex items-center gap-2">
                            <i
                                class="pi pi-check-circle text-primary"
                            ></i>
                            <span>Recomendaciones con IA</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `
})
export class HeroWidget {}
