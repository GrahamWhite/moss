package com.shackntheback.moss
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.shackntheback.moss.R
import kotlinx.coroutines.*
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class CurrentSeshesActivity : AppCompatActivity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var emptyText: TextView

    private val seshList = mutableListOf<Sesh>()
    private lateinit var adapter: SeshAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_current_seshes)

        recyclerView = findViewById(R.id.seshRecyclerView)
        progressBar = findViewById(R.id.progressBar)
        emptyText = findViewById(R.id.emptyText)

        adapter = SeshAdapter(seshList) { sesh ->
            joinSesh(sesh)
        }

        recyclerView.layoutManager = GridLayoutManager(this, 2)
        recyclerView.adapter = adapter

        fetchSeshes()

        val backButton = findViewById<Button>(R.id.btn_back_home)
        backButton.setOnClickListener {
            val intent = Intent(this, DashboardActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            startActivity(intent)
            finish()
        }


    }

    private fun fetchSeshes() {
        progressBar.visibility = ProgressBar.VISIBLE
        emptyText.visibility = TextView.GONE
        recyclerView.visibility = RecyclerView.GONE

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

                    seshList.clear()
                    for (i in 0 until jsonArray.length()) {
                        val obj = jsonArray.getJSONObject(i)
                        val usersJson = obj.optJSONArray("users")
                        val users = mutableListOf<String>()
                        if (usersJson != null) {
                            for (j in 0 until usersJson.length()) {
                                users.add(usersJson.getString(j))
                            }
                        }

                        val sesh = Sesh(
                            id = obj.getString("meeting_id"),
                            title = obj.getString("title"),
                            dateTime = obj.getString("start_time"),
                            info = obj.optString("info", ""),
                            location = obj.optString("location", ""),
                            picture = obj.optString("picture_url", "https://via.placeholder.com/150"),
                            users = users
                        )
                        seshList.add(sesh)
                    }

                    withContext(Dispatchers.Main) {
                        progressBar.visibility = ProgressBar.GONE
                        if (seshList.isEmpty()) {
                            emptyText.visibility = TextView.VISIBLE
                            recyclerView.visibility = RecyclerView.GONE
                        } else {
                            emptyText.visibility = TextView.GONE
                            recyclerView.visibility = RecyclerView.VISIBLE
                            adapter.notifyDataSetChanged()
                        }
                    }
                } else {
                    withContext(Dispatchers.Main) {
                        progressBar.visibility = ProgressBar.GONE
                        emptyText.text = "Error loading seshes: HTTP $responseCode"
                        emptyText.visibility = TextView.VISIBLE
                    }
                }

                conn.disconnect()
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    progressBar.visibility = ProgressBar.GONE
                    emptyText.text = "Fetch error: ${e.localizedMessage}"
                    emptyText.visibility = TextView.VISIBLE
                }
            }
        }
    }

    private fun joinSesh(sesh: Sesh) {
        val token = getSharedPreferences("prefs", Context.MODE_PRIVATE).getString("token", null)
        if (token == null) {
            Toast.makeText(this, "Not logged in", Toast.LENGTH_SHORT).show()
            return
        }

        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL("https://flumpy.ca/api/meetings/${sesh.id}/join")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.setRequestProperty("Authorization", "Bearer $token")
                conn.doOutput = true

                val responseCode = conn.responseCode
                val responseText = if (responseCode in 200..299) {
                    conn.inputStream.bufferedReader().use { it.readText() }
                } else {
                    conn.errorStream?.bufferedReader()?.use { it.readText() } ?: ""
                }

                val jsonResponse = JSONObject(responseText)

                withContext(Dispatchers.Main) {
                    if (responseCode in 200..299) {
                        Toast.makeText(this@CurrentSeshesActivity,
                            "You joined the sesh: ${jsonResponse.optString("title")}", Toast.LENGTH_LONG).show()
                    } else {
                        Toast.makeText(this@CurrentSeshesActivity,
                            jsonResponse.optString("error", "Failed to join sesh"), Toast.LENGTH_LONG).show()
                    }
                }

                conn.disconnect()
            } catch (e: Exception) {
                withContext(Dispatchers.Main) {
                    Toast.makeText(this@CurrentSeshesActivity,
                        "Join error: ${e.localizedMessage}", Toast.LENGTH_LONG).show()
                }
            }
        }
    }
}
