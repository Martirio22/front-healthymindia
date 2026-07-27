import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

interface CategoryOption {
    label: string;
    value: string;
    icon: string;
}

@Component({
    selector: 'app-habit-form',
    standalone: true,
    imports: [
        FormsModule,
        RouterModule,
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        SelectModule
    ],
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex items-center gap-4">
                <p-button
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    [text]="true"
                    [rounded]="true"
                    routerLink="/habits"
                />

                <div>
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                        {{ editMode ? 'Editar hábito' : 'Crear hábito' }}
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Define una meta clara, medible y sencilla de registrar.
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 lg:col-span-8">
                    <div class="card">
                        <div class="mb-6">
                            <h2 class="text-xl font-semibold m-0">
                                Información del hábito
                            </h2>

                            <p class="text-muted-color mt-2 mb-0">
                                Todos los campos son obligatorios.
                            </p>
                        </div>

                        <div class="flex flex-col gap-6">
                            <div>
                                <label
                                    for="name"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Nombre
                                </label>

                                <input
                                    pInputText
                                    id="name"
                                    [(ngModel)]="name"
                                    class="w-full"
                                    placeholder="Ejemplo: Beber agua"
                                    maxlength="100"
                                />

                                @if (showErrors && !name.trim()) {
                                    <small class="block text-red-500 mt-2">
                                        El nombre del hábito es obligatorio.
                                    </small>
                                }
                            </div>

                            <div>
                                <label
                                    for="category"
                                    class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                >
                                    Categoría
                                </label>

                                <p-select
                                    inputId="category"
                                    [(ngModel)]="category"
                                    [options]="categories"
                                    optionLabel="label"
                                    optionValue="value"
                                    placeholder="Selecciona una categoría"
                                    styleClass="w-full"
                                />

                                @if (showErrors && !category) {
                                    <small class="block text-red-500 mt-2">
                                        Debes seleccionar una categoría.
                                    </small>
                                }
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        for="goal"
                                        class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                    >
                                        Meta
                                    </label>

                                    <p-inputnumber
                                        inputId="goal"
                                        [(ngModel)]="goal"
                                        [min]="1"
                                        [showButtons]="true"
                                        buttonLayout="horizontal"
                                        incrementButtonIcon="pi pi-plus"
                                        decrementButtonIcon="pi pi-minus"
                                        styleClass="w-full"
                                        inputStyleClass="w-full text-center"
                                    />

                                    @if (showErrors && (!goal || goal < 1)) {
                                        <small class="block text-red-500 mt-2">
                                            La meta debe ser mayor que cero.
                                        </small>
                                    }
                                </div>

                                <div>
                                    <label
                                        for="unit"
                                        class="block text-surface-900 dark:text-surface-0 font-medium mb-2"
                                    >
                                        Unidad
                                    </label>

                                    <input
                                        pInputText
                                        id="unit"
                                        [(ngModel)]="unit"
                                        class="w-full"
                                        placeholder="Vasos, minutos, páginas..."
                                        maxlength="30"
                                    />

                                    @if (showErrors && !unit.trim()) {
                                        <small class="block text-red-500 mt-2">
                                            La unidad es obligatoria.
                                        </small>
                                    }
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8">
                            <p-button
                                label="Cancelar"
                                icon="pi pi-times"
                                severity="secondary"
                                [outlined]="true"
                                routerLink="/habits"
                            />

                            <p-button
                                [label]="editMode ? 'Guardar cambios' : 'Crear hábito'"
                                [icon]="editMode ? 'pi pi-save' : 'pi pi-plus'"
                                (onClick)="saveHabit()"
                            />
                        </div>
                    </div>
                </div>

                <div class="col-span-12 lg:col-span-4">
                    <div class="card">
                        <div class="flex items-center gap-3 mb-5">
                            <div
                                class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-lightbulb text-primary text-xl"></i>
                            </div>

                            <div>
                                <h2 class="text-xl font-semibold m-0">
                                    Recomendaciones
                                </h2>

                                <span class="text-muted-color text-sm">
                                    Crea una meta alcanzable
                                </span>
                            </div>
                        </div>

                        <div class="flex flex-col gap-4">
                            <div class="flex gap-3">
                                <i class="pi pi-check-circle text-green-500 mt-1"></i>

                                <span class="text-muted-color leading-6">
                                    Usa un nombre corto que describa claramente la actividad.
                                </span>
                            </div>

                            <div class="flex gap-3">
                                <i class="pi pi-check-circle text-green-500 mt-1"></i>

                                <span class="text-muted-color leading-6">
                                    Define una meta que puedas medir todos los días.
                                </span>
                            </div>

                            <div class="flex gap-3">
                                <i class="pi pi-check-circle text-green-500 mt-1"></i>

                                <span class="text-muted-color leading-6">
                                    Selecciona una unidad sencilla como vasos, minutos o páginas.
                                </span>
                            </div>
                        </div>
                    </div>

                    <div class="card">
                        <h2 class="text-xl font-semibold mt-0 mb-5">
                            Vista previa
                        </h2>

                        <div
                            class="p-5 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800"
                        >
                            <div class="flex items-center gap-4 mb-5">
                                <div
                                    class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i class="pi pi-list-check text-primary text-xl"></i>
                                </div>

                                <div>
                                    <div class="font-semibold text-lg">
                                        {{ name || 'Nombre del hábito' }}
                                    </div>

                                    <span class="text-muted-color text-sm">
                                        {{ selectedCategoryLabel }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex justify-between">
                                <span class="text-muted-color">
                                    Meta diaria
                                </span>

                                <span class="font-semibold">
                                    {{ goal || 0 }} {{ unit || 'unidades' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class HabitForm {
    name = '';
    category = '';
    goal = 1;
    unit = '';
    showErrors = false;
    editMode = false;

    categories: CategoryOption[] = [
        {
            label: 'Salud',
            value: 'SALUD',
            icon: 'pi pi-heart'
        },
        {
            label: 'Ejercicio',
            value: 'EJERCICIO',
            icon: 'pi pi-bolt'
        },
        {
            label: 'Nutrición',
            value: 'NUTRICION',
            icon: 'pi pi-apple'
        },
        {
            label: 'Lectura',
            value: 'LECTURA',
            icon: 'pi pi-book'
        },
        {
            label: 'Productividad',
            value: 'PRODUCTIVIDAD',
            icon: 'pi pi-briefcase'
        },
        {
            label: 'Bienestar',
            value: 'BIENESTAR',
            icon: 'pi pi-sun'
        },
        {
            label: 'Hidratación',
            value: 'HIDRATACION',
            icon: 'pi pi-tint'
        }
    ];

    constructor(private readonly router: Router) {}

    get selectedCategoryLabel(): string {
        return (
            this.categories.find(
                category => category.value === this.category
            )?.label ?? 'Sin categoría'
        );
    }

    saveHabit(): void {
        this.showErrors = true;

        if (
            !this.name.trim() ||
            !this.category ||
            !this.goal ||
            this.goal < 1 ||
            !this.unit.trim()
        ) {
            return;
        }

        void this.router.navigate(['/habits']);
    }
}
