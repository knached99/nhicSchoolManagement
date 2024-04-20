<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Students;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class HomeworkSubmitted extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */

    public function __construct($assignment_id, $assignment_name, $student_id, $faculty_id)
    {
        $this->assignment_id = $assignment_id;
        $this->assignment_name = $assignment_name;
        $this->student_id = $student_id;
        $this->faculty_id = $faculty_id; 

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }

    protected function studentName($student_id) {
        return ($student = Students::where('student_id', $student_id)->first()) 
        ? $student->first_name . ' ' . $student->last_name : '';
    }
    

    public function toDatabase($notifiable){
        return [
            'id'=> $this->faculty_id,
            'link'=>'/faculty/studentassignment/'.$this->student_id.'/'.$this->assignment_id.'',
            'notificationType'=>'System Notification',
            'notificationTitle'=>'Assignment '.$this->assignment_name. ' has been submitted by '.$this->studentName($this->student_id). ' on '.now()->format('m/d/Y h:i A'),
        ];
    }
}
