package com.shackntheback.moss

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Location
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.Menu
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.annotation.RequiresPermission
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.material.navigation.NavigationView
import com.google.android.material.snackbar.Snackbar
import com.shackntheback.moss.databinding.ActivityMainBinding
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONArray
import java.net.HttpURLConnection
import java.net.URL

class DashboardActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding
    private lateinit var fusedLocationClient: FusedLocationProviderClient

    private val REQUEST_CODE_LOCATION = 100
    private val REQUEST_CODE_NOTIFICATION = 101

    private val checkIntervalMillis = 30_000L
    private val handler = android.os.Handler(android.os.Looper.getMainLooper())
    private val checkRunnable = object : Runnable {
        override fun run() {
            if (ActivityCompat.checkSelfPermission(
                    this@DashboardActivity,
                    Manifest.permission.ACCESS_FINE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                checkNearbySessions()
            }
            handler.postDelayed(this, checkIntervalMillis)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setSupportActionBar(binding.appBarMain.toolbar)

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        // Request Notification permission for Android 13+ (API 33)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(Manifest.permission.POST_NOTIFICATIONS),
                    REQUEST_CODE_NOTIFICATION
                )
            }
        }

        // Request Location permission
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.ACCESS_FINE_LOCATION),
                REQUEST_CODE_LOCATION
            )
        } else {
            checkNearbySessions()
            handler.postDelayed(checkRunnable, checkIntervalMillis) // Start repeating check
        }

        binding.appBarMain.fab.setOnClickListener { view ->
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null)
                .setAnchorView(R.id.fab).show()
        }

        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_main)

        appBarConfiguration = AppBarConfiguration(
            setOf(R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow),
            drawerLayout
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)

        val role = "admin" // Replace with dynamic logic as needed

        val adminButtons = listOf(
            findViewById<Button>(R.id.btn_manage_users),
            findViewById<Button>(R.id.btn_site_settings),
            findViewById<Button>(R.id.btn_view_reports),
            findViewById<Button>(R.id.btn_create_sesh_admin),
            findViewById<Button>(R.id.btn_current_seshes_admin),
            findViewById<Button>(R.id.btn_edit_profile_admin),
            findViewById<Button>(R.id.btn_account_settings_admin),
            findViewById<Button>(R.id.btn_sesh_map)
        )
        val adminLabel = findViewById<TextView>(R.id.admin_controls_label)

        val userButtons = listOf(
            findViewById<Button>(R.id.btn_create_sesh_user),
            findViewById<Button>(R.id.btn_current_seshes_user),
            findViewById<Button>(R.id.btn_edit_profile_user),
            findViewById<Button>(R.id.btn_account_settings_user)
        )
        val userLabel = findViewById<TextView>(R.id.user_controls_label)

        if (role == "admin") {
            adminLabel.visibility = View.VISIBLE
            adminButtons.forEach { it.visibility = View.VISIBLE }
        } else if (role == "user") {
            userLabel.visibility = View.VISIBLE
            userButtons.forEach { it.visibility = View.VISIBLE }
        }

        // Set OnClick listeners for Current Seshes
        setButtonClick(R.id.btn_current_seshes_admin, CurrentSeshesActivity::class.java)
        setButtonClick(R.id.btn_current_seshes_user, CurrentSeshesActivity::class.java)

        // Set OnClick listeners for Create Sesh
        setButtonClick(R.id.btn_create_sesh_user, CreateSeshActivity::class.java)
        setButtonClick(R.id.btn_create_sesh_admin, CreateSeshActivity::class.java)

        // Set OnClick listeners for Sesh Map
        setButtonClick(R.id.btn_sesh_map, SeshMapActivity::class.java)

    }

    @RequiresPermission(Manifest.permission.ACCESS_FINE_LOCATION)
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            REQUEST_CODE_LOCATION -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    checkNearbySessions()
                    handler.postDelayed(checkRunnable, checkIntervalMillis) // Start repeating after permission granted
                } else {
                    Log.w("DashboardActivity", "Location permission denied")
                }
            }
            REQUEST_CODE_NOTIFICATION -> {
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    Log.d("DashboardActivity", "Notification permission granted")
                    // You can trigger notifications now or next time sessions are checked
                } else {
                    Log.w("DashboardActivity", "Notification permission denied")
                }
            }
        }
    }

    private val notifiedSessionIds = mutableSetOf<String>()


    @RequiresPermission(allOf = [Manifest.permission.ACCESS_FINE_LOCATION])
    private fun checkNearbySessions() {
        fusedLocationClient.lastLocation.addOnSuccessListener { location ->
            if (location != null) {
                val userLat = location.latitude
                val userLng = location.longitude
                Log.d("DashboardActivity", "User location: $userLat, $userLng")

                CoroutineScope(Dispatchers.IO).launch {
                    try {
                        val url = URL("https://flumpy.ca/api/meetings")
                        val conn = url.openConnection() as HttpURLConnection
                        conn.requestMethod = "GET"

                        val response = conn.inputStream.bufferedReader().readText()
                        val sessions = JSONArray(response)

                        for (i in 0 until sessions.length()) {
                            val sesh = sessions.getJSONObject(i)

                            if (sesh.has("latitude") && !sesh.isNull("latitude") &&
                                sesh.has("longitude") && !sesh.isNull("longitude") &&
                                sesh.has("meeting_id") && !sesh.isNull("meeting_id")) {

                                val seshLat = sesh.optString("latitude").toDoubleOrNull()
                                val seshLng = sesh.optString("longitude").toDoubleOrNull()
                                val seshId = sesh.getString("meeting_id")

                                if (seshLat != null && seshLng != null) {
                                    val distance = FloatArray(1)
                                    Location.distanceBetween(userLat, userLng, seshLat, seshLng, distance)

                                    Log.d("DashboardActivity", "Session '${sesh.optString("title")}' at ($seshLat, $seshLng) distance: ${distance[0]} meters")

                                    if (distance[0] <= 5000000) { // 5,000 km radius (adjust as needed)
                                        if (!notifiedSessionIds.contains(seshId)) {
                                            notifiedSessionIds.add(seshId)
                                            runOnUiThread {
                                                showNotification(
                                                    sesh.optString("title", "Nearby Sesh"),
                                                    sesh.optString("info", "You have a session nearby!")
                                                )
                                            }
                                        }
                                    }
                                }
                            } else {
                                Log.w("DashboardActivity", "Session missing lat/lng/id: ${sesh.optString("title")}")
                            }
                        }
                        conn.disconnect()
                    } catch (e: Exception) {
                        Log.e("DashboardActivity", "Error fetching sessions", e)
                    }
                }
            } else {
                Log.w("DashboardActivity", "User location unavailable")
            }
        }
    }

    private fun showNotification(title: String, message: String) {
        Log.d("DashboardActivity", "Showing notification: $title - $message")

        val channelId = "sesh_alerts"
        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Sesh Alerts", NotificationManager.IMPORTANCE_HIGH)
            manager.createNotificationChannel(channel)
        }

        val notification = NotificationCompat.Builder(this, channelId)
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(message)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()

        manager.notify((Math.random() * 500).toInt(), notification)
    }

    private fun setButtonClick(buttonId: Int, targetActivity: Class<*>) {
        findViewById<Button>(buttonId).setOnClickListener {
            val intent = Intent(this, targetActivity)
            startActivity(intent)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(checkRunnable)
    }
}
