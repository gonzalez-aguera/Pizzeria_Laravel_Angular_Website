<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'products';

    protected $primaryKey = 'idProduct';

    protected $fillable = [
        'idProduct',
        'name',
        'photo',
        'description',
        'isDeleted',
        'type',
        'price'
    ];


    public function users(){
        return $this->belongsToMany(User::class, 'user_product', 'idProduct', 'idCustomer')
        ->withPivot( 'quantity', 'totalPrice');
    }
}
