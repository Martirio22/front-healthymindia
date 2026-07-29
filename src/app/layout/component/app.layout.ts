import {
    Component,
    computed,
    effect,
    inject,
    OnDestroy,
    OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AppTopbar } from './app.topbar';
import { AppSidebar } from './app.sidebar';
import { AppFooter } from './app.footer';
import { SessionExpirationDialog } from './session-expiration-dialog';

import { LayoutService } from '@/app/layout/service/layout.service';
import { SessionManagerService } from '@/app/core/auth/services/session-manager.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        AppTopbar,
        AppSidebar,
        AppFooter,
        SessionExpirationDialog
    ],
    template: `
        <div
            class="layout-wrapper"
            [ngClass]="containerClass()"
        >
            <app-topbar />

            <app-sidebar />

            <div class="layout-main-container">
                <div class="layout-main">
                    <router-outlet />
                </div>

                <app-footer />
            </div>

            <div class="layout-mask"></div>
        </div>

        <app-session-expiration-dialog />
    `
})
export class AppLayout
    implements OnInit, OnDestroy {

    readonly layoutService =
        inject(LayoutService);

    private readonly sessionManager =
        inject(SessionManagerService);

    readonly containerClass = computed(() => {
        const config =
            this.layoutService.layoutConfig();

        const state =
            this.layoutService.layoutState();

        return {
            'layout-overlay':
                config.menuMode === 'overlay',

            'layout-static':
                config.menuMode === 'static',

            'layout-static-inactive':
                state.staticMenuDesktopInactive &&
                config.menuMode === 'static',

            'layout-overlay-active':
                state.overlayMenuActive,

            'layout-mobile-active':
                state.mobileMenuActive
        };
    });

    constructor() {
        effect(() => {
            const state =
                this.layoutService.layoutState();

            if (state.mobileMenuActive) {
                document.body.classList.add(
                    'blocked-scroll'
                );
            } else {
                document.body.classList.remove(
                    'blocked-scroll'
                );
            }
        });
    }

    ngOnInit(): void {
        this.sessionManager.start();
    }

    ngOnDestroy(): void {
        this.sessionManager.stop();

        document.body.classList.remove(
            'blocked-scroll'
        );
    }
}
