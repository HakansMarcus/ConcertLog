import { provideNativeDateAdapter } from '@angular/material/core';
import { Component, inject, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { BandService } from '../../band.service';
import { Band } from '../band.model';

@Component({
  selector: 'app-add-band',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: 'add-band.html',
  styleUrl: 'add-band.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBand {
  // MODE: add or edit
  mode = signal<'add' | 'edit'>('add');

  private bandService = inject(BandService);
  private snackBar = inject(MatSnackBar);
  private dialogRef = inject(MatDialogRef<AddBand>, { optional: true });
  private data = inject(MAT_DIALOG_DATA, { optional: true });

  // FORM
  protected signUpForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: Validators.required }),
    city: new FormControl('', { nonNullable: true, validators: Validators.required }),
    date: new FormControl<Date | null>(null, { validators: Validators.required }),
    venue: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    // set mode (add/edit)
    if (this.data?.mode) {
      this.mode.set(this.data.mode);
    }

    // preload form when editing
    if (this.data?.band) {
      this.signUpForm.patchValue({
        name: this.data.band.name,
        city: this.data.band.city,
        venue: this.data.band.venue,
        date: new Date(this.data.band.date),
      });
    }
  }

  closeModal() {
    this.dialogRef?.close();
  }

  save() {
    if (!this.signUpForm.valid) return;

    const form = this.signUpForm.getRawValue();

    const formattedDate = form.date
      ? form.date.getFullYear() +
        '-' +
        String(form.date.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(form.date.getDate()).padStart(2, '0')
      : '';

    // EDIT MODE
    if (this.mode() === 'edit' && this.data?.band) {
      const updatedBand: Band = {
        ...this.data.band,
        name: form.name,
        city: form.city,
        date: formattedDate,
        venue: form.venue ?? '',
      };

      this.bandService.updateRecord(updatedBand);

      this.snackBar.open('Band updated successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }

    // ADD MODE
    else {
      const newBand: Band = {
        id: Date.now(),
        name: form.name,
        city: form.city,
        date: formattedDate,
        venue: form.venue ?? '',
        festival: '',
      };

      this.bandService.addBand(newBand);

      this.snackBar.open('Band added successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });
    }

    this.dialogRef?.close();
  }
}
