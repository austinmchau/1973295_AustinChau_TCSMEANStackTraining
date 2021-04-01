import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreScreenComponent } from './score-screen.component';

describe('ScoreScreenComponent', () => {
  let component: ScoreScreenComponent;
  let fixture: ComponentFixture<ScoreScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoreScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
