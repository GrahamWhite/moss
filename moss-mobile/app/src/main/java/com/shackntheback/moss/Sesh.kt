package com.shackntheback.moss
data class Sesh(
    val id: String,
    val title: String,
    val dateTime: String,
    val info: String?,
    val location: String?,
    val picture: String,
    val users: List<String>
)
