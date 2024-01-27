<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::table('faculty')->insert([
            'faculty_id'=>'1',
            'name'=>'Test Admin',
            'email'=>'khalednached@gmail.com',
            'role'=>'Admin',
            'password'=>Hash::make('MarioKart8!'),
        ]);
    }
}
