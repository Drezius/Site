<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AnniversaryImage extends Model
{
    protected $fillable = ['relationship_id', 'image_path', 'anniversary_date'];

    protected $casts = [
        'anniversary_date' => 'date',
    ];

    public function relationship()
    {
        return $this->belongsTo(Relationship::class);
    }
}
