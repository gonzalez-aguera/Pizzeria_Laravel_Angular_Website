import { Component , OnInit} from '@angular/core';
import { Reservation } from 'src/app/models/reservation.interface';
import { BookingService } from 'src/app/services/booking/booking.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  reservations: Reservation[] = [];
  deletedReservations: any[] = [];
  searchDate: string = '';

  constructor(private bookingService: BookingService, private router:Router) {}

  ngOnInit() {
    this.fetchReservations();
  }

  fetchReservations() {
    this.bookingService.fetchReservations().subscribe(
      (data) => this.reservations = data,
      () => this.errorObtenerReservas()
    );
  }
  
  editReservation(reservation: Reservation) {
    const reservationId = reservation.idBooking;
    this.router.navigate(['reservation', reservationId]);
  }

  deleteReservation(reservation: Reservation) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Una vez eliminada, no podrás recuperar esta reserva',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            this.bookingService.deleteReservation(reservation.idBooking).subscribe(
                () => this.successDeleteReservation(reservation),
                () => this.errorDelete()
            );
        }
    });
  }

  successDeleteReservation(reservation: Reservation) {
    reservation.isDeleted = true; 
    this.successDelete(reservation);
  }

  successDelete(reservation: Reservation) {
    this.deletedReservations.push(reservation);
    this.filterDeletedReservations();
    this.successDeleteReservationMessage();
  }

  filterDeletedReservations() {
    this.reservations = this.reservations.filter(reservation => !this.deletedReservations.includes(reservation));
  }

  showAddForm() {
    this.router.navigate(['reservation']);
  }

  applyDateFilter() {
    if (this.searchDate) {
      const formattedSearchDate = this.formatDate(this.searchDate);
      this.reservations = this.reservations.filter(reservation =>
        reservation.date.toString().includes(formattedSearchDate)
      );
    }
  }

  private formatDate(date: string): string {
    const parts = date.split('/');
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  }

  clearDateFilter() {
    this.searchDate = '';
    this.fetchReservations();
  }

  //sweet alert
  successDeleteReservationMessage() {
    Swal.fire({
      title: 'Reserva eliminada',
      icon: 'success',
      confirmButtonText: 'Ok'
    });
  }

  errorDelete() {
    Swal.fire({
      title: 'Error al eliminar la reserva',
      icon: 'error',
      confirmButtonText: 'Ok'
    });
  }

  errorObtenerReservas() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Error al obtener las reservas',
    });
  }

  errorBookingExists() {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Ya existe una reserva con el mismo teléfono',
    });
  }
}