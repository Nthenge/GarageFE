import { Component, ElementRef, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthDialog } from '../../core/auth/auth-dialog';
//import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer implements AfterViewInit {

  constructor(private el: ElementRef, 
    @Inject(PLATFORM_ID) private platformId: Object,
    private authDialog: AuthDialog
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target); // stop observing once animated
            }
          });
        },
        { threshold: 0.2 } // when 20% of the element is visible
      );

      const columns = this.el.nativeElement.querySelectorAll('.footer-col');
      columns.forEach((col: HTMLElement) => observer.observe(col));
    }
  }

  openLogin(): void {
    this.authDialog.openLogin();
  }

  openRegister(): void {
    this.authDialog.openRegister();
  }

}
