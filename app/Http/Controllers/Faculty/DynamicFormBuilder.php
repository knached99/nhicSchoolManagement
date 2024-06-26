<?php

namespace App\Http\Controllers\Faculty;
use App\Http\Controllers\Controller; 
use App\Models\Form;
use App\Models\Faculty;
use App\Models\Field;
use App\Models\Notifications;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

use Inertia\Inertia;
use Illuminate\Validation\ValidationException;


class DynamicFormBuilder extends Controller
{
    public function builderUI()
    { 
        if(Auth::guard('faculty')->user()->role !== 'Admin'){
            return redirect()->route('faculty.dash');
        }

        $notifications = Notifications::whereRaw("JSON_EXTRACT(data, '$[0].id') = ?", [auth('faculty')->id()])->get();

        return Inertia::render('Faculty/FormBuilder', ['auth'=>Auth::guard('faculty')->user(), 'notifications'=>$notifications]);
    }

    public function getForms(){
        $forms = Form::with(['fields', 'faculty'])->get();
        
        return $forms;
    }
    

    public function buildForm(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            // 'fields' => 'array', // Make the 'fields' field optional
            // 'fields.*.name' => 'nullable|string|max:255', // Validate each field name
            // 'fields.*.type' => 'nullable|in:input,select,radio,checkbox,date', // Optionally validate each field type
        ]);
    
        try {
    
            // Generate UUID for form_id
            $formId = Str::uuid();
            $facultyId = Auth::guard('faculty')->id();
    
            // Create the form with the generated UUID
            $form = Form::create([
                'form_id' => $formId,
                'name' => $validatedData['name'],
                'faculty_id' => $facultyId // Correctly set faculty_id here
            ]);
    
            // Iterate over each field and set the form_id
            // foreach ($validatedData['fields'] as $fieldData) {
            //     // Generate UUID for field_id
            //     $fieldId = Str::uuid();
            
            //     // Set the 'form_id' for each field
            //     $fieldData['form_id'] = $formId;
            
            //     // Create the field with the generated UUID
            //     $field = new Field([
            //         'field_id' => $fieldId,
            //         'name' => $fieldData['name'],
            //         'type' => $fieldData['type'],
            //         'faculty_id' => Auth::guard('faculty')->id(),
            //     ]);
            
            //     $form->fields()->save($field);
            // }
    
            // Return the form data 
            Session::flash('success', 'Form created successfully! Continue to edit the form on this page');
            return response()->json($form, 201);

    
        } catch (ValidationException $e) {
            // return response()->json(['errors' => $e->errors()], 422);
            \Log::error('Form Builder Validation Errors '.$e->errors());
    
        } catch(\Exception $e){
            \Log::error('Unable to Create Form: '.$e->getMessage());
    
        }
    }
    

    public function deleteForm($formID){
       try{
        Form::destroy($formID);
        return response()->json(['success'=>'Form with ID: '. $formID. ' along with associated content deleted successfully!']);
    
    }

       catch(\Exception $e){
        \Log::error('Error deleting form: '.$e->getMessage());
        return response()->json(['error'=>'Unable to delete with ID: '. $formID. '. Something went wrong!']);

       }
    }
    
    

    public function addField(Request $request, Faculty $faculty, Form $form)
    {   

        $fieldId = Str::uuid();
    
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required',
            'options' => 'nullable|array', // Validate options as an array
            // 'options.*' => 'string|max:255', // Validate each option as a string
        ]);
    
        // Check if the form belongs to the specified faculty
        if ($form->faculty_id !== Auth::guard('faculty')->id()) {

            return response()->json(['error' => 'This form does not belong to the specified faculty.'], 403);
        }
    
        // Log validated data for debugging purposes
    
       // Check if options are provided, if not, set them to an empty array
           // Check if options are provided and not null, if not, set them to an empty array
       // Extract type from validated data
    
           $options = isset($validatedData['options']) && $validatedData['options'] !== null ? json_encode($validatedData['options']) : '[]';

            $type = isset($validatedData['type']['type']) ? $validatedData['type']['type'] : null;

            $field = $form->fields()->create([
                'field_id' => $fieldId, 
                'name' => $validatedData['name'],
                'type' => $type, // Set type extracted from validated data
                'options' => $options, // Set options to an empty array if not provided or null
            ]);



        
    
        return response()->json($field, 201);
    }
    
    public function viewform($form_id){

        if(Auth::guard('faculty')->user()->role !== 'Admin'){
            return redirect()->route('faculty.dash');
        }
        
        $form = Form::with(['fields', 'faculty'])->where('form_id', $form_id)->firstOrFail();
        
        $successMessage = session('success');
    
        return Inertia::render('Faculty/Form/editForm', [
            'form' => $form,
            'auth' => Auth::guard('faculty')->user(),
            'success' => $successMessage
        ]);
    }
    
    
}


?>