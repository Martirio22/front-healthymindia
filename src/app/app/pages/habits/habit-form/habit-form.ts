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
import { FormsModule } from '@angular/forms';
import {
    ActivatedRoute,
    Router,
    RouterModule
} from '@angular/router';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';

import { HabitCategory } from '@/app/core/habits/models/habit-category.enum';
import { HabitRequest } from '@/app/core/habits/models/habit-request.model';
import { HabitService } from '@/app/core/habits/services/habit.service';

interface CategoryOption {
    label: string;
    value: HabitCategory;
    icon: string;
    description: string;
}

@Component({
    selector: 'app-habit-form',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        InputNumberModule,
        InputTextModule,
        SelectModule,
        SkeletonModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

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
                    <h1
                        class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0"
                    >
                        {{
                            editMode
                                ? 'Editar hábito'
                                : 'Crear hábito'
                        }}
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        {{
                            editMode
                                ? 'Actualiza la información del hábito seleccionado.'
                                : 'Define una meta clara y medible para comenzar tu seguimiento.'
                        }}
                    </p>
                </div>
            </div>

            @if (loadingHabit) {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0">
                            <p-skeleton
                                width="12rem"
                                height="1.5rem"
                                styleClass="mb-7"
                            />

                            @for (
                                item of skeletonFields;
                                track item
                            ) {
                                <p-skeleton
                                    width="100%"
                                    height="3rem"
                                    styleClass="mb-6"
                                />
                            }
                        </div>
                    </div>
                </div>
            } @else {
                <div class="grid grid-cols-12 gap-6">
                    <div class="col-span-12 xl:col-span-8">
                        <div class="card mb-0">
                            <div class="flex items-center gap-4 mb-7">
                                <div
                                    class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-list-check text-primary text-xl"
                                    ></i>
                                </div>

                                <div>
                                    <h2
                                        class="text-xl font-semibold m-0"
                                    >
                                        Información del hábito
                                    </h2>

                                    <span
                                        class="text-muted-color text-sm"
                                    >
                                        Todos los campos son obligatorios
                                    </span>
                                </div>
                            </div>

                            <div class="flex flex-col gap-6">
                                <div>
                                    <label
                                        for="name"
                                        class="block font-medium mb-2"
                                    >
                                        Nombre
                                    </label>

                                    <input
                                        pInputText
                                        id="name"
                                        [(ngModel)]="form.name"
                                        class="w-full"
                                        placeholder="Ejemplo: Tomar agua"
                                        maxlength="100"
                                        [disabled]="saving"
                                    />

                                    @if (
                                        submitted &&
                                        !form.name.trim()
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            El nombre es obligatorio.
                                        </small>
                                    }
                                </div>

                                <div>
                                    <label
                                        for="category"
                                        class="block font-medium mb-2"
                                    >
                                        Categoría
                                    </label>

                                    <p-select
                                        inputId="category"
                                        [(ngModel)]="form.category"
                                        [options]="categoryOptions"
                                        optionLabel="label"
                                        optionValue="value"
                                        placeholder="Selecciona una categoría"
                                        styleClass="w-full"
                                        [disabled]="saving"
                                    >
                                        <ng-template
                                            #selectedItem
                                            let-selected
                                        >
                                            @if (selected) {
                                                <div
                                                    class="flex items-center gap-3"
                                                >
                                                    <i
                                                        class="pi"
                                                        [ngClass]="
                                                            selected.icon
                                                        "
                                                    ></i>

                                                    <span>
                                                        {{ selected.label }}
                                                    </span>
                                                </div>
                                            }
                                        </ng-template>

                                        <ng-template
                                            #item
                                            let-option
                                        >
                                            <div
                                                class="flex items-start gap-3"
                                            >
                                                <i
                                                    class="pi text-primary mt-1"
                                                    [ngClass]="
                                                        option.icon
                                                    "
                                                ></i>

                                                <div>
                                                    <div
                                                        class="font-medium"
                                                    >
                                                        {{ option.label }}
                                                    </div>

                                                    <small
                                                        class="text-muted-color"
                                                    >
                                                        {{
                                                            option.description
                                                        }}
                                                    </small>
                                                </div>
                                            </div>
                                        </ng-template>
                                    </p-select>

                                    @if (
                                        submitted &&
                                        !form.category
                                    ) {
                                        <small
                                            class="block text-red-500 mt-2"
                                        >
                                            La categoría es obligatoria.
                                        </small>
                                    }
                                </div>

                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div>
                                        <label
                                            for="goal"
                                            class="block font-medium mb-2"
                                        >
                                            Meta diaria
                                        </label>

                                        <p-inputnumber
                                            inputId="goal"
                                            [(ngModel)]="form.goal"
                                            [min]="1"
                                            [max]="999999"
                                            [showButtons]="true"
                                            styleClass="w-full"
                                            inputStyleClass="w-full"
                                            placeholder="Ejemplo: 8"
                                            [disabled]="saving"
                                        />

                                        @if (
                                            submitted &&
                                            (
                                                !form.goal ||
                                                form.goal <= 0
                                            )
                                        ) {
                                            <small
                                                class="block text-red-500 mt-2"
                                            >
                                                La meta debe ser mayor que cero.
                                            </small>
                                        }
                                    </div>

                                    <div>
                                        <label
                                            for="unit"
                                            class="block font-medium mb-2"
                                        >
                                            Unidad
                                        </label>

                                        <input
                                            pInputText
                                            id="unit"
                                            [(ngModel)]="form.unit"
                                            class="w-full"
                                            placeholder="Ejemplo: vasos"
                                            maxlength="50"
                                            [disabled]="saving"
                                        />

                                        @if (
                                            submitted &&
                                            !form.unit.trim()
                                        ) {
                                            <small
                                                class="block text-red-500 mt-2"
                                            >
                                                La unidad es obligatoria.
                                            </small>
                                        }
                                    </div>
                                    <div>
                                        <label
                                            for="day"
                                            class="block font-medium mb-2"
                                        >
                                            Dias
                                        </label>

                                        <input
                                            pInputText
                                            id="day"
                                            [(ngModel)]="form.day"
                                            class="w-full"
                                            placeholder="5"
                                            maxlength="50"
                                            [disabled]="saving"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div
                                class="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-8"
                            >
                                <p-button
                                    label="Cancelar"
                                    icon="pi pi-times"
                                    severity="secondary"
                                    [outlined]="true"
                                    routerLink="/habits"
                                    [disabled]="saving"
                                />

                                <p-button
                                    [label]="
                                        editMode
                                            ? 'Guardar cambios'
                                            : 'Crear hábito'
                                    "
                                    [icon]="
                                        editMode
                                            ? 'pi pi-save'
                                            : 'pi pi-plus'
                                    "
                                    [loading]="saving"
                                    (onClick)="saveHabit()"
                                />
                            </div>
                        </div>
                    </div>

                    <div class="col-span-12 xl:col-span-4">
                        <div class="card mb-0">
                            <div class="flex items-center gap-4 mb-6">
                                <div
                                    class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                    style="width: 3.5rem; height: 3.5rem"
                                >
                                    <i
                                        class="pi pi-eye text-green-500 text-xl"
                                    ></i>
                                </div>

                                <div>
                                    <h2
                                        class="text-xl font-semibold m-0"
                                    >
                                        Vista previa
                                    </h2>

                                    <span
                                        class="text-muted-color text-sm"
                                    >
                                        Así se mostrará el hábito
                                    </span>
                                </div>
                            </div>

                            <div
                                class="p-5 rounded-xl border border-surface-200 dark:border-surface-700"
                            >
                                <div
                                    class="flex items-center gap-4 mb-5"
                                >
                                    <div
                                        class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10"
                                        style="width: 3.5rem; height: 3.5rem"
                                    >
                                        <i
                                            class="pi text-primary text-xl"
                                            [ngClass]="selectedCategoryIcon"
                                        ></i>
                                    </div>

                                    <div>
                                        <h3
                                            class="text-xl font-semibold mt-0 mb-1"
                                        >
                                            {{
                                                form.name.trim() ||
                                                'Nombre del hábito'
                                            }}
                                        </h3>

                                        <span
                                            class="text-muted-color text-sm"
                                        >
                                            {{ selectedCategoryLabel }}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800"
                                >
                                    <span
                                        class="block text-muted-color text-sm mb-2"
                                    >
                                        Meta diaria
                                    </span>

                                    <span class="text-lg font-semibold">
                                        {{ form.goal || 0 }}
                                        {{
                                            form.unit.trim() ||
                                            'unidades'
                                        }}
                                    </span>
                                </div>
                            </div>

                            <div
                                class="flex items-start gap-3 mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20"
                            >
                                <i
                                    class="pi pi-info-circle text-blue-500 mt-1"
                                ></i>

                                <p
                                    class="text-muted-color text-sm leading-6 m-0"
                                >
                                    Define metas alcanzables. Podrás aumentar
                                    la dificultad cuando hayas desarrollado
                                    mayor constancia.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    `
})
export class HabitForm implements OnInit {
    private readonly habitService =
        inject(HabitService);

    private readonly route =
        inject(ActivatedRoute);

    private readonly router =
        inject(Router);

    private readonly messageService =
        inject(MessageService);

    private readonly destroyRef =
        inject(DestroyRef);

    private readonly changeDetectorRef =
        inject(ChangeDetectorRef);

    readonly skeletonFields = [1, 2, 3, 4];

    readonly categoryOptions: CategoryOption[] = [
        {
            label: 'Salud',
            value: HabitCategory.Salud,
            icon: 'pi-heart',
            description: 'Cuidado general de la salud'
        },
        {
            label: 'Ejercicio',
            value: HabitCategory.Ejercicio,
            icon: 'pi-bolt',
            description: 'Actividad física y movimiento'
        },
        {
            label: 'Nutrición',
            value: HabitCategory.Nutricion,
            icon: 'pi-apple',
            description: 'Alimentación equilibrada'
        },
        {
            label: 'Lectura',
            value: HabitCategory.Lectura,
            icon: 'pi-book',
            description: 'Lectura y aprendizaje'
        },
        {
            label: 'Productividad',
            value: HabitCategory.Productividad,
            icon: 'pi-briefcase',
            description: 'Organización y rendimiento'
        },
        {
            label: 'Bienestar',
            value: HabitCategory.Bienestar,
            icon: 'pi-sun',
            description: 'Bienestar emocional y descanso'
        },
        {
            label: 'Hidratación',
            value: HabitCategory.Hidratacion,
            icon: 'pi-filter',
            description: 'Consumo diario de líquidos'
        }
    ];

    habitId: number | null = null;

    editMode = false;

    loadingHabit = false;

    saving = false;

    submitted = false;

    form: HabitRequest = {
        name: '',
        category: HabitCategory.Salud,
        goal: 1,
        unit: '',
        day: ''
    };

    constructor() {
        const editValue =
            this.route.snapshot.queryParamMap.get(
                'edit'
            );

        const parsedId = Number(editValue);

        if (
            editValue &&
            Number.isInteger(parsedId) &&
            parsedId > 0
        ) {
            this.habitId = parsedId;
            this.editMode = true;
            this.loadingHabit = true;
        }
    }

    ngOnInit(): void {
        if (
            this.editMode &&
            this.habitId
        ) {
            this.loadHabit(this.habitId);
        }
    }

    get selectedCategoryLabel(): string {
        return (
            this.categoryOptions.find(
                option =>
                    option.value ===
                    this.form.category
            )?.label ??
            'Categoría'
        );
    }

    get selectedCategoryIcon(): string {
        return (
            this.categoryOptions.find(
                option =>
                    option.value ===
                    this.form.category
            )?.icon ??
            'pi-check-circle'
        );
    }

    saveHabit(): void {
        debugger;
        this.submitted = true;

        if (!this.isValidForm()) {
            return;
        }

        this.saving = true;

        const request: HabitRequest = {
            name: this.form.name.trim(),
            category: this.form.category,
            goal: Number(this.form.goal),
            unit: this.form.unit.trim(),
            day: this.form.day.trim()
        };

        const operation$ =
            this.editMode && this.habitId
                ? this.habitService.updateHabit(
                    this.habitId,
                    request
                )
                : this.habitService.createHabit(
                    request
                );

        operation$
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: response => {
                    this.saving = false;

                    this.messageService.add({
                        severity: 'success',
                        summary: this.editMode
                            ? 'Hábito actualizado'
                            : 'Hábito creado',
                        detail: this.editMode
                            ? 'Los cambios fueron guardados correctamente.'
                            : 'El hábito fue creado correctamente.'
                    });

                    setTimeout(() => {
                        void this.router.navigate([
                            '/habits',
                            response.id
                        ]);
                    }, 700);
                },
                error: (
                    error: HttpErrorResponse
                ) => {
                    this.saving = false;

                    this.messageService.add({
                        severity: 'error',
                        summary: this.editMode
                            ? 'No fue posible actualizar'
                            : 'No fue posible crear',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });
                }
            });
    }

    private loadHabit(id: number): void {
        this.habitService
            .getHabitById(id)
            .pipe(
                takeUntilDestroyed(
                    this.destroyRef
                )
            )
            .subscribe({
                next: habit => {
                    this.form = {
                        name: habit.name,
                        category: habit.category,
                        goal: habit.goal,
                        unit: habit.unit,
                        day: habit.day
                    };

                    window.setTimeout(() => {
                        this.loadingHabit = false;

                        this.changeDetectorRef
                            .detectChanges();
                    }, 0);
                },

                error: (
                    error: HttpErrorResponse
                ) => {
                    this.messageService.add({
                        severity: 'error',
                        summary:
                            'No fue posible cargar',
                        detail:
                            this.getErrorMessage(
                                error
                            )
                    });

                    window.setTimeout(() => {
                        this.loadingHabit = false;

                        this.changeDetectorRef
                            .detectChanges();

                        void this.router.navigate([
                            '/habits'
                        ]);
                    }, 0);
                }
            });
    }

    private isValidForm(): boolean {
        return Boolean(
            this.form.name.trim() &&
            this.form.category &&
            this.form.goal > 0 &&
            this.form.unit.trim()
        );
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
                'Revisa la información ingresada.'
            );
        }

        if (error.status === 401) {
            return 'La sesión expiró. Inicia sesión nuevamente.';
        }

        if (error.status === 403) {
            return 'No tienes permisos para realizar esta operación.';
        }

        if (error.status === 404) {
            return 'No se encontró el hábito solicitado.';
        }

        const message =
            error.error?.message;

        return typeof message === 'string'
            ? message
            : 'Ocurrió un error inesperado.';
    }
}
