<?php 

namespace App\Imports;

use App\Models\Students;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\ImportFailed;
use App\Notifications\ImportHasFailedNotification;
use Carbon\Carbon;


class StudentsImport implements ToModel, WithBatchInserts, WithChunkReading, WithUpserts{

 

    public function model(array $row)
    {
        $role = Auth::guard('faculty')->user()->role;
        $permissions = collect(Auth::guard('faculty')->user()->permissions);
        $dateOfBirth = null;
    
        // Check if the date column is set and not empty
        if (isset($row[3]) && !empty($row[3])) {
            try {
                $dateOfBirth = Carbon::parse($row[3])->format('Y-m-d');
            } catch (\Exception $e) {
              
                \Log::error("Import Exception: {$e->getMessage()}");
            }
        }
    
        return Students::firstOrNew(
            [
                'first_name' => $row[0] ?? null,
                'last_name' => $row[1] ?? null,
            ],
            [
                'gender' => $row[2] ?? null,
                'date_of_birth' => $dateOfBirth ?? null,
                'address' => $row[3] ?? null,
                'street_address_2' => $row[4] ?? null,
                'city' => $row[5] ?? null,
                'state' => $row[6] ?? null,
                'zip' => $row[7] ?? null,
                'grade' => $row[8] ?? null,
                'allergies_or_special_needs' => $row[9] ?? null,
                'emergency_contact_person' => $row[10] ?? null, 
                'emergency_contact_hospital' => $row[11] ?? null, 
                'user_id' => $row[12] ?? null, 
                'faculty_id' => $role === 'Teacher' ? Auth::guard('faculty')->id() : null
            ]
        );
        
    }
    
    
    
    

    
    
    public function chunkSize(): int {
        return 100; // To decrease memory usage, reads the spreadsheet in chunks of 100 rows 
    }
    // Decrease the number of models 
    public function batchSize(): int {
        return 100;
    }

    // upserts if the student already exists, will update the model 
    // instead of adding a new row 
    public function uniqueBy()
    {
        return ['first_name', 'last_name'];
    }
    

    

   

}

?>