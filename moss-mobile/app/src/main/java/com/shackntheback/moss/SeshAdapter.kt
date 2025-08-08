package com.shackntheback.moss
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide

class SeshAdapter(
    private val seshes: List<Sesh>,
    private val onJoinClicked: (Sesh) -> Unit
) : RecyclerView.Adapter<SeshAdapter.SeshViewHolder>() {

    inner class SeshViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val imageSesh: ImageView = view.findViewById(R.id.imageSesh)
        val textTitle: TextView = view.findViewById(R.id.textTitle)
        val textWhen: TextView = view.findViewById(R.id.textWhen)
        val textInfo: TextView = view.findViewById(R.id.textInfo)
        val textLocation: TextView = view.findViewById(R.id.textLocation)
        val textUsers: TextView = view.findViewById(R.id.textUsers)
        val buttonJoin: Button = view.findViewById(R.id.buttonJoin)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): SeshViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_sesh, parent, false)
        return SeshViewHolder(view)
    }

    override fun onBindViewHolder(holder: SeshViewHolder, position: Int) {
        val sesh = seshes[position]
        holder.textTitle.text = sesh.title
        holder.textWhen.text = "When: ${sesh.dateTime}"
        holder.textInfo.text = "Info: ${sesh.info ?: "N/A"}"
        holder.textLocation.text = sesh.location ?: "No location"
        holder.textUsers.text = if (sesh.users.isNotEmpty()) "Users: ${sesh.users.joinToString(", ")}" else "Users: None yet"

        // Load image using Glide or fallback placeholder
        Glide.with(holder.itemView.context)
            .load(sesh.picture)
            .placeholder(R.drawable.ic_logo)
            .into(holder.imageSesh)

        holder.buttonJoin.setOnClickListener {
            onJoinClicked(sesh)
        }
    }

    override fun getItemCount(): Int = seshes.size
}
