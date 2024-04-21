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

            $formats = ['m/d/Y', 'd/m/Y', 'Y-m-d', 'm-d-Y']; // Add other formats as necessary
            foreach ($formats as $format) {
                try {
                    $dateOfBirth = Carbon::createFromFormat($format, trim($row[3]));
                    break; // If parsing succeeds, break out of the loop
                } catch (\Exception $e) {
                    // Continue trying the next format
                }
            }
            
     
        
        // Check if the date column is set and not empty
        // if (isset($row[3]) && !empty($row[3])) {
            // try {
            //     $dateOfBirth = null;
            //     if (isset($row[3]) && !empty($row[3])) {
            //         $formats = ['Y-m-d', 'd/m/Y', 'm/d/Y']; // Add other formats as needed
            //         foreach ($formats as $format) {
            //             try {
            //                 $dateOfBirth = Carbon::createFromFormat($format, $row[3]);
            //                 break; // If parsing is successful, break out of the loop
            //             } catch (\Exception $e) {
            //                 // Continue trying the next format
            //             }
            //         }
            //         if ($dateOfBirth === null) {
            //             throw new \Exception('Failed to parse date of birth in all available formats.');
            //         }
            //     }
            // } catch (\Exception $e) {
            //     \Log::error("Failed to parse date of birth: {$e->getMessage()}");
            //     $dateOfBirth = null;
            // }
            
            
    
        return Students::firstOrNew(
            [
                'student_id'=>Str::uuid(),
                'first_name' => $row[0] ?? null,
                'last_name' => $row[1] ?? null,
            ],
            [
                'gender' => $row[2] ?? null,
                'date_of_birth' => $dateOfBirth ?? null,
                'address' => $row[4] ?? null,
                'street_address_2' => $row[5] ?? null,
                'city' => $row[6] ?? null,
                'state' => $row[7] ?? null,
                'zip' => $row[8] ?? null,
                'grade' => $row[9] ?? null,
                'allergies_or_special_needs' => $row[10] ?? null,
                'emergency_contact_person' => $row[11] ?? null, 
                'emergency_contact_hospital' => $row[12] ?? null, 
                'user_id' => $row[13] ?? null, 
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