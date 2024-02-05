<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_product', function (Blueprint $table) {
            $table->id('idCart');
            $table->bigInteger('idCustomer')->unsigned();
            $table->bigInteger('idProduct')->unsigned();
            $table->date('date')->default(today());
            $table->string('time');
            $table->integer('quantity')->default(1);
            $table->float('totalPrice')->default(0);
            $table->boolean('isDeleted')->default(false);
            $table->enum('order',['PickUp','TakeAway'])->default('PickUp');
            $table->timestamps();

            $table->foreign('idCustomer')->references('idCustomer')->on('users')->onDelete('cascade');
            $table->foreign('idProduct')->references('idProduct')->on('products')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_product');
    }
};
