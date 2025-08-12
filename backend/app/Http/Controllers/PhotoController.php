<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use Illuminate\Http\Request;

class PhotoController extends Controller
{
    public function store(Request $request, Relationship $relationship)
    {
        $request->validate([
            'photo' => 'required|image',
        ]);

        // Salva a imagem na pasta storage/app/public/photos
        $path = $request->file('photo')->store('photos', 'public');

        // Cria o registro no banco
        $photo = $relationship->photos()->create(['path' => $path]);

        return response()->json($photo, 201);
    }
}
