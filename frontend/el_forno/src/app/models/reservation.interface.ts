export interface Reservation {
    idBooking: number;
    name: string;
    phone: string;
    place: string;
    numberPeople: number;
    date: Date;
    time: string;
    isDeleted: boolean;
}