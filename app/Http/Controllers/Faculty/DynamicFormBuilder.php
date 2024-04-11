<?php

namespace App\Http\Controllers\Faculty;
use App\Http\Controllers\Controller; 
use App\Models\Form;
use App\Models\Faculty;
use App\Models\Field;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Validation\ValidationException;


class DynamicFormBuilder extends Controller
{
    public function builderUI()
    { 
        return Inertia::render('Faculty/FormBuilder', ['auth'=>Auth::guard('faculty')->user()]);
    }

    public function getForms(){
        $forms = Form::with(['fields'])->get();
        return $forms;
    }
    

    public function buildForm(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'fields' => 'array', // Make the 'fields' field optional
            'fields.*.name' => 'nullable|string|max:255', // Validate each field name
            'fields.*.type' => 'nullable|in:input,select,radio,checkbox,date', // Optionally validate each field type
        ]);
    
        try {
            \Log::info('Inside try block'); // Log a message to indicate the try block is executed
    
            // Generate UUID for form_id
            $formId = Str::uuid();
    
            // Create the form with the generated UUID
            $form = Form::create([
                'form_id' => $formId,
                'name' => $validatedData['name'],
            ]);
    
            // Iterate over each field and set the form_id
            foreach ($validatedData['fields'] as $fieldData) {
                // Generate UUID for field_id
                $fieldId = Str::uuid();
    
                // Set the 'form_id' for each field
                $fieldData['form_id'] = $formId;
    
                // Create the field with the generated UUID
                $form->fields()->create([
                    'field_id' => $fieldId,
                    'name' => $fieldData['name'],
                    'type' => $fieldData['type'],
                ]);
            }
    
            return response()->json($form, 201);
        } catch (ValidationException $e) {
            \Log::error('Unable to Create Form: ');
            \Log::error($e->getMessage());
            return response()->json(['errors' => $e->errors()], 422);
        }
    }
    

    public function addField(Request $request, Faculty $faculty, Form $form)
    {
        // You may want to implement additional authorization logic here to ensure the faculty has permission to add fields to this form.

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:input,select,radio,checkbox,date',
        ]);

        // Check if the form belongs to the specified faculty
        if ($form->faculty_id !== $faculty->id) {
            return response()->json(['error' => 'This form does not belong to the specified faculty.'], 403);
        }

        $field = $form->fields()->create($validatedData);

        return response()->json($field, 201);
    }
    
}


?>