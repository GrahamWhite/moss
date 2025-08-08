package com.shackntheback.moss

import android.app.Activity
import android.app.DatePickerDialog
import android.app.TimePickerDialog
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.io.BufferedReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

class CreateSeshActivity : AppCompatActivity() {

    private lateinit var titleEditText: EditText
    private lateinit var dateTimeEditText: EditText
    private lateinit var infoEditText: EditText
    private lateinit var locationEditText: EditText
    private lateinit var pickLocationButton: Button
    private lateinit var createButton: Button

    private var selectedLat: Double? = null
    private var selectedLng: Double? = null
    private var selectedMapUrl: String? = null

    private val LOCATION_PICKER_REQUEST = 2001

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_create_sesh)

        titleEditText = findViewById(R.id.editTextTitle)
        dateTimeEditText = findViewById(R.id.editTextDateTime)
        infoEditText = findViewById(R.id.editTextInfo)
        locationEditText = findViewById(R.id.editTextLocation)
        pickLocationButton = findViewById(R.id.buttonPickLocation)
        createButton = findViewById(R.id.buttonCreateSesh)

        val calendar = Calendar.getInstance()

        // Date & time picker
        dateTimeEditText.setOnClickListener {
            DatePickerDialog(this, { _, year, month, dayOfMonth ->
                calendar.set(Calendar.YEAR, year)
                calendar.set(Calendar.MONTH, month)
                calendar.set(Calendar.DAY_OF_MONTH, dayOfMonth)

                TimePickerDialog(this, { _, hourOfDay, minute ->
                    calendar.set(Calendar.HOUR_OF_DAY, hourOfDay)
                    calendar.set(Calendar.MINUTE, minute)

                    val format = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
                    dateTimeEditText.setText(format.format(calendar.time))

                }, calendar.get(Calendar.HOUR_OF_DAY), calendar.get(Calendar.MINUTE), true).show()

            }, calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.DAY_OF_MONTH)).show()
        }

        // Open map picker
        pickLocationButton.setOnClickListener {
            val intent = Intent(this, MapPickerActivity::class.java)
            startActivityForResult(intent, LOCATION_PICKER_REQUEST)
        }

        // Create sesh
        createButton.setOnClickListener {
            createSesh()
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == LOCATION_PICKER_REQUEST && resultCode == Activity.RESULT_OK && data != null) {
            selectedLat = data.getDoubleExtra("latitude", 0.0)
            selectedLng = data.getDoubleExtra("longitude", 0.0)
            selectedMapUrl = data.getStringExtra("mapUrl") ?: ""

            locationEditText.setText(selectedMapUrl)
        }
    }

    private fun createSesh() {
        val title = titleEditText.text.toString().trim()
        val dateTime = dateTimeEditText.text.toString().trim()
        val info = infoEditText.text.toString().trim()

        if (title.isEmpty() || dateTime.isEmpty()) {
            Toast.makeText(this, "Title and Date/Time are required", Toast.LENGTH_SHORT).show()
            return
        }
        if (selectedLat == null || selectedLng == null || selectedMapUrl.isNullOrEmpty()) {
            Toast.makeText(this, "Please pick a location", Toast.LENGTH_SHORT).show()
            return
        }

        val token = getSharedPreferences("prefs", MODE_PRIVATE).getString("token", null)
        if (token == null) {
            Toast.makeText(this, "You must be logged in", Toast.LENGTH_SHORT).show()
            return
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL("https://flumpy.ca/api/meetings")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Authorization", "Bearer $token")
                conn.setRequestProperty("Content-Type", "application/json")
                conn.doOutput = true

                val json = JSONObject().apply {
                    put("title", title)
                    put("dateTime", dateTime)
                    put("info", info)
                    put("latitude", selectedLat)
                    put("longitude", selectedLng)
                    put("location", selectedMapUrl)
                }

                OutputStreamWriter(conn.outputStream).use { it.write(json.toString()) }

                val responseCode = conn.responseCode
                val responseText = try {
                    val reader = if (responseCode in 200..299) {
                        BufferedReader(conn.inputStream.reader())
                    } else {
                        BufferedReader(conn.errorStream?.reader() ?: conn.inputStream.reader())
                    }
                    reader.readText()
                } catch (e: Exception) {
                    "No response body"
                }

                runOnUiThread {
                    if (responseCode in 200..299) {
                        Toast.makeText(this@CreateSeshActivity, "Sesh created!", Toast.LENGTH_LONG).show()
                        finish()
                    } else {
                        Toast.makeText(this@CreateSeshActivity, "Server error ($responseCode): $responseText", Toast.LENGTH_LONG).show()
                    }
                }

                conn.disconnect()

            } catch (e: Exception) {
                runOnUiThread {
                    Toast.makeText(this@CreateSeshActivity, "Error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
