import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.css',
})
export class DeleteConfirmationComponent {
  private dialogRef = inject(MatDialogRef);

  close(result: boolean) {
    this.dialogRef.close(result);
  }
}
