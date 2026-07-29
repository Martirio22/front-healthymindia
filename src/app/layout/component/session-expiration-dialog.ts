import { CommonModule } from '@angular/common';
import {
    Component,
    inject
} from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';

import { SessionManagerService } from '@/app/core/auth/services/session-manager.service';

@Component({
    selector:
        'app-session-expiration-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        DialogModule,
        MessageModule,
        ProgressBarModule
    ],
    template: `
        <p-dialog
            header="Tu sesión está por expirar"
            [visible]="
                sessionManager.dialogVisible()
            "
            [modal]="true"
            [closable]="false"
            [closeOnEscape]="false"
            [dismissableMask]="false"
            [draggable]="false"
            [resizable]="false"
            appendTo="body"
            styleClass="w-[92vw] sm:w-[30rem]"
        >
            <div
                class="flex flex-col items-center text-center gap-5 pt-2"
            >
                <div
                    class="flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-400/10"
                    style="
                        width: 5rem;
                        height: 5rem;
                    "
                >
                    <i
                        class="pi pi-clock text-orange-500 text-3xl"
                    ></i>
                </div>

                <div>
                    <h2
                        class="text-2xl font-semibold mt-0 mb-3"
                    >
                        ¿Deseas mantener tu sesión?
                    </h2>

                    <p
                        class="text-muted-color leading-6 m-0"
                    >
                        Por seguridad, tu sesión se cerrará
                        automáticamente si no realizas ninguna acción.
                    </p>
                </div>

                <div
                    class="flex items-center justify-center rounded-full border-4 border-orange-200 dark:border-orange-800"
                    style="
                        width: 6rem;
                        height: 6rem;
                    "
                >
                    <span
                        class="text-3xl font-semibold text-orange-500"
                    >
                        {{
                            sessionManager
                                .secondsRemaining()
                        }}
                    </span>
                </div>

                <span
                    class="text-muted-color"
                >
                    segundos restantes
                </span>

                <p-progressbar
                    [value]="progressValue"
                    [showValue]="false"
                    styleClass="w-full h-2"
                />

                @if (
                    sessionManager.errorMessage()
                ) {
                    <p-message
                        severity="error"
                        [text]="
                            sessionManager
                                .errorMessage()
                        "
                        styleClass="w-full text-left"
                    />
                }
            </div>

            <ng-template #footer>
                <div
                    class="flex flex-col-reverse sm:flex-row justify-end gap-3 w-full"
                >
                    <p-button
                        label="Cerrar sesión"
                        icon="pi pi-sign-out"
                        severity="secondary"
                        [outlined]="true"
                        [disabled]="
                            sessionManager.refreshing()
                        "
                        (onClick)="
                            sessionManager
                                .closeSession()
                        "
                    />

                    <p-button
                        label="Mantener sesión"
                        icon="pi pi-refresh"
                        [loading]="
                            sessionManager.refreshing()
                        "
                        (onClick)="
                            sessionManager
                                .keepSession()
                        "
                    />
                </div>
            </ng-template>
        </p-dialog>
    `
})
export class SessionExpirationDialog {
    readonly sessionManager =
        inject(SessionManagerService);

    get progressValue(): number {
        return Math.max(
            0,
            Math.min(
                100,
                (
                    this.sessionManager
                        .secondsRemaining() /
                    30
                ) * 100
            )
        );
    }
}
