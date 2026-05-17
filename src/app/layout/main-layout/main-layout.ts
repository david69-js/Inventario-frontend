import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Navbar],
  template: `
    <div class="app-container">
      <app-navbar />
      <div class="app-body">
        <app-sidebar />
        <main class="app-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class MainLayout {}
