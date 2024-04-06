<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Faculty;
use App\Models\Students;
use App\Models\User;
use App\Models\Banned;
use App\Models\LoginAttempts;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

use Illuminate\Contracts\Console\PromptsForMissingInput;

class GenerateReports extends Command implements PromptsForMissingInput
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nhic:generate-reports {email} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generates Reports for faculty team, students, users, and banned Ip addresses';

    /**
     * Execute the console command.
     */
    public function handle()
    {
      
        $email = $this->argument('email');
        $password = $this->argument('password');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->error('The email you entered: ' . $email . ' must be a valid email address. Re-run the command to try again.');
        }

        else{
        
    
        $user = Faculty::select('email', 'password', 'role')->where('email', $email)->first();
        if (!$user) {
            $this->error('User with email ' . $email . ' not found');
            return;
        } 

        
        
        elseif (!Hash::check($password, $user->password)) {
            $this->error('Invalid password, re-run command to try again');
            return;
        }
        if($user->role !== 'Admin'){
            $this->error('You are not authorized to access this information');
        }
        else{
      
        $this->info('Generating Report...');
    
        // Fetch data from database
        $faculty = Faculty::select('name', 'email', 'phone')->get();
        $students = Students::select('first_name', 'last_name', 'date_of_birth', 'address', 'street_address_2', 'city', 'state', 'zip')->get();
        $parents = User::select('name', 'email', 'phone', 'address', 'address_2', 'city', 'state', 'zip')->get();
        $banned = Banned::select('client_ip')->get();
        $attempts = LoginAttempts::select('email_used', 'client_ip', 'location_information', 'is_blocked')->get();
        
        foreach ($banned as $ban) {
            $ban->client_ip = Crypt::decryptString($ban->client_ip);
        }

        foreach ($attempts as $attempt) {
            $attempt->client_ip = Crypt::decryptString($attempt->client_ip);
        }

    
        // Output data to console
        $this->info('Faculty Data:');
        $this->table(['Name', 'Email', 'Phone'], $faculty->toArray());
    
        if($students->isEmpty()){
            $this->error('No data for students');
        }
        else{
        $this->info('Students Data:');
        $this->table(['First Name', 'Last Name', 'Date of Birth', 'Address', 'Street Address 2', 'City', 'State', 'Zip'], $students->toArray());
        }

        if($parents->isEmpty()){
            $this->error('No data for parents');
        }
        else{
        $this->info('Parents Data:');
        $this->table(['Name', 'Email', 'Phone', 'Address', 'Street Address 2', 'City', 'State', 'Zip'], $parents->toArray());
        }

        if($banned->isEmpty()){
            $this->error('No data for banned IPs');
        }
        else{
        $this->info('Banned IPs:');
        $this->table(['Client IP'], $banned->toArray());
        }

        if($attempts->isEmpty()){
            $this->error('No data for failed login attempts');
        }
        else{
            $this->info('Failed Login Attempts:');
            $this->table(['Email', 'Client IP', 'Location Information', 'Is Blocked'], $attempts->toArray());
        }
        
    
        $this->info('Finished Generating Report!');
    }
    }
    }
}
