<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customers = User::all();
        return response()->json($customers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'customerRole' => 'sometimes|string|in:Admin,Customer',
            'phone' => ['required','integer','unique:users', 'min:9'],
            'email' => ['required','string','unique:users'],
            'address' => 'required|string|max:255',
            'password' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $customer = new User();
        $customer->name = $request->name;
        $customer->surname = $request->surname;
        $customer->customerRole = $request->customerRole;
        $customer->phone = $request->phone;
        $customer->email = $request->email;
        $customer->address = $request->address;
        $customer->password = $request->password;
        $customer->save();

        return response()->json(['message' => 'Customer created successfully', 'customer'=> $customer], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $idCustomer)
    {
        $customer = User::find($idCustomer);

        if ($customer) {
            return response()->json(['message' => 'Customer found', 'customer' => $customer], 200);
        }

        return response()->json(['message' => 'Customer not found'], 404);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $idCustomer)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'customerRole' => 'sometimes|string|in:Admin,Customer',
            'phone' => ['required','integer', Rule::unique('users')->ignore($idCustomer, 'idCustomer'), 'min:9'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($idCustomer, 'idCustomer')],
            'address' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $customer = User::find($idCustomer);

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        $customer->name = $request->name;
        $customer->surname = $request->surname;
        $customer->phone = $request->phone;
        $customer->email = $request->email;
        $customer->address = $request->address;
        $customer->update();

        if ($customer){
            return response()->json(['message' => 'Customer updated successfully', 'customer' => $customer], 200);
        }

        return response()->json(['message' => 'Customer updated successfully', 'customer' => $customer], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $idCustomer)
    {
        $customer = User::find($idCustomer);

        if ($customer) {
            $customer->delete();
            return response()->json(['message' => 'Customer deleted successfully'], 200);
        }

        return response()->json(['message' => 'Customer not found'], 404);
    }
}
