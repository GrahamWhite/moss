package com.shackntheback.moss

import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class LoginActivity : AppCompatActivity() {

    private lateinit var emailInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var loginButton: Button
    private lateinit var statusText: TextView

    private val loginUrl = "https://flumpy.ca/api/login"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        emailInput = findViewById(R.id.emailInput)
        passwordInput = findViewById(R.id.passwordInput)
        loginButton = findViewById(R.id.loginButton)
        statusText = findViewById(R.id.statusText)

        loginButton.setOnClickListener {
            val email = emailInput.text.toString()
            val password = passwordInput.text.toString()

            if (email.isBlank() || password.isBlank()) {
                statusText.text = "Please enter email and password."
            } else {
                login(email, password) { success, message ->
                    runOnUiThread {
                        statusText.text = message
                        if (success) {
                            // Move to MainActivity on successful login
                            val intent = Intent(this, DashboardActivity::class.java)
                            startActivity(intent)
                            finish()
                        }
                    }
                }
            }
        }
    }

    fun login(email: String, password: String, onResult: (Boolean, String) -> Unit) {
        Thread {
            try {
                val url = URL("https://flumpy.ca/api/auth/login")
                val conn = url.openConnection() as HttpURLConnection
                conn.requestMethod = "POST"
                conn.doOutput = true
                conn.setRequestProperty("Content-Type", "application/json")
                conn.setRequestProperty("Accept", "application/json")

                val jsonBody = JSONObject().apply {
                    put("username", email)
                    put("password", password)
                }

                conn.outputStream.use { os ->
                    val input = jsonBody.toString().toByteArray(Charsets.UTF_8)
                    os.write(input, 0, input.size)
                }

                val responseCode = conn.responseCode
                if (responseCode == 200) {
                    val responseText = conn.inputStream.bufferedReader().use { it.readText() }
                    val jsonResponse = JSONObject(responseText)

                    val token = jsonResponse.getString("token")
                    val role = jsonResponse.getString("role")
                    onResult(true, "Login successful: role=$role, token=$token")
                    getSharedPreferences("prefs", MODE_PRIVATE)
                        .edit()
                        .putString("token", token)
                        .apply()

                } else {
                    val errorText = conn.errorStream?.bufferedReader()?.use { it.readText() } ?: "Unknown error"
                    onResult(false, "Server error $responseCode: $errorText")
                }
                conn.disconnect()
            } catch (e: Exception) {
                onResult(false, "Exception: ${e.localizedMessage}")
            }
        }.start()
    }

}
