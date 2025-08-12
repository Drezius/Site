<?php

namespace App\Http\Controllers;

use App\Models\Relationship;
use Illuminate\Http\Request;

class RelationshipController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'couple_name' => 'required',
            'start_date' => 'required|date',
            'custom_message' => 'nullable',
        ]);

        // Cria um relacionamento vinculado ao usuário autenticado
        $relationship = $request->user()->relationship()->create($request->all());

        return response()->json($relationship, 201);
    }

    public function show(Request $request, Relationship $relationship)
    {
        // Retorna o relacionamento junto com as fotos associadas
        return response()->json($relationship->load('photos'));
    }
}
