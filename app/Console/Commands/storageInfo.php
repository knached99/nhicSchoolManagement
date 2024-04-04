<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\Console\Helper\Table;
use Symfony\Component\Console\Output\ConsoleOutput;

class storageInfo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nhic:storage-info';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get app storage usage information';

    /**
     * Execute the console command.
     */
  
public function handle()
{
    $storage = $this->calculateStorageUsed(); // Calculates Storage Usage
    $filesCount = $this->countFilesInDirectories(); // Calculates number of files within 3 folders
    $storageLeft = $this->calculateStorageLeft(); // Calculates the amount of storage left 

    // Storage Usage 
    $logsSize = isset($storage['logs']) ? $storage['logs'] : 0;
    $wallpaperSize = isset($storage['wallpaper']) ? $storage['wallpaper'] : 0;
    $profilePicsSize = isset($storage['profile']) ? $storage['profile'] : 0;
    $totalSize = isset($storage['total']) ? $storage['total'] : 0;

    // File counts 
    $totalFiles = isset($filesCount['total']) ? $filesCount['total'] : 0;
    $logFiles = isset($filesCount['logs']) ? $filesCount['logs'] : 0;
    $wallpaperFiles = isset($filesCount['wallpaper']) ? $filesCount['wallpaper'] : 0;
    $profileFiles = isset($filesCount['profile']) ? $filesCount['profile'] : 0;

    // Calculate total available disk space
    $totalDiskSpaceHumanReadable = $this->formatBytes($totalDiskSpace);

    // Calculate space used
    $spaceUsed = $totalDiskSpace - $storageLeft;

    // Create a new table instance
    $table = new Table(new ConsoleOutput());

    // Set table headers
    $table->setHeaders(['Category', 'Size', 'Files Count']);

    // Add rows to the table
    $table->addRow(['Logs', $logsSize . ' bytes', $logFiles]);
    $table->addRow(['Wallpapers', $wallpaperSize . ' bytes', $wallpaperFiles]);
    $table->addRow(['Profile Pics', $profilePicsSize . ' bytes', $profileFiles]);
    $table->addRow(['Total', $totalSize . ' bytes', $totalFiles]);

    // Add total available disk space and space used rows
    $table->addRow(['Total Available Space', $totalDiskSpaceHumanReadable]);
    $table->addRow(['Space Used', $this->formatBytes($spaceUsed)]);

    // Render the table
    $table->render();
}

    private function calculateStorageUsed()
    {
        // Define the paths to the directories
        $wallpaperPath = storage_path('app/public/wallpaper_pics');
        $profilePath = storage_path('app/public/profile_pics');
        $logsPath = storage_path('storage/logs');
    
        // Calculate the size of each directory
        $wallpaperSize = $this->calculateDirectorySize($wallpaperPath);
        $profileSize = $this->calculateDirectorySize($profilePath);
        $logsSize = $this->calculateDirectorySize($logsPath);
    
        // Calculate the total size used
        $totalSize = $wallpaperSize + $profileSize + $logsSize;
    
        // Convert bytes to human-readable format
        $totalSizeHumanReadable = $this->formatBytes($totalSize);
        $wallpaperSizeHumanReadable = $this->formatBytes($wallpaperSize);
        $profilePicsSizeHumanReadable = $this->formatBytes($profileSize);
        $logsSizeHumanReadable = $this->formatBytes($logsSize);
        // Return the storage data
        return [
            'total' => $totalSizeHumanReadable,
            'wallpaper' => $wallpaperSizeHumanReadable,
            'profile' => $profilePicsSizeHumanReadable,
            'logs' => $logsSizeHumanReadable,
        ];
    }
    
  
  
  private function calculateDirectorySize ($dir)
  {
      $size = 0;
  
      foreach (glob(rtrim($dir, '/').'/*', GLOB_NOSORT) as $each) {
          $size += is_file($each) ? filesize($each) : folderSize($each);
      }
  
      return $size;
  }
  
  
  
  private function formatBytes($bytes, $precision = 2)
  {
      $units = ['B', 'KB', 'MB', 'GB', 'TB'];
  
      $bytes = max($bytes, 0);
      $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
      $pow = min($pow, count($units) - 1);
  
      // Uncomment one of the following alternatives
      // $bytes /= pow(1024, $pow);
      $bytes /= (1 << (10 * $pow));
  
      return round($bytes, $precision) . ' ' . $units[$pow];
  }
  
  
  private function calculateStorageLeft()
  {
      // Define the paths to the directories
      // $wallpaperPath = storage_path('app/public/wallpaper_pics');
      // $profilePath = storage_path('app/public/profile_pics');
      // $logsPath = storage_path('logs');
  
      $totalStorageLimit = disk_free_space(storage_path());
  
      // Make sure $totalStorageLimit is in bytes
      if (!is_numeric($totalStorageLimit)) {
          // Handle the case where total storage limit couldn't be determined
          // You might want to set a default value or throw an error
          return 'Unable to calculate storage left. Non-numeric total storage limit encountered.';
      } else {
          // Convert the total storage limit to human-readable format
          $totalStorageLimitHumanReadable = $this->formatBytes($totalStorageLimit);
  
          // Get the current storage usage
          $storageLeft = $this->calculateStorageLeft(); 
  
          // Convert the human-readable storage used to bytes
          $storageUsedBytes = $this->convertHumanReadableToBytes($storageUsed['total']);
  
          // Calculate the storage left
          $storageLeft = $totalStorageLimit - $storageUsedBytes;
  
          // Convert bytes to human-readable format
          $storageLeftHumanReadable = $this->formatBytes($storageLeft);
  
          // Now you have the accurate total storage limit and storage left
          return $storageLeftHumanReadable;
      }
  }
  
  
  // Function to convert human-readable size (e.g., "1.83 MB") to bytes
  private function convertHumanReadableToBytes($sizeString)
  {
      // Extract numeric part
      $numericPart = (float) $sizeString;
      // Extract unit part
      $unit = strtoupper(trim(preg_replace('/[0-9\. ]/', '', $sizeString)));
  
      switch ($unit) {
          case 'GB':
              return $numericPart * 1024 * 1024 * 1024;
          case 'MB':
              return $numericPart * 1024 * 1024;
          case 'KB':
              return $numericPart * 1024;
          default:
              return $numericPart;
      }
  }
  
  
  private function countFilesInDirectories() {
      // Define the paths to the directories
      $wallpaperPath = storage_path('app/public/wallpaper_pics');
      $profilePath = storage_path('app/public/profile_pics');
      $logsPath = storage_path('logs');
  
      // Count files in each directory recursively
      $wallpaperCount = $this->countFilesRecursive($wallpaperPath);
      $profileCount = $this->countFilesRecursive($profilePath);
      $logFiles = glob($logsPath . '/*.log');
      $logsCount = count($logFiles);
      $totalCount = $wallpaperCount + $profileCount + $logsCount;
      
  
      // Return the counts
      return [
          'wallpaper' => $wallpaperCount,
          'profile' => $profileCount,
          'logs' => $logsCount,
          'total' => $totalCount,
      ];
  }
  
  // private function countFilesRecursive($directory) {
  //     // Get all files within the directory and its subdirectories
  //     $files = Storage::allFiles($directory);
  
  //     // Count the number of files
  //     $fileCount = count($files);
  
  //     return $fileCount;
  // }
  
  private function countFilesRecursive($directory) {
      // Initialize count to 0
      $fileCount = 0;
  
      // Open the directory
      $dir = opendir($directory);
  
      // Loop through each file and directory
      while (($file = readdir($dir)) !== false) {
          // Skip . and .. directories
          if ($file == '.' || $file == '..') {
              continue;
          }
  
          // Get the full path of the file or directory
          $filePath = $directory . '/' . $file;
  
          // If it's a directory, recursively count files in it
          if (is_dir($filePath)) {
              $fileCount += $this->countFilesRecursive($filePath);
          } else {
              // If it's a file, increment the count
              $fileCount++;
          }
      }
  
      // Close the directory
      closedir($dir);
  
      return $fileCount;
  }
  
  
}
