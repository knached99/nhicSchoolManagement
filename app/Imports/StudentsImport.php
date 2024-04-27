<?php 

namespace App\Imports;

use App\Models\Students;
use Maatwebsite\Excel\Concerns\ToModel;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithUpserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithProgressBar;
use Illuminate\Contracts\Queue\ShouldQueue;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Events\ImportFailed;
use App\Notifications\ImportHasFailedNotification;
use Carbon\Carbon;
use Illuminate\Support\Str;


class StudentsImport implements ToModel, WithBatchInserts, WithChunkReading, WithUpserts, WithProgressBar{

    use Importable;

    public function model(array $row)
    {
        // $role = Auth::guard('faculty')->user()->role;
        // $permissions = collect(Auth::guard('faculty')->user()->permissions);

        if (isset($row[3]) && !empty($row[3])) {
            try {
                
                // Normalize date to mm/dd/yyyy format
                $dateOfBirth = Carbon::createFromFormat('m/d/Y', trim($row[3]));
            } catch (\Exception $e) {

                \Log::error('Failed to parse date_of_birth: ' . $e->getMessage() . ' in row: ' . json_encode($row));
                return null; // Skip this row due to invalid date
            }
        } else {
            \Log::error('Missing data for date_of_birth column in row: ' . json_encode($row));
            return null; // Skip this row due to missing date
        }

       
            
    
        return Students::firstOrNew(
            [
                'student_id'=> $row[0] ?? null,     //Str::uuid() -> Uncomment this out for production
                'first_name' => $row[1] ?? null,
                'last_name' => $row[2] ?? null,
            ],
            [   'date_of_birth' => $dateOfBirth ?? null,
                'address' => $row[4] ?? null,
                'street_address_2' => $row[5] ?? null,
                'city' => $row[6] ?? null,
                'state' => $row[7] ?? null,
                'zip' => $row[8] ?? null,
                'level' => $row[9] ?? null,
                'gender' => $row[10] ?? null,
                'allergies_or_special_needs' => $row[11] ?? null,
                'emergency_contact_person' => $row[12] ?? null,
                'emergency_contact_hospital' => $row[13] ?? null

                // Below is the correct order for production 
                // 'gender' => $row[2] ?? null,
                // 'date_of_birth' => $dateOfBirth ?? null,
                // 'address' => $row[4] ?? null,
                // 'street_address_2' => $row[5] ?? null,
                // 'city' => $row[6] ?? null,
                // 'state' => $row[7] ?? null,
                // 'zip' => $row[8] ?? null,
                // 'grade' => $row[9] ?? null,
                // 'allergies_or_special_needs' => $row[10] ?? null,
                // 'emergency_contact_person' => $row[11] ?? null, 
                // 'emergency_contact_hospital' => $row[12] ?? null, 
                // 'user_id' => $row[13] ?? null, 
                // 'faculty_id' => $role === 'Teacher' ? Auth::guard('faculty')->id() : null
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