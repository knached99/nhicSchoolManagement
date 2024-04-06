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
            $this->info($response);

            if ($data->status === false) {
                $this->error('Failed to retrieve IP information');
            } else {
                $this->displayData($data);
            }
        }
    }

    /**
     * Display IP information.
     *
     * @param  object  $data
     */
    // private function displayData($data)
    // {
    //     $this->info('IP: ' . $data->ip);
    //     $this->info('ISP: ' . $data->isp);
    //     $this->info('City: ' . $data->city);
    //     $this->info('Region: ' . $data->region);
    //     $this->info('Country: ' . $data->country);
    //     $this->info('Location: ' . $data->location);
    //     $this->info('Area Code: ' . $data->area_code);
    //     $this->info('Country Code: ' . $data->country_code);
    //     $this->info('Latitude: ' . $data->coordinates->latitude);
    //     $this->info('Longitude: ' . $data->coordinates->longitude);
    // }

    private function displayData($data)
{
    // Convert the $data object to a formatted string
    $formattedData = "IP: $data->ip\n" .
                     "ISP: $data->isp\n" .
                     "City: $data->city\n" .
                     "Region: $data->region\n" .
                     "Country: $data->country\n" .
                     "Location: $data->location\n" .
                     "Area Code: $data->area_code\n" .
                     "Country Code: $data->country_code\n" .
                     "Latitude: $data->coordinates->latitude\n" .
                     "Longitude: $data->coordinates->longitude";

    // Output the formatted string
    $this->info($formattedData);
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
