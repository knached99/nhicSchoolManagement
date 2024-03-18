<?php 
namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
// use Illuminate\Http\Request;

class getIpInfo extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'nhic:findIP {clientIP}';

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
        $clientIP = $this->argument('clientIP');

        if (!$this->validateIP($clientIP)) {
            $this->error('Invalid IP address');
            return;
        }

        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://ipinfo.io/'.$clientIP,
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
            $data = json_decode($response, true);
            $this->displayData($data);
        }
    }

    /**
     * Display IP information.
     *
     * @param  array  $data
     */
    private function displayData($data)
    {
        $this->info('IP: ' . ($data['ip'] ?? 'N/A'));
        $this->info('Hostname: ' . ($data['hostname'] ?? 'N/A'));
        $this->info('City: ' . ($data['city'] ?? 'N/A'));
        $this->info('Region: ' . ($data['region'] ?? 'N/A'));
        $this->info('Country: ' . ($data['country'] ?? 'N/A'));
        $this->info('Latitude, Longitude: ' . ($data['loc'] ?? 'N/A'));
        $this->info('Organization: ' . ($data['org'] ?? 'N/A'));
        $this->info('Postal Code: ' . ($data['postal'] ?? 'N/A'));
        $this->info('Timezone: ' . ($data['timezone'] ?? 'N/A'));
    }

    /**
     * Validate IPv4 or IPv6 address.
     *
     * @param  string  $clientIP
     * @return bool
     */
    private function validateIP($clientIP)
    {
        $validate = Validator::make(['ip' => $clientIP], [
            'ip' => 'ip'
        ]);

        return !$validate->fails();
    }
}
?>