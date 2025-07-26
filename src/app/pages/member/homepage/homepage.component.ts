import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit, OnDestroy {
  private mouseX = 0;
  private mouseY = 0;
  private animationId: number = 0;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.addMouseListener();
    this.startAnimation();
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private addMouseListener(): void {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
  }

  private startAnimation(): void {
    const animate = () => {
      this.updateFloatingIcons();
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  private updateFloatingIcons(): void {
    const floatingElements = this.elementRef.nativeElement.querySelectorAll('[class*="floating-"], [class*="priest-floating-"]');
    
    floatingElements.forEach((element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      const elementX = rect.left + rect.width / 2;
      const elementY = rect.top + rect.height / 2;
      
      const deltaX = this.mouseX - elementX;
      const deltaY = this.mouseY - elementY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      if (distance < 200 && distance > 0) {
        const force = (200 - distance) / 200;
        const moveX = (deltaX / distance) * force * 15;
        const moveY = (deltaY / distance) * force * 15;
        
        const currentTransform = element.style.transform || '';
        const baseTransform = currentTransform.includes('rotate') ? currentTransform : '';
        element.style.transform = `translate(${moveX}px, ${moveY}px) ${baseTransform}`;
      } else {
        const currentTransform = element.style.transform || '';
        const baseTransform = currentTransform.includes('rotate') ? currentTransform.replace(/translate\([^)]*\)\s*/, '') : '';
        element.style.transform = `translate(0px, 0px) ${baseTransform}`;
      }
    });
  }
}