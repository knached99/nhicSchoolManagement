<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Carbon\Carbon;
use App\Models\Banned; 

class UnbanUsers implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    // public function __construct()
    // {
    //     //
    // }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $bannedUsers = Banned::where('banned_until', '=', now()->toDateString()->get());

        foreach($bannedUsers as $banned){
            $banned->delete();
        }
    }
}
