import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { User } from '../../../models/user.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  profileForm: FormGroup | any;  
  isEditing: boolean = false;
  originalProfile: User = {} as User;

  constructor(private profileService: ProfileService,private formBuilder: FormBuilder) {}

  ngOnInit() {
    const storedUserId = localStorage.getItem('user');

    if (storedUserId) {
      const userId = +storedUserId;

      this.profileService.getUserProfile(userId).subscribe(
        (data: any) => {
          if (data !== undefined) {
            this.originalProfile = data.customer;
            this.profileForm = this.formBuilder.group({
              name: [this.originalProfile.name, Validators.required],
              surname: [this.originalProfile.surname, Validators.required],
              email: [this.originalProfile.email, Validators.compose([Validators.required, Validators.email])],
              phone: [this.originalProfile.phone, Validators.compose([Validators.required , Validators.pattern('[0-9]{9}')])],
              address: [this.originalProfile.address, Validators.required],
            });
          }
        },
        () => this.errorfecthUser()
      );
    } else {
      this.errorIdUser();
    }
  }

  startEditing() {
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
  }

  updateProfile() {
    const storedUserId = localStorage.getItem('user');

    if (storedUserId && this.profileForm.valid) {
      const userId = +storedUserId;

      const editUser = {
        ...this.profileForm.value,
        customerRole: 'Customer',
        idCustomer: storedUserId,
      };

      this.profileService.updateProfile(userId, editUser).subscribe(
        () => {
          this.successUpdateUser();
          this.isEditing = false;
          this.originalProfile = editUser;
        },
        () => this.errorUpdateUser(),
      );
    }
  }

  errorUpdateUser() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se pudo actualizar la información del usuario',
    });
  }

  errorfecthUser() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se pudo obtener la información del usuario',
    });
  }

  successUpdateUser() {
    Swal.fire({
      icon: 'success',
      title: 'Usuario actualizado correctamente',
      showConfirmButton: false,
      timer: 1500
    });
  }

  errorIdUser() {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'ID de usuario no se encuentra en el almacenamiento local.',
    });
  }
}