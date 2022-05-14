<?php

namespace App\Console\Commands;

use App\Models\Message;
use Illuminate\Console\Command;

class ClearMessage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'msg:refresh';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        if (Message::with('user')->delete()) {
            return $this->info("Success Refresh Messages");
        }
        return $this->error("Failed Refresh Messages");
    }
}
