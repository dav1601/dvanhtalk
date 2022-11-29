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
            $table->smallInteger('type_msg')->tinyInteger('type_msg')->default(1)->comment('1:message , 2:images , 3: auido, 4:noti group , 5: msg call , 6: audio record , 7: video')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
    }
};
