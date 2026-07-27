import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

interface HabitMock {
    id: number;
    name: string;
    category: string;
    goal: number;
    unit: string;
    active: boolean;
    createdAt: string;
    progress: number;
    icon: string;
}

@Component({
    selector: 'app-habit-list',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        ButtonModule,
        ProgressBarModule,
        TagModule
    ],
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 class="text-3xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                        Mis hábitos
                    </h1>

                    <p class="text-muted-color mt-2 mb-0">
                        Crea, organiza y registra el progreso de tus hábitos personales.
                    </p>
                </div>

                <p-button
                    label="Crear hábito"
                    icon="pi pi-plus"
                    routerLink="/habits/new"
                />
            </div>

            <div class="card mb-0">
                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div class="flex flex-wrap gap-3">
                        <p-button
                            label="Todos"
                            icon="pi pi-list"
                            [outlined]="filter !== 'ALL'"
                            (onClick)="filterHabits('ALL')"
                        />

                        <p-button
                            label="Activos"
                            icon="pi pi-check-circle"
                            severity="success"
                            [outlined]="filter !== 'ACTIVE'"
                            (onClick)="filterHabits('ACTIVE')"
                        />

                        <p-button
                            label="Inactivos"
                            icon="pi pi-ban"
                            severity="secondary"
                            [outlined]="filter !== 'INACTIVE'"
                            (onClick)="filterHabits('INACTIVE')"
                        />
                    </div>

                    <div class="flex items-center gap-2 text-muted-color">
                        <i class="pi pi-list-check"></i>
                        <span>
                            {{ filteredHabits.length }} hábitos encontrados
                        </span>
                    </div>
                </div>
            </div>

            @if (filteredHabits.length > 0) {
                <div class="grid grid-cols-12 gap-6">
                    @for (habit of filteredHabits; track habit.id) {
                        <div class="col-span-12 md:col-span-6 xl:col-span-4">
                            <div class="card h-full mb-0 flex flex-col">
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
                                            <h2 class="text-xl font-semibold text-surface-900 dark:text-surface-0 m-0">
                                                {{ habit.name }}
                                            </h2>

                                            <span class="text-muted-color text-sm">
                                                {{ habit.category }}
                                            </span>
                                        </div>
                                    </div>

                                    <p-tag
                                        [value]="habit.active ? 'Activo' : 'Inactivo'"
                                        [severity]="habit.active ? 'success' : 'secondary'"
                                    />
                                </div>

                                <div class="grid grid-cols-2 gap-4 mb-5">
                                    <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                        <span class="block text-muted-color text-sm mb-2">
                                            Meta
                                        </span>

                                        <span class="font-semibold text-surface-900 dark:text-surface-0">
                                            {{ habit.goal }} {{ habit.unit }}
                                        </span>
                                    </div>

                                    <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800">
                                        <span class="block text-muted-color text-sm mb-2">
                                            Fecha de creación
                                        </span>

                                        <span class="font-semibold text-surface-900 dark:text-surface-0">
                                            {{ habit.createdAt }}
                                        </span>
                                    </div>
                                </div>

                                <div class="mb-6">
                                    <div class="flex justify-between items-center mb-2">
                                        <span class="text-muted-color">
                                            Progreso de hoy
                                        </span>

                                        <span class="font-semibold">
                                            {{ habit.progress }}%
                                        </span>
                                    </div>

                                    <p-progressbar
                                        [value]="habit.progress"
                                        [showValue]="false"
                                        styleClass="h-2"
                                    />
                                </div>

                                <div class="mt-auto flex flex-col gap-3">
                                    <p-button
                                        label="Registrar progreso"
                                        icon="pi pi-check-circle"
                                        styleClass="w-full"
                                        routerLink="/daily-record"
                                    />

                                    <div class="grid grid-cols-2 gap-3">
                                        <p-button
                                            label="Editar"
                                            icon="pi pi-pencil"
                                            severity="secondary"
                                            [outlined]="true"
                                            styleClass="w-full"
                                            routerLink="/habits/new"
                                            [queryParams]="{ edit: habit.id }"
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

                                    <div class="grid grid-cols-2 gap-3">
                                        <p-button
                                            [label]="habit.active ? 'Desactivar' : 'Activar'"
                                            [icon]="habit.active ? 'pi pi-ban' : 'pi pi-check'"
                                            [severity]="habit.active ? 'warn' : 'success'"
                                            [outlined]="true"
                                            styleClass="w-full"
                                            (onClick)="changeStatus(habit)"
                                        />

                                        <p-button
                                            label="Eliminar"
                                            icon="pi pi-trash"
                                            severity="danger"
                                            [outlined]="true"
                                            styleClass="w-full"
                                            (onClick)="deleteHabit(habit)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <div class="card flex flex-col items-center justify-center text-center py-16">
                    <div
                        class="flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-400/10 mb-5"
                        style="width: 5rem; height: 5rem"
                    >
                        <i class="pi pi-list-check text-primary text-3xl"></i>
                    </div>

                    <h2 class="text-2xl font-semibold m-0">
                        No hay hábitos para mostrar
                    </h2>

                    <p class="text-muted-color mt-3 mb-6">
                        Crea tu primer hábito y comienza a registrar tu progreso.
                    </p>

                    <p-button
                        label="Crear hábito"
                        icon="pi pi-plus"
                        routerLink="/habits/new"
                    />
                </div>
            }
        </div>
    `
})
export class HabitList {
    filter: 'ALL' | 'ACTIVE' | 'INACTIVE' = 'ALL';

    habits: HabitMock[] = [
        {
            id: 1,
            name: 'Beber agua',
            category: 'HIDRATACIÓN',
            goal: 8,
            unit: 'vasos',
            active: true,
            createdAt: '20/07/2026',
            progress: 75,
            icon: 'pi-tint'
        },
        {
            id: 2,
            name: 'Leer diariamente',
            category: 'LECTURA',
            goal: 30,
            unit: 'minutos',
            active: true,
            createdAt: '18/07/2026',
            progress: 100,
            icon: 'pi-book'
        },
        {
            id: 3,
            name: 'Ejercicio cardiovascular',
            category: 'EJERCICIO',
            goal: 45,
            unit: 'minutos',
            active: true,
            createdAt: '15/07/2026',
            progress: 40,
            icon: 'pi-heart'
        },
        {
            id: 4,
            name: 'Meditación',
            category: 'BIENESTAR',
            goal: 15,
            unit: 'minutos',
            active: false,
            createdAt: '10/07/2026',
            progress: 0,
            icon: 'pi-sun'
        },
        {
            id: 5,
            name: 'Planificar el día',
            category: 'PRODUCTIVIDAD',
            goal: 1,
            unit: 'plan',
            active: true,
            createdAt: '08/07/2026',
            progress: 100,
            icon: 'pi-calendar'
        },
        {
            id: 6,
            name: 'Consumir frutas',
            category: 'NUTRICIÓN',
            goal: 3,
            unit: 'porciones',
            active: false,
            createdAt: '05/07/2026',
            progress: 30,
            icon: 'pi-apple'
        }
    ];

    get filteredHabits(): HabitMock[] {
        if (this.filter === 'ACTIVE') {
            return this.habits.filter(habit => habit.active);
        }

        if (this.filter === 'INACTIVE') {
            return this.habits.filter(habit => !habit.active);
        }

        return this.habits;
    }

    filterHabits(filter: 'ALL' | 'ACTIVE' | 'INACTIVE'): void {
        this.filter = filter;
    }

    changeStatus(habit: HabitMock): void {
        habit.active = !habit.active;
    }

    deleteHabit(habit: HabitMock): void {
        const confirmed = window.confirm(
            `¿Deseas eliminar el hábito "${habit.name}"?`
        );

        if (!confirmed) {
            return;
        }

        this.habits = this.habits.filter(
            currentHabit => currentHabit.id !== habit.id
        );
    }
}
