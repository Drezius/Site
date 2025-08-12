<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Photo extends Model
{
    protected $fillable = ['relationship_id', 'path'];

    public function relationship()
    {
        return $this->belongsTo(Relationship::class);
    }
}
