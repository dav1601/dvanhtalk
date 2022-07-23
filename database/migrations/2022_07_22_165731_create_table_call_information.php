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
        Schema::create('call_information', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger("user_message_id");
            $table->string("process");
            $table->string("status");
            $table->string("duration")->nullable();
            $table->string("file_save")->nullable();
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
        Schema::dropIfExists('call_information');
    }
};
