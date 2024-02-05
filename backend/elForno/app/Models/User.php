<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $table = 'users';

    protected $primaryKey = 'idCustomer';

    protected $fillable = [
        'idCustomer',
        'name',
        'surname',
        'customerRole',
        'phone',
        'email',
        'address',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function products()
    {
        //foreign key es el nombre de la columna de la pivot que hace referencia a este modelo
        //related key es el nombre de la columna de la pivot que hace referencia al Product

        return $this->belongsToMany(Product::class, 'user_product', 'idCustomer', 'idProduct')
            ->withPivot('quantity', 'totalPrice');
    }

    // un usuario tiene muchos pedidos

    public function orders(){
        return $this->hasMany(Order::class,'idCustomer');
    }


}
