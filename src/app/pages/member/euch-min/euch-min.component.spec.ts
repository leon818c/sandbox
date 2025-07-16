import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuchMinComponent } from './euch-min.component';

describe('EuchMinComponent', () => {
  let component: EuchMinComponent;
  let fixture: ComponentFixture<EuchMinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EuchMinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EuchMinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
