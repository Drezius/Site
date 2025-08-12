<?php

namespace App\Console;

use App\Models\Relationship;
use App\Http\Controllers\AnniversaryImageController;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Http\Request;

class Kernel
{
    protected function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $today = now()->format('m-d');

            $relationships = Relationship::whereRaw(
                "DATE_FORMAT(start_date, '%m-%d') = ?", [$today]
            )->get();

            foreach ($relationships as $relationship) {
                // Cria um request vazio e chama o controller
                $controller = new AnniversaryImageController();
                $controller->generate(new Request(), $relationship);
            }
        })->daily();
    }
}

