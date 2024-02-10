<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotifyUserOfStudentAssigned extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $student_id, string $first_name, string $last_name, string $name)
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
        return (new MailMessage)
        ->subject('Your Child has been added to your account')
        ->greeting('Hello '.$this->name)
        ->line('Your child '.$this->first_name. ' '.$this->last_name.' has been added to your account')
        ->line('You can now view information regarding your child and their academic performance')
        ->action('View Student Details', url('/student/'.$this->student_id.'/view'));
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
