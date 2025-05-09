import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';
import { provideRouter } from '@angular/router';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls closePopup() method', () => {
    spyOn(component, 'closePopup');

    component.closePopup();

    expect(component.closePopup).toHaveBeenCalled();
  });

  it('calls requestFreeConsultation() method', () => {
    spyOn(component, 'requestFreeConsultation');

    component.requestFreeConsultation();

    expect(component.requestFreeConsultation).toHaveBeenCalled();
  });
});
