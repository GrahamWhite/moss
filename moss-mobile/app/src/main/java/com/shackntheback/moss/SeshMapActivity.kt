package com.shackntheback.moss

import android.Manifest
import android.content.pm.PackageManager
import android.location.Location
import android.os.Bundle
import android.util.Log
import android.widget.SeekBar
import android.widget.TextView
import android.widget.Toast
import androidx.annotation.RequiresPermission
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.LocationServices
import com.google.android.gms.maps.CameraUpdateFactory
import com.google.android.gms.maps.GoogleMap
import com.google.android.gms.maps.OnMapReadyCallback
import com.google.android.gms.maps.SupportMapFragment
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.maps.model.Marker
import com.google.android.gms.maps.model.MarkerOptions
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.*

class SeshMapActivity : AppCompatActivity(), OnMapReadyCallback {

    private lateinit var map: GoogleMap
    private lateinit var radiusSeekBar: SeekBar
    private lateinit var radiusLabel: TextView
    private var userLocation: LatLng? = null
    private val seshMarkers = mutableListOf<Marker>()

    private val LOCATION_PERMISSION_REQUEST = 1001
    private val TAG = "SeshMapActivity"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sesh_map)

        radiusSeekBar = findViewById(R.id.radiusSeekBar)
        radiusLabel = findViewById(R.id.radiusLabel)

        val mapFragment = supportFragmentManager
            .findFragmentById(R.id.mapFragment) as SupportMapFragment
        mapFragment.getMapAsync(this)

        radiusSeekBar.setOnSeekBarChangeListener(object: SeekBar.OnSeekBarChangeListener {
            override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                val radius = if (progress < 1) 1 else progress // minimum 1 km
                radiusLabel.text = "Radius: $radius km"
                userLocation?.let {
                    fetchAndShowSeshes(it, radius.toDouble())
                }
            }
            override fun onStartTrackingTouch(seekBar: SeekBar?) {}
            override fun onStopTrackingTouch(seekBar: SeekBar?) {}
        })
    }

    override fun onMapReady(googleMap: GoogleMap) {
        map = googleMap

        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
            != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                LOCATION_PERMISSION_REQUEST)
            return
        }
        enableLocationAndFetch()
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    private fun enableLocationAndFetch() {
        map.isMyLocationEnabled = true
        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                userLocation = LatLng(location.latitude, location.longitude)
                map.moveCamera(CameraUpdateFactory.newLatLngZoom(userLocation!!, 12f))

                val radius = if (radiusSeekBar.progress < 1) 1 else radiusSeekBar.progress
                radiusLabel.text = "Radius: $radius km"
                fetchAndShowSeshes(userLocation!!, radius.toDouble())
            } else {
                Toast.makeText(this, "Failed to get user location", Toast.LENGTH_LONG).show()
                Log.w(TAG, "User location is null")
            }
        }.addOnFailureListener {
            Toast.makeText(this, "Failed to get user location: ${it.message}", Toast.LENGTH_LONG).show()
            Log.e(TAG, "Failed to get user location", it)
        }
    }

    private fun fetchAndShowSeshes(center: LatLng, radiusKm: Double) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL("https://flumpy.ca/api/meetings")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "GET"
                conn.setRequestProperty("Accept", "application/json")

                val responseCode = conn.responseCode
                if (responseCode == 200) {
                    val responseText = conn.inputStream.bufferedReader().use { it.readText() }
                    val jsonArray = JSONArray(responseText)

                    val filteredSeshes = mutableListOf<SeshMarker>()

                    for (i in 0 until jsonArray.length()) {
                        val obj = jsonArray.getJSONObject(i)
                        val lat = obj.optString("latitude").toDoubleOrNull()
                        val lng = obj.optString("longitude").toDoubleOrNull()
                        val title = obj.optString("title", "Sesh")
                        val info = obj.optString("info", "")

                        if (lat != null && lng != null) {
                            val distance = distanceInKm(center.latitude, center.longitude, lat, lng)
                            if (distance <= radiusKm) {
                                filteredSeshes.add(SeshMarker(LatLng(lat, lng), title, info))
                            }
                        }
                    }

                    withContext(Dispatchers.Main) {
                        // Clear old markers
                        seshMarkers.forEach { it.remove() }
                        seshMarkers.clear()

                        // Add markers for filtered seshes
                        filteredSeshes.forEach { sesh ->
                            val marker = map.addMarker(
                                MarkerOptions()
                                    .position(sesh.latLng)
                                    .title(sesh.title)
                                    .snippet(sesh.info)
                            )
                            marker?.let { seshMarkers.add(it) }
                        }
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        Toast.makeText(this@SeshMapActivity,
                            "Error fetching seshes: HTTP $responseCode",
                            Toast.LENGTH_LONG).show()
                    }
                }
                conn.disconnect()
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@SeshMapActivity,
                        "Failed to fetch seshes: ${e.localizedMessage}",
                        Toast.LENGTH_LONG).show()
                }
                Log.e(TAG, "Error fetching seshes", e)
            }
        }
    }

    // Calculate distance between two lat/lon points in km (Haversine formula)
    private fun distanceInKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
        val R = 6371.0 // Earth radius in km
        val dLat = Math.toRadians(lat2 - lat1)
        val dLon = Math.toRadians(lon2 - lon1)
        val a = sin(dLat / 2).pow(2.0) +
                cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) *
                sin(dLon / 2).pow(2.0)
        val c = 2 * atan2(sqrt(a), sqrt(1 - a))
        return R * c
    }

    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION])
    override fun onRequestPermissionsResult(
        requestCode: Int, permissions: Array<out String>, grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        if (requestCode == LOCATION_PERMISSION_REQUEST) {
            if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                enableLocationAndFetch()
            } else {
                Toast.makeText(this, "Location permission denied", Toast.LENGTH_LONG).show()
            }
        }
    }

    data class SeshMarker(val latLng: LatLng, val title: String, val info: String)
}
