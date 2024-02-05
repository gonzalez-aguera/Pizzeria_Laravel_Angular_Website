<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::where('isDeleted', 0)->get();
        return response()->json($bookings);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'phone' => 'required|integer',
            'numberPeople' => 'required|integer',
            'place' => 'required|string|in:inside,outside',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        $existingBooking = Booking::where('phone', $request->phone)->first();

        if ($existingBooking) {
            if ($existingBooking->isDeleted === 0) {
                return response()->json(['message' => 'Booking with the same phone already exists and is not deleted'], 400);
            }

            $existingBooking->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'numberPeople' => $request->numberPeople,
                'place' => $request->place,
                'date' => $request->date,
                'time' => $request->time,
                'isDeleted' => 0,
            ]);

            return response()->json(['message' => 'Booking updated successfully', 'booking' => $existingBooking], 200);
        }

        $booking = new Booking();
        $booking->name = $request->name;
        $booking->phone = $request->phone;
        $booking->numberPeople = $request->numberPeople;
        $booking->place = $request->place;
        $booking->date = $request->date;
        $booking->time = $request->time;
        $booking->save();

        return response()->json(['message' => 'Booking created successfully', 'booking' => $booking], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $idBooking)
    {
        $booking = Booking::find($idBooking);

        if ($booking) {
            return response()->json(['message' => 'Booking found', 'booking' => $booking], 200);
        }

        return response()->json(['message' => 'Booking not found'],402);    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $idBooking)
    {
        $booking = Booking::find($idBooking);
        if (!$booking) {
            return response()->json(['message' => 'Booking not found'],404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'phone' => 'required|integer',
            'numberPeople' => 'required|integer',
            'place' => 'required|string|in:inside,outside',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        $booking->name = $request->name;
        $booking->phone = $request->phone;
        $booking->numberPeople = $request->numberPeople;
        $booking->place = $request->place;
        $booking->date = $request->date;
        $booking->time = $request->time;
        $booking->update();

        if ($booking){
            return response()->json(['message' => 'Booking updated successfully', 'booking' => $booking], 200);
        }

        return response()->json(['message' => 'Booking not found'],402);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $idBooking)
    {
        $booking = Booking::find($idBooking);

        if ($booking) {
            $booking->update(['isDeleted' => true]);

            return response()->json(['message' => 'Booking deleted successfully', 'booking' => $booking], 200);
        }

        return response()->json(['message' => 'Booking not found'], 404);
    }

}
