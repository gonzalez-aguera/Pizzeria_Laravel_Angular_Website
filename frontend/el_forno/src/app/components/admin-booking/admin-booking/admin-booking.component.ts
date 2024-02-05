import { Component} from '@angular/core';
import { Reservation } from 'src/app/models/reservation.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookingService } from 'src/app/services/booking/booking.service';
import { Router,ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-booking',
  templateUrl: './admin-booking.component.html',
  styleUrls: ['./admin-booking.component.scss']
})
export class AdminBookingComponent {
  reservations: Reservation[] = [];
  showForm: boolean = false;
  reservationForm: FormGroup;
  isEditing: boolean = false;
  idReservation: number = 0;

  constructor(private formBuilder: FormBuilder, private bookingService: BookingService, private route: ActivatedRoute, private router: Router) {
    this.reservationForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['',  Validators.compose([Validators.required , Validators.pattern('[0-9]{9}')])],
      place: ['', Validators.required],
      numberPeople: [0, Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  ngOnInit() :void {
    this.route.params.subscribe((params) => {
      const reservationId = params['id'];
      this.idReservation = reservationId;

      if (reservationId) {
        this.isEditing = true;
        this.bookingService.getReservationById(reservationId).subscribe(
          (response) => {
            if (response.message === 'Booking found') {
              const { name, phone, place, numberPeople, date, time } = response.booking;

              this.reservationForm = this.formBuilder.group({
                name: [name, Validators.required],
                phone: [phone, Validators.compose([Validators.required , Validators.pattern('[0-9]{9}')])],
                place: [place, Validators.required],
                numberPeople: [numberPeople, Validators.required],
                date: [date, Validators.required],
                time: [time, Validators.required],
              });
            } else {
              this.errorfecthReservation();
            }
          },
          () => {
            this.errorfecthReservation();
          }
        );
      }
    });
  }

  editReservation() {
    const valuesForm = this.reservationForm.value;

    const newProduct = {
      ...this.reservationForm.value,
      idBooking: this.idReservation,
      time: valuesForm.time.substring(0, 5)
      }

    this.bookingService.updateReservation(newProduct).subscribe(
      (response) => {
        if (response.message === 'Booking updated successfully') {
          this.successUpdateReservation();
          this.reservations = [...this.reservations.filter(res => res.idBooking !== response.booking.id), response.booking];
          this.router.navigate(['booking']);
        } else if (response.message === 'Booking with the same phone already exists and is not deleted') {
          this.errorBookingExistsNotDeleted();
        } else {
          this.errorfecthReservation();
        }
      },
      () =>this.errorfecthReservation()
    );
  }

  addReservation() {
    if (this.reservationForm.valid) {
      this.bookingService.addReservation(this.reservationForm.value).subscribe(
        (response) => {
          if (response.message === 'Booking created successfully') {
            this.successAddReserva();
            this.reservations = [...this.reservations, response.booking];
            this.clearForm();
            this.router.navigate(['booking']);
          } else if (response.message === 'Booking with the same phone already exists and is not deleted') {
            this.errorBookingExistsNotDeleted();
          } else if (response.message === 'Booking updated successfully') {
            this.successUpdateReservation();
            this.reservations = [...this.reservations.filter(res => res.idBooking !== response.booking.id), response.booking];
            this.clearForm();
            this.router.navigate(['booking']);
          } else {
            this.errorAgregarReserva();
          }
        },
        () => {
          this.errorAgregarReserva();
        }
      );
    }
  }

  clearForm() {
    this.reservationForm.reset();
  }

  goBack(){
    window.history.back();
  }

  //sweet alert
  errorfecthReservation() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se ha podido obtener la reserva',
    }).then(() => {
      this.router.navigate(['reservation']);
    });
  }

  errorAgregarReserva() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al agregar la reserva',
    });
  }

  successAddReserva() {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Reserva agregada con éxito',
    });
  }

  successUpdateReservation() {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Reserva actualizada con éxito',
    });
  }
  
  errorBookingExistsNotDeleted() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ya existe una reserva activa con el mismo teléfono',
    });
  }
}