import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCollectionDialogComponent } from './collection-choice-dialog.component';

describe('CollectionChoiceDialogComponent', () => {
  let component: CreateCollectionDialogComponent;
  let fixture: ComponentFixture<CreateCollectionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCollectionDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCollectionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
