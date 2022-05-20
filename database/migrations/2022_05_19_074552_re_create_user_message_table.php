<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('user_message', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sd_id');
            $table->foreign('sd_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('rcv_id');
            $table->foreign('rcv_id')->references('id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('msg_id');
            $table->foreign('msg_id')->references('id')->on('message')->onDelete('cascade');
            $table->tinyInteger('type')->default(0);
            $table->tinyInteger('seen')->default(0)->comment('1:seen');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('user_message');
    }
};
