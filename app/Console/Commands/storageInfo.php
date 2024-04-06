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
        $totalDiskSpace = disk_free_space(storage_path());
        $totalDiskSpaceHumanReadable = $this->formatBytes($totalDiskSpace);

        // Calculate space used
        $spaceUsed = $totalDiskSpace - $storageLeft;

        // Create a new table instance
        $table = new Table(new ConsoleOutput());

        // Set table headers
        $table->setHeaders(['Category', 'Size', 'Files Count']);

        // Add rows to the table
        $table->addRow(['Logs Storage Usage', $logsSize . ' bytes', $logFiles]);
        $table->addRow(['Wallpapers Storage Usage', $wallpaperSize . ' bytes', $wallpaperFiles]);
        $table->addRow(['Profile Pics Storage Usage', $profilePicsSize . ' bytes', $profileFiles]);
        $table->addRow(['Total Storage Usage', $totalSize . ' bytes', $totalFiles]);

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
        $logsPath = storage_path('logs');

        // Calculate the size of each directory
        $wallpaperSize = $this->getDirectorySize($wallpaperPath);
        $profileSize = $this->getDirectorySize($profilePath);
        $logsSize = $this->getDirectorySize($logsPath);

        // Calculate the total size used
        $totalSize = $wallpaperSize + $profileSize + $logsSize;

        // Convert bytes to human-readable format
        return [
            'total' => $this->formatBytes($totalSize),
            'wallpaper' => $this->formatBytes($wallpaperSize),
            'profile' => $this->formatBytes($profileSize),
            'logs' => $this->formatBytes($logsSize),
        ];
    }

    private function getDirectorySize($directory)
    {
        $totalSize = 0;

        // Iterate over each file in the directory
        foreach (Storage::files($directory) as $file) {
            // Get the size of the file and add it to the total size
            $totalSize += Storage::size($file);
        }

        return $totalSize;
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
        // Calculate the space used
        $spaceUsed = array_sum(array_column($this->calculateStorageUsed(), 'total'));

        // Calculate total available disk space
        $totalDiskSpace = disk_total_space(storage_path());

        // Calculate the storage left
        $storageLeft = $totalDiskSpace - $spaceUsed;

        // Convert bytes to human-readable format
        return $storageLeft;
    }

    private function countFilesInDirectories()
    {
        // Define the paths to the directories
        $wallpaperPath = storage_path('app/public/wallpaper_pics');
        $profilePath = storage_path('app/public/profile_pics');
        $logsPath = storage_path('logs');

        // Count files in each directory
        $wallpaperCount = count(Storage::files($wallpaperPath));
        $profileCount = count(Storage::files($profilePath));
        $logsCount = count(Storage::files($logsPath));

        // Calculate the total count
        $totalCount = $wallpaperCount + $profileCount + $logsCount;

        return [
            'wallpaper' => $wallpaperCount,
            'profile' => $profileCount,
            'logs' => $logsCount,
            'total' => $totalCount,
        ];
    }
}
