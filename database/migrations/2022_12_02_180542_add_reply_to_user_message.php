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
        Schema::table('user_message', function (Blueprint $table) {
            $table->unsignedBigInteger('reply_msg_id')->after("msg_id")->nullable();
            $table->foreign('reply_msg_id')->references('id')->on('message')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_message', function (Blueprint $table) {
            //
        });
    }
};
