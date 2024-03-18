<?php 

namespace App\Exceptions;
use Exception;

class InsufficientStudentsException extends Exception {

    protected $message = 'You cannot upload this assignment as you have no students assigned to you';
}

?>