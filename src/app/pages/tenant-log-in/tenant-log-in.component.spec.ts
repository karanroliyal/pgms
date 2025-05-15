import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantLogInComponent } from './tenant-log-in.component';

describe('TenantLogInComponent', () => {
  let component: TenantLogInComponent;
  let fixture: ComponentFixture<TenantLogInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TenantLogInComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TenantLogInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
