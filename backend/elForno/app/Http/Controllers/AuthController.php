<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{

    // Register a new user
    public function register(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'customerRole' => 'required|enum:Customer,Admin', // Utiliza la regla personalizada 'enum'
            'phone' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'address' => 'required|string|max:255',
            'password' => 'required|string|min:6',
        ]);

        // If validation fails, return error
        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'customerRole' => $request->customerRole,
            'phone' => $request->phone,
            'email' => $request->email,
            'address' => $request->address,
            'password' => Hash::make($request->password),
        ]);

        // Create a token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the token
        return response()->json([
            'data'=> $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // Login an existing user
    public function login(Request $request){

        // si estas o no logueado
        if (!Auth::attempt($request->only('email', 'password'))){
            return response()
                ->json([
                    'message' => 'Unauthorized'
                ], 401);
        }

        //quiero que me devuelva el usuario que coincida que tenga ese email y esa contraseña
        $user = User::where('email', $request->email)->firstOrFail();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    // Logout an existing user
    public function logout(){
        auth()->user()->tokens()->delete();

        return [
            'message' => 'Logged out'
        ];
    }
}
