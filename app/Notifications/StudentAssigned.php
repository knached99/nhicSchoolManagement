<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentAssigned extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(?string $student_id = null, string $first_name, string $last_name, string $name)
    {
        $this->student_id = $student_id;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->name = $name;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
{
    $mailMessage = (new MailMessage)
        ->subject('New Student Assigned To You')
        ->greeting('Hello ' . $this->name)
        ->line('You\'ve been assigned to ' . $this->first_name . ' ' . $this->last_name . ' as their teacher');

    if ($this->student_id !== null) {
        $mailMessage->action('View Student Details', url('/student/' . $this->student_id . '/view'));
    } else {
        $mailMessage->action('My Dashboard', url('/faculty/dash'));
    }

    return $mailMessage;
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
}
