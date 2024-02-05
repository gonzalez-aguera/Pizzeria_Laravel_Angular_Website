<?php

namespace App\Http\Controllers;

use App\Models\Ingredient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class IngredientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ingredients = Ingredient::where('isDeleted', false)->get();;
        return response()->json($ingredients);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'productType' => 'required|string|in:Pizza,Papa',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $existingIngredient = Ingredient::where('name', $request->name)
            ->where('productType', $request->productType)
            ->first();

        if ($existingIngredient) {
            // Si el ingrediente no está eliminado, devuelve un error
            if ($existingIngredient->isDeleted === 0) {
                return response()->json(['message' => 'Ingredient with the same name already exists and is not deleted'], 400);
            } else {
                $existingIngredient->isDeleted = 0;
                $existingIngredient->save();
                return response()->json(['message' => 'Ingredient restored successfully', 'ingredient' => $existingIngredient], 200);
            }
        }

        $ingredient = new Ingredient();
        $ingredient->name = $request->name;
        $ingredient->productType = $request->productType;
        $ingredient->save();

        return response()->json(['message' => 'Ingredient created successfully', 'ingredient' => $ingredient], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $idIngredient)
    {
        $ingredient = Ingredient::find($idIngredient);

        if ($ingredient) {
            $ingredient->update(['isDeleted' => true]);
            return response()->json(['message' => 'Ingredient deleted successfully'], 200);
        }

        return response()->json(['message' => 'Ingredient not found'], 404);
    }
}
