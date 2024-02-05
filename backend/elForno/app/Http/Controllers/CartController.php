<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $carts = DB::table('user_product')
            ->join('products', 'user_product.idProduct', '=', 'products.idProduct')
            ->join('users', 'user_product.idCustomer', '=', 'users.idCustomer')
            ->select('user_product.idCart','user_product.idCustomer','users.name as name', 'users.surname' , 'users.phone', 'users.address', 'products.idProduct',
                'products.name as producto', 'products.description', 'products.price', 'user_product.quantity', 'user_product.totalPrice', 'user_product.date', 'user_product.time','user_product.order')
            ->where('user_product.isDeleted', '=', false)
            ->get();

        return response()->json($carts);

    }

    /**
     * Display a listing of the resource.
     */
    public function addToCart(Request $request)
    {
        $productos = $request->input('productos');

    foreach ($productos as $producto) {
        DB::table('user_product')->insert([
            'idCustomer' => $producto['idCustomer'],
            'idProduct' => $producto['idProduct'],
            'quantity' => $producto['quantity'],
            'totalPrice' => $producto['totalPrice'],
            'date' => now(),
            'time' => $producto['time'],
            'order' => $producto['order']
        ]);
    }
        Product::where('name', 'like', '%Personalizada%')->update(['isDeleted' => true]);
        return response()->json(['mensaje' => 'Productos agregados al carrito con éxito']);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $idCustomer)
    {
        $customer = User::find($idCustomer);

        if ($customer) {
            $cart = DB::table('user_product')
                ->join('products', 'user_product.idProduct', '=', 'products.idProduct')
                ->join('users', 'user_product.idCustomer', '=', 'users.idCustomer')
                ->select('user_product.idCart', 'user_product.idCustomer', 'users.name', 'users.surname', 'users.phone', 'users.address', 'products.idProduct',
                    'products.name as producto', 'products.description', 'products.price', 'user_product.quantity', 'user_product.totalPrice')
                ->where('user_product.idCustomer', '=', $idCustomer)
                ->get();

            return response()->json(['message' => 'Cart found', 'cart' => $cart], 200);
        }

        return response()->json(['message' => 'Cart not found'], 404);

    }

    /**
     * Update the specified resource in storage.
     */
    public function updateQuantity(string $idProduct, string $idCustomer)
    {
        $cartItem = DB::table('user_product')
            ->where('idProduct', $idProduct)
            ->where('idCustomer', $idCustomer)
            ->first();

        if ($cartItem) {
            // Reduce la cantidad en 1
            DB::table('user_product')
                ->where('idProduct', $idProduct)
                ->where('idCustomer', $idCustomer)
                ->decrement('quantity', 1);

            // Obtén la cantidad actualizada
            $updatedQuantity = DB::table('user_product')
                ->where('idProduct', $idProduct)
                ->where('idCustomer', $idCustomer)
                ->value('quantity');

            // Si la cantidad llega a cero, elimina el producto
            if ($updatedQuantity === 0) {
                $this->deleteProduct($idProduct, $idCustomer);
            }

            return response()->json(['message' => 'Quantity reduced successfully'], 200);
        } else {
            return response()->json(['message' => 'Item not found in the cart'], 404);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $affectedRows = DB::table('user_product')
            ->where('idCart', $id)
            ->update(['isDeleted' => true]);

        if ($affectedRows == 0) {
            return response()->json(['message' => 'La relación no fue encontrada'], 404);
        }

        return response()->json(['message' => 'La relación fue marcada como eliminada lógicamente'], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function deleteProduct(string $idProduct, string $idCustomer)
    {
        $cartItem = DB::table('user_product')
            ->where('idProduct', $idProduct)
            ->where('idCustomer', $idCustomer)
            ->first();

        if ($cartItem) {
            // Elimina el producto directamente
            DB::table('user_product')->where('idProduct', $idProduct)->where('idCustomer', $idCustomer)->delete();

            return response()->json(['message' => 'Product deleted from cart successfully'], 200);
        }

        return response()->json(['message' => 'Product not found'], 404);
    }


}
