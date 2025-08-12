<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AnniversaryImageController extends Controller
{
    public function generate(Request $request, Relationship $relationship)
    {
        // Verifica se hoje é o aniversário
        if ($relationship->getAnniversaryDate() !== now()->format('m-d')) {
            return response()->json(['message' => 'Not anniversary today'], 400);
        }

        // Gera a imagem (simplificado)
        $imagePath = $this->generateImage($relationship);

        // Salva no banco de dados
        $anniversaryImage = $relationship->anniversaryImages()->create([
            'image_path' => $imagePath,
            'anniversary_date' => now()->format('Y-m-d'),
        ]);

        // Envia email (simplificado)
        $this->sendEmail($request->user(), $anniversaryImage);

        return response()->json($anniversaryImage);
    }

    private function generateImage(Relationship $relationship)
    {
        $filename = 'anniversary-' . $relationship->id . '-' . now()->format('Y-m-d') . '.jpg';
        $path = storage_path('app/public/' . $filename);

        // Simulação de criação de imagem
        file_put_contents($path, 'SIMULATED IMAGE DATA');

        return $filename;
    }

    private function sendEmail($user, $anniversaryImage)
    {
        Mail::raw('Seu aniversário de namoro!', function ($message) use ($user, $anniversaryImage) {
            $message->to($user->email)
                    ->subject('Feliz Aniversário de Namoro!')
                    ->attach(storage_path('app/public/' . $anniversaryImage->image_path));
        });
    }
}
