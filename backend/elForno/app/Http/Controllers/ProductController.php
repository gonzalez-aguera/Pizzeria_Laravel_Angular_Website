<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::where('isDeleted', false)
            ->where('name', 'not like', '%Personalizada%')
            ->get();
        return response()->json($products);
    }

    public function checkProductByName(string $name)
    {
        $product = Product::where('name', $name)->where('isDeleted', 0)->first();

        if ($product) {
            return response()->json(['message' => 'Product found', 'product' => $product], 200);
        }

        return response()->json(['message' => 'Product not found'], 404);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'photo' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|string|in:pizza,roasted potato,drink,meat',
            'price' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Validation failed', 'errors' => $validator->errors()], 400);
        }

        $existingProduct = Product::where('name', $request->name)->first();

        if ($existingProduct) {
            if ($existingProduct->isDeleted === 0) {
                return response()->json(['message' => 'Product with the same name already exists and is not deleted'], 400);
            }
        }

        $product = new Product();
        $product->name = $request->name;
        $product->photo = $request->photo;
        $product->description = $request->description;
        $product->type = $request->type;
        $product->price = $request->price;
        $product->save();

        return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $idProduct)
    {
        $product = Product::find($idProduct);

        if ($product) {
           return response()->json(['message'=> 'Product found','product' => $product], 200);
        }

        return response()->json(['message' => 'Product not found'], 404);

    }

    /**
     * Update the specified resource in storage.
     */
        public function update(Request $request, string $idProduct)
        {
            $product = Product::find($idProduct);
            if (!$product) {
                return response()->json(['message' => 'Product not found'], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'required|string',
                'photo' => 'required | string',
                'description' => 'required|string',
                'price' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }

            $product->name = $request->name;
            $product->photo = $request->photo;
            $product->description = $request->description;
            $product->price = $request->price;
            $product->update();


            if ($product) {
                return response()->json(['message' => 'Product updated successfully', 'product' => $product], 200);
            }

            return response()->json(['message' => 'Product not found'], 404);
        }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $idProduct)
    {
        $product = Product::find($idProduct);

        if ($product) {
            $product->update(['isDeleted' => true]);

            return response()->json(['message' => 'Product deleted successfully', 'product' => $product], 200);
        }

        return response()->json(['message' => 'Product not found'], 404);
    }

}
