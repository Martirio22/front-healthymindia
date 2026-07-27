import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

interface DailyHabitMock {
    id: number;
    name: string;
    category: string;
    icon: string;
    goal: number;
    unit: string;
    completedValue: number;
    notes: string;
    saved: boolean;
    recordId?: number;
    expanded: boolean;
}

@Component({
    selector: 'app-daily-record',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ButtonModule,
        DatePickerModule,
        InputNumberModule,
        ProgressBarModule,
        TagModule,
        TextareaModule,
        ToastModule
    ],
    providers: [MessageService],
    template: `
        <p-toast />

        <div class="flex flex-col gap-6">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                        Registro diario
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Registra el progreso de tus hábitos activos de forma rápida.
                    </p>
                </div>

                <div class="flex flex-col sm:flex-row gap-3">
                    <p-datepicker
                        [(ngModel)]="selectedDate"
                        [showIcon]="true"
                        [maxDate]="today"
                        dateFormat="dd/mm/yy"
                        placeholder="Selecciona una fecha"
                        styleClass="w-full sm:w-auto"
                        (onSelect)="changeDate()"
                    />

                    <p-button
                        label="Ver mis hábitos"
                        icon="pi pi-list"
                        severity="secondary"
                        [outlined]="true"
                        routerLink="/habits"
                    />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Hábitos activos
                                </span>

                                <div class="text-3xl font-semibold">
                                    {{ habits.length }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-400/10"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-list-check text-blue-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Registros guardados
                                </span>

                                <div class="text-3xl font-semibold">
                                    {{ savedCount }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-400/10"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-check-circle text-green-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Metas completadas
                                </span>

                                <div class="text-3xl font-semibold">
                                    {{ completedCount }}
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-400/10"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-star-fill text-purple-500 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div class="card mb-0 h-full">
                        <div class="flex items-center justify-between mb-4">
                            <div>
                                <span class="block text-muted-color font-medium mb-3">
                                    Progreso diario
                                </span>

                                <div class="text-3xl font-semibold">
                                    {{ dailyProgress }}%
                                </div>
                            </div>

                            <div
                                class="flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-400/10"
                                style="width: 3rem; height: 3rem"
                            >
                                <i class="pi pi-chart-line text-orange-500 text-xl"></i>
                            </div>
                        </div>

                        <p-progressbar
                            [value]="dailyProgress"
                            [showValue]="false"
                            styleClass="h-2"
                        />
                    </div>
                </div>
            </div>

            <div class="card mb-0">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 class="text-xl font-semibold m-0">
                            Hábitos del {{ formattedSelectedDate }}
                        </h2>

                        <p class="text-muted-color mt-2 mb-0">
                            Completa el valor realizado y agrega una nota cuando sea necesario.
                        </p>
                    </div>

                    <p-tag
                        [value]="completedCount + ' de ' + habits.length + ' completados'"
                        [severity]="completedCount === habits.length ? 'success' : 'info'"
                        icon="pi pi-chart-pie"
                    />
                </div>
            </div>

            <div class="grid grid-cols-12 gap-6">
                @for (habit of habits; track habit.id) {
                    <div class="col-span-12 xl:col-span-6">
                        <div
                            class="card mb-0 h-full flex flex-col"
                            [class.opacity-70]="!isSelectedDateToday && !habit.saved"
                        >
                            <div class="flex items-start justify-between gap-4 mb-5">
                                <div class="flex items-center gap-4">
                                    <div
                                        class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                                        style="width: 3.5rem; height: 3.5rem"
                                    >
                                        <i
                                            class="pi text-primary text-xl"
                                            [ngClass]="habit.icon"
                                        ></i>
                                    </div>

                                    <div>
                                        <h2 class="text-xl font-semibold m-0">
                                            {{ habit.name }}
                                        </h2>

                                        <span class="text-muted-color text-sm">
                                            {{ habit.category }}
                                        </span>
                                    </div>
                                </div>

                                <p-tag
                                    [value]="
                                        isCompleted(habit)
                                            ? 'Completado'
                                            : habit.saved
                                              ? 'Registrado'
                                              : 'Pendiente'
                                    "
                                    [severity]="
                                        isCompleted(habit)
                                            ? 'success'
                                            : habit.saved
                                              ? 'info'
                                              : 'warn'
                                    "
                                />
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-5">
                                <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                    <span class="block text-muted-color text-sm mb-2">
                                        Meta diaria
                                    </span>

                                    <span class="text-lg font-semibold">
                                        {{ habit.goal }} {{ habit.unit }}
                                    </span>
                                </div>

                                <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                    <span class="block text-muted-color text-sm mb-2">
                                        Valor realizado
                                    </span>

                                    <span class="text-lg font-semibold">
                                        {{ habit.completedValue }} {{ habit.unit }}
                                    </span>
                                </div>
                            </div>

                            <div class="mb-6">
                                <div class="flex justify-between items-center mb-2">
                                    <span class="text-muted-color">
                                        Cumplimiento
                                    </span>

                                    <span class="font-semibold">
                                        {{ getProgress(habit) }}%
                                    </span>
                                </div>

                                <p-progressbar
                                    [value]="getProgress(habit)"
                                    [showValue]="false"
                                    styleClass="h-2"
                                />
                            </div>

                            <div class="flex flex-col gap-5 flex-1">
                                <div>
                                    <label
                                        [for]="'completedValue-' + habit.id"
                                        class="block font-medium mb-2"
                                    >
                                        Cantidad realizada
                                    </label>

                                    <p-inputnumber
                                        [inputId]="'completedValue-' + habit.id"
                                        [(ngModel)]="habit.completedValue"
                                        [min]="0"
                                        [showButtons]="true"
                                        buttonLayout="horizontal"
                                        incrementButtonIcon="pi pi-plus"
                                        decrementButtonIcon="pi pi-minus"
                                        styleClass="w-full"
                                        inputStyleClass="w-full text-center"
                                        [suffix]="' ' + habit.unit"
                                        (ngModelChange)="markAsPending(habit)"
                                    />
                                </div>

                                <div>
                                    <div class="flex justify-between mb-2">
                                        <label
                                            [for]="'notes-' + habit.id"
                                            class="font-medium"
                                        >
                                            Notas
                                        </label>

                                        <span
                                            class="text-muted-color text-sm"
                                            [class.text-red-500]="habit.notes.length > 300"
                                        >
                                            {{ habit.notes.length }}/300
                                        </span>
                                    </div>

                                    <textarea
                                        pTextarea
                                        [id]="'notes-' + habit.id"
                                        [(ngModel)]="habit.notes"
                                        rows="3"
                                        maxlength="300"
                                        class="w-full resize-none"
                                        placeholder="Agrega una observación opcional..."
                                        (ngModelChange)="markAsPending(habit)"
                                    ></textarea>
                                </div>
                            </div>

                            <div class="flex flex-col sm:flex-row gap-3 mt-6">
                                <p-button
                                    [label]="habit.recordId ? 'Actualizar registro' : 'Guardar registro'"
                                    [icon]="habit.recordId ? 'pi pi-save' : 'pi pi-check'"
                                    styleClass="w-full"
                                    (onClick)="saveRecord(habit)"
                                />

                                <p-button
                                    label="Historial"
                                    icon="pi pi-history"
                                    severity="secondary"
                                    [outlined]="true"
                                    styleClass="w-full"
                                    [routerLink]="['/habits', habit.id]"
                                />
                            </div>

                            @if (habit.saved) {
                                <div
                                    class="flex items-center gap-3 mt-5 p-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30"
                                >
                                    <i class="pi pi-check-circle text-green-500"></i>

                                    <span class="text-green-700 dark:text-green-300">
                                        Registro guardado correctamente.
                                    </span>
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>

            <div class="card mb-0">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                    <div class="flex items-start gap-4">
                        <div
                            class="flex items-center justify-center rounded-xl bg-primary-100 dark:bg-primary-400/10 shrink-0"
                            style="width: 3rem; height: 3rem"
                        >
                            <i class="pi pi-info-circle text-primary text-xl"></i>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold mt-0 mb-2">
                                Tu avance se calcula automáticamente
                            </h3>

                            <p class="text-muted-color m-0 leading-6">
                                Una meta se considera completada cuando el valor realizado es
                                igual o superior a la meta definida para el hábito.
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3">
                        <p-button
                            label="Guardar todos"
                            icon="pi pi-save"
                            (onClick)="saveAllRecords()"
                        />

                        <p-button
                            label="Ver estadísticas"
                            icon="pi pi-chart-bar"
                            severity="secondary"
                            [outlined]="true"
                            routerLink="/statistics"
                        />
                    </div>
                </div>
            </div>
        </div>
    `
})
export class DailyRecord {
    readonly today = new Date();

    selectedDate = new Date();

    habits: DailyHabitMock[] = [
        {
            id: 1,
            name: 'Beber agua',
            category: 'HIDRATACIÓN',
            icon: 'pi-tint',
            goal: 8,
            unit: 'vasos',
            completedValue: 6,
            notes: 'Tomé menos agua durante la mañana.',
            saved: false,
            expanded: true
        },
        {
            id: 2,
            name: 'Leer diariamente',
            category: 'LECTURA',
            icon: 'pi-book',
            goal: 30,
            unit: 'minutos',
            completedValue: 30,
            notes: 'Leí un capítulo completo.',
            saved: true,
            recordId: 102,
            expanded: true
        },
        {
            id: 3,
            name: 'Ejercicio cardiovascular',
            category: 'EJERCICIO',
            icon: 'pi-heart',
            goal: 45,
            unit: 'minutos',
            completedValue: 25,
            notes: '',
            saved: false,
            expanded: true
        },
        {
            id: 4,
            name: 'Meditación',
            category: 'BIENESTAR',
            icon: 'pi-sun',
            goal: 15,
            unit: 'minutos',
            completedValue: 15,
            notes: 'Sesión de respiración guiada.',
            saved: true,
            recordId: 104,
            expanded: true
        }
    ];

    constructor(
        private readonly messageService: MessageService
    ) {}

    get savedCount(): number {
        return this.habits.filter(habit => habit.saved).length;
    }

    get completedCount(): number {
        return this.habits.filter(habit => this.isCompleted(habit)).length;
    }

    get dailyProgress(): number {
        if (this.habits.length === 0) {
            return 0;
        }

        return Math.round(
            this.habits.reduce(
                (total, habit) => total + this.getProgress(habit),
                0
            ) / this.habits.length
        );
    }

    get formattedSelectedDate(): string {
        return new Intl.DateTimeFormat('es-EC', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        }).format(this.selectedDate);
    }

    get isSelectedDateToday(): boolean {
        return (
            this.selectedDate.toDateString() ===
            this.today.toDateString()
        );
    }

    getProgress(habit: DailyHabitMock): number {
        if (habit.goal <= 0) {
            return 0;
        }

        return Math.min(
            100,
            Math.round(
                (habit.completedValue / habit.goal) * 100
            )
        );
    }

    isCompleted(habit: DailyHabitMock): boolean {
        return habit.completedValue >= habit.goal;
    }

    markAsPending(habit: DailyHabitMock): void {
        habit.saved = false;
    }

    saveRecord(habit: DailyHabitMock): void {
        if (
            habit.completedValue === null ||
            habit.completedValue === undefined ||
            habit.completedValue < 0
        ) {
            this.messageService.add({
                severity: 'error',
                summary: 'Valor inválido',
                detail: 'La cantidad realizada no puede ser negativa.'
            });

            return;
        }

        habit.saved = true;
        habit.recordId ??= Date.now();

        this.messageService.add({
            severity: 'success',
            summary: 'Registro guardado',
            detail: `${habit.name}: ${habit.completedValue} ${habit.unit}.`
        });
    }

    saveAllRecords(): void {
        this.habits.forEach(habit => {
            habit.saved = true;
            habit.recordId ??= Date.now() + habit.id;
        });

        this.messageService.add({
            severity: 'success',
            summary: 'Registros guardados',
            detail: 'El progreso diario fue guardado correctamente.'
        });
    }

    changeDate(): void {
        this.habits = this.habits.map(habit => ({
            ...habit,
            saved: false,
            recordId: undefined,
            completedValue: 0,
            notes: ''
        }));

        this.messageService.add({
            severity: 'info',
            summary: 'Fecha actualizada',
            detail: `Mostrando los hábitos del ${this.formattedSelectedDate}.`
        });
    }
}
