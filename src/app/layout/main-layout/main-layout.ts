import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Navbar],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <app-sidebar class="shrink-0" />
      <div class="flex-1 flex flex-col min-w-0">
        <app-navbar />
        <main class="flex-1 overflow-y-auto">
          <div class="px-8 py-8 max-w-7xl mx-auto">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
})
export class MainLayout {}
