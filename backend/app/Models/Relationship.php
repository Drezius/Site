<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Relationship extends Model
{
    protected $fillable = ['user_id', 'couple_name', 'start_date', 'custom_message'];

    protected $casts = [
        'start_date' => 'datetime', // permite usar ->format()
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function photos(): HasMany
    {
        return $this->hasMany(Photo::class);
    }

    public function anniversaryImages(): HasMany
    {
        return $this->hasMany(AnniversaryImage::class);
    }

    public function getAnniversaryDate()
    {
        return $this->start_date?->format('m-d');
    }
}
