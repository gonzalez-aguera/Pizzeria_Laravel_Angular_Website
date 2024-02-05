<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\IngredientController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group( function () {
    Route::get('/logout', [AuthController::class, 'logout']);
});

//auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

//customer
Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']);
Route::get('/customers/{customer}', [CustomerController::class, 'show']);
Route::put('/customers/{customer}', [CustomerController::class, 'update']);
Route::delete('/customers/{customer}', [CustomerController::class, 'destroy']);

//product
Route::get('/products', [ProductController::class, 'index']);
Route::post('/products', [ProductController::class, 'store']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::put('/products/{product}', [ProductController::class, 'update']);
Route::delete('/products/{product}', [ProductController::class, 'destroy']);
Route::get('/products/{name}', [ProductController::class, 'checkProductByName']);

//booking
Route::get('/bookings', [BookingController::class, 'index']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{booking}', [BookingController::class, 'show']);
Route::put('/bookings/{booking}', [BookingController::class, 'update']);
Route::delete('/bookings/{booking}', [BookingController::class, 'destroy']);

//ingredient
Route::get('/ingredients', [IngredientController::class, 'index']);
Route::post('/ingredients', [IngredientController::class, 'store']);
Route::delete('/ingredients/{ingredient}', [IngredientController::class, 'destroy']);

//cart
Route::get('/carts', [CartController::class, 'index']);
Route::post('/carts', [CartController::class, 'addToCart']);
Route::get('/carts/{idCustomer}', [CartController::class, 'show']);
Route::put('/carts/{idProduct}/{idCustomer}', [CartController::class, 'updateQuantity']);
Route::delete('/carts/{cart}', [CartController::class, 'destroy']);
Route::delete('/carts/{idProduct}/{idCustomer}', [CartController::class, 'deleteProduct']);

//order
Route::get('/orders', [CartController::class, 'index']);
Route::post('/orders', [CartController::class, 'store']);
Route::get('/orders/{idCustomer}', [CartController::class, 'show']);
Route::delete('/orders/{cart}', [CartController::class, 'destroy']);
