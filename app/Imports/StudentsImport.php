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
                \Log::error("Error converting date: {$row[3]}. Exception: {$e->getMessage()}");
            }
        }
    
        return Students::firstOrNew(['parent_guardian_email' => $row[2]], [
            'first_name' => $row[0] ?? null,
            'last_name' => $row[1] ?? null,
            'date_of_birth' => $dateOfBirth ?? null,
            'address' => $row[4] ?? null,
            'city' => $row[5] ?? null,
            'state' => $row[6] ?? null,
            'zip' => $row[7] ?? null,
            'grade' => $row[8] ?? null, // Use null if key 8 is undefined
            'faculty_id' => ($role === 'Teacher' && $permissions->contains('can_add_student')) ? Auth::guard('faculty')->id() : null
        ]);
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
    return ['parent_guardian_email'];
}

    

   

}

?>