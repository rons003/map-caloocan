import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-resident-info-attachment',
  standalone: true,
  imports: [],
  templateUrl: './resident-info-attachment.component.html',
  styleUrl: './resident-info-attachment.component.scss'
})
export class ResidentInfoAttachmentComponent {

  img_src: string = '';

  constructor(private activeModal: NgbActiveModal){
    
  }


  closeModal() {
    this.activeModal.close('close');
  }

}
