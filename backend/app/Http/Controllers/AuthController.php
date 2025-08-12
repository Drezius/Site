<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);
        
        $user = User::create([
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);
        
        return response()->json(['user' => $user], 201);
    }
    
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        
        if (Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['user' => Auth::user()]);
        }
        
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}
