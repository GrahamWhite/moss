package com.shackntheback.moss

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions

class MapPickerActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var map: GoogleMap
    private var selectedMarker: Marker? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_map_picker)

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)
    }

    override fun onMapReady(googleMap: GoogleMap) {
        map = googleMap

        // Start at a default location
        val defaultLocation = LatLng(40.7128, -74.0060) // New York
        map.moveCamera(CameraUpdateFactory.newLatLngZoom(defaultLocation, 10f))

        // Tap to place marker
        map.setOnMapClickListener { latLng ->
            selectedMarker?.remove()
            selectedMarker = map.addMarker(MarkerOptions().position(latLng).title("Selected Location"))

            val resultIntent = Intent().apply {
                putExtra("latitude", latLng.latitude)
                putExtra("longitude", latLng.longitude)
                putExtra("mapUrl", "https://maps.google.com/?q=${latLng.latitude},${latLng.longitude}")
            }
            setResult(Activity.RESULT_OK, resultIntent)
            finish() // close map picker
        }
    }
}
