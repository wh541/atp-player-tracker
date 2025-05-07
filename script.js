let apiKey = sessionStorage.getItem("apiKey");

if (!apiKey) {
  apiKey = prompt("Enter your API-Tennis key:");
  sessionStorage.setItem("apiKey", apiKey);
}

const searchBtn = document.getElementById("searchBtn");
const playerSearch = document.getElementById("playerSearch");

searchBtn.addEventListener("click", () => {
  const playerName = playerSearch.value.trim();
  if (playerName !== "") {
    fetchPlayerInfo(playerName);
  }
});

function fetchPlayerInfo(name) {
  const url = `https://api.api-tennis.com/tennis/?method=get_players&name=${encodeURIComponent(name)}&APIkey=${apiKey}`;
  console.log("🔍 Fetching player from:", url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("📦 Player API response:", data);

      if (data.error === "1" || !data.result || data.result.length === 0) {
        alert("Player not found or API error. Try a different name.");
        return;
      }

      const player = data.result[0];
      console.log("👤 Player object:", player);

      const fullName = `${player.firstname || ""} ${player.lastname || ""}`.trim();
      const country = player.country || "N/A";
      const rank = player.ranking || player.rank || "N/A";
      const points = player.points || "N/A";
      const playerId = player.player_id;

      document.getElementById("playerName").textContent = fullName;
      document.getElementById("playerCountry").textContent = country;
      document.getElementById("playerRank").textContent = rank;
      document.getElementById("playerPoints").textContent = points;
      document.getElementById("player-info").classList.remove("hidden");

      if (playerId) {
        console.log("📌 Using player_id:", playerId);
        fetchRecentMatches(playerId);
      } else {
        console.warn("⚠️ No player_id found — cannot fetch matches.");
        alert("No match data available for this player.");
      }
    })
    .catch(error => {
      console.error("❌ Error fetching player:", error);
      alert("Something went wrong. Please check the console.");
    });
}

function fetchRecentMatches(playerId) {
  const url = `https://api.api-tennis.com/tennis/?method=get_results&player_id=${playerId}&APIkey=${apiKey}`;
  console.log("🎾 Fetching match results from:", url);

  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log("📦 Match API response:", data);

      const matchList = document.getElementById("matchList");
      matchList.innerHTML = "";

      if (!data.result || data.result.length === 0) {
        matchList.innerHTML = "<li>No recent matches found.</li>";
        return;
      }

      data.result.slice(0, 5).forEach(match => {
        const event = match.event || match.tournament_name || "Unknown Tournament";
        const date = match.event_date || match.date || "Unknown Date";
        const score = match.score || "Score not available";

        const li = document.createElement("li");
        li.textContent = `${event} — ${date} — ${score}`;
        matchList.appendChild(li);
      });

      document.getElementById("matches").classList.remove("hidden");
    })
    .catch(error => {
      console.error("❌ Match fetch error:", error);
      alert("Error loading match data.");
    });
}

