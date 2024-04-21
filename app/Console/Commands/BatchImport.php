<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Imports\StudentsImport;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Excel;

class BatchImport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nhic:import';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import a batch of students from a spreadsheet';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Ask for the spreadsheet filepath
        $file = $this->ask('Enter spreadsheet filepath: ');

        // Define the validation rules
        // Validation rules
$rules = [
    'file' => [
        'required',
        function($attribute, $value, $fail) {
            // Check if the file exists
            if (!file_exists($value)) {
                return $fail('The file does not exist.');
            }

            // Get the file extension
            $extension = pathinfo($value, PATHINFO_EXTENSION);

            // Define allowed file types
            $allowedTypes = ['xls', 'xlsx', 'csv'];

            // Check if the file type is allowed
            if (!in_array($extension, $allowedTypes)) {
                return $fail('The file must be of type: xls, xlsx, or csv.');
            }
        }
    ],
];

        // Validate the file
        $validator = Validator::make(['file' => $file], $rules);

        try {
           $this->info('Validating File..');

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $this->output->title('Initializing import..');

            $studentsImport = new StudentsImport;
            $studentsImport->withOutput($this->output)->import($file);

            $this->output->success('Import successful!');
        } catch (ValidationException $e) {
            // Get the errors from the exception
            $errors = $e->errors();
            
            // Iterate through each error and display them
            foreach ($errors as $field => $messages) {
                foreach ($messages as $message) {
                    // Display each error message as a string
                    $this->error($message);
                }
            }
        }
         catch (\Exception $e) {
            $this->error('Import Failed: ' . $e->getMessage());
        }
    }
}

?>