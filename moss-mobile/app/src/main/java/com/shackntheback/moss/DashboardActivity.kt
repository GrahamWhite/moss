package com.shackntheback.moss
import android.content.Intent

import android.os.Bundle
import android.view.Menu
import android.view.View
import android.widget.Button
import android.widget.TextView
import com.google.android.material.snackbar.Snackbar
import com.google.android.material.navigation.NavigationView
import androidx.navigation.findNavController
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.navigateUp
import androidx.navigation.ui.setupActionBarWithNavController
import androidx.navigation.ui.setupWithNavController
import androidx.drawerlayout.widget.DrawerLayout
import androidx.appcompat.app.AppCompatActivity
import com.shackntheback.moss.databinding.ActivityMainBinding

class DashboardActivity : AppCompatActivity() {

    private lateinit var appBarConfiguration: AppBarConfiguration
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.appBarMain.toolbar)

        binding.appBarMain.fab.setOnClickListener { view ->
            Snackbar.make(view, "Replace with your own action", Snackbar.LENGTH_LONG)
                .setAction("Action", null)
                .setAnchorView(R.id.fab).show()
        }
        val drawerLayout: DrawerLayout = binding.drawerLayout
        val navView: NavigationView = binding.navView
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        // Passing each menu ID as a set of Ids because each
        // menu should be considered as top level destinations.
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.nav_home, R.id.nav_gallery, R.id.nav_slideshow
            ), drawerLayout
        )
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)

        val role = "admin" // or "user" from your JWT decode logic

        val adminButtons = listOf(
            findViewById<Button>(R.id.btn_manage_users),
            findViewById<Button>(R.id.btn_site_settings),
            findViewById<Button>(R.id.btn_view_reports),
            findViewById<Button>(R.id.btn_create_sesh_admin),
            findViewById<Button>(R.id.btn_current_seshes_admin),
            findViewById<Button>(R.id.btn_edit_profile_admin),
            findViewById<Button>(R.id.btn_account_settings_admin)
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

        setButtonClick(R.id.btn_current_seshes_admin, CurrentSeshesActivity::class.java)
        setButtonClick(R.id.btn_current_seshes_user, CurrentSeshesActivity::class.java)

    }

    private fun setButtonClick(buttonId: Int, targetActivity: Class<*>) {
        findViewById<Button>(buttonId).setOnClickListener {
            val intent = Intent(this, targetActivity)
            startActivity(intent)
        }
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        // Inflate the menu; this adds items to the action bar if it is present.
        menuInflater.inflate(R.menu.main, menu)
        return true
    }

    override fun onSupportNavigateUp(): Boolean {
        val navController = findNavController(R.id.nav_host_fragment_content_main)
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }
}