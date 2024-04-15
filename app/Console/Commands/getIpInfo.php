<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Crypt;

class GetIpInfo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nhic:findIP';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Get information about an IP Address';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $clientIP = $this->argument('clientIP');
        $clientIP = $this->ask('Enter IPV4 or IPV6 address:');

        if (!$this->validateIP($clientIP)) {
            $this->error('Invalid IP address');
            return;
        }

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => "https://nordvpn.com/wp-admin/admin-ajax.php?action=get_user_info_data&ip={$clientIP}",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CUSTOMREQUEST => 'GET',
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
            ],
        ]);

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
            $this->error('Failed to retrieve IP information: ' . $err);
        } else {
            $data = json_decode($response);
            $this->displayData($data);
        }
    }

    /**
     * Display IP information.
     *
     * @param  object  $data
     */
  
     private function displayData($data)
     {
         // Check if coordinates property exists and is an object
         if (isset($data->coordinates) && is_object($data->coordinates)) {
             // Store latitude and longitude in variables
             $latitude = $data->coordinates->latitude;
             $longitude = $data->coordinates->longitude;
     
             // Construct URLs for Google Earth and Google Maps
             $googleEarthLink = "https://earth.google.com/web/@$latitude,$longitude,1000a,41407.87820565d,1y,0h,0t,0r";
             $googleMapsLink = "https://www.google.com/maps?q=$latitude,$longitude";
     
             // Convert the $data object to a formatted string
             $formattedData = "IP: $data->ip\n" .
                              "ISP: $data->isp\n" .
                              "City: $data->city\n" .
                              "Region: $data->region\n" .
                              "Country: $data->country\n" .
                              "Location: $data->location\n" .
                              "Area Code: $data->area_code\n" .
                              "Country Code: $data->country_code\n" .
                              "Latitude: $latitude\n" .
                              "Longitude: $longitude\n" .
                              "Google Earth: $googleEarthLink\n" .
                              "Google Maps: $googleMapsLink";
     
             // Output the formatted string
             $this->info($formattedData);
         } else {
             $this->error('Coordinates data not found or not in expected format');
         }
     }
     
     

    /**
     * Validate IPv4 or IPv6 address.
     *
     * @param  string  $clientIP
     * @return bool
     */
    private function validateIP($clientIP)
    {
        return filter_var($clientIP, FILTER_VALIDATE_IP) !== false;
    }
}
