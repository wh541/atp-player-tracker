function fetchPlayerInfo(name) {
    const url = `https://api.api-tennis.com/tennis/?method=get_players&name=${encodeURIComponent(name)}&APIkey=${apiKey}`;
    console.log("🔍 Fetching player from:", url);
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log("📦 Player API response:", data);
  
        // ✅ If API returns an error structure
        if (data.error === "1" || !data.result || !Array.isArray(data.result)) {
          alert("Player not found or API error. Try a different name.");
          return;
        }
  
        const player = data.result[0];
        console.log("👤 Player object:", player);
  
        const playerName = player.player_name || `${player.firstname || ""} ${player.lastname || ""}`;
        const country = player.country || "N/A";
        const rank = player.ranking || player.rank || "N/A";
        const points = player.points || "N/A";
        const playerKey = player.player_key;
  
        document.getElementById("playerName").textContent = playerName.trim();
        document.getElementById("playerCountry").textContent = country;
        document.getElementById("playerRank").textContent = rank;
        document.getElementById("playerPoints").textContent = points;
        document.getElementById("player-info").classList.remove("hidden");
  
        if (playerKey) {
          console.log("📌 Using player_key:", playerKey);
          fetchRecentMatches(playerKey);
        } else {
          console.warn("⚠️ No player_key found — cannot fetch matches.");
          alert("No match data available for this player.");
        }
      })
      .catch(error => {
        console.error("❌ Error fetching player:", error);
        alert("Something went wrong. Please check the console.");
      });
  }
  
